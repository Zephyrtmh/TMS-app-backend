const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/handleErrors");
const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/group");
const applicationRoutes = require("./routes/application");
const planRoutes = require("./routes/plan");
const taskRoutes = require("./routes/task");
const ErrorHandler = require("./Utils/ErrorHandler");
const authenticationRoutes = require("./routes/authentication");
const cookieParser = require("cookie-parser");

//enable cors
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

app.use(applicationRoutes);
app.use(authenticationRoutes);
app.use(userRoutes);
app.use(groupRoutes);
app.use(taskRoutes);
app.use(planRoutes);

app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    "";
});
