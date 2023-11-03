const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
  return open({
    filename: "./db/apt_maintenancesys.db",
    driver: sqlite3.Database,
  });
}

async function getUsers() {
  const db = await connect();
  const users = await db.all(`SELECT * FROM User`);

  console.log("dbConnector got users", users);
  return users;
}

async function createUser(newUser) {
  const db = await connect();

  const stmt = await db.prepare(`INSERT INTO
    User(user_id, name, apt_number, email)
    VALUES (:user_id, :name, :apt_number, :email)
  `);

  stmt.bind({
    ":user_id": newUser.user_id,
    ":name": newUser.name,
    ":apt_number": newUser.apt_number,
    ":email": newUser.email,
  });

  return await stmt.run();
}

async function getUserByID(user_id) {
  const db = await connect();

  const stmt = await db.prepare(`SELECT *
    FROM User
    WHERE
      user_id == user_id
  `);

  stmt.bind({
    ":user_id": user_id,
  });

  return await stmt.get();
}

async function deleteUser(userToDelete) {
  const db = await connect();

  const stmt = await db.prepare(`DELETE FROM
    User
    WHERE user_id == theIDToDelete
  `);

  stmt.bind({
    ":theIDToDelete": userToDelete.user_id,
  });

  return await stmt.run();
}

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  deleteUser,
};
