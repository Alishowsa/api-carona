const express = require('express');
const router = express.Router();

const controller = require('../controllers/solicitacaoController');
const auth = require('../middlewares/auth');

// SOLICITAR VAGA
router.post('/:carona_id', auth, controller.solicitar);

// ACEITAR SOLICITAÇÃO
router.put('/:id/aceitar', auth, controller.aceitar);

// RECUSAR SOLICITAÇÃO
router.put('/:id/recusar', auth, controller.recusar);

module.exports = router;