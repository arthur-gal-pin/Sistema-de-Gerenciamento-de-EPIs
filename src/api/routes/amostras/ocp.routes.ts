import { Router } from "express";
import { OcpController } from "../../controllers/amostras/ocp.controller";

const ocpRoutes = Router();

ocpRoutes.get('/all', OcpController.getAll);
ocpRoutes.get('/:id', OcpController.getId);
ocpRoutes.get('/:nome', OcpController.getNome);
ocpRoutes.post('/', OcpController.post);
ocpRoutes.put('/:id', OcpController.put);
ocpRoutes.delete('/:id', OcpController.delete);

export default ocpRoutes;