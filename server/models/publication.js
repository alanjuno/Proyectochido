'use strict'

// Cargar mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el schema del modelo publication
let PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Publication', PublicationSchema);