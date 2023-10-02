'use strict'

// Cargar librería de mongoose
const mongoose = require('mongoose');
const app = require('./app'); // Configuración de express
const PORT = 3800;



// Conexión con la base de datos
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wiclopedia', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            // Crear servidor
            app.listen(PORT, () => {
                console.log('Servidor escuchando en http://localhost:3800');
            });
        })
        .catch(error  => console.log(error));



        