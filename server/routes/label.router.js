const express = require("express");

const {
    handleAddLabelController,
    handleGetLabelsController
} = require("../controller/label.controller.js");

const labelRouter = express.Router();

labelRouter.post("/addLabel", handleAddLabelController);

labelRouter.get("/labels", handleGetLabelsController);

module.exports = labelRouter;
