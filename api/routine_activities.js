// routine_activities
const express = require("express");
const { getRoutineById } = require("../db/routines");
const {
  updateRoutineActivity,
  getRoutineActivitiesByRoutine,
} = require("../db/routine_activities");
const { requireUser } = require("./utils");
const routines_activitiesRouter = express.Router();
// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity
routines_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const routineActivityId = req.params;
    try {
      const routineActivity = await getRoutineActivitiesByRoutine(
        routineActivityId
      );
      const routine = await getRoutineById(routineActivity.creatorId);
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
// Remove an activity from a routine, use hard delete
module.exports = routines_activitiesRouter;
