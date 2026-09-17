import { Router } from "express";
import { TelefoneController } from "../../controllers/funcionarios/telefone.controller";


const telefoneRoutes = Router();

telefoneRoutes.get('/funcionario/:fkId', TelefoneController.getFuncionario);
telefoneRoutes.post('/', TelefoneController.create);
telefoneRoutes.put('/:id', TelefoneController.update);
telefoneRoutes.delete('/:id', TelefoneController.delete);

export default telefoneRoutes;