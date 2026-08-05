// cargo.routes.ts
import { Router } from "express";
import { CargoController } from "../../controllers/funcionarios/cargo.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const cargoRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

// Qualquer funcionário autenticado pode listar
cargoRoutes.get('/all',    auth.authenticate, CargoController.readAll);
cargoRoutes.get('/id/:id', auth.authenticate, CargoController.readId);

// Só admin ou coordenador pode criar/editar/deletar cargos
cargoRoutes.post('/',       auth.authenticate, auth.autorizar(administrador), CargoController.create);
cargoRoutes.patch('/id/:id',  auth.authenticate, auth.autorizar(administrador, coordenador), CargoController.update);
cargoRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador), CargoController.delete);

export default cargoRoutes;