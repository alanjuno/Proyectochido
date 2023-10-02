'use strict'

//  Cargar módulo de express
const express = require('express');

// Cargar controlador de user
const UseController = require('./../controllers/user');

// Cargar el router de express
const api = express.Router();

// Cargar módulo multer subida de ficheros
const crypto = require('crypto')
const multer = require('multer');

const storage = multer.diskStorage({
  destination(request, file, cb) {
    cb(null, './uploads/users');
  },

  filename(request, file = {}, cb) {
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    
    crypto.pseudoRandomBytes(16, function (error, raw) {
      cb(null, raw.toString('hex') + Date.now() + fileExtension);
    });

  },
});

const multerUpload = multer({dest: './uploads/users',storage});

// Cargar middlewares
const middlewareAuth = require('./../middlewares/authenticated');

// Definir rutas
api.post('/register', UseController.saveUser);
api.post('/login', UseController.loginUser);
api.get('/user/:id', middlewareAuth.ensureAuth, UseController.getUser);
api.get('/users/:page?', middlewareAuth.ensureAuth, UseController.getUsers);
api.get('/counters/:id?', middlewareAuth.ensureAuth, UseController.getCounters);
api.put('/update-user/:id', middlewareAuth.ensureAuth, UseController.updateUser);
api.post('/upload-image-user/:id', [middlewareAuth.ensureAuth, multerUpload.single('image')], UseController.uploadImage);
api.get('/get-image-user/:imageFile', UseController.getImageFile);

module.exports = api;