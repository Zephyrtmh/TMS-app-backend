class User {
    constructor(username, password, email, active, userGroups) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.active = active;
        this.userGroups = userGroups;
    }
}

module.exports = User;
