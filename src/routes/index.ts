import { Router } from "express";
import { usersRoutes } from "./users-routes";

const routes = Router()


//rotas Publicas
routes.use('/users', usersRoutes)

export{routes}