require("dotenv").config();
const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
const morgan = require("morgan");
server.use(morgan("dev"));
const cors = require("cors");
server.use(cors());
server.use(express.json());
const client  = require("./db/client");

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use("*", (req, res, next) => {
res.status(404).send('not found');
});

const apiRouter = require("./api");
server.use("/api", apiRouter);


server.use(({name, message}, req, res, next) => {
  res.send({name, message, success: false});
});
server.listen(PORT, () => {
  client.connect();
  console.log(`listening on port http://localhost:${PORT}`);
});