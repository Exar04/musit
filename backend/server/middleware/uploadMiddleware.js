import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath
    if (file.fieldname === "image") {
      uploadPath = "uploads/images"
      cb(null, "uploads/images");
    } else if (file.fieldname === "song") {
      uploadPath = "uploads/songs"
      cb(null, "uploads/songs");
    } else {
      cb(new Error("Invalid field name"), false);
    }
    fs.mkdirSync(uploadPath, { recursive: true });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;