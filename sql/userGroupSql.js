//USER-GROUP QUERIES
const createUserGroup = "INSERT INTO user_group (userGroupName) values(?)";

const getUserGroups = "SELECT userGroupName from user_group";

module.exports = { createUserGroup, getUserGroups };
