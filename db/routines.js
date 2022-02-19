const  client  = require("./client");


async function getRoutineById(id) {
    try{
      const {rows: [routine]} = await client.query(`
        SELECT *
        FROM routines
        WHERE id=$1;
      `,[id]);

      delete user.password;
      return routine;
    } catch (error){
      throw error;
    }
  }
  async function getAllRoutines() {
    try {
        const { rows: routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
    `);
  
        const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
    `);
    
        return routines;
    }   catch (error){
        throw error;
    }
  }
module.exports = {
    getRoutineById,
    getAllRoutines,
  };