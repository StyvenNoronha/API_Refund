// uploadConfig.ts
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.relative(TMP_FOLDER, "uploads");

const MAX_FILE_SIZE = 1024 * 1024 * 3;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]; // Corrigido: era "images/jpeg", tem que ser "image/jpeg"

const storage = multer.diskStorage({
  destination: TMP_FOLDER,
  filename(request, file, callback) {
    const fileHash = crypto.randomBytes(10).toString("hex");
    const fileName = `${fileHash}-${file.originalname}`;
    return callback(null, fileName);
  },
});

const MULTER = {
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (request:Request, file:any, callback:any) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type"));
    }
  },
};

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
};
