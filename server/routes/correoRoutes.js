const express = require('express');
const app = express();

const nodemailer = require('nodemailer');

let envio = require('../controllers/user');

app.post('/envio', (req, res) => {
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


module.exports = app;