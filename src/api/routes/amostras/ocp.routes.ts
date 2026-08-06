import { Router } from "express";
import { OcpController } from "../../controllers/amostras/ocp.controller";

const ocpRoutes = Router();

ocpRoutes.get('/all', OcpController.getAll);
ocpRoutes.get('/nome/:nome', OcpController.getNome);
ocpRoutes.get('/id/:id', OcpController.getId);
ocpRoutes.post('/', OcpController.create);
ocpRoutes.patch('/id/:id', OcpController.update);
ocpRoutes.delete('/id/:id', OcpController.delete);

export default ocpRoutes;