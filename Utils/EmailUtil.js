const express = require("express");
const nodemailer = require("nodemailer");
const UserRepository = require("../Repository/UserRepository");

const app = express();

// Define a route to send an email
module.exports.sendEmail = async (info) => {
    //retrieve all recipients
    const userRepository = new UserRepository();
    userRepository;

    const from = "zephinatay@gmail.com";
    var to = "";
    for (let user of info.recipients) {
        to = to + user.email + ",";
    }
    // Create a nodemailer transporter with your email service provider details
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "zephinatay@gmail.com",
            pass: "sdfolitoctdpkksp",
        },
    });

    // Define the email options
    const mailOptions = {
        from: from,
        to: to,
        subject: `task promotion notification`,
        text: `Task ${info.task.task_name} has been completed by ${info.user.username}. For your approval. \n\n THIS IS A SYSTEM GENERATED EMAIL. DO NOT REPLY TO THIS EMAIL.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return "error sending mail";
        } else {
            return "Sucessfully sent mail";
        }
    });
};
