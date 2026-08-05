import { Router } from "express";
import { AmostraController } from "../../controllers/amostras/amostra.controller";

const amostraRoutes = Router();

amostraRoutes.get('/all', AmostraController.getAll);
amostraRoutes.get('/nome/:nome', AmostraController.getNome);
amostraRoutes.get('/:id', AmostraController.getId);
amostraRoutes.post('/', AmostraController.post);
amostraRoutes.put('/:id', AmostraController.put);
amostraRoutes.delete('/:id', AmostraController.delete);

export default amostraRoutes;
