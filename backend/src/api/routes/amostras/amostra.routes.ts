import { Router } from "express";
import { AmostraController } from "../../controllers/amostras/amostra.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const amostraRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

amostraRoutes.get('/all', auth.authenticate, AmostraController.getAll);
amostraRoutes.get('/nome/:nome', auth.authenticate, AmostraController.getNome);
amostraRoutes.get('/id/:id', auth.authenticate, AmostraController.getId);
amostraRoutes.get('/protocolo/:idProtocolo', auth.authenticate, AmostraController.getProtocolo);
amostraRoutes.get('/classificacao/:classificacao', auth.authenticate, AmostraController.getClassificacao);
amostraRoutes.get('/subclassificacao/:subclassificacao', auth.authenticate, AmostraController.getSubclassificacao);
amostraRoutes.get('/codigo/:codigo', auth.authenticate, AmostraController.getCodigo);
amostraRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador), AmostraController.create);
amostraRoutes.patch('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador), AmostraController.update);
amostraRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador), AmostraController.delete);

export default amostraRoutes;
