'use strict';

const nodemailer = require('nodemailer');


const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('multer');
const crypto = require('crypto');

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

const multerUpload = multer({ dest: './uploads/users', storage });

const middlewareAuth = require('./../middlewares/authenticated');

// Ruta para enviar correo de confirmación
router.post('/envio', (req, res) => {
  const { email, asunto, mensaje } = req.body;

  // Configuración del transporte del correo
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'alanavelar9@gmail.com', // Cambiar con tu dirección de correo
          pass: 'tswfgkmrtetlvfxy' // Cambiar con tu contraseña
      }
  });

  // Configuración del correo electrónico
  const mailOptions = {
      from: 'alanavelar9@gmail.com', // Cambiar con tu dirección de correo
      to: email,
      subject: asunto,
      text: mensaje
  };

  // Envío del correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al enviar el correo de confirmación' });
      } else {
          console.log('Correo de confirmación enviado: ' + info.response);
          res.status(200).json({ message: 'Correo de confirmación enviado correctamente' });
      }
  });
});

// Definir rutas
router.post('/register', userController.saveUser);
router.post('/login', userController.loginUser);
router.get('/user/:id', middlewareAuth.ensureAuth, userController.getUser);
router.get('/users/:page?', middlewareAuth.ensureAuth, userController.getUsers);
router.get('/counters/:id?', middlewareAuth.ensureAuth, userController.getCounters);
router.put('/update-user/:id', middlewareAuth.ensureAuth, userController.updateUser);
router.post('/upload-image-user/:id', [middlewareAuth.ensureAuth, multerUpload.single('image')], userController.uploadImage);
router.get('/get-image-user/:imageFile', userController.getImageFile);

// Ruta para confirmar cuenta
router.get('/confirmar/:email', userController.confirmAccount);

module.exports = router;