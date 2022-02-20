const express = require("express");
const apiRouter = express.Router();

const healthRouter = require("./health");
apiRouter.use("/health", healthRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routinesActivitiesRouter = require("./routines_activities");
apiRouter.use("/routinesActivities", routinesActivitiesRouter);

apiRouter.use((error, req, res, next)=>{
    res.send({
        name: error.name,
        message: error.message,
    })
})

module.exports = apiRouter;