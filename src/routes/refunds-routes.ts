import { Router } from "express";
import { RefundsController } from "@/controllers/refunds-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorizarion";
const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post('/',verifyUserAuthorization(["employee"]),refundsController.create)
refundsRoutes.get('/',verifyUserAuthorization(["manager"]),refundsController.index)


export {refundsRoutes}