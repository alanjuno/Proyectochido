const express = require('express');
const app = express();
let cors = require('cors');
const bodyparser = require('body-parser');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extende:false}));

app.use(require('./routes/correoRoutes'));

app.listen('5000', ()=>{
    console.log('Escuchado');
})