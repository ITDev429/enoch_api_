const { Client } = require("pg");
const pgclient = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "Enoch-ezd",
  password: "nesl",
});
pgclient
  .connect()
  .then(() => console.log("[ connected with postgresql ]"))
  .catch((err) => console.error("connection error", err.stack));
module.exports = pgclient;
