const express = require("express");

const {
    handleAddLabelController,
    handleGetLabelsController,
    handleDeleteLabel
} = require("../controller/label.controller.js");

const labelRouter = express.Router();

labelRouter.post("/addLabel", handleAddLabelController);

labelRouter.delete("/deleteLabel/:id", handleDeleteLabel);

labelRouter.get("/labels", handleGetLabelsController);

module.exports = labelRouter;
