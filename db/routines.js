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

// still need to be worked on by Yeonju
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic" = true;
    `);
    
    const { rows: activities } = await client.query(`
      SELECT * FROM activities;
    `);
    
    return routines;
  } catch (error) {
    throw error;
  }
}

// need to be checked
async function getAllRoutinesByUser({username}) {
  try {
    const {rows: routines} = client.query(`
      SELECT * FROM routines, 
      WHERE username=$1 AND "isPublic"=true;
    `, [username])
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
  getAllRoutinesByUser
};
