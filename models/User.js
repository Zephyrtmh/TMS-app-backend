class User {
    constructor(username, password, email, active, userGroupId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.active = active;
        this.userGroupId = userGroupId;
    }
}

module.exports = User;
