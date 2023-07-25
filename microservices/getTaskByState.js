const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");

const UserRepository = require("../Repository/UserRepository");
const bcrypt = require("bcryptjs");

module.exports.getTaskByState = catchAsyncErrors(async (req, res, next) => {
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();
    const userRepository = new UserRepository();
    try {
        //Get values from json body
        if (!req.body.username || !req.body.password || !req.body.state) {
            return res.status(200).send({
                code: "E003",
            });
        }

        //check for params
        console.log(Object.keys(req.query).length);
        if (Object.keys(req.query).length > 0) {
            return res.status(200).send({
                code: "E007",
            });
        }

        //Check for unexpected fields in the request body
        if (req.body.appAcronym || req.body.appAcronym == "") var expectedFields = ["username", "password", "state", "appAcronym"];
        else var expectedFields = ["username", "password", "state"];
        const unexpectedFields = Object.keys(req.body).filter((field) => !expectedFields.includes(field));
        if (unexpectedFields.length > 0) {
            return res.status(200).send({
                code: "E013",
            });
        }
    } catch (err) {
        console.log(err);
    }

    //check if user is in db
    try {
        const user = await userRepository.getUserByUsername(req.body.username);
        //Check if user is found
        if (!user) {
            return res.status(200).send({
                code: "E004",
            });
        }
        //check if user is suspended
        if (user[0].isActive == 0) {
            return res.status(200).send({
                code: "E001",
            });
        }
        //check password
        const isValidCredentials = await bcrypt.compare(req.body.password, user[0].password);
        if (!isValidCredentials) {
            return res.status(200).send({
                code: "E004",
            });
        }

        //check valid state
        const stateArray = ["open", "todo", "doing", "done", "closed"];
        if (!stateArray.includes(String(req.body.state).toLowerCase())) {
            return res.status(200).send({
                code: "E008",
            });
        }
    } catch (e) {
        return res.status(200).send({
            code: "E004",
        });
    }

    //query db
    try {
        if (req.body.appAcronym) {
            var application = await applicationRepository.getApplicationByAcronym(req.body.appAcronym);
            if (!application) {
                return res.status(200).send({
                    code: "E005",
                });
            }
            try {
                var tasks = await taskRepository.getTasksByStateAndAppAcronym(req.body.state, req.body.appAcronym);
            } catch (err) {
                res.status(200).json({ code: "E011" });
            }

            return res.status(200).json({ code: "S001", tasks: tasks });
        } else {
            var tasks = await taskRepository.getTasksByState(req.body.state);
            return res.status(200).json({ code: "S001", tasks: tasks });
        }
    } catch (err) {
        console.log(err);
    }
    console.log(done);
});
