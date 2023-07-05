class Task {
    constructor(taskName, taskDescription, taskNotes = "", taskId, taskPlan = "", taskAppAcronym, taskState, taskCreator, taskOwner, taskCreateDate) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskNotes = taskNotes;
        this.taskId = taskId;
        this.taskPlan = taskPlan;
        this.taskAppAcronym = taskAppAcronym;
        this.taskState = taskState;
        this.taskCreator = taskCreator;
        this.taskOwner = taskOwner;
        this.taskCreateDate = taskCreateDate;
    }
}

module.exports = Task;
