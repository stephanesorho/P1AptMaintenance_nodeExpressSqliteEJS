let express = require("express");
const { redirect } = require("express/lib/response");
let router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    console.log("Got request for /");
    const users = await getUsers();
    res.render("index", {
      users,
      err: "",
      type: "success",
    });
  } catch (exception) {
    console.log("Error execution SQL", exception);
    res.render("index", {
      title: "Apartment Maintenance App",
      users: [],
      err: `Error execution SQL ${exception}`,
      type: "danger",
    });
  }
});

/* Render Edit page. */
router.get("/users/:user_id/edit", async function (req, res) {
  console.log("Edit route", req.params.user_id);
  try {
    const sqlRes = await getUserById(req.params.user_id);
    console.log("users edit found user", sqlRes);
    if (sqlRes.length === 1) {
      res.render("users_edit", { user: sqlRes[0], err: null, type: "success" });
    } else {
      res.render("users_edit", {
        user: null,
        err: "Error finding User " + req.params.user_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      user: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Actually edits a User in table
router.post("/users/:user_id/edit", async function (req, res) {
  console.log("Edit route", req.params.user_id, req.body);

  const user_id = req.params.user_id;
  const newUser = req.body;

  try {
    const sqlResUpdate = await updateUser(user_id, newUser);
    console.log("Updating user", sqlResUpdate);

    if (sqlResUpdate.changes === 1) {
      const sqlResFind = await getUserById(req.params.user_id);
      res.render("users_edit", {
        user: sqlResFind[0],
        err: "User modified",
        type: "success",
      });
    } else {
      res.render("users_edit", {
        user: null,
        err: "Error Updating User " + req.params.user_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      user: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Delete a user
router.get("/users/:user_id/delete", async function (req, res) {
  console.log("Delete route", req.params.user_id);

  try {
    const sqlResDelete = await deleteUser(req.params.user_id);
    console.log("Delete user res=", sqlResDelete);
    const users = await getUsers();

    if (sqlResDelete.changes === 1) {
      res.render("index", { users, err: "User deleted", type: "success" });
    } else {
      res.render("index", {
        users,
        err: "Error deleting user",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      users,
      err: "Error executing SQL",
      type: "danger",
    });
  }
});

// Render Create page
router.get("/users/create", async function (req, res) {
  console.log("Create route", req.params.user_id);

  res.render("users_create", { err: null, type: "success" });
});

// Actually creates User
router.post("/users/create", async function (req, res) {
  console.log("Create route", req.body);

  const newUser = req.body;

  try {
    const sqlResCreate = await createUser(newUser);
    console.log("Updating user", sqlResCreate);
    const users = await getUsers();

    if (sqlResCreate.changes === 1) {
      res.redirect("/");
      res.render("index", {
        users,
        err: "User Created " + sqlResCreate.lastID,
        type: "success",
      });
    } else {
      res.render("user_create", {
        err: "Error inserting user",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      users: null,
      err: "Error inserting user" + exception,
      type: "danger",
    });
  }
});

module.exports = router;
