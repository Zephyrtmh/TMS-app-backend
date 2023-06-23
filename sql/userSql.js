//USER QUERIES
const getUserByUsername = `SELECT username, password, email, active, user_group.userGroupName AS userGroupName FROM accounts INNER JOIN user_group on accounts.userGroupName = user_group.userGroupName WHERE username = ?;`;

const getAllUsers = `SELECT username, password, email, active, user_group.userGroupName AS userGroupName FROM accounts INNER JOIN user_group on accounts.userGroupName = user_group.userGroupName`;

const createUser = `INSERT INTO accounts (username, password, email, active, userGroupName) values (?, ?, ?, ?, ?);`;

const deleteUser = `DELETE FROM accounts WHERE username = ?;`;

const updateUserIncludingPassword = `UPDATE accounts SET password = ?, email = ?, active = ?, userGroupName = ? WHERE username = ?`;

const updateUserExcludingPassword = `UPDATE accounts SET email = ?, active = ?, userGroupName = ? WHERE username = ?`;

const deactivateUser = `UPDATE accounts SET active = "inactive" WHERE username = ?`;

const activateUser = `UPDATE accounts SET active = "active" WHERE username = ?`;

module.exports = { createUser, getAllUsers, getUserByUsername, deleteUser, updateUserIncludingPassword, updateUserExcludingPassword, deactivateUser, activateUser };
