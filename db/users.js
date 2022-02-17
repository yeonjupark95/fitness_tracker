const { client } = require("./client");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

async function createUser({ username, password }) {
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `,
      [username, hashPassword]
    );

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
      `,
      [username]
    );

    if (!user) {
      throw {
        name: "userNotFound",
        message: "User not found under that username",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserById(id) {
    try{
      const {rows: [user]} = await client.query(`
        SELECT *
        FROM users
        WHERE id=$1;
      `,[id]);

      delete user.password;
      return user;
    } catch (error){
      throw error;
    }
  }

async function getUserByUsername( username ) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * from users
        where username = $1;
      `,
      [username]
    );
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};