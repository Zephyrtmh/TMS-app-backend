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
const dotenv = require("dotenv");
const cors = require("cors");

//enable cors

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

dotenv.config({ path: "./config/config.env" });

app.use(applicationRoutes);
app.use(authenticationRoutes);
app.use(userRoutes);
app.use(groupRoutes);
app.use(taskRoutes);
app.use(planRoutes);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(200).json({ code: "E013" });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.status(200).send({
        code: "E007",
    });
});

app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
