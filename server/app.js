'use strict'

// Cargar los módulos de express y body-parser
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Cargar rutas
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');
const messageRoutes  = require('./routes/message');

// Middlewares (métodos que se ejecutan antes de llegar al controlador)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
// configurar cabeceras http
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


// Rutas
app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);

// Exportar la configuración
module.exports = app;
