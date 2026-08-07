const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: "No description provided"
    },
    priority: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
},
{timestamps: true}
);

const Task = mongoose.model("Task", taskSchema);

module.exports = {Task};