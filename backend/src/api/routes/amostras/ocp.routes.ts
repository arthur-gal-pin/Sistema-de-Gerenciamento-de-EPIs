import { Router } from "express";
import { OcpController } from "../../controllers/amostras/ocp.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const ocpRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

ocpRoutes.get('/all', auth.authenticate, OcpController.getAll);
ocpRoutes.get('/nome/:nome', auth.authenticate, OcpController.getNome);
ocpRoutes.get('/id/:id', auth.authenticate, OcpController.getId);
ocpRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador), OcpController.create);
ocpRoutes.patch('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador), OcpController.update);
ocpRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador), OcpController.delete);

export default ocpRoutes;