const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE id=$1;
      `,
      [id]
    );

    delete user.password;
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT *
        FROM routines;
      `
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT * FROM routines 
      `
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic" = true;
    `);

    const { rows: activities } = await client.query(`

    `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON users.id = routines."creatorId"
      WHERE username = $1
    `,
      [username]
    );

    const { rows: activities } = client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities."routineId"
      FROM activities
      JOIN routine_activites
      ON activities.id = routine_activities."activityId"
    `);

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => routine.id === activity.routineId
      );
    });
    return routines;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
};
