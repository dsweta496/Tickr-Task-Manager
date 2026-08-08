const { Task } = require("../model/task.model");
const handleTaskManagerController = async (req, res) => {
    try {
        const body = req.body;
        if (!body.taskName || !body.description || !body.priority || !body.dueDate) {
            return res.status(400).json({ message: "All fields are required", Success: false });
        }
        const taskAdd = await Task.insertOne(body);

        if (taskAdd) {
            return res.status(201)
                .json({ message: "Task added successfully", Success: true, Id: taskAdd._id });
        }

        console.log("Task added successfully", taskAdd);
    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("SERVER RESPONSE:", error.response?.data);
    }
}

const handleTaskListController = async (req, res) => {
    try {
        const taskList = await Task.find({});
        console.log("Task List fetched successfully:", taskList);
        return res.status(200)
            .json({ message: "All Tasks fetched successfully", Success: true, TotalCount: taskList.length, taskList: taskList });
    } catch (error) {
        console.log("Error fetching task list:", error);
        return res.status(500)
            .json({ message: error.message, Success: false });
    }
}

const handleTaskDeleteController = async (req, res) => {
    const body = req.body;
    try {
        const deleted = await Task.deleteOne({ _id: body.Id });
        console.log("Task deleted successfully:", deleted);
        if (deleted.acknowledged) {
            return res.status(200)
                .json({ message: "Task deleted successfully", Success: true });
        }
    } catch (error) {
        console.log("Error deleting task:", error);
        return res.status(500)
            .json({ message: error.message, Success: false });
    }
}

const handleTaskUpdateController = async (req, res) => {
    try {
        const body = req.body;
        const updating = await Task.updateOne({ _id: body._id }, { $set: body });

        if (updating.acknowledged) {
            return res.status(200)
                .json({ message: "Task updated successfully", Success: true });
        }
    } catch (error) {
        return res.status(500)
            .json({ message: error.message, Success: false });
    }
}

const handleTaskCompleteController = async (req, res) => {
    try {
        const { id } = req.body;

        const completed = await Task.updateOne(
            { _id: id },
            {
                $set: {
                    completed: true,
                    completedAt: new Date()
                }
            }
        );

        if (completed.acknowledged) {
            return res.status(200).json({
                message: "Task marked as completed",
                Success: true
            });
        }

    } catch (error) {
        console.log("Error completing task:", error);

        return res.status(500).json({
            message: error.message,
            Success: false
        });
    }
};

const handleGetCompletedTasksController = async (req, res) => {
    try {
        const completedTasks = await Task.find({
            completed: true
        })
            .populate("label")
            .sort({
                completedAt: -1
            });

        return res.status(200).json({
            message: "Completed tasks fetched successfully",
            Success: true,
            TotalCount: completedTasks.length,
            taskList: completedTasks
        });

    } catch (error) {
        console.log("Error fetching completed tasks:", error);

        return res.status(500).json({
            message: error.message,
            Success: false
        });
    }
};
module.exports = { handleTaskManagerController, handleTaskListController, handleTaskDeleteController, handleTaskUpdateController, handleTaskCompleteController, handleGetCompletedTasksController };