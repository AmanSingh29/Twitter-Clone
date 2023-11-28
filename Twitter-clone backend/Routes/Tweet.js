const express = require("express");
const router = express.Router();
const Tweet = require("../models/TweetModel");
const verifyUser = require("../middleware/VerifyUser");
const upload = require("../multer/uploadConfig");

//to upload image for tweet
router.post("/uploadFile", upload.single("file"), async (req, res) => {
  res.json({ fileName: req.file.filename });
});

//create a tweet api
router.post("/tweet", verifyUser, async (req, res) => {
  const { content, image } = req.body;
  try {
    if (!content) {
      return res
        .status(400)
        .json({ error: "One or more mandatory fields are empty" });
    } else {
      const tweet = await new Tweet({
        tweetedBy: req.user._id,
        content,
        image: image,
      });
      tweet
        .save()
        .then((newTweet) => {
          return res.status(201).json({ tweet: newTweet });
        })
        .catch((error) => {
          return res.send(error);
        });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//like a tweet api
router.post("/tweet/:id/like", verifyUser, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.likes.includes(req.user._id)) {
      return res.status(401).json({ error: "you aleady liked this tweet!" });
    } else {
      tweet
        .updateOne({ $push: { likes: req.user._id } }, { new: true })
        .then((likedTweet) => {
          return res.status(201).json({ tweet: likedTweet });
        })
        .catch((error) => {
          return res.send(error);
        });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//dislike a tweet api
router.post("/tweet/:id/dislike", verifyUser, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.likes.includes(req.user._id)) {
      tweet
        .updateOne({ $pull: { likes: req.user._id } }, { new: true })
        .then((dislikedTweet) => {
          return res.status(201).json({ tweet: dislikedTweet });
        })
        .catch((error) => {
          return res.send(error);
        });
    } else {
      return res.status(401).json({ error: "you are not liking this tweet!" });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//replies on a tweet api
router.post("/tweet/:id/reply", verifyUser, async (req, res) => {
  const { content } = req.body;
  try {
    const newTweet = await new Tweet({ content, tweetedBy: req.user._id });
    newTweet.save();
    const tweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: newTweet._id } },
      { new: true }
    )
      .populate("replies", "content")
      .populate("tweetedBy", "_id username fullName")
      .then((result) => {
        return res.status(201).json({ result });
      })
      .catch((error) => {
        return res.send(error);
      });
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//get a single tweet api
router.get("/tweet/:id", (req, res) => {
  try {
    Tweet.findById(req.params.id)
      .populate("tweetedBy", "_id fullName username profilePicture")
      .populate("replies")
      .then((result) => {
        return res.status(200).json({ result: result });
      })
      .catch((error) => {
        return res.send(error);
      });
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//get a single user all tweets api
router.get("/:id/usertweet", verifyUser, (req, res) => {
  // res.send("all tweets")
  try {
    Tweet.find({ tweetedBy: req.params.id })
      .populate(
        "tweetedBy",
        "_id fullName username location dateOfBirth email profilePicture"
      )
      .then((result) => {
        return res.send(result);
      });
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//get all tweets details details
router.get("/tweet/", verifyUser, (req, res) => {
  try {
    Tweet.find()
      .populate("tweetedBy", "_id fullName username profilePicture")
      .sort({ createdAt: -1 })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.send(error);
      });
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//delete a tweet api
router.delete("/tweet/:id", verifyUser, async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  try {
    if (req.user._id == tweet.tweetedBy.toString()) {
      tweet
        .deleteOne()
        .then((result) => {
          return res.status(200).json({ result: "tweet deleted!" });
        })
        .catch((error) => {
          return res.send(error);
        });
    } else {
      return res.status(401).json({ error: "access denied!" });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

//retweet api
router.post("/tweet/:id/retweet", verifyUser, async (req, res) => {
  let tweet = await Tweet.findById(req.params.id);
  try {
    if (tweet.reTweetedBy.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "you already retweeted this tweet!" });
    } else {
      tweet
        .updateOne({ $push: { reTweetedBy: req.user._id } }, { new: true })
        .then((result) => {
          return res.status(201).json({ result: result });
        })
        .catch((error) => {
          return res.status(501).json({ error: "Internal server error!" });
        });
    }
  } catch (error) {
    return res.status(501).json({ error: "Internal server error!" });
  }
});

module.exports = router;
