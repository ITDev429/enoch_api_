const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const pgclient = require("../../database");
const utils = require("../../utils");
const statusCodes = require("../../config/statusCodes");
const Vonage = require("@vonage/server-sdk");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
});

exports.registerUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      dateofbirth,
      country,
      email,
      phone_number,
      password,
    } = req.body;
    if (!utils.validateEmail(email)) {
      return res.status(406).send("Invalid Email Address.");
    }
    if (password.length < 8) {
      return res
        .status(406)
        .send("Password Must be greater or equal to 8 digits.");
    }
    const bycrptedpassword = await bcrypt.hashSync(password, 10);
    const emailVerificationToken = uuidv4();
    const response = await pgclient.query(
      `INSERT INTO public.user (first_name, last_name, email, date_of_birth, phone, country, password, emailVerificationToken, scopes) VALUES ('${firstName}', '${lastName}', '${email}', '${dateofbirth}', '${phone_number}', '${country}', '${bycrptedpassword}', '${emailVerificationToken}', ARRAY ['user'])`,
      (err, result) => {
        if (err) {
          console.log("errros", err);
          if (err.code == 23505) {
            return res.status(500).send("Email Already Exist");
          }
        } else {
          const emailVariables = {
            name: firstName + " " + lastName,
            // link: `https://enochweb.co.uk/Signin/${emailVerificationToken}/${email}`,
          };
          utils.sendEmail(email, "VERIFICATION", emailVariables);
          const response = {
            flag: statusCodes.OK,
            message: statusCodes.getStatusText(statusCodes.OK),
            description:
              "A verification token sent to your mail, Please confirm your email",
          };
          return res.status(200).send(response);
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, emailverificationtoken } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}' LIMIT 1`
    );
    if (rows.length == 0) {
      return res.status(404).send("Email Not Found");
    } else {
      if (
        (!emailverificationtoken && rows[0].isemailverified == true) ||
        (emailverificationtoken && rows[0].isemailverified == true)
      ) {
        return res.status(406).send("Email Already Verified");
      }
      if (emailverificationtoken == rows[0].emailverificationtoken) {
        const isEmailVerified = true;
        const Verificationtoken = null;

        const data = await pgclient.query(
          `UPDATE public.user SET emailVerificationtoken = ${Verificationtoken}, isemailverified = ${isEmailVerified} WHERE _id = '${rows[0]._id}'`
        );
        utils.sendEmail(rows[0].email, "WELCOME", {
          // link: "https://www.test.com",
          name: rows[0].first_name + rows[0].last_name,
        });
        return res.status(200).send("Email Verified");
      } else {
        return res.status(406).send("Incorrect Token");
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.signInIndividualUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const checkPassword = bcrypt.compareSync(password, rows[0].password); // compare password string to encrypted string
      if (!checkPassword) {
        return res.status(404).send("Incorrect Email or Password");
      }
      if (rows[0].isemailverified == false) {
        const response = {
          flag: statusCodes.UNAUTHORIZED,
          message: "Please verify your mail",
        };
        return res.status(401).send(response);
      }
      if (
        rows[0].authenticator_type == null ||
        rows[0].authenticator_type == undefined
      ) {
        const response = {
          flag: statusCodes.UNAUTHORIZED,
          message: "Please setup two FA",
        };
        return res.status(401).send(response);
      }
      if (rows[0].authenticator_type == "mobile") {
        vonage.verify.request(
          {
            number: rows[0].phone,
            brand: "EZD VERIFICATION",
            code_length: 6,
          },
          (err, result) => {
            if (err) {
              return res.status(404).send(err);
            } else {
              if (result["status"] == "0") {
                const requestId = result.request_id;
                const response = {
                  flag: statusCodes.UNAUTHORIZED,
                  message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                  data: requestId,
                };
                return res.status(401).send(response);
              } else {
                return res.status(406).send(result["error_text"]);
              }
            }
          }
        );
      }
      if (rows[0].authenticator_type == "authenticatorApp") {
        const response = {
          flag: statusCodes.UNAUTHORIZED,
          message:
            "Please Verify Sign In with with code generated in Authenticator App",
        };
        return res.status(401).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.sendVerificationCode = async (req, res, next) => {
  try {
    const { email, password, phonenumber } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const checkPassword = bcrypt.compareSync(password, rows[0].password); // compare password string to encrypted string
      if (!checkPassword) {
        return res.status(404).send("Incorrect Email or Password");
      }
      if (rows[0].phone != phonenumber) {
        return res.status(404).send("Please Input Registered Phone Number");
      } else {
        vonage.verify.request(
          {
            number: phonenumber,
            brand: "EZD VERIFICATION",
            code_length: 6,
            Text: `verify code`,
          },
          (err, result) => {
            if (err) {
              return res.status(404).send(err);
            } else {
              if (result["status"] == "0") {
                const requestId = result.request_id;
                return res.status(200).send(requestId);
              } else {
                return res.status(406).send(result["error_text"]);
              }
            }
          }
        );
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.verifyPhoneNumber = async (req, res, next) => {
  try {
    const { email, password, requestId, code } = req.body;

    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const checkPassword = bcrypt.compareSync(password, rows[0].password); // compare password string to encrypted string
      if (!checkPassword) {
        return res.status(404).send("Incorrect Email or Password");
      }
      vonage.verify.check(
        {
          request_id: requestId,
          code: code,
        },
        async (err, result) => {
          if (err) {
            console.error(err);
          } else {
            if (result["status"] == "0") {
              await pgclient.query(
                `UPDATE public.user SET ismobileverified = true, authenticator_type = mobile WHERE email = '${email}'`
              );
              return res.status(200).send("successfully verified");
            } else {
              const errormessage = result["error_text"].substring(80);
              return res.status(500).send(errormessage);
            }
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.verifyRecoveryNumber = async (req, res, next) => {
  try {
    const { email, password, requestId, code } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const checkPassword = bcrypt.compareSync(password, rows[0].password); // compare password string to encrypted string
      if (!checkPassword) {
        return res.status(404).send("Incorrect Email or Password");
      }
      vonage.verify.check(
        {
          request_id: requestId,
          code: code,
        },
        async (err, result) => {
          if (err) {
            throw err;
          } else {
            if (result["status"] == "0") {
              const QRVerificationToken = uuidv4();
              await pgclient.query(
                `UPDATE public.user SET ismobileverified = true, qrVerificationtoken = '${QRVerificationToken}' WHERE email = '${email}'`
              );
              const emailVariables = {
                name: rows[0].first_name + " " + rows[0].last_nameame,
                link: `https://Enoch.co.uk/verifyapp_2fa/${email}/${QRVerificationToken}`,
              };
              utils.sendEmail(email, "VERIFICATION", emailVariables);
              return res
                .status(200)
                .send(
                  "successfully verified, check your email to proceed further"
                );
            } else {
              const errormessage = result["error_text"].substring(80);
              return res.status(500).send(errormessage);
            }
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.getAppVerificationQR = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      await pgclient.query(
        `UPDATE public.user SET authenticator_type = 'authenticatorApp' WHERE email = '${email}'`
      );

      let secret = speakeasy.generateSecret({
        name: `ENOCH [${email}]`,
      });

      let qr = await qrcode.toDataURL(secret.otpauth_url);

      let data = {
        qr: qr,
        secret: secret.base32,
      };
      await pgclient.query(
        `UPDATE public.user SET qrsecret = '${secret.base32}' WHERE email = '${email}'`
      );
      let newresponse = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        data: data,
      };
      return res.status(200).send(newresponse);
    }
  } catch (error) {
    throw error;
  }
};

exports.verifyAppTwoFA = async (req, res, next) => {
  try {
    const { email, code, qrVerificationtoken } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (qrVerificationtoken != rows[0].qrverificationtoken) {
        const response = {
          flag: statusCodes.undefined,
          message: "Token already scanned/Not match",
        };
        res.status(401).send(response);
      }
      let verified = speakeasy.totp.verify({
        secret: rows[0].qrsecret,
        encoding: "base32",
        token: code,
      });
      if (verified) {
        let data = [];
        for (var i = 0; i < 6; i++) {
          let code = utils.twofactorbackupCode(6);
          data.push(`'${code}'`);
        }

        await pgclient.query(
          `UPDATE public.user SET two_fa_backup = ARRAY [${data}] WHERE email = '${email}'`
        );
        rows[0].password = "";
        rows[0].two_fa_bakup = data;
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          data: rows[0],
        };
        res.status(200).send(response);
      } else {
        const response = {
          flag: statusCodes.undefined,
          message: "Token already scanned/Expired",
        };
        res.status(401).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.verifySignIn = async (req, res, next) => {
  try {
    const { email, password, requestId, code } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const checkPassword = bcrypt.compareSync(password, rows[0].password); // compare password string to encrypted string
      if (!checkPassword) {
        return res.status(404).send("Incorrect Email or Password");
      }
      const tokenData = {
        id: rows[0]._id,
        scope: rows[0].scopes,
        date: new Date().toISOString(),
        deviceType: null, //payload.deviceType ||
        deviceToken: null, //payload.deviceToken ||
      };
      const token = await utils.generateToken(tokenData); // generate JWT
      rows[0].token = token;
      if (rows[0].authenticator_type == "authenticatorApp") {
        let verified = speakeasy.totp.verify({
          secret: rows[0].qrsecret,
          encoding: "base32",
          token: code,
        });
        if (verified) {
          rows[0].password = "";
          rows[0].two_fa_backup = "";
          const response = {
            flag: statusCodes.OK,
            message: statusCodes.getStatusText(statusCodes.OK),
            data: rows[0],
          };
          res.status(200).send(response);
        } else {
          const response = {
            flag: statusCodes.UNAUTHORIZED,
            message: "Token is Expired ",
          };
          res.status(401).send(response);
        }
      }
      if (rows[0].authenticator_type == "mobile") {
        vonage.verify.check(
          {
            request_id: requestId,
            code: code,
          },
          async (err, result) => {
            if (err) {
              console.error(err);
            } else {
              if (result["status"] == "0") {
                rows[0].password = "";
                let data = {
                  flag: statusCodes.OK,
                  message: statusCodes.getStatusText(statusCodes.OK),
                  data: rows[0],
                };
                return res.status(200).send(data);
              } else {
                const errormessage = result["error_text"].substring(80);
                return res.status(500).send(errormessage);
              }
            }
          }
        );
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.requestchangeNumber = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      let changeNumberCode = utils.changeNumberCode(6);
      // changeNumber Code

      await pgclient.query(
        `UPDATE public.user SET changenumbercode = ${changeNumberCode} WHERE email = '${email}'`
      );
      const emailVariables = {
        name: rows[0].first_nameame + " " + rows[0].last_name,
        changeNumberCode,
      };
      utils.sendEmail(email, "CHANGENUMBER", emailVariables);
      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        description: "Please check your email",
      };

      res.status(200).send(response);
    }
  } catch (error) {
    throw error;
  }
};

exports.verifychangeNumberrequest = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (token != rows[0].changenumbercode) {
        return res.status(404).send("Token Expired, Request New token");
      }
      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        description: "Change Number Token Verification Success",
      };
      res.status(200).send(response);
    }
  } catch (error) {
    throw error;
  }
};

exports.addnewnumber = async (req, res, next) => {
  try {
    const { email, Number } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (
        rows[0].changenumbercode == "" ||
        rows[0].changenumbercode == undefined ||
        rows[0].changenumbercode == null
      ) {
        return res.status(404).send("No change Number Request Found");
      }
      await pgclient.query(
        `UPDATE public.user SET phone = ${Number}, changenumbercode = null WHERE email = '${email}'`
      );

      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        description: "Number Changed Successfully, Please verify Your Number",
      };
      res.status(200).send(response);
    }
  } catch (error) {
    throw error;
  }
};

exports.recoveryPasswordRequestByMail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      const resetToken = uuidv4();

      await pgclient.query(
        `UPDATE public.user SET forgotPasswordToken = '${resetToken}' WHERE email = '${email}'`
      );

      const emailVariables = {
        name: rows[0].first_name + " " + rows[0].last_name,
        // link: `https://enoch-web.co.uk/ResetPassword/${resetToken}/${email}`,
      };
      await utils.sendEmail(email, "RESET_PASSWORD", emailVariables);
      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        description: "Mail Send, Please Check your Registered E-mail",
      };
      res.status(200).send(response);
    }
  } catch (error) {
    throw error;
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (token != rows[0].forgotpasswordtoken) {
        return res.status(406).send("Token is expired/Not matched");
      } else {
        const bycrptedpassword = await bcrypt.hashSync(newPassword, 10);
        await pgclient.query(
          `UPDATE public.user SET forgotPasswordToken = null, password = '${bycrptedpassword}' WHERE email = '${email}'`
        );
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          description: "Password Changed Successfully",
        };
        res.status(200).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.getTwoFAType = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (rows[0].authenticator_type == "authenticatorApp") {
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          description:
            "Two FA is Set to Authenticator App, Get Your Code From Google Authenticator APP.",
        };
        res.status(200).send(response);
      } else {
        let data = {
          email: rows[0].email,
          phonenumber: rows[0].phone,
        };
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          description: "Two FA Is Set to Phone/SMS",
          data: data,
        };
        res.status(200).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.changePasswordByAppTwoFA = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      let verified = speakeasy.totp.verify({
        secret: rows[0].qrsecret,
        encoding: "base32",
        token: token,
      });
      if (verified) {
        const resetToken = uuidv4();
        await pgclient.query(
          `UPDATE public.user SET forgotPasswordToken = '${resetToken}' WHERE email = '${email}'`
        );
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          token: resetToken,
        };
        res.status(200).send(response);
      } else {
        const response = {
          flag: statusCodes.UNAUTHORIZED,
          message: "Token is Expired ",
        };
        res.status(401).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.changePasswordByTwoFA = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      let verified = speakeasy.totp.verify({
        secret: rows[0].qrsecret,
        encoding: "base32",
        token: token,
      });
      if (verified) {
        const resetToken = uuidv4();
        await pgclient.query(
          `UPDATE public.user SET forgotPasswordToken = '${resetToken}' WHERE email = '${email}'`
        );
        const response = {
          flag: statusCodes.OK,
          message: statusCodes.getStatusText(statusCodes.OK),
          token: resetToken,
        };
        res.status(200).send(response);
      } else {
        const response = {
          flag: statusCodes.UNAUTHORIZED,
          message: "Token is Expired ",
        };
        res.status(401).send(response);
      }
    }
  } catch (error) {
    throw error;
  }
};

exports.sendVerificationCodeMobileTwoFA = async (req, res, next) => {
  try {
    const { email, phonenumber } = req.params;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE email = '${email}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      vonage.verify.request(
        {
          number: phonenumber,
          brand: "EZD VERIFICATION",
          code_length: 6,
          Text: `verify code`,
        },
        (err, result) => {
          if (err) {
            return res.status(404).send(err);
          } else {
            if (result["status"] == "0") {
              const requestId = result.request_id;
              return res.status(200).send(requestId);
            } else {
              return res.status(406).send(result["error_text"]);
            }
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};
