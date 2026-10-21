import { Router } from "express";
import { dadosEnsaioController } from "../../../controllers/ensaios/dados/dadosEnsaio.controller";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../../enum/funcionarios/nivelPermissao.enum";

const dadosEnsaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

dadosEnsaioRoutes.get('/all', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.getAll);
dadosEnsaioRoutes.get('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.getId);
dadosEnsaioRoutes.get('/amostraEnsaio/:fk_amostra_ensaio', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.getAmostraEnsaio);
dadosEnsaioRoutes.get('/campoEnsaio/:fk_campo_ensaio', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.getCampoEnsaio);
dadosEnsaioRoutes.get('/nome/:nome', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.getName);
dadosEnsaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.create);
dadosEnsaioRoutes.patch('/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), dadosEnsaioController.update);
dadosEnsaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), dadosEnsaioController.delete);

export default dadosEnsaioRoutes;