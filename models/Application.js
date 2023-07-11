class Application {
    constructor(appAcronym, appDescription, appRNumber, appStartDate, appEndDate, appPermitCreate, appPermitOpen, appPermitToDo, appPermitDoing, appPermitDone) {
        this.appAcronym = appAcronym;
        this.appDescription = appDescription;
        this.appRNumber = appRNumber;
        this.appStartDate = appStartDate;
        this.appEndDate = appEndDate;
        this.appPermitCreate = appPermitCreate;
        this.appPermitOpen = appPermitOpen;
        this.appPermitToDo = appPermitToDo;
        this.appPermitDoing = appPermitDoing;
        this.appPermitDone = appPermitDone;
    }
}

module.exports = Application;
