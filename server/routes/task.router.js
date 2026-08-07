const express = require("express");
const{handleTaskManagerController, handleTaskListController} = require("../controller/task.controller");

const router = express.Router();
router.post("/addTask", handleTaskManagerController);
router.get("/tasklists", handleTaskListController);

module.exports = router;    