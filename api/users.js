// users
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername } = require("../db/users");
// POST /users/register
// Create a new user. Require username and password, and hash password before saving user to DB. Require all passwords to be at least 8 characters long.
// Throw errors for duplicate username, or password-too-short.
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (password.length < 8) {
      next({
        name: "password-too-short",
        message: "Your password is too short!",
      });
      return;
    }
    const duplicateUsername = await getUserByUsername(username);
    if (duplicateUsername) {
      next({
        name: "dupicate-username",
        message: "That username already exists!",
      });
      return;
    }
    const user = await createUser(username, password);
    res.send({
      user
    });
  } catch (error) {
    next(error);
  }
});

// POST /users/login
// Log in the user. Require username and password, and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token.

// Keep the id and username in the token.

// GET /users/me (*)
// Send back the logged-in user's data if a valid token is supplied in the header.

// GET /users/:username/routines
// Get a list of public routines for a particular user.
module.exports = usersRouter;