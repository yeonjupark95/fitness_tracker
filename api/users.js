const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "some random string" } = process.env;
const {
  createUser,
  getUser,
  getUserByUsername,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");

// POST /users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (password.length < 8) {
      next({
        name: "passwordLengthError",
        message: "Password is too short",
      });
      return;
    }
    const duplicatedUser = await getUserByUsername(username);
    if (duplicatedUser) {
      next({
        name: "duplicatedUserError",
        message: "Username is already taken",
      });
      return;
    }
    const user = await createUser({ username, password });
    res.send({ user });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUser(req.body);
    if (user) {
      const token = jwt.sign({ username: username, id: user.id }, JWT_SECRET);
      res.send({ token, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// // GET /users/me (*)
usersRouter.get("/me", requireUser, async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  try {
    if (auth) {
      const token = auth.slice(prefix.length);
      const user = jwt.verify(token, JWT_SECRET);
      res.send(user);
    } else {
      return next({
        message: "You're not logged in",
      });
    }
  } catch (error) {
    next(error);
  }
});
// // GET /users/:username/routines
// // Get a list of public routines for a particular user.
usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    const allRoutines = await getPublicRoutinesByUser({ username });
    res.send(allRoutines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = usersRouter;
