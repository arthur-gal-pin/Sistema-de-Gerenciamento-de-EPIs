import { Router } from "express";
import { TelefoneController } from "../../controllers/funcionarios/telefone.controller";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

const telefoneRoutes = Router();
const auth = new AuthMiddleware();

const { administrador, coordenador } = enumNivelPermissao;

telefoneRoutes.get('/funcionario/:fkId', auth.authenticate, TelefoneController.getFuncionario);
telefoneRoutes.post('/', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.create);
telefoneRoutes.put('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.update);
telefoneRoutes.delete('/:id', auth.authenticate, auth.autorizar(administrador, coordenador), TelefoneController.delete);

export default telefoneRoutes;