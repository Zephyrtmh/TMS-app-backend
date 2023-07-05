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
        // Implementation
    }

    async getTaskByName(taskName) {
        // Implementation
    }

    async getTasksByApp(taskAppAcronym) {
        var [tasks] = await connection.execute(taskSql.getTasksByApp, [taskAppAcronym]);
        return tasks;
    }
}

module.exports = TaskRepository;
