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

const addActivitiestoRoutines = async (routines) => {
  try{
  const { rows: activities } = await client.query(
    `
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities."routineId", routine_activities.id AS "routineActivityId"
      FROM activities
      JOIN routine_activities 
      ON routine_activities."activityId" = activities.id;
   `);

  routines.forEach((routine) => {
    routine.activities = activities.filter(
      (activity) => routine.id === activity.routineId
    );
  });

  return routines;
}catch(error){
  throw error
}
}
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users 
        ON routines."creatorId"=users.id;
      `);

    return await addActivitiestoRoutines(routines)
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users
        ON users.id = routines."creatorId"
        WHERE "isPublic" = true;
      `);

    return await addActivitiestoRoutines(routines)
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines 
        JOIN users 
        ON users.id = routines."creatorId"
        WHERE username = $1;
      `,
      [username]
    );

    return await addActivitiestoRoutines(routines)
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines 
        JOIN users 
        ON users.id = routines."creatorId"
        WHERE routines."isPublic" = true
        AND username = $1;
      `,
      [username]
    );

    return await addActivitiestoRoutines(routines)
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routineActivities } = await client.query(
      `
        SELECT "routineId"
        FROM routine_activities
        WHERE "activityId" = $1;
      `,
      [id]
    );

    const routineActivitiesId = routineActivities.map((routineActivity)=>{
      return routineActivity.routineId
    }) 
 
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users
        ON users.id = routines."creatorId"
        WHERE "isPublic" = true AND routines.id IN (${routineActivitiesId});
      `
    );
    
    return await addActivitiestoRoutines(routines)
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", "name", "goal")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((field, index) => {
        return `"${field}"=$${index + 1}`;
      })
      .join(", ");
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id = ${id}
        RETURNING *;
      `,
      Object.values(fields)
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
        DELETE FROM routine_activities
        WHERE "routineId"=$1;
      `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
        DELETE FROM routines
        WHERE id=$1
        RETURNING *;
      `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllRoutinesByUser,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};