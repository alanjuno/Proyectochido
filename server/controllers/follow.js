'use strict'

const mongoosePaginate = require('mongoose-pagination');

// Cargar modelos 
const User = require('./../models/user');
const Follow = require('./../models/follow');
const response = require('express');

// Guardar follow
function saveFollow(request, response) {
    let params = request.body;

    let follow = new Follow();
    follow.user = request.user.sub; // Usuario que sigue (logeado)
    follow.followed = params.followed; // Usuario que sigo

    follow.save((error, followStored) => {
        if (error) return response.status(500).send({ message: 'Error al guardar el seguimiento de usuario' });

        if (!followStored) return response.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return response.status(200).send({ follow: followStored });
    });
}

// Eliminar follow
function deleteFollow(request, response) {
    let userId = request.user.sub; // Usuario que sigue (logeado)
    let followId = request.params.id; // Usuario que va a dejar de seguir

    Follow.find({ 'user': userId, 'followed': followId }).deleteOne(error => {
        if (error) return response.status(500).send({ message: 'Error al dejar de seguir a un usuario' });

        return response.status(200).send({ message: 'Has dejado de seguir al usuario correctamente' })
    })
}

// Listar usuarios que seguimos
function getFollowingUsers(request, response) {
    let userId = request.user.sub; // usuario logeado

    if (request.params.id) {
        userId = request.params.id;
    }

    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    } else {
        page = request.params.id;
    }

    let itemsPerPage = 4

    // Buscar todos los usuarios que sigo
    // Indicar el path y el campo al objeto que está haciendo referencia
    // Para cambiar el ID guardado por el objeto al que hace referencia
    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (error, follows, total) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return response.status(404).send({ message: 'No estas siguiendo a ningun usuario' });
        
        followUserIds(request.user.sub, userId).then((resultado) => {
            // console.log('Resultado:' + JSON.stringify(resultado));
            return response.status(200).send({
                total: total, 
                pages: Math.ceil(total / itemsPerPage), 
                follows,
                usersFollowing: resultado.following,
                usersFollowMe: resultado.followed,
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

// Listar usuarios que siguen paginados
function getFollowedUsers(request, response) {
    let userId = request.user.sub; 

    if (request.params.id && request.params.page) {
        userId = request.params.id;
    }

    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    } else {
        page = request.params.id; 
    }

    let itemsPerPage = 4

    // Listar todos los usuarios que nos siguen paginados
    // Pasar el usuario que nos sigue (user)
    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (error, follows, total) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return response.status(404).send({ message: 'No te sigue ningun usuario' });

        followUserIds(request.user.sub, userId).then((resultado) => {
            // console.log('Resultado:' + JSON.stringify(resultado));
            return response.status(200).send({
                total: total, 
                pages: Math.ceil(total / itemsPerPage), 
                follows,
                usersFollowing: resultado.following,
                usersFollowMe: resultado.followed,
            });
        });
    });
}

// Listar los usuarios que sigo
function getMyFollowed(request, response) {
    let userId = request.user.sub;

    Follow.find({ user: userId }).populate('user followed').exec((error, follows) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return response.status(404).send({ message: 'No sigues a ningun usuario' });

        response.status(200).send({ follows });
    });
}

// Listar los usuarios que me siguen
function getMyFollows(request, response) {
    let userId = request.user.sub;

    Follow.find({ followed: userId }).populate('user followed').exec((error, follows) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return response.status(404).send({ message: 'No sigues a ningun usuario' });

        response.status(200).send({ follows });
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollowed,
    getMyFollows
}