const fs = require("fs");
const pgclient = require("../../database");
const utils = require("../../utils");

exports.updateProfilePhoto = async (req, res, next) => {
  const { id } = req.user;
  let image = "";
  if (req.file) {
    const { destination, filename } = req.file;
    if (utils.isImage(req.file.mimetype)) {
      image = utils.createImageUrl(destination, filename);
    }
  }
  const { rows } = await pgclient.query(
    `SELECT * FROM public.user WHERE _id::text = '${id}'`
  );
  if (rows.length == 0) {
    return res.status(404).send("User Not Found");
  } else {
    if (rows[0].profile_photo) {
      const path = utils.getImagePath(rows[0].profile_photo);
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
    const update = await pgclient.query(
      `WITH updated_rows AS (UPDATE public.user SET profile_photo = '${image}' WHERE _id::text = '${id}' RETURNING _id ) SELECT _id FROM updated_rows;`
    );
    if (update.rows.length == 0) {
      return res.status(404).send("Not Updated");
    }
    return res.status(200).send("Profile picture Update");
  }
};

// Update Individual User Personalinfo
exports.updatePersonaLInfo = async (req, res, next) => {
  const { id } = req.user;
  const { first_name, last_name, middle_name } = req.body;
  const { rows } = await pgclient.query(
    `SELECT * FROM public.user WHERE _id::text = '${id}'`
  );
  if (rows.length == 0) {
    return res.status(404).send("User Not Found");
  } else {
    const update = await pgclient.query(
      `WITH updated_rows AS (UPDATE public.user SET first_name = '${first_name}', last_name = '${last_name}', middle_name = '${middle_name}' WHERE _id::text = '${id}' RETURNING _id ) SELECT _id FROM updated_rows;`
    );
    if (update.rows.length == 0) {
      return res.status(404).send("Not Updated");
    }
    return res.status(200).send("Profile picture Update");
  }
};

exports.updateAccountInfo = async (req, res, next) => {
  const { id } = req.user;
  const { dateofbirth, country, email, phone_number } = req.body;
  const { rows } = await pgclient.query(
    `SELECT * FROM public.user WHERE _id::text = '${id}'`
  );
  if (rows.length == 0) {
    return res.status(404).send("User Not Found");
  } else {
    if (!utils.validateEmail(email)) {
      return res.status(406).send("Invalid Email Address.");
    }
    await pgclient.query(
      `WITH updated_rows AS (UPDATE public.user SET date_of_birth ='${dateofbirth}', country = '${country}', email = '${email}', phone = '${phone_number}' WHERE _id::text = '${id}' RETURNING _id ) SELECT _id FROM updated_rows;`,
      (err, result) => {
        if (err) {
          if (err.code == 23505) {
            return res.status(500).send("Email Already Exist");
          }
        } else {
          return res.status(200).send("Account Info Update");
        }
      }
    );
  }
};

exports.updateAddressInfo = async (req, res, next) => {
  const { id } = req.user;
  const { address1, address2, city, country, postal_code } = req.body;
  const { rows } = await pgclient.query(
    `SELECT * FROM public.user WHERE _id::text = '${id}'`
  );
  if (rows.length == 0) {
    return res.status(404).send("User Not Found");
  } else {
    if (rows[0].country != country) {
      return res.status(401).send("Please Select Same Country as Account Info");
    }
    const update = await pgclient.query(
      `WITH updated_rows AS (UPDATE public.user SET address1 = '${address1}', address2 = '${address2}', city = '${city}', country = '${country}', postal_code = '${postal_code}' WHERE _id::text = '${id}' RETURNING _id ) SELECT _id FROM updated_rows;`
    );
    if (update.rows.length == 0) {
      return res.status(404).send("Not Updated");
    }
    return res.status(200).send("Address Info Update");
  }
};
