const express = require("express");
const{handleTaskManagerController, handleTaskListController, handleTaskDeleteController, handleTaskUpdateController } = require("../controller/task.controller");

const router = express.Router();
router.post("/addTask", handleTaskManagerController);
router.get("/tasklists", handleTaskListController);
router.post("/deleteTask", handleTaskDeleteController);
router.put("/updateTask", handleTaskUpdateController);
module.exports = router;    