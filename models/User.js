class User {
    constructor(username, password, email, active, userGroupNames) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.active = active;
        this.userGroupNames = userGroupNames;
    }
}

module.exports = User;
