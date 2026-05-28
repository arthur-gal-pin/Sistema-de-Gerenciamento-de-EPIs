import { Router } from "express";
import { FuncionarioController } from "../../controllers/funcionarios/funcionario.controller";
import uploadImage from "../../middlewares/uploadImage";
const funcionarioRoutes = Router();

funcionarioRoutes.get('/all', FuncionarioController.readAll);
funcionarioRoutes.get('/id/:id', FuncionarioController.readId);
funcionarioRoutes.post('/', uploadImage.single('image'), FuncionarioController.create);
funcionarioRoutes.put('/:id', uploadImage.single('image'), FuncionarioController.update);
funcionarioRoutes.delete('/:id', FuncionarioController.delete);

export default funcionarioRoutes;