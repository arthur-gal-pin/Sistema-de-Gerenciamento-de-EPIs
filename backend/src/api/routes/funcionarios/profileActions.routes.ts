import { Router } from "express";
import { FuncionarioController } from "../../controllers/funcionarios/funcionario.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { profileActions } from "../../controllers/funcionarios/perfis/profileActions.controller";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";
import uploadImage from "../../middlewares/uploadImage";

const profileActionsRoutes = Router();
const auth = new AuthMiddleware();


profileActionsRoutes.patch('/meu-perfil/info',  auth.authenticate, FuncionarioController.update);
profileActionsRoutes.patch('/meu-perfil/info',  auth.authenticate, FuncionarioController.update);
profileActionsRoutes.patch('/meu-perfil/info',  auth.authenticate, FuncionarioController.update);
profileActionsRoutes.delete('/id/:id', auth.authenticate, FuncionarioController.delete);

export default profileActionsRoutes;