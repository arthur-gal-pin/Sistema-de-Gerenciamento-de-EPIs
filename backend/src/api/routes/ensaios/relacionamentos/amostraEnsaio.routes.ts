import { Router } from "express";
import { amostraEnsaioController } from "../../../controllers/ensaios/relacionamentos/amostraEnsaio.controller";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../../enum/funcionarios/nivelPermissao.enum";

const amostraEnsaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

amostraEnsaioRoutes.get('/all', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.getAll);
amostraEnsaioRoutes.get('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.getId);
amostraEnsaioRoutes.get('/amostra/:fk_amostra', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.getAmostra);
amostraEnsaioRoutes.get('/ensaio/:fk_ensaio', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.getEnsaio);
amostraEnsaioRoutes.get('/instrumento/:fk_instrumento', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.getInstrumento);
amostraEnsaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.create);
amostraEnsaioRoutes.patch('/:id', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), amostraEnsaioController.update);
amostraEnsaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), amostraEnsaioController.delete);

export default amostraEnsaioRoutes;