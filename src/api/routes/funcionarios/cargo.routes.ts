import { Router } from "express";
import { CargoController } from "../../controllers/funcionarios/cargo.controller";

const cargoRoutes = Router();

cargoRoutes.get('/all', CargoController.readAll);
cargoRoutes.get('/id/:id', CargoController.readId);
cargoRoutes.put('/id/:id', CargoController.update);
cargoRoutes.post('/', CargoController.create);
cargoRoutes.delete('/id/:id', CargoController.delete);

export default cargoRoutes;