const getUserById = `SELECT id, username, password, email FROM accounts where id = ?;`;

const getUserByUsername = `SELECT id, username, password, email FROM accounts where username = ?;`;

const getAllUsers = `SELECT id, username, password, email FROM accounts;`;

const createUser = `INSERT INTO accounts (username, password, email, active, userGroup) values (?, ?, ?, ?, ?);`;

const deleteUser = `DELETE FROM accounts where username = ?;`;

module.exports = { getUserById, createUser, getAllUsers, getUserByUsername, deleteUser };
