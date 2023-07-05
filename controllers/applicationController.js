const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Application = require("../models/Application");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const ErrorHandler = require("../Utils/ErrorHandler");

module.exports.createApplication = catchAsyncErrors(async (req, res, next) => {
    const { app_acronym, app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done } = req.body;

    const applicationData = new Application(app_acronym, app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done);

    const applicationRepository = new ApplicationRepository();

    try {
        const createdApplication = await applicationRepository.createApplication(applicationData);
        res.status(200).json({
            success: true,
            application: createdApplication,
        });
    } catch (err) {
        next(err);
    }
});

module.exports.getAllApplications = catchAsyncErrors(async (req, res, next) => {
    const applicationRepository = new ApplicationRepository();
    const applications = await applicationRepository.getAllApplications();
    res.status(200).json(applications);
});

module.exports.getApplicationByAcronym = catchAsyncErrors(async (req, res, next) => {
    const { acronym } = req.params;
    const applicationRepository = new ApplicationRepository();
    const application = await applicationRepository.getApplicationByAcronym(acronym);

    if (!application) {
        throw new ErrorHandler(`Application with acronym '${acronym}' not found.`, 404);
    }

    res.status(200).json(application);
});

module.exports.deleteApplication = catchAsyncErrors(async (req, res, next) => {
    const { acronym } = req.params;
    const applicationRepository = new ApplicationRepository();
    const deleteResult = await applicationRepository.deleteApplication(acronym);

    if (deleteResult.affectedRows === 0) {
        throw new ErrorHandler(`Application with acronym '${acronym}' not found.`, 404);
    }

    res.status(200).json({
        success: true,
        deleted: acronym,
    });
});

module.exports.updateApplication = catchAsyncErrors(async (req, res, next) => {
    const { acronym } = req.params;
    const { app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done } = req.body;

    const updatedApplicationData = {
        app_description,
        app_startdate,
        app_enddate,
        app_permit_open,
        app_permit_todo,
        app_permit_doing,
        app_permit_done,
    };

    const applicationRepository = new ApplicationRepository();

    try {
        const updateResult = await applicationRepository.updateApplication(acronym, updatedApplicationData);

        if (updateResult.affectedRows === 0) {
            throw new ErrorHandler(`Application with acronym '${acronym}' not found.`, 404);
        }

        res.status(200).json({
            success: true,
            updated: acronym,
        });
    } catch (err) {
        next(err);
    }
});
