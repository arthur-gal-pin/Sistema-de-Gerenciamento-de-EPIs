import { Router } from "express";
import { campoEnsaioController } from "../../controllers/ensaios/campoEnsaio.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const campoEnsaioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

campoEnsaioRoutes.get('/all',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.getAll);
campoEnsaioRoutes.get('/id/:id',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.getId);
campoEnsaioRoutes.get('/tipoEnsaio/:fk',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.getFK);
campoEnsaioRoutes.get('/nome/:name',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.getName);
campoEnsaioRoutes.get('/unidade/:unidade',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.getUnidadeMedida);
campoEnsaioRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.create);
campoEnsaioRoutes.patch('/:id',  auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), campoEnsaioController.update);
campoEnsaioRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), campoEnsaioController.delete);

export default campoEnsaioRoutes;