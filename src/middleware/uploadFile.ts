import multer, { FileFilterCallback } from "multer";
import path from "path";
import slugify from "slugify";
import { randomUUID } from "crypto";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../upload/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = randomUUID();
    const date = new Date().toLocaleDateString();
    cb(
      null,
      slugify(req.body.title + "-" + date, { lower: true }) +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname),
    );
  },
});

const filterImage = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    "image/webp" ||
    "image/avif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: filterImage,
});
