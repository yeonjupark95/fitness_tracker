const express = require("express");
const apiRouter = express.Router();
const { getUserById } = require("../db/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({
      message: "All is well",
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    // const [ , token] = auth.split(' ')
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
        //   console.log("User is set:", req.user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routines_activitiesRouter = require("./routine_activities");
apiRouter.use("/routine_activities", routines_activitiesRouter);

module.exports = apiRouter;
