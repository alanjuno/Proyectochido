'use strict'

// Cargar módulo bcrypt
const bcrypt = require('bcrypt-nodejs');

// Cargar módulo mongoose-pagination
const mongoosePaginate = require('mongoose-pagination');

// Cargar módulo fs para trabajar con archivos
const fs = require('fs');

// Cargar módulo path para trabajar con rutas de sistemas de ficheros
const path = require('path');

// Cargar modelos
const User = require('./../models/user');
const Follow = require('./../models/follow');
const Publication = require('./../models/publication');

// Cargar servicio para el token de autenticación
const jwt = require('./../services/jwt');

// Registrar usuario
function saveUser(request, response) {
    let params = request.body;
    let user = new User();

    if (params.name && params.surname && params.nickname &&
        params.email && params.password) {

            
                // Verificar la longitud mínima de 8 caracteres
                if (params.password.length < 8) {
                    return response.status(400).send({
                        message: 'La contraseña debe tener al menos 8 caracteres.'
                    });
                }
        
                // Verificar al menos una mayúscula y una minúscula
                if (!/[A-Z]/.test(params.password) || !/[a-z]/.test(params.password)) {
                    return response.status(400).send({
                        message: 'La contraseña debe contener al menos una mayúscula y una minúscula.'
                    });
                }
        
                // Verificar al menos un carácter especial
                if (!/[!@#$%^&*]/.test(params.password)) {
                    return response.status(400).send({
                        message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*).'
                    });
                }
        
                // Verificar que no haya números consecutivos
                for (let i = 0; i < params.password.length - 1; i++) {
                    const currentCharCode = params.password.charCodeAt(i);
                    const nextCharCode = params.password.charCodeAt(i + 1);
        
                    if (
                        (currentCharCode >= 48 && currentCharCode <= 57) && // Es un número
                        (nextCharCode >= 48 && nextCharCode <= 57) && // El siguiente también es un número
                        Math.abs(currentCharCode - nextCharCode) === 1 // Son consecutivos
                    ) {
                        return response.status(400).send({
                            message: 'La contraseña no puede tener números consecutivos.'
                        });
                    }
                }
        
                // Verificar que no haya letras consecutivas
                for (let i = 0; i < params.password.length - 1; i++) {
                    const currentCharCode = params.password.charCodeAt(i);
                    const nextCharCode = params.password.charCodeAt(i + 1);
        
                    if (
                        ((currentCharCode >= 65 && currentCharCode <= 90) || // Es una letra mayúscula
                        (currentCharCode >= 97 && currentCharCode <= 122)) && // Es una letra minúscula
                        ((nextCharCode >= 65 && nextCharCode <= 90) || // El siguiente también es mayúscula
                        (nextCharCode >= 97 && nextCharCode <= 122)) && // El siguiente también es minúscula
                        Math.abs(currentCharCode - nextCharCode) === 1 // Son consecutivas
                    ) {
                        return response.status(400).send({
                            message: 'La contraseña no puede tener letras consecutivas.'
                        });
                    }
                }



        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // Control usuarios duplicados
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nickname: user.nickname.toLowerCase() }
            ]
        }).exec((error, users) => {
            if (error) return response.status(500).send({ message: 'No se ha podido procesar la petición para guardar un usuario' });

            // Si existe un usuario con el mismo email o nickname
            if (users && users.length >= 1) {
                return response.status(400).send({ message: 'El usuario ya existe' });
            } else {

                // Si todo ok cifra password y guarda los datos
                bcrypt.hash(params.password, null, null, (error, hash) => {
                    user.password = hash;

                    user.save((error, userStored) => {
                        if (error) return response.status(500).send({ message: 'No se ha podido procesar la petición para guardar un usuario' });

                        if (userStored) {
                            response.status(200).send({ user: userStored });
                        } else {
                            response.status(400).send({ message: 'No se ha podido registrar el usuario' });
                        }
                    });
                });
            }
        });

    } else {
        response.status(400).send({
            message: 'Introduce todos los campos obligatorios'
        });
    }
};

// Login usuario
function loginUser(request, response) {
    let params = request.body;
    let email = params.email;
    let password = params.password;

    // Comporbar si el email existe
    // La password no se comprueba aquí, lo hace 'bcrypt.compare'
    User.findOne({ email: email }, (error, user) => {
        if (error) return response.status(500).send({ message: 'No se ha podido procesar la peticion' });

        // Si todo ok y existe el usuario
        if (user) {
            // Comprobar si el pasword que llega es igual que el password de la base de datos
            bcrypt.compare(password, user.password, (error, check) => {
                if (check) {

                    if (params.gettoken) {
                        // Generar y devolver un token
                        return response.status(200).send({
                            token: jwt.createToken(user) // Usuario que hace login
                        });
                    } else {
                        // Devolver datos de usuario     
                        user.password = undefined; // Quitar password al devolver los datos
                        return response.status(200).send({ user });
                    }

                } else {
                    return response.status(404).send({ message: 'Usuario o Password incorrectos' });
                }
            });
        } else {
            return response.status(404).send({ message: 'Usuario o Password incorrectos' });
        }
    });
}

