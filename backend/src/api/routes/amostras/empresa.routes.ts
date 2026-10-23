import { Router } from "express";
import { EmpresaController } from "../../controllers/amostras/empresa.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const empresaRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

empresaRoutes.get('/all', auth.authenticate, EmpresaController.getAll);
empresaRoutes.get('/nome/:nome', auth.authenticate, EmpresaController.getNome);
empresaRoutes.get('/:id', auth.authenticate, EmpresaController.getId);
empresaRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador), EmpresaController.create);
empresaRoutes.patch('/id/:id', auth.authenticate, auth.autorizar(administrador, coordenador), EmpresaController.update);
empresaRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador), EmpresaController.delete);

export default empresaRoutes;