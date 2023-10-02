'use strict'

// Cargar mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el schema del modelo follow
let FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Follow', FollowSchema);