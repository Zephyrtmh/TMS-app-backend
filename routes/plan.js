const express = require("express");
const router = express.Router();

const { createPlan, getAllPlans, getPlanByMVPName, deletePlan, updatePlan } = require("../controllers/planController");
const { verifyUser } = require("../controllers/authenticationController");
const { accessUserDetails } = require("../middlewares/authorization");

router.route("/plan/:mvpName").put(verifyUser, accessUserDetails, updatePlan);
router.route("/plan/create").post(verifyUser, createPlan);
router.route("/plan/delete/:mvpName").delete(verifyUser, accessUserDetails, deletePlan);
router.route("/plan/all").post(verifyUser, getAllPlans);
router.route("/plan/:mvpName").post(getPlanByMVPName); //authenticateUser, accessUserDetails,

module.exports = router;
