const basicInfo = require("./basicInfo");
const servers = require("./servers");
const components = require("./components");
const security = require("./security");
const tags = require("./tags");
const paths = require("./paths/index");

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  // ...security,
  ...tags,
  ...paths,
};
