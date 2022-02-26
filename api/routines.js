const express = require("express");

const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
} = require("../db/routines");
const { addActivityToRoutine } = require("../db/routine_activities");
const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

routinesRouter.post("/", requireUser,async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  try {
    const newRoutine = await createRoutine({
      creatorId: req.user.id,
      name,
      isPublic,
      goal,
    });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;

  try {
    const routine = await getRoutineById(routineId);
    if (routine.creatorId === req.user.id) {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        isPublic,
        name,
        goal,
      });
      res.send(updatedRoutine);
      return;
    } else {
      next({
        name: "updateRoutineError",
        message: "You must be logged in",
      });
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const routine  = await getRoutineById(routineId);
    if (routine.creatorId === req.user.id) {
      const updatedRoutine = await destroyRoutine(routineId);
      res.send(updatedRoutine);
      return
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const routineActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });
    res.send(routineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = routinesRouter;