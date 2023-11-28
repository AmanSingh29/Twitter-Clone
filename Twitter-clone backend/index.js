const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = 5000;
const app = express();
const cors = require("cors");

// middlewares
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("./uploads"));

global.__basedir = __dirname;
//connect to database
mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", function () {
  console.log("DB connected");
});

//error on connecting to db
mongoose.connection.on("error", function (error) {
  console.log("some error on connecting to DB");
});

//Models
require("./models/UserModel");
require("./models/TweetModel");

//Routes
app.use("/api", require("./Routes/Auth"));
app.use("/api", require("./Routes/User"));
app.use("/api", require("./Routes/Tweet"));

//starting local server
app.listen(port, () => {
  console.log("Server has started!");
});
