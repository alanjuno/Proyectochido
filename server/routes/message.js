'use strict'

const express = require('express');
const MessageController = require('./../controllers/message');
const api  = express.Router();

const middlewareAuth = require('./../middlewares/authenticated');

api.post('/save-message',  middlewareAuth.ensureAuth, MessageController.saveMessage);
api.get('/received-messages/:page?', middlewareAuth.ensureAuth, MessageController.getReceivedMessages);
api.get('/sent-messages/:page?', middlewareAuth.ensureAuth, MessageController.getSentMessages);
api.get('/unviewed-messages', middlewareAuth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', middlewareAuth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;