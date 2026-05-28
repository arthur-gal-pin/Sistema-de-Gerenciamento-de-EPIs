import { Router } from "express";
import { TelefoneController } from "../../controllers/funcionarios/telefone.controller";


const telefoneRoutes = Router();

telefoneRoutes.get('/funcionario/:fkId', TelefoneController.readFuncionario);
telefoneRoutes.post('/', TelefoneController.create);
telefoneRoutes.put('/:id', TelefoneController.update);
telefoneRoutes.delete('/:id', TelefoneController.delete);

export default telefoneRoutes;