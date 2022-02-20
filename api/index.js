const express = require("express");
const apiRouter = express.Router();
const {getUserById} = require('../db/users');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;


apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "all is well" });
  } catch (error) {
    next(error);
  }
});

apiRouter.use(async(req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth){
        next();
    } else if (auth.startsWith(prefix)){

    // const [ , token] = auth.split(' ')
    const token = auth.slice(prefix.length);
        try{ 
            const {id} = jwt.verify(token, JWT_SECRET);
            if (id) {
            req.user = await getUserById(id);
            next();
    //   console.log("User is set:", req.user);
    }
    }catch ({name, message}){
    next({name, message});
    }
    }else{
    next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
  });
}
});

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });

const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");

const healthRouter = require("./health");
const usersRouter = require("./users");
const routinesRouter = require("./routines");
const activitiesRouter = require("./activities");

apiRouter.use("/activities", activitiesRouter);

const routines_activitiesRouter = require("./routine_activities");
apiRouter.use("/routine_activities", routines_activitiesRouter);

const routinesActivitiesRouter = require("./routines_activities");

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "all is well" });
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
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Aurthorization token must start with ${prefix}`,
    });
  }
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

apiRouter.use((req, res, next) => {});
// apiRouter.use("/health", healthRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/routines", routinesRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/routinesActivities", routinesActivitiesRouter);

module.exports = apiRouter;