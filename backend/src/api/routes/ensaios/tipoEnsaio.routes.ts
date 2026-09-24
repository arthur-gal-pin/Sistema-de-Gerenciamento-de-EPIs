import { Router } from "express";
import { tipoEnsaioController } from "../../controllers/ensaios/tipoEnsaio.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const tipoEnsaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

tipoEnsaioRoutes.get('/all', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.getAll);
tipoEnsaioRoutes.get('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.getId);
tipoEnsaioRoutes.get('/description', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.getDescription);
tipoEnsaioRoutes.get('/category/:categoria', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.getCategory);
tipoEnsaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.create);
tipoEnsaioRoutes.put('/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), tipoEnsaioController.update);
tipoEnsaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), tipoEnsaioController.delete);

export default tipoEnsaioRoutes;