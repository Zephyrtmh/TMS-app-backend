// TASK QUERIES
const createTask = "INSERT INTO tasks (task_name, task_description, task_notes, task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

const getTaskById = "SELECT task_id, task_name, task_description, task_status, task_assigned_to, task_due_date, task_plan_mvp_name FROM tasks WHERE task_id = ?;";

const getTasksByApp = "SELECT task_name FROM tasks WHERE task_app_acronym = ?;";

const getAllTasks = "SELECT task_id, task_name, task_description, task_status, task_assigned_to, task_due_date, task_plan_mvp_name FROM tasks;";

const updateTask = "UPDATE tasks SET task_name = ?, task_description = ?, task_notes = ?, task_plan = ?, task_state = ?, task_creator = ?, task_owner = ? WHERE task_id = ?;";

const deleteTask = "DELETE FROM tasks WHERE task_id = ?;";

module.exports = { createTask, getTaskById, getAllTasks, updateTask, deleteTask, getTasksByApp };
