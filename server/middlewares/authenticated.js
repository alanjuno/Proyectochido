'use  strict'

// Cargar módulo jwt-simple
const jwt = require('jwt-simple');

// Cargar módulo moment
const moment = require('moment');

// Calve secreta
const secret = 'clave_secreta_red_social';

// Garantizar la autenticación
exports.ensureAuth = function (request, response, next) {

    // El token va a llegar en una cabecera
    // Si no llega en la cabecera
    if (!request.headers.authorization) {
        return response.status(403).send({ message: 'Acceso denegado!! La peticion no tiene la cabecera de autenticacion' });
    }

    // Replace para quitar las comillas simples y/o dobles
    // En la variable token se guarda el token limpio para decodificarlo
    let token = request.headers.authorization.replace(/['"]+/g, '');

    try {
        // Decodificar el payload (objeto completo con todos los datos)
        var payload = jwt.decode(token, secret);

        // Si el payload lleva una fecha inferor o igual a la actual
        if (payload.exp <= moment.unix()) {
            // El token ha expirado
            return response.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        // El token ha expirado
        return response.status(404).send({
            message: 'El token no es valido'
        });
    }

    /**
     * Adjuntar el payload a la request para tener en los controladores
     * el objeto usuario que está logeado
     * En la propiedad user del objeto request están todos los datos 
     * del usuario que está logeado
     */
    request.user = payload;

    // Llamada al método next para saltar a lo siguiente que va a ejecutar Node
    // Ejecutar la acción del controlador
    next();
}