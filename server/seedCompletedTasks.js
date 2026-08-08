const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const mongoose = require("mongoose");
const { Task } = require("./model/task.model.js");
const { Label } = require("./model/label.model.js");

const MONGO_URI = process.env.MONGO_URI;
const seedCompletedTasks = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        // -----------------------------------
        // 1. DELETE EXISTING COMPLETED TASKS
        // -----------------------------------

        const deleted = await Task.deleteMany({
            completed: true
        });

        console.log(
            `Deleted ${deleted.deletedCount} completed tasks`
        );

        // -----------------------------------
        // 2. GET EXISTING LABELS
        // -----------------------------------

        const labels = await Label.find();

        const labelMap = {};

        labels.forEach((label) => {
            labelMap[label.name.toLowerCase()] = label._id;
        });

        console.log("Available labels:", Object.keys(labelMap));

        // -----------------------------------
        // 3. HELPER
        // -----------------------------------

        const getLabel = (name) => {
            return labelMap[name.toLowerCase()] || null;
        };

        // -----------------------------------
        // 4. FAKE COMPLETED TASKS
        // -----------------------------------

        const tasks = [

            // ================================
            // JULY 2026
            // ================================

            {
                taskName: "Log fasting glucose readings",
                description: "Record the week's fasting glucose readings.",
                priority: "Medium",
                dueDate: new Date("2026-07-05"),
                completed: true,
                completedAt: new Date("2026-07-05"),
                label: getLabel("Personal")
            },

            {
                taskName: "Restock medication",
                description: "Check medication supplies and restock anything running low.",
                priority: "High",
                dueDate: new Date("2026-07-08"),
                completed: true,
                completedAt: new Date("2026-07-08"),
                label: getLabel("Personal")
            },
            {
                taskName: "Backup important files",
                description: "Create a backup of important documents and project files.",
                priority: "Medium",
                dueDate: new Date("2026-07-27"),
                completed: true,
                completedAt: new Date("2026-07-27"),
                label: null
            },


            {
                taskName: "Complete DBMS assignment",
                description: "Finish the normalization and SQL portions of the assignment.",
                priority: "High",
                dueDate: new Date("2026-07-11"),
                completed: true,
                completedAt: new Date("2026-07-10"),
                label: getLabel("College")
            },
            {
                taskName: "Organize study desk",
                description: "Clear the desk and arrange notebooks and supplies.",
                priority: "Low",
                dueDate: new Date("2026-07-15"),
                completed: true,
                completedAt: new Date("2026-07-15"),
                label: null
            },

            {
                taskName: "Practice SQL queries",
                description: "Work through joins, subqueries, grouping and aggregation.",
                priority: "Medium",
                dueDate: new Date("2026-07-14"),
                completed: true,
                completedAt: new Date("2026-07-14"),
                label: getLabel("College")
            },

            {
                taskName: "Finish Spring Boot API",
                description: "Complete the remaining endpoints and test them with Postman.",
                priority: "High",
                dueDate: new Date("2026-07-17"),
                completed: true,
                completedAt: new Date("2026-07-16"),
                label: getLabel("Internship")
            },

            {
                taskName: "Review glucose monitoring supplies",
                description: "Check testing supplies and make a list of items that need replacement.",
                priority: "Low",
                dueDate: new Date("2026-07-19"),
                completed: true,
                completedAt: new Date("2026-07-19"),
                label: getLabel("Personal")
            },

            {
                taskName: "Design Empirical Society poster",
                description: "Finalize the event poster and prepare the social media version.",
                priority: "Medium",
                dueDate: new Date("2026-07-22"),
                completed: true,
                completedAt: new Date("2026-07-21"),
                label: getLabel("College")

            },
            {
                taskName: "Clean up downloads folder",
                description: "Remove old files and organize anything important.",
                priority: "Low",
                dueDate: new Date("2026-07-07"),
                completed: true,
                completedAt: new Date("2026-07-07"),
                label: null
            },
            {
                taskName: "Update internship resume",
                description: "Add recent projects, technical skills and internship experience.",
                priority: "High",
                dueDate: new Date("2026-07-25"),
                completed: true,
                completedAt: new Date("2026-07-24"),
                label: getLabel("Internship")
            },

            {
                taskName: "Update GitHub projects",
                description: "Clean up repositories and update project documentation.",
                priority: "Low",
                dueDate: new Date("2026-07-29"),
                completed: true,
                completedAt: new Date("2026-07-28"),
                label: getLabel("Internship")
            },

            // ================================
            // AUGUST 2026
            // ================================

            {
                taskName: "Complete weekly glucose log",
                description: "Update the weekly glucose monitoring record.",
                priority: "Medium",
                dueDate: new Date("2026-08-01"),
                completed: true,
                completedAt: new Date("2026-08-01"),
                label: getLabel("Personal")
            },
            {
                taskName: "Plan August schedule",
                description: "Review upcoming deadlines and organize the month's priorities.",
                priority: "Medium",
                dueDate: new Date("2026-08-02"),
                completed: true,
                completedAt: new Date("2026-08-02"),
                label: null
            },

            {
                taskName: "Check medication stock",
                description: "Review current medication supplies and note anything that needs restocking.",
                priority: "Medium",
                dueDate: new Date("2026-08-03"),
                completed: true,
                completedAt: new Date("2026-08-03"),
                label: getLabel("Personal")
            },

            {
                taskName: "Restock glucose testing strips",
                description: "Check remaining testing strips and restock supplies.",
                priority: "High",
                dueDate: new Date("2026-08-04"),
                completed: true,
                completedAt: new Date("2026-08-04"),
                label: getLabel("Personal")
            },
            {
                taskName: "Clean up Git branches",
                description: "Remove old branches and organize the active project branches.",
                priority: "Low",
                dueDate: new Date("2026-08-06"),
                completed: true,
                completedAt: new Date("2026-08-06"),
                label: null
            },

            {
                taskName: "Revise Java OOP concepts",
                description: "Review inheritance, polymorphism, abstraction and interfaces.",
                priority: "High",
                dueDate: new Date("2026-08-05"),
                completed: true,
                completedAt: new Date("2026-08-05"),
                label: getLabel("College")
            },

            {
                taskName: "Finish Tickr task filtering",
                description: "Complete task filtering and verify the completed-task workflow.",
                priority: "High",
                dueDate: new Date("2026-08-06"),
                completed: true,
                completedAt: new Date("2026-08-06"),
                label: getLabel("Personal")
            },


            {
                taskName: "Push portfolio updates",
                description: "Add recent projects and polish the portfolio project descriptions.",
                priority: "Medium",
                dueDate: new Date("2026-08-07"),
                completed: true,
                completedAt: new Date("2026-08-07"),
                label: getLabel("Internship")
            },

            {
                taskName: "Review weekly plans",
                description: "Go through completed work and prepare the next week's priorities.",
                priority: "Low",
                dueDate: new Date("2026-08-08"),
                completed: true,
                completedAt: new Date("2026-08-08"),
                label: null
            },

            {
                taskName: "Finalize society event banner",
                description: "Export the final banner and prepare the required dimensions.",
                priority: "Medium",
                dueDate: new Date("2026-08-07"),
                completed: true,
                completedAt: new Date("2026-08-07"),
                label: getLabel("College")
            },

            {
                taskName: "Practice MongoDB queries",
                description: "Practice filtering, updates, references and aggregation basics.",
                priority: "Low",
                dueDate: new Date("2026-08-08"),
                completed: true,
                completedAt: new Date("2026-08-08"),
                label: getLabel("College")
            }
        ];

        // -----------------------------------
        // 5. INSERT
        // -----------------------------------

        const inserted = await Task.insertMany(tasks);

        console.log(
            `Inserted ${inserted.length} completed tasks`
        );

        console.log("Seeding complete!");

        await mongoose.disconnect();

    } catch (error) {
        console.error("Seed error:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedCompletedTasks();