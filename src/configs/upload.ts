import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

export const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
export const UPLOADS_FOLDER = path.relative(TMP_FOLDER, "uploads");

export const MAX_FILE_SIZE = 1024 * 1024 * 3;
export const ACCEPTED_IMAGE_TYPES = ["images/jpeg", "images/jpg", "image/png"];

export const MULTER = [
  Storage,
  multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
];
