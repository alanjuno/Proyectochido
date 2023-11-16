const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/result');

router.post('/api/resultados', resultadoController.crearResultado);

module.exports = router;
