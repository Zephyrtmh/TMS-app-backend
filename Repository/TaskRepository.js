const connection = require("../sqlConnection/sqlConnection");
const Task = require("../models/Task");
const taskSql = require("../sql/taskSql");
// Import any necessary SQL queries or utility functions

class TaskRepository {
    // Implement the repository methods for task CRUD operations
    // You can use the User Repository as a reference for writing these methods
    // For example:
    async createTask(task) {
        console.log(task);
        var planCreated = await connection.execute(taskSql.createTask, Object.values(task));
        return planCreated;
    }

    async deleteTask(taskName) {
        // Implementation
    }

    async updateTask(task, taskId) {
        // const updatedTaskData = {
        //     task_description,
        //     task_notes,
        //     task_id,
        //     task_plan,
        //     task_app_acronym,
        //     task_state,
        //     task_creator,
        //     task_owner,
        //     task_createdate,
        // };

        var taskArray = Object.values(task);
        taskArray.push(taskId);
        console.log(taskArray);
        return await connection.execute(taskSql.updateTask, taskArray);
    }

    async getAllTasks() {
        var [tasks] = await connection.execute(taskSql.getAllTasks);
        return tasks;
    }

    async getTasksByState(state) {
        var [tasks] = await connection.execute(taskSql.getTaskByState, [state]);
        return tasks;
    }

    async getTasksByStateAndAppAcronym(state, appAcronym) {
        var [tasks] = await connection.execute(taskSql.getTaskByState, [state]);
        return tasks;
    }

    async getAllTasksByAppAcronym(appAcronym) {
        var [tasks] = await connection.execute(taskSql.getAllTasksByAppAcronym, [state, appAcronym]);
        return tasks;
    }

    async getTaskById(taskId) {
        var [task] = await connection.execute(taskSql.getTaskByTaskId, [taskId]);
        console.log(task);
        return task[0];
    }

    async getTasksByApp(taskAppAcronym) {
        var [tasks] = await connection.execute(taskSql.getTasksByApp, [taskAppAcronym]);
        return tasks;
    }

    async promoteTask(taskId, newState, newNotes) {
        var promoted = await connection.execute(taskSql.promoteTask, [newState, newNotes, taskId]);
        return promoted;
    }

    async addNoteToTask(taskId, ...notes) {
        //get notes for task
        var task = await this.getTaskById(taskId);
        var taskNotes = task.task_notes;
        console.log("current notes: " + task.task_notes);

        if (taskNotes) {
            var newNote = taskNotes;
            for (let note of notes) {
                if (note.content !== "") {
                    newNote = newNote + "|" + note.content + "|" + note.state + "|" + note.author + "|" + note.createdate;
                }
            }
        } else {
            var newNote = "";
            notes.forEach((note, index) => {
                if (note.content !== "") {
                    if (index === 0) {
                        newNote = "|" + note.content + "|" + note.state + "|" + note.author + "|" + note.createdate;
                    } else {
                        newNote = note.content + "|" + note.state + "|" + note.author + "|" + note.createdate;
                    }
                }
            });
        }

        return newNote;
    }
}

module.exports = TaskRepository;
