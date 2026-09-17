import { Router } from "express";
import { AmostraController } from "../../controllers/amostras/amostra.controller";

const amostraRoutes = Router();

amostraRoutes.get('/all', AmostraController.getAll);
amostraRoutes.get('/nome/:nome', AmostraController.getNome);
amostraRoutes.get('/id/:id', AmostraController.getId);
amostraRoutes.post('/', AmostraController.create);
amostraRoutes.patch('/id/:id', AmostraController.update);
amostraRoutes.delete('/id/:id', AmostraController.delete);

export default amostraRoutes;
