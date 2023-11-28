const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const TweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    tweetedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: "no image"
    },
    replies: [{
        type: ObjectId,
        ref: "Tweet"
    }],
    reTweetedBy: [{
        type: String,
        ref: "User"
    }]

}, {
    timestamps: true
})

module.exports = mongoose.model('Tweet', TweetSchema)