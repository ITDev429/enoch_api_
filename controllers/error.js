exports.get404 = (req, res, next) => {
  res.status(404);
  res.send("Page not found please check route");
};
