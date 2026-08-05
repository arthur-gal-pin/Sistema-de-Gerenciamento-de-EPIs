import { Router } from "express";
import { OcpController } from "../../controllers/amostras/ocp.controller";

const ocpRoutes = Router();

ocpRoutes.get('/all', OcpController.getAll);
ocpRoutes.get('/nome/:nome', OcpController.getNome);
ocpRoutes.get('/:id', OcpController.getId);
ocpRoutes.post('/', OcpController.post);
ocpRoutes.put('/:id', OcpController.put);
ocpRoutes.delete('/:id', OcpController.delete);

export default ocpRoutes;