const { Router } = require("express");
const tarefaController = require("../controllers/tarefaController");
const autenticar = require("../middlewares/autenticar");

const router = Router();

router.use(autenticar);
router.post("/", tarefaController.criar);
router.get("/", tarefaController.listar);
router.put("/:id", tarefaController.atualizar);
router.delete("/:id", tarefaController.deletar);

module.exports = router;
