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
    const users = await db.all(
      `SELECT user_id, name, apt_number, email FROM User`
    );

    console.log("dbConnector got users", users);
    return users;
  } finally {
    await db.close();
  }
}

async function getUserById(user_id) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT user_id, name, apt_number, email
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

// *********** REQUESTS *********** //
async function getRequests() {
  const db = await connect();

  try {
    const requests = await db.all(
      "SELECT title, request_id, user_id FROM Request"
    );
    return requests;
  } finally {
    await db.close();
  }
}

async function getRequestById(request_id) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT title, request_id, user_id
    FROM Request
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":request_id": request_id,
    });

    const request = await stmt.all();

    await stmt.finalize();

    return request;
  } finally {
    await db.close();
  }
}

async function updateRequest(request_id, newRequest) {
  console.log("update request request_id ", request_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`UPDATE Request
    SET
      title = :title
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":title": newRequest.title,
      ":request_id": request_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function deleteRequest(request_id) {
  console.log("deleting request ", request_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`DELETE FROM Request
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":request_id": request_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createRequest(newRequest) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`INSERT INTO
    Request(title, request_id, user_id)
    VALUES (:title, :request_id, :user_id)
  `);

    stmt.bind({
      ":title": newRequest.title,
      ":request_id": newRequest.request_id,
      ":user_id": newRequest.user_id,
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
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  createRequest,
};
