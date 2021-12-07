const { v4: uuidv4 } = require("uuid");
const pgclient = require("../../database");
const statusCodes = require("../../config/statusCodes");

exports.getWalletSign = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE _id::text = '${id}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      if (
        !rows[0].middle_name ||
        !rows[0].profile_photo ||
        !rows[0].address1 ||
        !rows[0].address2 ||
        !rows[0].city ||
        !rows[0].postal_code
      ) {
        return res.status(401).send("Please complete Account Info First");
      }
      const sign = uuidv4();
      await pgclient.query(
        `INSERT INTO public.wallet (userid, sign) VALUES ('${id}', '${sign}')`,
        (err, result) => {
          if (err) {
            return res.status(500).send("Wallet Not Signed");
          } else {
            const response = {
              flag: statusCodes.OK,
              message: statusCodes.getStatusText(statusCodes.OK),
              description: "sign. Wallet success",
            };
            return res.status(200).send(response);
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};
exports.linkUserWallet = async (req, res, next) => {
  try {
    const { walletType, wallet_address } = req.query;
    const { id } = req.user;
    const { rows } = await pgclient.query(
      `SELECT * FROM public.user WHERE _id::text = '${id}'`
    );
    if (rows.length == 0) {
      return res.status(404).send("User Not Found");
    } else {
      await pgclient.query(
        `UPDATE public.wallet SET walletType = '${walletType}', wallet_address = '${wallet_address}' WHERE userid = '${id}'`,
        (err, result) => {
          if (err) {
            return res.status(500).send("Wallet Not Created");
          } else {
            const response = {
              flag: statusCodes.OK,
              message: statusCodes.getStatusText(statusCodes.OK),
              description: "Wallet Created Successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};
