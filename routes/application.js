const express = require("express");
const router = express.Router();

const { createApplication, getAllApplications, getApplicationByAcronym, deleteApplication, updateApplication } = require("../controllers/applicationController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails } = require("../middlewares/authorization");
const { setUserGroupsPermitted } = require("../Utils/AuthorizationUtils");

router.route("/application/:acronym").put(updateApplication);
router.route("/application/create").post(
    // (req, res, next) => {
    //     // setUserGroupsPermitted(req, ["project lead"]);
    //     next();
    // },
    verifyUser,
    createApplication
);
router.route("/application/delete/:acronym").delete(verifyUser, accessUserDetails, deleteApplication);
router.route("/application/all").post(verifyUser, getAllApplications);
router.route("/application/:acronym").post(verifyUser, getApplicationByAcronym);

module.exports = router;
