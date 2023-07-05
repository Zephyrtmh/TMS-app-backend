class Application {
    constructor(appAcronym, appDescription, appRNumber, appStartDate, appEndDate, appPermitOpen, appPermitToDo, appPermitDoing, appPermitDone) {
        this.appAcronym = appAcronym;
        this.appDescription = appDescription;
        this.appRNumber = appRNumber;
        this.appStartDate = appStartDate;
        this.appEndDate = appEndDate;
        this.appPermitOpen = appPermitOpen;
        this.appPermitToDo = appPermitToDo;
        this.appPermitDoing = appPermitDoing;
        this.appPermitDone = appPermitDone;
    }
}

module.exports = Application;
