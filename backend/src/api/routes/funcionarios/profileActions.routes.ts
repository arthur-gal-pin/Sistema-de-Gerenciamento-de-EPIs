import { Router } from "express";
import { ProfileActionsController } from "../../controllers/funcionarios/perfis/profileActions.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { uploadImagePerfil } from "../../middlewares/uploadImage";

const profileActionsRoutes = Router();
const auth = new AuthMiddleware();

profileActionsRoutes.patch('/meu-perfil/change-info',  auth.authenticate, ProfileActionsController.updateInfo);
profileActionsRoutes.patch('/meu-perfil/change-password',  auth.authenticate, ProfileActionsController.updatePassword);
profileActionsRoutes.post('/meu-perfil/change-pfp',  auth.authenticate, uploadImagePerfil.single('image'), ProfileActionsController.updatePfp);
profileActionsRoutes.patch('/meu-perfil/remove-pfp', auth.authenticate, ProfileActionsController.removePfp);

export default profileActionsRoutes;