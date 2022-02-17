const { client } = require("./client");

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

module.exports = {
  getUser,
};
