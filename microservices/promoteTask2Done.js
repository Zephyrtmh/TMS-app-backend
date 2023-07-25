const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const UserRepository = require("../Repository/UserRepository");
const PlanRepository = require("../Repository/PlanRepository");
const Note = require("../models/Note");
const ErrorHandler = require("../Utils/ErrorHandler");

const { sendEmail } = require("../Utils/EmailUtil");

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//     },
// });

async function promoteTask2Done(req, res, next) {
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();
    const userRepository = new UserRepository();
    const planRepository = new PlanRepository();
    const { username, password, taskId, taskNote, appAcronym } = req.body;

    //check for params
    if (Object.keys(req.query).length > 0) {
        return res.status(200).send({
            code: "E007",
        });
    }

    if (!username || !password || !taskId || !appAcronym) {
        return res.status(200).send({
            code: "E003",
        });
    }

    const expectedFields = ["username", "password", "appAcronym", "taskId", "taskNote"];
    const receivedFields = Object.keys(req.body);

    const hasExtraFields = receivedFields.some((field) => !expectedFields.includes(field));

    if (hasExtraFields) {
        return res.status(200).send({ code: "E013" });
    }

    //check if user is in db
    try {
        var user = await userRepository.getUserByUsername(req.body.username);
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
    } catch (e) {
        return res.status(200).send({
            code: "E004",
        });
    }

    var application = await applicationRepository.getApplicationByAcronym(req.body.appAcronym);
    if (!application) {
        return res.status(200).send({
            code: "E005",
        });
    }

    if (!application) {
        return res.status(200).send({
            code: "E005",
        });
    }

    // Compare userGroupsArr vs application app_premit_doing group
    console.log("user", user);
    if (!user[0].userGroups.includes(application.app_permit_doing)) {
        return res.status(200).send({
            code: "E002",
        });
    }

    var task = await taskRepository.getTaskById(taskId);

    if (!task) {
        return res.status(200).send({
            code: "E009",
        });
    }

    if (task.task_state !== "doing") {
        return res.status(200).send({
            code: "E010",
        });
    }

    if (taskNote && taskNote != "") {
        if (/\|/.test(taskNote)) {
            return res.status(200).json({
                code: "E012",
            });
        }
    }

    // System generated note string
    try {
        var notesDetails = { action: "promote", from: "doing", to: "done", taskId: taskId, author: username };
        var newNotes = await addSystemGeneratedNote(notesDetails);
        console.log(newNotes);

        var promoted = await taskRepository.promoteTask(taskId, "done", newNotes);
        const user = await userRepository.getUserByUsername(username);

        const recipients = await userRepository.getAllUsersAppPermitDone(appAcronym);
        console.log("recipients", recipients);

        const emailData = { user: user[0], task: task, recipients: recipients };
        console.log("emailData", emailData);

        if (recipients.length !== 0) {
            sendEmail(emailData);
        }
    } catch (err) {
        console.log(err);
        return res.status(200).send({
            code: "E011",
        });
    }

    return res.status(200).send({
        taskId: taskId.toLowerCase(),
        code: "S001",
    });
}

const addSystemGeneratedNote = async (details) => {
    console.log("this was ran");
    const taskRepository = new TaskRepository();
    const author = details.author;
    if (details.action === "promote") {
        var content = `${author} promoted the task from ${details.from} -> ${details.to}`;
    } else if (details.action === "demote") {
        var content = `${author} demoted the task from ${details.from} -> ${details.to}`;
    } else if (details.action === "update") {
        var content = `${author} reassigned the plan: ${details.from} -> ${details.to}`;
    }

    var note = new Note(content, details.from, "system", new Date().toLocaleString());

    try {
        var noteAdded = await taskRepository.addNoteToTask(details.taskId, note);
        return noteAdded;
    } catch (err) {
        throw new ErrorHandler("error adding notes", 500);
    }
};

module.exports = { promoteTask2Done };
