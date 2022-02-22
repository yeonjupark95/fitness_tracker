const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, createActivity, getPublicRoutinesByActivity } = require("../db");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();

    res.send(activities);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    res.send(newActivity);
  } catch (error) {
    next(error);
  }
});
// PATCH /activities/:activityId (*)
// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)

// GET /activities/:activityId/routines
// Get a list of all public routines which feature that activity
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  
  const {activityId} = req.params;
  
  try {
    
    const routines = await getPublicRoutinesByActivity({id:activityId})
  
    res.send(routines)
  } catch ({ name, message }) {
    next ({name, message});
  }
});
module.exports = activitiesRouter;
