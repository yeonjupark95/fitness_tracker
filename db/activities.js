const  client  = require("./client");

async function getActivityById(id) {
    try{
      const {rows: [activity]} = await client.query(`
        SELECT *
        FROM activities
        WHERE id=$1;
      `,[id]);

      return activity;
    } catch (error){
      throw error;
    }
  }


module.exports = {
   getActivityById,
  };