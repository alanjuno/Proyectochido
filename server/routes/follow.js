'use strict'

// Cargar Express
const express = require('express');

// Cargar controlador de follows
const FollowController = require('./../controllers/follow');

// Cargar router de express
const api = express.Router();

// Cargar middleware de autenticación
const middlewareAuthentication = require('./../middlewares/authenticated');

api.post('/save-follow', middlewareAuthentication.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', middlewareAuthentication.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', middlewareAuthentication.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', middlewareAuthentication.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows', middlewareAuthentication.ensureAuth, FollowController.getMyFollows);
api.get('/get-my-followed', middlewareAuthentication.ensureAuth, FollowController.getMyFollowed);

module.exports = api;