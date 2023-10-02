'use strict'

// Cargar mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el schema del modelo message
let MessageSchema = Schema({
    text: String,
    viewed: Boolean,
    created_at: String,
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', MessageSchema);