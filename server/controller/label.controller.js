const { Label } = require("../model/label.model.js");
const { Task } = require("../model/task.model.js");

const handleAddLabelController = async (req, res) => {
    try {
        const body = req.body;

        if (!body.name) {
            return res.status(400).json({
                message: "Label name is required",
                Success: false
            });
        }

        const label = await Label.create({
            name: body.name
        });

        return res.status(201).json({
            message: "Label created successfully",
            Success: true,
            label: label
        });

    } catch (error) {
        console.log("Error creating label:", error);

        return res.status(500).json({
            message: error.message,
            Success: false
        });
    }
};
const handleGetLabelsController = async (req, res) => {
    try {
        const labels = await Label.find();

        return res.status(200).json({
            message: "Labels fetched successfully",
            Success: true,
            labels: labels
        });

    } catch (error) {
        console.log("Error fetching labels:", error);

        return res.status(500).json({
            message: error.message,
            Success: false
        });
    }
};
const handleDeleteLabel = async (req, res) => {
    try {
        const { id } = req.params;

        // Remove this label from every task using it
        await Task.updateMany(
            { label: id },
            { $set: { label: null } }
        );

        // Delete the label itself
        const deletedLabel = await Label.findByIdAndDelete(id);

        if (!deletedLabel) {
            return res.status(404).json({
                message: "Label not found",
                Success: false
            });
        }

        return res.status(200).json({
            message: "Label deleted successfully",
            Success: true,
            label: deletedLabel
        });

    } catch (error) {
        console.log("Error deleting label:", error);

        return res.status(500).json({
            message: error.message,
            Success: false
        });
    }
};

module.exports = {
    handleAddLabelController,
    handleGetLabelsController,
    handleDeleteLabel
};