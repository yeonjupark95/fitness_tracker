// //GET /health
// A common need is to see if our server is up (not completely crashed). We can create a route to send back a message, just a string saying all is well.
const express = require("express");
const healthRouter = express.Router();

healthRouter.get("/health", async (req, res, next) => {
  try {
    res.send({
      message: "all is well",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = healthRouter;