import { Router } from "express";
import { FuncionarioController } from "../../controllers/funcionarios/funcionario.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";
import { uploadImagePerfil } from "../../middlewares/uploadImage";

const funcionarioRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

funcionarioRoutes.get('/all',    auth.authenticate, auth.autorizar(administrador, coordenador), FuncionarioController.getAll);
funcionarioRoutes.get('/id/:id', auth.authenticate, FuncionarioController.getId);
funcionarioRoutes.post('/',    auth.authenticate, auth.autorizar(administrador), uploadImagePerfil.single('image'), FuncionarioController.create);
funcionarioRoutes.patch('/id/:id',  auth.authenticate, auth.autorizar(administrador, coordenador), uploadImagePerfil.single('image'), FuncionarioController.update);
funcionarioRoutes.delete('/id/:id', auth.authenticate, auth.autorizar(administrador), FuncionarioController.delete);
<<<<<<< HEAD
=======
funcionarioRoutes.post('/rota-secretabro', uploadImagePerfil.single('image'), FuncionarioController.create);
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285

export default funcionarioRoutes;