import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { uploadsRoutes } from "./upload-routes";

const routes = Router();

//rotas Publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

//Rotas privadas
routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);
routes.use("/uploads", uploadsRoutes);
export { routes };
