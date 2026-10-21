import { Router } from "express";
import { ensaioController } from "../../controllers/ensaios/ensaio.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const ensaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

ensaioRoutes.get('/all', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getAll);
ensaioRoutes.get('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getId);
ensaioRoutes.get('/nome/:nome', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getName);
ensaioRoutes.get('/descricao/:descricao', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getDescription);
ensaioRoutes.get('/papel/:papel', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getPapelEnsaio);
ensaioRoutes.get('/protocolo/:idProtocolo', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getProtocolo);
ensaioRoutes.get('/tipoEnsaio/:idTipoEnsaio', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.getTipoEnsaio);
ensaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.create);
ensaioRoutes.patch('/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ensaioController.update);
ensaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), ensaioController.delete);

export default ensaioRoutes;