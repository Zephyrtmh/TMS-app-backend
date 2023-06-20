const getUserByUsername = `SELECT username, password, email, active, user_group.userGroupName FROM accounts INNER JOIN user_group on accounts.userGroupId = user_group.userGroupId WHERE username = ?;`;

const getAllUsers = `SELECT username, password, email FROM accounts;`;

const createUser = `INSERT INTO accounts (username, password, email, active, userGroupId) values (?, ?, ?, ?, ?);`;

const deleteUser = `DELETE FROM accounts WHERE username = ?;`;

const updateUser = `UPDATE accounts SET password = ?, email = ?, active = ?, userGroupId = ? WHERE username = ?`;

const deactivateUser = `UPDATE accounts SET active = "inactive" WHERE username = ?`;

module.exports = { createUser, getAllUsers, getUserByUsername, deleteUser, updateUser, deactivateUser };
