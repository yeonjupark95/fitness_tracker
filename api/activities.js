const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    res.send(newActivity);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  try {
    const newActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const routines = await getPublicRoutinesByActivity({
      id: activityId,
    });
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;