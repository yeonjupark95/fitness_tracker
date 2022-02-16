const { client } = require("./client");

async function getUser({ username, password }) {
  try {
    const {rows: [user]} = await client.query(`
      SELECT * FROM users
      WHERE username = $1;
    `, [username]);
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUser,
};
