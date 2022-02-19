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

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
          INSERT INTO activities(name, description) 
          VALUES ($1, $2)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;
      `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((field, index) => {
        return `"${field}"=$${index + 1}`;
      })
      .join(", ");
    const {
      row: [activity],
    } = client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id = ${id};
    `,
      Object.values(fields)
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById,
  getAllAcitivities,
  createActivity,
  updateActivity,
};
