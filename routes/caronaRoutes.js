const express = require('express');
const router = express.Router();

const controller = require('../controllers/caronaController');
const auth = require('../middlewares/auth');

// Todas as rotas de carona exigem login (token JWT)
router.post('/', auth, controller.criar);
router.get('/', auth, controller.listar);
router.get('/:id', auth, controller.buscarPorId);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.deletar);

module.exports = router;
