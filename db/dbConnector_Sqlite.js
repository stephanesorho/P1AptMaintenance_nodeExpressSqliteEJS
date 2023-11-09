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

  try {
    const users = await db.all(`SELECT * FROM User`);

    console.log("dbConnector got users", users);
    return users;
  } finally {
    await db.close();
  }
}

async function getUserById(user_id) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT *
    FROM User
    WHERE
      user_id = :user_id
  `);

    stmt.bind({
      ":user_id": user_id,
    });

    const user = await stmt.all();

    await stmt.finalize();

    return user;
  } finally {
    await db.close();
  }
}

async function updateUser(user_id, newUser) {
  console.log("update user user_id ", user_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`UPDATE User
    SET
      name = :name,
      apt_number = :apt_number,
      email = :email
    WHERE
      user_id = :user_id
  `);

    stmt.bind({
      ":user_id": user_id,
      ":name": newUser.name,
      ":apt_number": newUser.apt_number,
      ":email": newUser.email,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function deleteUser(user_id) {
  console.log("deleting user ", user_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`DELETE FROM User
    WHERE
      user_id = :user_id
  `);

    stmt.bind({
      ":user_id": user_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createUser(newUser) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`INSERT INTO
    User(name, apt_number, email)
    VALUES (:name, :apt_number, :email)
  `);

    stmt.bind({
      ":name": newUser.name,
      ":apt_number": newUser.apt_number,
      ":email": newUser.email,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};
