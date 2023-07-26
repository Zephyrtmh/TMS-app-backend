const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/handleErrors");
const ErrorHandler = require("./Utils/ErrorHandler");
// const dotenv = require("dotenv");

const router = express.Router();
// if (process.env.NODE_ENV !== "production") {
//     dotenv.config({ path: "./config/config.env" });
// }

const { createTask_v2 } = require("./microservices/createTask_v2");
const { getTaskByState } = require("./microservices/getTaskByState");
const { promoteTask2Done } = require("./microservices/promoteTask2Done");

router.route("/createTask").post(createTask_v2);
router.route("/getTaskByState").post(getTaskByState);
router.route("/promoteTask2Done").patch(promoteTask2Done);

app.use(express.json());

app.use(router);

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
console.log("DB_USERNAME", process.env.DB_USERNAME);
console.log("DB_PASSWORD", process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
