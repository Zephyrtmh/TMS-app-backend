//USER QUERIES
const getUserByUsername = `SELECT accounts.username, password, email, accounts_usergroups.userGroupName as userGroupName, active FROM accounts INNER JOIN accounts_usergroups on accounts.username = accounts_usergroups.username WHERE accounts.username = ?;`;

const getAllUsers = `SELECT accounts.username, password, email, accounts_usergroups.userGroupName as userGroupName, active FROM accounts INNER JOIN accounts_usergroups on accounts.username = accounts_usergroups.username`;

// const getAllUsers = `SELECT accounts.username, password, email, active FROM accounts`;

const getAllUserGroupMappings = `SELECT username, userGroupName FROM accounts_usergroups`;

const createUser = `INSERT INTO accounts (username, password, email, active) values (?, ?, ?, ?);`;

const createUserWithGroups = `INSERT INTO accounts_usergroups (username, userGroupName) VALUES `;

const deleteUser = `DELETE FROM accounts WHERE username = ?;`;

const updateUserIncludingPassword = `UPDATE accounts SET password = ?, email = ?, active = ?, userGroupName = ? WHERE username = ?`;

const updateUserExcludingPassword = `UPDATE accounts SET email = ?, active = ?, userGroupName = ? WHERE username = ?`;

const deactivateUser = `UPDATE accounts SET active = "inactive" WHERE username = ?`;

const activateUser = `UPDATE accounts SET active = "active" WHERE username = ?`;

module.exports = { createUser, getAllUsers, getUserByUsername, deleteUser, updateUserIncludingPassword, updateUserExcludingPassword, deactivateUser, activateUser, createUserWithGroups, getAllUserGroupMappings };
