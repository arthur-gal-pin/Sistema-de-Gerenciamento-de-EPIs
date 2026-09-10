import { Router } from "express";
import { ProfileActionsController } from "../../controllers/funcionarios/perfis/profileActions.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import uploadImage from "../../middlewares/uploadImage";

const profileActionsRoutes = Router();
const auth = new AuthMiddleware();


profileActionsRoutes.patch('/meu-perfil/change-info',  auth.authenticate, ProfileActionsController.updateInfo);
profileActionsRoutes.patch('/meu-perfil/change-password',  auth.authenticate, ProfileActionsController.updatePassword);
profileActionsRoutes.patch('/meu-perfil/change-pfp',  auth.authenticate, ProfileActionsController.updatePfp);

export default profileActionsRoutes;