import { Router } from "express";
import { InstrumentoController } from "../../controllers/ensaios/instrumento.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const instrumentoRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

instrumentoRoutes.get('/all',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.getAll);
instrumentoRoutes.get('/id/:id',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.getId);
instrumentoRoutes.get('/function',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.getFunction);
instrumentoRoutes.get('/calibration',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.getCalibration);
instrumentoRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.create);
instrumentoRoutes.patch('/:id',  auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), InstrumentoController.update);
instrumentoRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), InstrumentoController.delete);

export default instrumentoRoutes;