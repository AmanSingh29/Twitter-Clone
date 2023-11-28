// const { JWT_SECRET } = require('../config');
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

module.exports = async (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    return res.status(401).json({ error: "user not logged in!" });
  }
  jwt.verify(auth, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "user not logged in!" });
    }
    const { _id } = payload;
    User.findById({ _id }).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
