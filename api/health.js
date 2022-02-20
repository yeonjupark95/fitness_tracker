// const express = require("express");
// const healthRouter = express.Router();

// healthRouter.use((req, res, next) => {
//     console.log("A request is being made to /health");
//     next();
//   });
  

// healthRouter.get("/health", async (req, res, next) => {
//   try {
//     res.send({ message: "all is well" });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = healthRouter;