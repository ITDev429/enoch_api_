const pgclient = require("../../database");
const statusCodes = require("../../config/statusCodes");

exports.getUsersList = async (req, res, next) => {
  try {
    const { rows } = await pgclient.query(
      "SELECT _id, first_name, last_name, email, kyc_status, account_status, country, phone FROM public.user"
    );
    if (rows.length == 0) {
      return res.status(404).send("No User Found");
    } else {
      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        data: rows,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.updateUserAccountstatus = async (req, res, next) => {
  try {
    const { userIds, status } = req.query;
    const { rows } = await pgclient.query(
      `WITH updated_rows AS (UPDATE public.user SET account_status= '${status}' WHERE _id::text = ANY(ARRAY[string_to_array('${userIds}',',')]) RETURNING _id ) SELECT _id FROM updated_rows;`
    );
    if (rows.length == 0) {
      return res.status(404).send("Nothing Updated");
    } else {
      return res.status(200).send(`successfully updated`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserKYCdetails = async (req, res, next) => {
  const { userId } = req.query;
  const { rows } = await pgclient.query(
    `SELECT * FROM public.user WHERE _id::text = '${userId}'`
  );
  if (rows.length == 0) {
    return res.status(404).send("No User Found");
  } else {
    if (rows[0].kyc_status == "incomplete") {
      return res.status(404).send("Didn't Applied for  KYC");
    }
    let kyc = await pgclient.query(
      `SELECT * FROM public.kycdocuments WHERE userid = '${userId}'`
    );
    if (kyc.rows.length == 0) {
      return res.status(404).send("No User Found");
    } else {
      let data = {
        accountdetails: rows[0],
        kyc: kyc.rows[0],
      };
      const response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK),
        data,
      };
      return res.status(200).send(response);
    }
  }
};

exports.putUserKYCstatus = async (req, res, next) => {
  const { userId, status } = req.query;
  const { rows } = await pgclient.query(
    `WITH updated_rows AS (UPDATE public.user SET KYC_status= '${status}' WHERE _id::text = '${userId}' RETURNING _id ) SELECT _id FROM updated_rows;`
  );
  if (rows.length == 0) {
    return res.status(404).send("Nothing Updated");
  } else {
    return res.status(200).send(`successfully updated`);
  }
};
