import { Router } from "express";
import { AmostraController } from "../../controllers/amostras/amostra.controller";

const amostraRoutes = Router();

amostraRoutes.get('/all', AmostraController.getAll);
amostraRoutes.get('/:id', AmostraController.getId);
amostraRoutes.get('/:nome', AmostraController.getNome);
amostraRoutes.post('/', AmostraController.post);
amostraRoutes.put('/:id', AmostraController.put);
amostraRoutes.delete('/:id', AmostraController.delete);

export default amostraRoutes;
