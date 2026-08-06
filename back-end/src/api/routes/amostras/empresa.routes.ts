import { Router } from "express";
import { EmpresaController } from "../../controllers/amostras/empresa.controller";

const empresaRoutes = Router();

empresaRoutes.get('/all', EmpresaController.getAll);
empresaRoutes.get('/nome/:nome', EmpresaController.getNome);
empresaRoutes.get('/:id', EmpresaController.getId);
empresaRoutes.post('/', EmpresaController.create);
empresaRoutes.patch('/id/:id', EmpresaController.update);
empresaRoutes.delete('/id/:id', EmpresaController.delete);

export default empresaRoutes;