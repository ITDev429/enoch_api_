process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (
  process.env.NODE_ENV !== "development" &&
  process.env.NODE_ENV !== "production" &&
  process.env.NODE_ENV !== "staging"
) {
  console.log(`
  Please specify one of the following environments to run your server
  - development
  - production
  Example : NODE_ENV=development pm2 start server.js`);
  process.exit(1);
}
require("dotenv").config();
const express = require("express"),
  config = require("config"),
  cors = require("cors"),
  path = require("path"),
  http = require("http"),
  port = process.env.PORT || config.port,
  errorController = require("./controllers/error"),
  routes = require("./routes/index"),
  swaggerSpec = require("./swagger/index"),
  swaggerUi = require("swagger-ui-express");

const app = express();

app.use("/api/images", express.static(path.join(__dirname, "public/uploads")));
app.use(express.json());

app.use(cors());
app.use("/api/v1", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorController.get404);
var httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log("[ Http server running at port ] ", port);
});
