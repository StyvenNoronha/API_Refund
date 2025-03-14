import { Router } from "express"
import multer from "multer"

import uploadConfig from "@/configs/uploadConfig"
import { UploadsController } from "@/controllers/uploads-controller"

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

import { verifyUserAuthorization } from "@/middlewares/verify-user-authorizarion"

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(verifyUserAuthorization(["employee"]))

uploadsRoutes.post("/", upload.single("file"), uploadsController.create)

export { uploadsRoutes }
