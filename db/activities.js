const client = require("./client");

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT *
        FROM activities
        WHERE id=$1;
      `,
      [id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllAcitivities() {
  try {
    const { rows: activities } = await client.query(`
      SELECT * FROM activities;    
    `);
    return activities;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById,
  getAllAcitivities,
};
