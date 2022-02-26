// routine_activities
const express = require("express");
const { getRoutineById } = require("../db/routines");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  destroyRoutineActivity,
} = require("../db/routine_activities");
const { requireUser } = require("./utils");
const routines_activitiesRouter = express.Router();

// PATCH /routine_activities/:routineActivityId (**)
routines_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    
    try {
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);
      if (routine.creatorId === req.user.id) {
        const { count, duration } = req.body;
        const updatedRoutineActivity = await updateRoutineActivity({
          id: routineActivityId,
          count,
          duration,
        });
        res.send(updatedRoutineActivity);
        return;
      } else {
        next({
          name: "routineActivityUserError",
          message: "You must be the creator of this routine acitivity",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /routine_activities/:routineActivityId (**)
routines_activitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);
      if (routine.creatorId === req.user.id) {
        const deletedRoutineAcitivity = await destroyRoutineActivity(
          routineActivityId
        );
        res.send(deletedRoutineAcitivity);
        return;
      } else {
        next({
          name: "routineActivityDeleteError",
          message: "You must be the creator of the routine",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routines_activitiesRouter;
