const Resultado = require('../models/result');

exports.crearResultado = async (req, res) => {
  try {
    const { operacion, resultado } = req.body;
    const nuevoResultado = new Resultado({ operacion, resultado });
    await nuevoResultado.save();
    res.status(201).json({ mensaje: 'Resultado guardado en la base de datos' });
  } catch (error) {
    console.error('Error al guardar el resultado en la base de datos', error);
    res.status(500).json({ mensaje: 'Error al guardar el resultado en la base de datos' });
  }
};