import multer from "multer";
import path from "path";
import slugify from "slugify";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../../upload/images"));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = randomUUID();
    const date = (new Date()).toLocaleDateString();
    cb(null, slugify(req.body.title + "-" + date, { lower: true }) + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const filterImage = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || "image/webp" || "image/avif") {
    cb(null, true);
  } else {
    console.error("file type not support");
    cb(null, false);
  }
};

export const uploadImage = multer({ storage: storage, fileFilter: filterImage });
