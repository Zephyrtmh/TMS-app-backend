const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
    const hashPassword = bcrypt.hash(password, 10);
    return hashPassword;
}

async function verifyPassword(givenPassword, actualHashedPassword) {
    return bcrypt.compareSync(givenPassword, actualHashedPassword);
}

async function generateJWToken(userId) {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });
}

async function verifyJWToken(token) {
    try {
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenPayload) {
            new ErrorHandler("Login to create new User", 401);
        }
        console.log(tokenPayload);
        return tokenPayload.userId;
    } catch (err) {
        new ErrorHandler("Login to create new User", 401);
    }
}

module.exports = { hashPassword, verifyPassword, generateJWToken };
