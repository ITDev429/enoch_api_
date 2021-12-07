const logMessage = require("./helpers/logger").logMessage;
const statusCodes = require("./config/statusCodes");
const config = require("config");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const Constants = require("./config/constants");

let transporter = nodemailer.createTransport({
  service: config.get("emailConfig").service,
  auth: {
    user: config.get("emailConfig").email,
    pass: config.get("emailConfig").password,
  },
});
function sendSuccessResponse(data, res) {
  const dataToSend = { ...data };
  if (!dataToSend.flag) {
    dataToSend.flag = statusCodes.OK;
  }

  if (!dataToSend.message) {
    dataToSend.message = statusCodes.getStatusText(statusCodes.OK);
  }

  return res.status(dataToSend.flag).send({
    statusCode: dataToSend.flag,
    message: dataToSend.description || dataToSend.message,
    data: dataToSend.data || {},
  });
}

function sendErrorResponse(error, res) {
  const errorToSend = { ...error };

  if (!errorToSend.flag) {
    errorToSend.flag = statusCodes.METHOD_FAILURE;
  }
  if (!errorToSend.message) {
    errorToSend.message = statusCodes.getStatusText(statusCodes.METHOD_FAILURE);
  }

  const loggerMessage = [errorToSend.flag, errorToSend.message].join(" ");

  logMessage("debug", loggerMessage);

  return res.status(errorToSend.flag).send(errorToSend);
}

/**
 * Generate JWT token
 * @param {object} tokenData Data to be encrypted in token
 */
async function generateToken(tokenData) {
  const secret = config.get("jwtPrivateKey");
  try {
    const token = JWT.sign(tokenData, secret);
    return token;
  } catch (err) {
    return err;
  }
}

const decodeToken = async (token) => {
  token = token.replace("Bearer ", "");
  const decoded = await JWT.verify(token, config.get("jwtPrivateKey"));
  return decoded;
};

const authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
        },
        res
      );
    }
    const decoded = await decodeToken(token);
    // const user = await Client.findById(mongoose.Types.ObjectId(decoded.id));

    if (!user) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }

    const sessionFilter = {
      user: user._id,
      loginTimestamp: new Date(decoded.date),
    };

    const session = await Session.aggregate([
      { $match: sessionFilter },
      {
        $project: {
          sessionStartTime: {
            $subtract: ["$$NOW", "$updatedAt"],
          },
          logoutTimestamp: 1,
        },
      },
    ]);

    if (
      session.length < 1 ||
      (session.length > 0 && session[0].logoutTimestamp)
    ) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }

    if (session[0].sessionStartTime / 3600000 > config.sessionExpiryInHours) {
      const session = await Session.updateOne(
        {
          // user: mongoose.Types.ObjectId(user._id),
          loginTimestamp: new Date(decoded.date),
        },
        {
          logoutTimestamp: new Date().toISOString(),
        }
      );

      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }
    await Session.updateOne(
      {
        // user: mongoose.Types.ObjectId(user._id),
      },
      {
        // user: mongoose.Types.ObjectId(user._id),
      }
    );

    next();
  } catch (error) {
    logMessage("error", error.message);

    return sendErrorResponse(
      {
        flag: statusCodes.UNAUTHORIZED,
        message: "Session Expired. Please login again to continue",
      },
      res
    );
  }
};
const authenticateUser = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
        },
        res
      );
    }
    const decoded = await decodeToken(token);
    // const user = await User.findById(mongoose.Types.ObjectId(decoded.id));
    if (!user) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }

    const sessionFilter = {
      user: user._id,
      loginTimestamp: new Date(decoded.date),
    };

    const session = await Session.aggregate([
      { $match: sessionFilter },
      {
        $project: {
          sessionStartTime: {
            $subtract: ["$$NOW", "$updatedAt"],
          },
          logoutTimestamp: 1,
        },
      },
    ]);

    if (
      session.length < 1 ||
      (session.length > 0 && session[0].logoutTimestamp)
    ) {
      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }

    if (session[0].sessionStartTime / 3600000 > config.sessionExpiryInHours) {
      const session = await Session.updateOne(
        {
          // user: mongoose.Types.ObjectId(user._id),
          loginTimestamp: new Date(decoded.date),
        },
        {
          logoutTimestamp: new Date().toISOString(),
        }
      );

      return sendErrorResponse(
        {
          flag: statusCodes.UNAUTHORIZED,
          message: "Session Expired. Please login again to continue",
        },
        res
      );
    }
    await Session.updateOne(
      {
        // user: mongoose.Types.ObjectId(user._id),
      },
      {
        // user: mongoose.Types.ObjectId(user._id),
      }
    );
    req.authUser = decoded;
    next();
  } catch (error) {
    logMessage("error", error.message);

    return sendErrorResponse(
      {
        flag: statusCodes.UNAUTHORIZED,
        message: "Session Expired. Please login again to continue",
      },
      res
    );
  }
};

