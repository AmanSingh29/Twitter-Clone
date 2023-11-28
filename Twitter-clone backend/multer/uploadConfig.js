const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return res
      .status(400)
      .json({ error: "Only jpg, jpeg and png image allowed!" });
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

module.exports = upload;
