import { Router } from "express";
import { ProtocoloController } from "../../controllers/ensaios/protocolo.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const protocoloRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador, funcionario } = enumNivelPermissao;

protocoloRoutes.get('/all',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.getAll);
protocoloRoutes.get('/id/:id',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.getId);
protocoloRoutes.get('/SEI/:sei',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.getSEI);
protocoloRoutes.get('/numeroProtocolo/:code',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.getCode);
protocoloRoutes.get('/tipoProtocolo/:type',    auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.getType);
protocoloRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.create);
protocoloRoutes.patch('/id/:id',  auth.authenticate, auth.autorizar(administrador, coordenador, funcionario), ProtocoloController.update);
protocoloRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador), ProtocoloController.delete);

export default protocoloRoutes;