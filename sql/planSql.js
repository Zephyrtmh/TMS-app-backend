// PLANS QUERIES
const createPlan = "INSERT INTO plans (plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym, plan_colour) VALUES (?, ?, ?, ?, ?);";

const getPlanByMvpName = "SELECT plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym FROM plans WHERE plan_mvp_name = ?;";

const getAllPlans = "SELECT plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym FROM plans;";

const getAllPlansByAppAcronym = "SELECT plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym, plan_colour FROM plans WHERE plan_app_acronym = ?;";

const updatePlan = "UPDATE plans SET plan_startdate = ?, plan_enddate = ? WHERE plan_mvp_name = ?;";

const getTakenColours = "SELECT DISTINCT plan_colour FROM plans WHERE plan_app_acronym = ?;";

module.exports = { createPlan, getPlanByMvpName, updatePlan, getAllPlans, getTakenColours, getAllPlansByAppAcronym };