renderMessageFromTemplate = async (templateDate, variableData) => {
  const compiledFile = await Handlebars.compile(templateDate)(variableData);
  return Promise.resolve(compiledFile);
};

async function sendEmail(emailId, emailType, emailVarialbles) {
  try {
    const mailOptions = {
      from: `no-reply <${config.get("emailConfig.email")}>`,
      to: emailId,
      subject: null,
      html: null,
    };
    let filePath;

    let emailMessage;
    switch (emailType) {
      case "WELCOME":
        filePath = Path.normalize(
          Path.join(Path.resolve("./"), Constants.email.WELCOME.emailMessage)
        );
        emailMessage = await fs.readFileSync(filePath, "utf8");
        mailOptions.subject = Constants.email.WELCOME.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        break;
      case "VERIFICATION":
        filePath = Path.normalize(
          Path.join(
            Path.resolve("./"),
            Constants.email.VERIFICATION.emailMessage
          )
        );
        emailMessage = await fs.readFileSync(filePath, "utf-8");
        mailOptions.subject = Constants.email.VERIFICATION.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        break;

      case "SUBSCRIBE":
        filePath = Path.normalize(
          Path.join(Path.resolve("./"), Constants.email.SUBSCRIBE.emailMessage)
        );
        emailMessage = await fs.readFileSync(filePath, "utf8");
        mailOptions.subject = Constants.email.SUBSCRIBE.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        break;
      case "SEND_PDF":
        filePath = Path.normalize(
          Path.join(Path.resolve("./"), Constants.email.SEND_PDF.emailMessage)
        );
        emailMessage = await fs.readFileSync(filePath, "utf8");
        mailOptions.subject = Constants.email.SEND_PDF.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        mailOptions.attachments = [
          {
            path: "./public/uploads/attchments/test.pdf",
          },
        ];
        break;
      case "CHANGENUMBER":
        filePath = Path.normalize(
          Path.join(
            Path.resolve("./"),
            Constants.email.VERIFICATION.emailMessage
          )
        );
        emailMessage = await fs.readFileSync(filePath, "utf-8");
        mailOptions.subject = Constants.email.VERIFICATION.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        break;
      case "RESET_PASSWORD":
        filePath = Path.normalize(
          Path.join(
            Path.resolve("./"),
            Constants.email.VERIFICATION.emailMessage
          )
        );
        emailMessage = await fs.readFileSync(filePath, "utf-8");
        mailOptions.subject = Constants.email.VERIFICATION.emailSubject;
        mailOptions.html = await renderMessageFromTemplate(
          emailMessage,
          emailVarialbles
        );
        break;

      default:
        return Promise.reject(new Error("Something went wrong with emailer"));
    }
    const sentMail = await transporter.sendMail(mailOptions);
    console.log("sentMail.accepted -->", sentMail.accepted);
    console.log("sentMail.messageId -->", sentMail.messageId);

    console.log("Email sent to:", sentMail.accepted, sentMail.messageId);
    return Promise.resolve({ status: "sent", data: sentMail });
  } catch (error) {
    console.log("Email Error", error);
    return Promise.resolve({ status: "error", data: error });
  }
}

const createImageUrl = (destination, filename) => {
  return "images" + destination.substring(16) + filename;
};

const getImagePath = (image) => {
  return "./public/uploads" + image.substring(image.indexOf("images") + 6);
};

const isImage = (type) => {
  const mimeTypes = ["image/gif", "image/jpeg", "image/png"];
  return mimeTypes.includes(type);
};

const formatDate = (date) => {
  try {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  } catch (ex) {}
};

const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function twofactorbackupCode(length) {
  var result = [];
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

function changeNumberCode(length) {
  var result = [];
  var characters = "1234567890";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    let character = Math.floor(Math.random() * charactersLength);
    if (character == 0 && i == 0) {
      character = character + 1;
    }
    result.push(character);
  }
  console.log("results", result);
  return result.join("");
}

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  generateToken,
  decodeToken,
  authenticate,
  authenticateUser,
  createImageUrl,
  getImagePath,
  isImage,
  sendEmail,
  getRandom,
  formatDate,
  validateEmail,
  twofactorbackupCode,
  changeNumberCode,
};
