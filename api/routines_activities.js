// routine_activities
const express = require("express");
const routinesActivitiesRouter = express.Router();
// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity

// DELETE /routine_activities/:routineActivityId (**)
// Remove an activity from a routine, use hard delete
module.exports = routinesActivitiesRouter;