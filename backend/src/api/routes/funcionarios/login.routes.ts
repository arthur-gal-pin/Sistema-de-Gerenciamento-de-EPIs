import { Router } from "express";
import { AuthController } from "../../controllers/AuthController";

const authController = new AuthController();

const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.post('/profile/logout', authController.logout);
authRoutes.post('/esqueci-senha', authController.esqueciASenha);

export default authRoutes;