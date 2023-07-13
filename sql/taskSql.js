// TASK QUERIES
const createTask = "INSERT INTO tasks (task_name, task_description, task_notes, task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

const getTaskByTaskId = "SELECT task_name, task_description, task_notes, task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate FROM tasks WHERE task_id = ?;";

const getTasksByApp = "SELECT task_name FROM tasks WHERE task_app_acronym = ?;";

const getAllTasks = "SELECT task_name, task_description, task_notes, task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate , plans.plan_colour FROM tasks INNER JOIN plans ON tasks.task_plan = plans.plan_MVP_name;";

const getAllTasksByAppAcronym = "SELECT task_name, task_description, task_notes, task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate , plans.plan_colour FROM tasks LEFT JOIN plans ON tasks.task_plan = plans.plan_MVP_name WHERE task_app_acronym = ?;";

const updateTask = "UPDATE tasks SET task_name = ?, task_description = ?, task_notes = ?, task_plan = ?, task_state = ?, task_creator = ?, task_owner = ? WHERE task_id = ?;";

const deleteTask = "DELETE FROM tasks WHERE task_id = ?;";

const promoteTask = "UPDATE tasks SET task_state = ?, task_notes = ? WHERE task_id = ?";

module.exports = {
    createTask,
    getTaskByTaskId,
    getAllTasks,
    updateTask,
    deleteTask,
    getTasksByApp,
    promoteTask,
    getAllTasksByAppAcronym,
};
