'use strict'

// Cargar módulo jwt-simple
const jwt = require('jwt-simple');

// Cargar módulo moment
const moment  = require('moment'); // Generar fechas

const secret = 'clave_secreta_red_social';

// Recibe como parámetro un objeto usuario
exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};