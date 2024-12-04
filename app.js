const express = require('express');
const setupSwagger = require('./config/swagger');
const cors = require('cors')



const app = express();

app.use(cors())
app.use(express.json());

app.use('/uploads', express.static( __dirname +'/uploads')); // Serve uploaded images
// Swagger setup
setupSwagger(app);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/password', require('./routes/password'));
app.use('/api', require('./routes/user'));


module.exports = app;

