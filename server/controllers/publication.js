'use strict'

// Cargar módulo path para trabajar con rutas de sistemas de ficheros
const path = require('path');

// Cargar módulo fs para trabajar con ficheros
const fs = require('fs');

// Cargar módulo moment para trabajar con fechas
const moment = require('moment');

// Cargar módulo mongoose-pagination
const mongoosePaginate = require('mongoose-pagination');

// Cargar modelos
const Publication = require('./../models/publication');
const User = require('./../models/user');
const Follow = require('./../models/follow');

// Crear una publicación
function savePublication(request, response) {
    let params = request.body;

    if (!params.text) return response.status(400).send({ message: 'El texto de la publicacion es obligatorio' });

    let publication = new Publication();

    publication.text = params.text;
    publication.file = null;
    publication.user = request.user.sub;
    publication.created_at = moment().unix();

    publication.save((error, publicationStored) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!publicationStored) return response.status(404).send({ message: 'No se ha podido procesar la peticion para crear una publicacion' });

        return response.status(200).send({ publication: publicationStored });
    });
}

// Listar todas mis publicaciones y de usarios que sigo
function getPublications(request, response) {
    let page = 1;

    if (request.params.page) {
        page = request.params.page;
    }

    let itemsPerPage = 4

    // Buscar los usuarios que sigo
    Follow.find({ user: request.user.sub }).populate('followed').exec((error, follows) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        let followsArray = [];

        follows.forEach((follow) => {
            // Guardar usuarios que sigo en un array
            followsArray.push(follow.followed);
        });

        // Añadir las publicaciones del usuario identificado al timeline
        followsArray.push(request.user.sub);

        // Comprobar si alguno de los usuarios que sigo tiene publicaciones
        Publication.find({ user: { '$in': followsArray } }).sort({ created_at: -1 }).populate('user').paginate(page, itemsPerPage, (error, publications, total) => {
            if (error) return response.status(500).send({ message: 'Error en el servidor al devolver publicaciones' });

            if (!publications) return response.status(404).send({ message: 'No hay publicaciones' });

            return response.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                publications
            })
        });
    });
}

// Listar todas las publicaciones de un usario
function getPublicationsUser(request, response) {
    let page = 1;

    if (request.params.page) {
        page = request.params.page;
    }

    let itemsPerPage = 4

    let user = request.user.sub;

    if (request.params.user) {
        user = request.params.user;
    }

    Publication.find({ user: user }).sort({ created_at: -1 }).populate('user').paginate(page, itemsPerPage, (error, publications, total) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor al devolver publicaciones' });

        if (!publications) return response.status(404).send({ message: 'No hay publicaciones' });

        return response.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            publications
        })
    });
}

// Devolver una publicación por su id
function getPublication(request, response) {
    let publicationId = request.params.id;

    Publication.findById(publicationId, (error, publication) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor al devolver publicacion' });

        if (!publication) return response.status(404).send({ message: 'No existe la publicacion' });

        return response.status(200).send({ publication });
    });
}

// Eliminar una publicación
function deletePublication(request, response) {
    let publicationId = request.params.id;

    Publication.findOne({ user: request.user.sub, '_id': publicationId }).deleteOne((error) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor al eliminar publicacion' });

        return response.status(200).send({ status: 200 });
    });
} 

//  Subir archivos 
function uploadImage(request, response) {
    let publicationId = request.params.id;

    if (request.file) {

        let filePath = request.file.path;
        let fileSplit = filePath.split('\\');
        let fileName = fileSplit[2];
        let extensionSplit = request.file.originalname.split('\.');
        let fileExtension = extensionSplit[1]

        if (fileExtension === 'png' || fileExtension === 'gif' || fileExtension === 'jpg') {

            Publication.findOne({ 'user': request.user.sub, '_id': publicationId }).exec((error, publication) => {
                if (publication) {

                    Publication.findByIdAndUpdate(publicationId, { file: fileName }, { new: true }, (error, publicationUpdated) => {

                        if (!publicationUpdated) {
                            response.status(404).send({ message: 'No se ha podido actualizar la imagen de la publicacion' });
                        } else {
                            response.status(200).send({ publication: publicationUpdated });
                        }
                    });
                } else {
                    return removeFilesOfUploads(response, filePath, 'Acceso denegado!! No tienes permiso para actualizar esta publicacion');
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
    let pathFile = './uploads/publications/' + imageFile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            response.sendFile(path.resolve(pathFile));
        } else {
            response.status(404).send({ message: 'No existe la imagen' });
        }
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}