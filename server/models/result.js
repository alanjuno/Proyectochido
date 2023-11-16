const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
  operacion: String,
  resultado: Number,
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Resultado = mongoose.model('Resultado', resultadoSchema);

module.exports = Resultado;
