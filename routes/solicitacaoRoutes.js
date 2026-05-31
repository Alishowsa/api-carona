const express = require('express');
const router = express.Router();

const controller = require('../controllers/solicitacaoController');
const auth = require('../middlewares/auth');

// criar solicitação
router.post('/:carona_id', auth, controller.solicitar);

// listar solicitações
router.get('/carona/:carona_id', auth, controller.listar);

// atualizar solicitação
router.put('/:id/aceitar', auth, controller.aceitar);
router.put('/:id/recusar', auth, controller.recusar);

// buscar solicitação
router.get('/:id', auth, controller.buscarPorId);

// cancelar solicitação
router.delete('/:id', auth, controller.cancelar);

module.exports = router;