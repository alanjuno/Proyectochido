'use strict'

// Cargar mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el schema del modelo user
let UserSchema = Schema({
    name: String,
    surname: String,
    nickname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);