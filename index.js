// create the express server here
require('dotenv').config();
const {PORT = 3000} = process.env
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));
const cors = require('cors');
server.use(cors()); 
server.use(express.json());
const apiRouter = require('./api');
server.use('/api', apiRouter);
const {client} = require('./db/client');

server.get("*", (req, res, next) => {
res.status(404).send('not found');
});

server.use((error,req, res, next) =>{
res.status(500).send(error);
});

server.listen(PORT, () => {
  client.connect();
    console.log('The server is up on port:', PORT)
  });