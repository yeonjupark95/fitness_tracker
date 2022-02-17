const {client} = require('./client')

async function createUser({ username, password }) {
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
    try {
      const {rows:[user]} = await client.query(`
      INSERT INTO users(username, password) 
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
`, [ username, hashPassword ]);

    delete user.password
      return user
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    createUser,
  }