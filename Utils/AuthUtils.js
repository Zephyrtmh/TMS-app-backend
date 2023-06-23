const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");

async function hashPassword(password) {
    const hashPassword = bcrypt.hash(password, 10);
    return hashPassword;
}

async function verifyPassword(givenPassword, actualHashedPassword) {
    return bcrypt.compareSync(givenPassword, actualHashedPassword);
}

async function generateJWToken(username) {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });
}

function validatePassword(password) {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,10}$/.test(password);
}

async function verifyJWToken(token) {
    try {
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(tokenPayload);
        if (!tokenPayload) {
            throw new ErrorHandler("Login to access service", 401);
        }
        return tokenPayload.username;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new ErrorHandler("JWToken expired. Login to access service", 401);
        } else {
            throw new ErrorHandler("Login to access service", 401);
        }
    }
}

module.exports = { hashPassword, verifyPassword, generateJWToken, validatePassword, verifyJWToken };
