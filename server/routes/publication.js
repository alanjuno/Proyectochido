'use strict'

// Cargar Express
const express = require('express');

// Cargar controlador de publicaciones
const PublicationController = require('./../controllers/publication');

// Cargar router de express
const api = express.Router();

// Cargar módulo multer subida de ficheros
const crypto = require('crypto')
const multer = require('multer');

const storage = multer.diskStorage({
  destination(request, file, cb) {
    cb(null, './uploads/publications');
  },

  filename(request, file = {}, cb) {
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    
    crypto.pseudoRandomBytes(16, function (error, raw) {
      cb(null, raw.toString('hex') + Date.now() + fileExtension);
    });

  },
});

const multerUpload = multer({dest: './uploads/publications',storage});

// Cargar middleware de autenticación 
const middlewareAuth = require('./../middlewares/authenticated');

// Rutas
api.post('/save-publication', middlewareAuth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?',  middlewareAuth.ensureAuth, PublicationController.getPublications);
api.get('/publications-user/:user/:page?',  middlewareAuth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', middlewareAuth.ensureAuth, PublicationController.getPublication);
api.delete('/delete-publication/:id', middlewareAuth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-publication/:id', [middlewareAuth.ensureAuth, multerUpload.single('image')], PublicationController.uploadImage);
api.get('/get-image-publication/:imageFile', PublicationController.getImageFile);

module.exports = api;
