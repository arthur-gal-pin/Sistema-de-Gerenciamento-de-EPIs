import { Router } from "express";
import { funcionarioEnsaioController } from "../../../controllers/ensaios/relacionamentos/funcionarioEnsaio.controller";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../../enum/funcionarios/nivelPermissao.enum";

const funcionarioEnsaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

funcionarioEnsaioRoutes.get('/all', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.getAll);
funcionarioEnsaioRoutes.get('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.getId);
funcionarioEnsaioRoutes.get('/funcionario/:fk_funcionario', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.getFuncionario);
funcionarioEnsaioRoutes.get('/ensaio/:fk_ensaio', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.getEnsaio);
funcionarioEnsaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.create);
funcionarioEnsaioRoutes.patch('/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), funcionarioEnsaioController.update);
funcionarioEnsaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), funcionarioEnsaioController.delete);

export default funcionarioEnsaioRoutes;