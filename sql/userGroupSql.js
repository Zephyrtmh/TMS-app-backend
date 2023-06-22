//USER-GROUP QUERIES
const addUserGroup = "INSERT INTO user_group (userGroupName) values(?)";

const getUserGroups = "SELECT userGroupName from user_group";

module.exports = { addUserGroup, getUserGroups };
