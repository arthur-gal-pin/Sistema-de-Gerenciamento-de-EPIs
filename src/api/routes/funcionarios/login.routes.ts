import { Router } from "express";
import { AuthController } from "../../controllers/AuthController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const authController = new AuthController();

const authRoutes = Router();

authRoutes.post('/login', authController.login);

export default authRoutes;