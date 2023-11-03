let express = require("express");
let router = express.Router();

const myDB = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");
  const users = await myDB.getUsers();

  res.render("index", { users: users });
});

/* GET user ID. */
router.get("/users/:user_id", async function (req, res) {
  console.log("Got user id");

  const user_id = req.params.user_id;

  console.log("got user id ", user_id);

  const userID = await myDB.getUserByID(user_id);

  console.log("User created");

  res.render("User ID", { userID });
});

/* POST create user. */
router.post("/users/create", async function (req, res) {
  console.log("Got post create/users");

  const user = req.body;

  console.log("got create user", user);

  await myDB.createUser(user);

  console.log("User created");

  res.redirect("/");
});

/* POST delete user. */
router.post("/users/delete", async function (req, res) {
  console.log("Got post delete user");

  const user = req.body;

  console.log("got delete user", user);

  await myDB.deleteUser(user);

  console.log("User deleted");

  res.redirect("/");
});

module.exports = router;
