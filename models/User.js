class User {
    constructor(username, password, email, active, userGroupName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.active = active;
        this.userGroupName = userGroupName;
    }
}

module.exports = User;
