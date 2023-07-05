const PlanRepository = require("../Repository/PlanRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Plan = require("../models/Plan");

module.exports.createPlan = catchAsyncErrors(async (req, res, next) => {
    const { plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym } = req.body;

    const plan = new Plan(plan_mvp_name, new Date(plan_startdate), new Date(plan_enddate), plan_app_acronym);

    const planRepository = new PlanRepository();
    const applicationRepository = new ApplicationRepository();

    //validate start date and end date
    var application = await applicationRepository.getApplicationByAcronym(plan_app_acronym);
    var appStartDate = application.app_startdate;
    var appEndDate = application.app_enddate;
    console.log("appstartdate: " + appStartDate);
    console.log("appEndDate: " + appEndDate);
    console.log("plan_startdate " + plan.planStartDate);
    console.log("plan_enddate " + plan.planEndDate);
    //invalid startdate
    if (!plan.planStartDate > appStartDate) {
        throw new ErrorHandler("Invalid date. input plan start date not after application start date", 400);
    }
    //invalid enddate
    if (!plan.planEndDate < appEndDate) {
        throw new ErrorHandler("Invalid date. input plan end date not before application end date", 400);
    }

    try {
        const createdPlan = await planRepository.createPlan(plan);
        res.status(200).json({
            success: true,
            plan: createdPlan,
        });
    } catch (err) {
        next(err);
    }
});

module.exports.getAllPlans = catchAsyncErrors(async (req, res, next) => {
    const planRepository = new PlanRepository();
    const plans = await planRepository.getAllPlans();
    res.status(200).json(plans);
});

module.exports.getPlanByMVPName = catchAsyncErrors(async (req, res, next) => {
    const { mvpName } = req.params;
    const planRepository = new PlanRepository();
    const plan = await planRepository.getPlanByMVPName(mvpName);

    if (!plan) {
        throw new ErrorHandler(`Plan with MVP name '${mvpName}' not found.`, 404);
    }

    res.status(200).json(plan);
});

module.exports.deletePlan = catchAsyncErrors(async (req, res, next) => {
    const { mvpName } = req.params;
    const planRepository = new PlanRepository();
    const deleteResult = await planRepository.deletePlan(mvpName);

    if (deleteResult.affectedRows === 0) {
        throw new ErrorHandler(`Plan with MVP name '${mvpName}' not found.`, 404);
    }

    res.status(200).json({
        success: true,
        deleted: mvpName,
    });
});

module.exports.updatePlan = catchAsyncErrors(async (req, res, next) => {
    const { mvpName } = req.params;
    const { plan_startdate, plan_enddate, plan_app_acronym } = req.body;

    const updatedPlanData = {
        plan_startdate,
        plan_enddate,
        plan_app_acronym,
    };

    const planRepository = new PlanRepository();

    try {
        const updateResult = await planRepository.updatePlan(mvpName, updatedPlanData);

        if (updateResult.affectedRows === 0) {
            throw new ErrorHandler(`Plan with MVP name '${mvpName}' not found.`, 404);
        }

        res.status(200).json({
            success: true,
            updated: mvpName,
        });
    } catch (err) {
        next(err);
    }
});