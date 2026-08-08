const express = require("express");
const{handleTaskManagerController, handleGetCompletedTasksController, handleTaskListController, handleTaskDeleteController, handleTaskUpdateController, handleTaskCompleteController } = require("../controller/task.controller");

const router = express.Router();
router.post("/addTask", handleTaskManagerController);
router.get("/tasklists", handleTaskListController);
router.get("/completedTasks", handleGetCompletedTasksController);
router.post("/deleteTask", handleTaskDeleteController);
router.put("/completeTask", handleTaskCompleteController);
router.put("/updateTask", handleTaskUpdateController);
module.exports = router;    