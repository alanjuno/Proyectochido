'use strict'

const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');

const User = require('./../models/user');
const Follow = require('./../models/follow');
const Message = require('./../models/message');

// Insertar mensajes
function saveMessage(request, response) {
    let params = request.body;

    if (!params.text || !params.receiver) return response.status(400).send({ message: 'Envia los datos obligatorios' });

    let message = new Message();

    message.emitter = request.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false

    message.save((error, messageStored) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!messageStored) return response.status(500).send({ message: 'Error al enviar el mensaje' });

        return response.status(200).send({ message: messageStored });
    });
}

// Listar mensajes recibidos
function getReceivedMessages(request, response) {
    let userId = request.user.sub;

    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    }

    let itemsPerPage = 4;

    Message.find({ receiver: userId }).sort({ created_at: -1 }).populate('emitter', 'name surname email nickname image _id').paginate(page, itemsPerPage, (error, messages, total) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!messages) return response.status(404).send({ message: 'No hay mensajes' });

        return response.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        })
    })
}

// Listar mensajes enviados
function getSentMessages(request, response) {
    let userId = request.user.sub;

    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    }

    let itemsPerPage = 4;

    Message.find({ emitter: userId }).sort({ created_at: -1 }).populate('emitter receiver', 'name surname email nickname image _id').paginate(page, itemsPerPage, (error, messages, total) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        if (!messages) return response.status(404).send({ message: 'No hay mensajes' });

        return response.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

// Listar mensajes que no he leído
function getUnviewedMessages(request, response) {
    let userId = request.user.sub;

    Message.countDocuments({ receiver: userId, viewed: false}).exec((error, count) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        return response.status(200).send({
            'unviewed': count
        });
    });
}

function setViewedMessages(request, response) {
    let userId = request.user.sub;

    Message.update({ receiver: userId, viewed: false}, { viewed: true }, { 'multi': true }, (error, messagesUpdated) =>  {
        if (error) return response.status(500).send({ message: 'Error en el servidor' });

        return response.status(200).send({ messages: messagesUpdated });
    });
}

// Eliminar una publicación
function deleteMessage(request, response) {
    let messageId = request.params.id;

    Publication.findOne({ user: request.user.sub, '_id': messageId }).deleteOne((error) => {
        if (error) return response.status(500).send({ message: 'Error en el servidor al eliminar mensaje' });

        return response.status(200).send({ status: 200 });
    });
} 

module.exports = {
    saveMessage,
    getReceivedMessages,
    getSentMessages,
    getUnviewedMessages,
    setViewedMessages,
    deleteMessage
}