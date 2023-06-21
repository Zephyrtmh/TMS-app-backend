const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const userRoutes = require("./routes/user");
const ErrorHandler = require("./utils/errorHandler");

const cookieParser = require("cookie-parser");

const cors = require("cors");

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

//authentication routes
const authenticationRoutes = require("./routes/authentication");

app.use(authenticationRoutes);
app.use(errorMiddleware);
app.use(userRoutes);

app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
