import { Router } from "express";
import { TelefoneController } from "../../controllers/funcionarios/telefone.controller";
<<<<<<< HEAD
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const telefoneRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

telefoneRoutes.get('/funcionario/:fkId', auth.authenticate, TelefoneController.getFuncionario);
telefoneRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.create);
telefoneRoutes.put('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.update);
telefoneRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.delete);
=======


const telefoneRoutes = Router();

telefoneRoutes.get('/funcionario/:fkId', TelefoneController.getFuncionario);
telefoneRoutes.post('/', TelefoneController.create);
telefoneRoutes.put('/:id', TelefoneController.update);
telefoneRoutes.delete('/:id', TelefoneController.delete);
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285

export default telefoneRoutes;