import React, { useEffect } from "react";
import { taskBaseUrl, labelBaseUrl } from "../axiosInstance.js";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdLabelOutline, MdLabel } from "react-icons/md";

const Home = () => {
    console.log("HOME COMPONENT LOADED");
    const [taskForm, setTaskForm] = React.useState({
        taskName: "",
        description: "",
        priority: "",
        dueDate: "",
        label: "",
    });

    const [taskList, setTaskList] = React.useState([]);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [sortBy, setSortBy] = React.useState("dueDate");
    const [filterPriority, setFilterPriority] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [labels, setLabels] = React.useState([]);
    const [activeLabelTask, setActiveLabelTask] = React.useState(null);
    const [creatingLabel, setCreatingLabel] = React.useState(false);
    const [newLabelName, setNewLabelName] = React.useState("");
    const [selectedLabel, setSelectedLabel] = React.useState("All");
    console.log("LABELS:", labels);

    const tasksPerPage = 12;

    const getAllTasksList = async () => {
        try {
            const { data } = await taskBaseUrl.get("/tasklists");
            setTaskList(data.taskList);
        } catch (error) {
            console.log("Error fetching task list:", error);
        }
    };

    const getAllLabels = async () => {
        try {
            const { data } = await labelBaseUrl.get("/labels");

            if (data && data.Success) {
                setLabels(data.labels);
            }
        } catch (error) {
            console.log("Error fetching labels:", error);
        }
    };

    React.useEffect(() => {
        getAllTasksList();
        getAllLabels();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("SUBMIT CLICKED:", taskForm);

        try {

            if (!taskForm.taskName || !taskForm.description || !taskForm.priority || !taskForm.dueDate) {
                alert("All fields are required");
                return;
            }

            const taskData = {
                ...taskForm,
                label: taskForm.label || null
            };

            if (isUpdating) {

                const { data } = await taskBaseUrl.put("/updateTask", taskData);

                if (data && data.Success) {
                    alert(data.message);

                    setTaskForm({
                        taskName: "",
                        description: "",
                        priority: "",
                        dueDate: "",
                        label: ""
                    });

                    setIsUpdating(false);
                    getAllTasksList();
                }

            } else {

                const { data } = await taskBaseUrl.post("/addTask", taskData);

                if (data && data.Success) {
                    alert(data.message);

                    setTaskForm({
                        taskName: "",
                        description: "",
                        priority: "",
                        dueDate: "",
                        label: ""
                    });

                    getAllTasksList();
                }
            }

        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }
        try {
            const { data } = await taskBaseUrl.post("/deleteTask", { Id: taskId });
            console.log("Task deleted successfully:", data);
            getAllTasksList();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = (data) => {
        setTaskForm({
            _id: data._id,
            taskName: data.taskName,
            description: data.description,
            priority: data.priority,
            dueDate: data.dueDate,
            label: data.label || ""
        });
        setIsUpdating(true);
    };

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    const filteredTasks = taskList.filter((task) => {

        const matchesPriority =
            filterPriority === "All" ||
            task.priority === filterPriority;

        const matchesLabel =
            selectedLabel === "All" ||
            task.label === selectedLabel;

        return matchesPriority && matchesLabel;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {

        if (sortBy === "priority") {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        if (sortBy === "dueDate") {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }

        return 0;
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;

    const currentTasks = sortedTasks.slice(
        indexOfFirstTask,
        indexOfLastTask
    );

    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

    const getDeadlineStatus = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const difference = due - today;
        const daysLeft = Math.round(
            difference / (1000 * 60 * 60 * 24)
        );
        if (daysLeft < 0) {
            return `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}`;
        }
        if (daysLeft === 0) {
            return "Due today";
        }
        if (daysLeft === 1) {
            return "Due tomorrow";
        }
        return `${daysLeft} days left`;
    };

    const getDeadlineBadge = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const difference = due - today;
        const daysLeft = Math.round(
            difference / (1000 * 60 * 60 * 24)
        );

        if (daysLeft < 0) {
            return "bg-red-100 text-red-700";
        }

        if (daysLeft === 0) {
            return "bg-orange-100 text-orange-700";
        }

        if (daysLeft === 1) {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-green-100 text-green-700";
    };

    const handleLabelSelect = async (task, labelId) => {
        try {
            const updatedTask = {
                ...task,
                label: labelId
            };

            const { data } = await taskBaseUrl.put(
                "/updateTask",
                updatedTask
            );

            if (data && data.Success) {
                await getAllTasksList();
                setActiveLabelTask(null);
            }

        } catch (error) {
            console.log("Error assigning label:", error);
        }
    };

    const handleCreateLabel = async (task) => {
        try {
            if (!newLabelName.trim()) {
                return;
            }

            const { data } = await labelBaseUrl.post("/addLabel", {
                name: newLabelName.trim()
            });

            if (data && data.Success) {

                const newLabelId = data.label._id;

                await handleLabelSelect(task, newLabelId);

                await getAllLabels();

                setNewLabelName("");
                setCreatingLabel(false);
                setActiveLabelTask(null);
            }

        } catch (error) {
            console.log("Error creating and assigning label:", error);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-60px)] flex">

            {/* LEFT SIDEBAR */}
            <aside className="w-52 min-h-[calc(100vh-60px)] border-r border-gray-200 px-4 py-5">

                <button
                    onClick={() => {
                        setSelectedLabel("All");
                        setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm mb-3 cursor-pointer ${selectedLabel === "All"
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                        }`}
                >
                    All Tasks
                </button>

                <p className="text-xs font-semibold text-gray-400 px-3 mb-2">
                    LABELS
                </p>

                {labels.map((label) => (
                    <button
                        key={label._id}
                        onClick={() => {
                            setSelectedLabel(label._id);
                            setCurrentPage(1);
                        }}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm cursor-pointer ${selectedLabel === label._id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        <MdLabelOutline size={17} />
                        {label.name}
                    </button>
                ))}

            </aside>
            <main className="flex-1 px-5">
                <div className="w-full grid grid-cols-4 gap-5 items-center justify-center mt-5 my-4">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="">Task Name</label>
                        <input type="text" name="taskName" value={taskForm.taskName} onChange={handleFormChange} placeholder="TaskTitle" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2 " />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="">Description</label>
                        <input type="text" name="description" value={taskForm.description} onChange={handleFormChange} placeholder="Description" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="">Priority</label>
                        <select
                            name="priority"
                            value={taskForm.priority}
                            onChange={handleFormChange}
                            className="w-full border-2 text-gray-800 border-gray-300 rounded-sm outline-none h-8 px-2">
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="">Due Date</label>
                        <input type="date" name="dueDate" value={taskForm.dueDate} onChange={handleFormChange} placeholder="Due Date" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2" />
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <button className="bg-gray-700 text-white h-9 rounded-md cursor-pointer w-22" onClick={handleSubmit}>
                        SUBMIT
                    </button>
                </div>
                {/* <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-2 border-gray-300 rounded-md h-9 px-2"
                >
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                </select> */}
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="border-2 border-gray-300 rounded-md h-9 px-2"
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <div className="w-full mt-5">
                    <div className="w-full">
                        <table className="w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="tracking-wider px-6 py-3 text-left text-xs font-medium text-grey-500">Task Name</th>
                                    <th className="tracking-wider px-6 py-3 text-left text-xs font-medium text-grey-500">Description</th>
                                    <th className="tracking-wider px-6 py-3 text-left text-xs font-medium text-grey-500">Priority</th>
                                    <th className="tracking-wider px-6 py-3 text-left text-xs font-medium text-grey-500">Due Date</th>
                                    <th className="tracking-wider px-6 py-3 text-left text-xs font-medium text-grey-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="w-full bg-white divide-y divide-gray-200">
                                {currentTasks.map((task, index) => {
                                    return (
                                        <tr className="Hover:bg-gray-200" key={index}>
                                            <td className="px-6 py-3 whitespace-nowrap">{task.taskName}</td>
                                            <td className="px-6 py-3 whitespace-nowrap">{task.description}</td>
                                            <td className="px-6 py-3 whitespace-nowrap">{task.priority}</td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <div>{task.dueDate?.split("T")[0]}</div>

                                                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDeadlineBadge(task.dueDate)}`}>
                                                    {getDeadlineStatus(task.dueDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap flex gap-2">
                                                <div className="flex gap-2">
                                                    <div className="relative">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveLabelTask(
                                                                    activeLabelTask === task._id ? null : task._id
                                                                )
                                                            }
                                                            className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer transition-all
            ${activeLabelTask === task._id || task.label
                                                                    ? "text-blue-500 bg-blue-50"
                                                                    : "text-gray-500 hover:bg-gray-100"
                                                                }
        `}
                                                            title="Labels"
                                                        >
                                                            {task.label ? (
                                                                <MdLabel size={21} />
                                                            ) : (
                                                                <MdLabelOutline size={21} />
                                                            )}
                                                        </button>


                                                        {/* POPUP */}
                                                        {activeLabelTask === task._id && (
                                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
                                                                <p className="text-xs font-semibold text-gray-500 px-2 py-1">
                                                                    LABELS
                                                                </p>

                                                                {/* ALL LABELS */}
                                                                <div className="flex flex-col w-full">
                                                                    {labels.map((label) => (
                                                                        <button
                                                                            key={label._id}
                                                                            type="button"
                                                                            onClick={() => handleLabelSelect(task, label._id)}
                                                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition
                                                                                    ${task.label?._id === label._id || task.label === label._id
                                                                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                                                                    : "hover:bg-gray-100"
                                                                                }
                                                                           `}
                                                                        >
                                                                            {label.name}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                {/* CREATE LABEL SECTION */}
                                                                <div className="border-t border-gray-200 mt-1 pt-1">

                                                                    {!creatingLabel ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setCreatingLabel(true)}
                                                                            className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                                                                        >
                                                                            + Create new label
                                                                        </button>
                                                                    ) : (
                                                                        <div className="p-2">
                                                                            <input
                                                                                type="text"
                                                                                value={newLabelName}
                                                                                onChange={(e) => setNewLabelName(e.target.value)}
                                                                                placeholder="Label name"
                                                                                autoFocus
                                                                                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none"
                                                                            />

                                                                            <div className="flex justify-end gap-2 mt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setCreatingLabel(false);
                                                                                        setNewLabelName("");
                                                                                    }}
                                                                                    className="text-xs text-gray-500 cursor-pointer"
                                                                                >
                                                                                    Cancel
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleCreateLabel(task)}
                                                                                    className="text-xs font-medium cursor-pointer"
                                                                                >
                                                                                    Create
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                </div>

                                                            </div>
                                                        )}

                                                    </div>

                                                    <button className="bg-blue-500 text-white h-8 rounded-md cursor-pointer w-8 flex items-center justify-center" onClick={() => handleUpdate(task)}>
                                                        <MdEdit size={20} />
                                                    </button>

                                                    <button className="bg-red-500 text-white h-8 rounded-md cursor-pointer w-8 flex items-center justify-center" onClick={() => handleDelete(task._id)}>
                                                        <MdDeleteForever size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>)
                                })}
                            </tbody>
                        </table>
                        <div className="flex justify-center items-center gap-4 mt-5">

                            <button
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
                                Previous
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
                                Next
                            </button>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Home;