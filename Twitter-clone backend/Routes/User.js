const User = require("../models/UserModel");
const Tweet = require("../models/TweetModel");
const verifyUser = require("../middleware/VerifyUser");
const express = require("express");
const multer = require("multer");
const router = express.Router();

//get user detail api
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(401).json({ error: "user does not exist!" });
    } else {
      return res.json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        following: user.following,
        followers: user.followers,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        dateOfBirth: user.dateOfBirth,
        location: user.location,
        profilePicture: user.profilePicture,
      });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//api to follow a user
router.post("/user/:id/follow", verifyUser, async (req, res) => {
  try {
    if (req.user._id == req.params.id) {
      return res.status(401).json({ error: "you can not follow yourself!" });
    } else {
      let user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.user._id);
      if (!user) {
        return res.status(402).json({ error: "user does not found" });
      } else if (user.followers.includes(req.user._id)) {
        return res
          .status(401)
          .json({ error: "You already following this user!" });
      } else {
        try {
          user = await User.updateOne(
            user,
            { $push: { followers: req.user._id } },
            { new: true }
          );
          currentUser = await User.updateOne(
            currentUser,
            { $push: { following: req.user._id } },
            { new: true }
          );
          return res.json({ result: { user: user, currentUser: currentUser } });
        } catch (error) {
          return res.json({ error: error });
        }
      }
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//api to unfollow a user
router.post("/user/:id/unfollow", verifyUser, async (req, res) => {
  try {
    if (req.user._id == req.params.id) {
      return res.status(401).json({ error: "you can not unfollow yourself!" });
    } else {
      let user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.user._id);
      if (!user) {
        return res.status(402).json({ error: "user does not found" });
      } else if (user.followers.includes(req.user._id)) {
        user = await User.updateOne(
          user,
          { $pull: { followers: req.user._id } },
          { new: true }
        );
        currentUser = await User.updateOne(
          currentUser,
          { $pull: { following: req.user._id } },
          { new: true }
        )
          .then((newUser) => {
            return res.json({ result: newUser });
          })
          .catch((error) => {
            return res.send(error);
          });
      } else {
        return res
          .status(401)
          .json({ error: "you are not following this user!" });
      }
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//Edit user details api
router.put("/user/:id/", verifyUser, async (req, res) => {
  const { newName, newDob, newLocation, profilePic } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(401).json({ error: "cannot find user!" });
    } else if (req.params.id.toString() == req.user._id) {
      try {
        let updateduser = await User.updateOne(
          user,
          {
            $set: {
              fullName: newName,
              location: newLocation,
              dateOfBirth: newDob,
              profilePicture: profilePic,
            },
          },
          { new: true }
        );
        return res.json(updateduser);
      } catch (error) {
        return res.json({ error: error });
      }
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//Get user tweet api
router.post("/user/:id/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find({ user: req.params.id });
    return res.send(tweets);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
