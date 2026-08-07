const express = require("express");
const{handleTaskManagerController, handleTaskListController, handleTaskDeleteController } = require("../controller/task.controller");

const router = express.Router();
router.post("/addTask", handleTaskManagerController);
router.get("/tasklists", handleTaskListController);
router.post("/deleteTask", handleTaskDeleteController);

module.exports = router;    