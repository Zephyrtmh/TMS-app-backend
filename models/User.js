class User {
    constructor(userId = 0, username, password, email, active, userGroup) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.active = active;
        this.userGroup = userGroup;
    }
}

module.exports = User;
