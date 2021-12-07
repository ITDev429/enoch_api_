const pgclient = require("../../database");
const utils = require("../../utils");

exports.postUserKYCdocuments = async (req, res, next) => {
  try {
    const {
      id1_type,
      id1_number,
      id1_expiry,
      id2_type,
      id2_number,
      id2_expiry,
    } = req.body;
    const { id } = req.user;
    let wallet = await pgclient.query(
      `select exists(select * from public.wallet where userid= '${id}')`
    );
    if (wallet.rows[0].exists == false) {
      return res.status(404).send("Please Connect Wallet First");
    } else {
      let data = {
        id1_frontSide: "",
        id1_backSide: "",
        id2_frontSide: "",
        id2_backSide: "",
        selfie: "",
        addressProof: "",
      };
      if (req.files) {
        req.files.forEach((file) => {
          const { destination, filename, fieldname } = file;
          if (utils.isImage(file.mimetype)) {
            data[`${fieldname}`] = utils.createImageUrl(destination, filename);
          }
        });
      }
      const { rows } = await pgclient.query(
        `INSERT INTO public.kycdocuments (userid, id1_type, id1_number, id1_expiry, id1_frontSide, id1_backSide, id2_type, id2_number, id2_expiry, id2_frontSide, id2_backSide, selfie, addressProof) VALUES ('${id}', '${id1_type}', '${id1_number}', '${id1_expiry}', '${data.id1_frontSide}', '${data.id1_backSide}', '${id2_type}', '${id2_number}', '${id2_expiry}', '${data.id2_frontSide}', '${data.id2_backSide}', '${data.selfie}', '${data.addressProof}') RETURNING userId`
      );
      if (rows.length == 0) {
        return res.status(404).send("No Record Added");
      } else {
        await pgclient.query(
          `UPDATE public.user SET KYC_status = 'pending' WHERE _id::text = '${rows[0].userid}'`,
          (err, result) => {
            if (err) {
              return res.status(401).send("Something Went Wrong");
            } else {
              const response = {
                flag: statusCodes.OK,
                message: statusCodes.getStatusText(statusCodes.OK),
                data: { KYC_status: "pending" },
              };
              return res.status(200).send(response);
            }
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
