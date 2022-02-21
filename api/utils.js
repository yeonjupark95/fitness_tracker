async function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "UserNotLoggedIn",
      message: "Must be logged in",
    });
  }
}

module.exports = { requireUser };
