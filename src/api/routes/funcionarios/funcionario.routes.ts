// funcionario.routes.ts
import { Router } from "express";
import { FuncionarioController } from "../../controllers/funcionarios/funcionario.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";
import uploadImage from "../../middlewares/uploadImage";

const funcionarioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

funcionarioRoutes.get('/all',    auth.authenticate, auth.autorizar(administrador, coordenador), FuncionarioController.readAll);

funcionarioRoutes.get('/id/:id', auth.authenticate, FuncionarioController.readId);

funcionarioRoutes.post('/',    auth.authenticate, auth.autorizar(administrador), uploadImage.single('image'), FuncionarioController.create);

funcionarioRoutes.put('/:id',  auth.authenticate, auth.autorizar(administrador, coordenador), uploadImage.single('image'), FuncionarioController.update);

funcionarioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador), FuncionarioController.delete);

export default funcionarioRoutes;