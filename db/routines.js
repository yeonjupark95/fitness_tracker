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

  async function getRoutinesWithoutActivities() {
    try{
    const { rows: routines } = await client.query(
        `SELECT *
        FROM routines;
      `);
    
      return routines;
    }catch (error){
      throw error;
    }
  }

  async function getAllRoutines() {
    try{
    const { rows: [routine] } = await client.query(
        `SELECT *
        FROM routines;
      `);
    
      return routine;
    }catch (error){
      throw error;
    }
  }


module.exports = {
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
  };