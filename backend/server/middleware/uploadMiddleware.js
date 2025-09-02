import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (file.fieldname === "image") {
      uploadPath = path.join(__dirname, "../../../frontend/public/uploads/images");
    } else if (file.fieldname === "song") {
      uploadPath = path.join(__dirname, "../../../frontend/public/uploads/songs");
    } else {
      return cb(new Error("Invalid field name"), false);
    }

    // ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // use the absolute path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;