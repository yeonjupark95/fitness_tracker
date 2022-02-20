// activities
const express = require("express");
const activitiesRouter = express.Router();
const {getAllActivities} = require('../db')

// GET /activities
// Just return a list of all activities in the database
activitiesRouter.get("/", async (req, res, next) => {
    try {
      const activities = await getAllActivities();
  
      res.send(activities);
    } catch (error) {
      next(error);
    }
  });
// POST /activities (*)
// Create a new activity

// PATCH /activities/:activityId (*)
// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)

// GET /activities/:activityId/routines
// Get a list of all public routines which feature that activity

module.exports = activitiesRouter;