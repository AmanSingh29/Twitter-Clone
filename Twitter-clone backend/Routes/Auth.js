const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../multer/uploadConfig");
// const { JWT_SECRET } = require("../config");

//testing multer api
router.post("/testmulter", upload.single("test"), (req, res) => {
  console.log(req.file);
});

router.post(
  "/user/:id/uploadProfilePic",
  upload.single("file"),
  async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      user = await User.updateOne(
        user,
        { $set: { profilePicture: req.file.filename } },
        { new: true }
        // console.log(req.file)
      ).then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//user register api
router.post("/auth/register", async (req, res) => {
  const {
    fullName,
    username,
    email,
    password,
    profilePicture,
    location,
    dateOfBirth,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "one or more field is mandatory!" });
    }
    let userbymail = await User.findOne({ email: email });
    let userbyusername = await User.findOne({ username: username });
    if (userbyusername || userbymail) {
      return res.status(500).json({ error: "user already registered!" });
    } else {
      let user = new User({
        fullName,
        username,
        email,
        password: hashPass,
        profilePicture,
        location,
        dateOfBirth,
      });
      user.save();
      return res.status(201).json({ success: "user successfully registered" });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

// Login user
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid cradentials!" });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: "Invalid cradentials!" });
    } else if (user) {
      const passCompare = await bcrypt.compare(password, user.password);
      if (passCompare) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const userData = {
          userid: user._id,
          username: user.username,
          name: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture,
        };
        res
          .status(200)
          .json({ result: { userData: userData, authtoken: token } });
      } else {
        return res.status(401).json({ error: "Invalid cradentials!" });
      }
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

module.exports = router;
