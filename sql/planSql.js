// PLANS QUERIES
const createPlan = "INSERT INTO plans (plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym) VALUES (?, ?, ?, ?);";

const getPlanByMvpName = "SELECT plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym FROM plans WHERE plan_mvp_name = ?;";

const getAllPlans = "SELECT plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym FROM plans;";

const updatePlan = "UPDATE plans SET plan_startdate = ?, plan_enddate = ? WHERE plan_mvp_name = ?;";

module.exports = { createPlan, getPlanByMvpName, updatePlan, getAllPlans };