// Conseguir datos de un usuario
function getUser(request, response) {
    let userId = request.params.id;

    User.findById(userId, (error, user) => {

        if (error) return response.status(500).send({ message: 'No se ha podido procesar la peticion para buscar un usuario' });

        if (!user) return response.status(404).send({ message: 'El usuario no existe en la base de datos' });

        // Pasar como parámetros:
        // request.user.sub = usuario identificado
        // userId = usuario consultado por la URL
        followThisUser(request.user.sub, userId).then((value) => {
            user.password = undefined;

            return response.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
}

// Función asíncrona (devuelve una promesa)
// Comprobar si seguimos a un usuario y este nos sigue a nosotros
async function followThisUser(identityUserId, userId) {

    // Llamadas síncronas
    // Esperar a conseguir el resultado de cada llamada antes de ejecutar lo siguiente

    // Comprobar si seguimos a un usuario
    let following = await Follow.findOne({ user: identityUserId, followed: userId }).exec()
        .then((following) => {
            return following;
        })
        .catch((err) => {
            return handleError(err);
        });

    // Comprobar si este usuario nos sigue a nosotros
    let followed = await Follow.findOne({ user: userId, followed: identityUserId }).exec()
        .then((followed) => {
            return followed;
        })
        .catch((err) => {
            return handleError(err);
        });

    // Devolver el resultado
    return {
        following: following,
        followed: followed
    };
}

// Devolver lista de usuarios paginada
function getUsers(request, response) {
    let userId = request.user.sub;

    let page = 1;

    if (request.params.page) {
        page = request.params.page;
    }
    
    let itemsPerPage = 4;

    User.find().sort('_id').select({ 'password': 0, '__v': 0 }).paginate(page, itemsPerPage, (error, users, total) => {

        if (error) return response.status(500).send({ message: "Error en el servidor", error });

        if (!users) return response.status(404).send({ message: "No hay Usuarios" });

        followUserIds(userId).then((resultado) => {
            return response.status(200).send({
                message: "Resultados",
                users, 
                usersFollowing: resultado.following,
                usersFollowMe: resultado.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}

async function followUserIds(userId) {
    // Usuarios que sigo
    let following = await Follow.find({ 'user': userId }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            return handleError(err);
        });

    // Usuarios que me siguen
    let followed = await Follow.find({ followed: userId }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            return handleError(err);
        });

    let followingArray = []; // Array de usuarios que sigo

    following.forEach((follow) => {
        // Insert en array de usuarios que sigo
        followingArray.push(follow.followed);
    });

    let followMeArray = []; // Array de usuarios que me siguen

    followed.forEach((follow) => {
        // Insert en array de usuarios que me siguen
        followMeArray.push(follow.user);
    });

    return { following: followingArray, followed: followMeArray }

}

// Contar usuarios que sigo y usuarios que me siguen
function getCounters(request, response) {
    let userId = request.user.sub;

    if (request.params.id) {
        userId = request.params.id;
    }

    getCountFollow(userId).then((value) => {
        return response.status(200).send(value);
    });
}

async function getCountFollow(userId) {
    let following = await Follow.countDocuments({ 'user': userId })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((error) => {
            return handleError(error);
        });

    let followed = await Follow.countDocuments({ 'followed': userId })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((error) => {
            return handleError(error);
        });

    let publications = await Publication.countDocuments({ 'user': userId })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((error) => {
            return handleError(error);
        });

    return {
        following: following,
        followed: followed,
        publications: publications
    }

}

// Actualizar datos de un usuario
function updateUser(request, response) {
    let userId = request.params.id;
    let update = request.body;
    // Quitar propiedad paswword
    delete update.password;

    // Si el id que llega por la url es diferente al id del usuario identificado
    if (userId != request.user.sub) {
        return response.status(500).send({ message: 'No tienes permiso para actualizar los datos' });
    }

    // Evitar actualizar datos duplicados
    User.findOne({
        $or: [
            { email: update.email.toLowerCase() },
            { nickname: update.nickname.toLowerCase() }
        ]
    }).exec((error, user) => {

        if (user && user._id != userId)  return response.status(500).send({ message: 'Email o password no disponibles' });

        // { new: true } devuelve el objeto actualizado
        User.findByIdAndUpdate(userId, update, { new: true }, (error, userUpdated) => {
            if (error) return response.status(500).send({ message: 'No se ha podido procesar la peticion para actualizar usuario' });

            if (!userUpdated) return response.status(404).send({ message: 'No se ha podido actualizar el usuario' });

            return response.status(200).send({ user: userUpdated });
        });
    });

}

// Subir ficheros imagen/avatar usuario
function uploadImage(request, response) {
    let userId = request.params.id;

    if (request.file) {

        let filePath = request.file.path;
        let fileSplit = filePath.split('\\');
        let fileName = fileSplit[2];
        let extensionSplit = request.file.originalname.split('\.');
        let fileExtension = extensionSplit[1]

        // Si el id que llega por la url es diferente al id del usuario identificado
        if (userId != request.user.sub) {
            return removeFilesOfUploads(response, filePath, 'No tienes permiso para actualizar los datos de este usuario');
        }

        if (fileExtension === 'png' || fileExtension === 'gif' || fileExtension === 'jpg') {

            User.findByIdAndUpdate(userId, { image: fileName }, { new: true }, (error, userUpdated) => {

                if (!userUpdated) {
                    response.status(404).send({ message: 'No se ha podido actualizar el avatar del usuario' });
                } else {
                    response.status(200).send({ user: userUpdated });
                }
            });
        } else {
            return removeFilesOfUploads(response, filePath, 'Extension no valida');
        }

    } else {
        response.status(400).send({ message: 'No has subido ninguna imagen...' });
    }
}

// Función auxiliar para eliminar ficheros
function removeFilesOfUploads(response, filePath, message) {
    // Si la extesión no es válida
    fs.unlink(filePath, (error) => {
        return response.status(400).send({ message: message });
    });
}

// Devolver imagen de un usuario
function getImageFile(request, response) {
    let imageFile = request.params.imageFile;
    let pathFile = './uploads/users/' + imageFile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            response.sendFile(path.resolve(pathFile));
        } else {
            response.status(404).send({ message: 'No existe la imagen' });
        }
    });
}

// Exportar funciones
module.exports = {
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile,
}