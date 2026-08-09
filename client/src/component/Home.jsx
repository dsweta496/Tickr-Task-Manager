import React, { useEffect } from "react";
import { taskBaseUrl, labelBaseUrl } from "../axiosInstance.js";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Sidebar from "./Sidebar.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { MdLabelOutline, MdLabel } from "react-icons/md";
import Navbar from "./Navbar.jsx";

const Home = ({
    isSidebarOpen,
    setIsSidebarOpen,
    setCurrentPage,
    currentPage,
    onLogout
}) => {

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
    const [taskPage, setTaskPage] = React.useState(1);
    const [labels, setLabels] = React.useState([]);
    const [activeLabelTask, setActiveLabelTask] = React.useState(null);
    const [creatingLabel, setCreatingLabel] = React.useState(false);
    const [newLabelName, setNewLabelName] = React.useState("");
    const [selectedLabel, setSelectedLabel] = React.useState("All");
    const [selectedTask, setSelectedTask] = React.useState(null);
    const [showTaskForm, setShowTaskForm] = React.useState(false);


    const tasksPerPage = 12;

    const getAllTasksList = async () => {
        try {
            const { data } = await taskBaseUrl.get("/tasklists");


            if (data && data.Success) {
                setTaskList(
                    data.taskList.filter((task) => !task.completed)
                );
            }
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

    const handleCompleteTask = async (task) => {
        const confirmed = window.confirm(
            `Mark "${task.taskName}" as completed?`
        );

        if (!confirmed) return;

        try {
            const { data } = await taskBaseUrl.put("/updateTask", {
                ...task,
                completed: true,
                completedAt: new Date().toISOString()
            });

            if (data && data.Success) {
                await getAllTasksList();
            }
        } catch (error) {
            console.log("Error completing task:", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    setShowTaskForm(false);
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
        setShowTaskForm(true);
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

    const indexOfLastTask = taskPage * tasksPerPage;
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

    const handleTaskComplete = async (task) => {
        try {
            const confirmed = window.confirm(
                `Mark "${task.taskName}" as completed?`
            );

            if (!confirmed) {
                return;
            }

            const { data } = await taskBaseUrl.put("/completeTask", {
                id: task._id
            });

            if (data && data.Success) {
                getAllTasksList();
            }

        } catch (error) {
            console.log("Error completing task:", error);
        }
    };

    return (
        <>

            <Navbar
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={onLogout}
                userName={localStorage.getItem("userName")}
            />

            <div className="flex w-full min-h-[calc(100vh-64px)] bg-gray-50">
                {/* LEFT SIDEBAR */}
                <Sidebar
                    labels={labels}
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                    setTaskPage={setTaskPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onLogout={onLogout}
                    onLabelDeleted={(deletedLabelId) => {

                        setLabels((prevLabels) =>
                            prevLabels.filter(
                                (label) =>
                                    String(label._id) !== String(deletedLabelId)
                            )
                        );

                        setTaskList((prevTasks) =>
                            prevTasks.map((task) => {

                                const taskLabelId =
                                    typeof task.label === "object"
                                        ? task.label?._id
                                        : task.label;

                                return String(taskLabelId) === String(deletedLabelId)
                                    ? { ...task, label: null }
                                    : task;
                            })
                        );

                        if (String(selectedLabel) === String(deletedLabelId)) {
                            setSelectedLabel("All");
                            setTaskPage(1);
                        }
                    }}
                />

                <main className="flex-1 min-w-0 px-3 sm:px-5">
                    {/* TASK FORM */}
                    <div className={`${showTaskForm ? "block" : "hidden"} md:block`}>
                        {showTaskForm && (
                            <>
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 mb-4">

                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="">Task Name</label>

                                        <input
                                            type="text"
                                            name="taskName"
                                            value={taskForm.taskName}
                                            onChange={handleFormChange}
                                            placeholder="TaskTitle"
                                            className="w-full border-2 text-gray-800 border-gray-300 rounded-sm outline-none h-8 px-2"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="">Description</label>

                                        <input
                                            type="text"
                                            name="description"
                                            value={taskForm.description}
                                            onChange={handleFormChange}
                                            placeholder="Description"
                                            className="w-full border-2 text-gray-800 border-gray-300 rounded-sm outline-none h-8 px-2"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="">Priority</label>

                                        <select
                                            name="priority"
                                            value={taskForm.priority}
                                            onChange={handleFormChange}
                                            className="w-full border-2 text-gray-800 border-gray-300 rounded-sm outline-none h-8 px-2"
                                        >
                                            <option value="">Select Priority</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="">Due Date</label>

                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={taskForm.dueDate}
                                            onChange={handleFormChange}
                                            className="w-full border-2 text-gray-800 border-gray-300 rounded-sm outline-none h-8 px-2"
                                        />
                                    </div>

                                </div>

                                <div className="w-full flex justify-end mt-4">
                                    <button
                                        type="button"
                                        className="bg-gray-700 text-white h-9 rounded-md cursor-pointer px-4"
                                        onClick={handleSubmit}
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </>
                        )}
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
                    <div className="w-full flex items-center justify-between mt-5 mb-4">

                        {/* PRIORITY FILTER */}
                        <select
                            value={filterPriority}
                            onChange={(e) => {
                                setFilterPriority(e.target.value);
                                setTaskPage(1);
                            }}
                            className="border-2 border-gray-300 rounded-md outline-none h-9 px-2 text-gray-800"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                        {/* ADD TASK */}
                        <button
                            type="button"
                            onClick={() => setShowTaskForm(!showTaskForm)}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
                        >
                            {showTaskForm ? "× Close" : "+ Add Task"}
                        </button>

                    </div>
                    <div className="w-full mt-5">
                        <div className="w-full overflow-visible">
                            <table className="hidden lg:table w-full bg-white divide-y divide-gray-200">
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
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">

                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed || false}
                                                            onChange={() => handleTaskComplete(task)}
                                                            className="h-4 w-4 cursor-pointer"
                                                        />

                                                        <span>
                                                            {task.taskName}
                                                        </span>

                                                    </div>
                                                </td>
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

                                                                        {!(creatingLabel && activeLabelTask === task._id) ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setCreatingLabel(true);
                                                                                    setActiveLabelTask(task._id);
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 cursor-pointer"
                                                                            >
                                                                                + Create Label
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

                            {/* MOBILE TASK CARDS */}

                            <div className="lg:hidden space-y-3">

                                {currentTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => setSelectedTask(task)}
                                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                                    >

                                        <div className="flex items-center gap-3">

                                            {/* COMPLETE CHECKBOX */}
                                            <input
                                                type="checkbox"
                                                checked={task.completed || false}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleTaskComplete(task);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="h-4 w-4 cursor-pointer shrink-0"
                                            />

                                            {/* TASK DETAILS */}
                                            <div className="min-w-0 flex-1">

                                                <p className="font-semibold text-gray-800 truncate">
                                                    {task.taskName}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {task.priority}

                                                    <span className="mx-2">
                                                        •
                                                    </span>

                                                    {task.dueDate?.split("T")[0]}
                                                </p>

                                            </div>

                                            {/* LABEL BUTTON */}
                                            <div className="relative shrink-0">

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setActiveLabelTask(
                                                            activeLabelTask === task._id
                                                                ? null
                                                                : task._id
                                                        );
                                                    }}
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

                                                {/* LABEL POPUP */}
                                                {activeLabelTask === task._id && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col"
                                                    >

                                                        <p className="text-xs font-semibold text-gray-500 px-3 py-2">
                                                            LABELS
                                                        </p>

                                                        <div className="flex flex-col w-full">

                                                            {labels.map((label) => (
                                                                <button
                                                                    key={label._id}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleLabelSelect(task, label._id)
                                                                    }
                                                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition
                ${task.label?._id === label._id ||
                                                                            task.label === label._id
                                                                            ? "bg-blue-100 text-blue-700 font-semibold"
                                                                            : "hover:bg-gray-100"
                                                                        }
            `}
                                                                >
                                                                    {label.name}
                                                                </button>
                                                            ))}

                                                            {!creatingLabel ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCreatingLabel(true);
                                                                        setActiveLabelTask(task._id);
                                                                    }}
                                                                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 cursor-pointer"
                                                                >
                                                                    + Create Label
                                                                </button>

                                                            ) : (

                                                                <div
                                                                    className="border-t border-gray-100 p-2"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >

                                                                    <input
                                                                        type="text"
                                                                        value={newLabelName}
                                                                        onChange={(e) =>
                                                                            setNewLabelName(e.target.value)
                                                                        }
                                                                        placeholder="Label name"
                                                                        autoFocus
                                                                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                                                                    />

                                                                    <div className="flex gap-2 mt-2">

                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleCreateLabel(task);
                                                                            }}
                                                                            className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-md hover:bg-blue-700 cursor-pointer"
                                                                        >
                                                                            Create
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setNewLabelName("");
                                                                                setCreatingLabel(false);
                                                                            }}
                                                                            className="flex-1 bg-gray-100 text-gray-700 text-xs py-1.5 rounded-md hover:bg-gray-200 cursor-pointer"
                                                                        >
                                                                            Cancel
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                            )}

                                                        </div>
                                                    </div>
                                                )}

                                            </div>

                                            {/* ARROW */}
                                            <span className="text-gray-400 text-xl ml-1">
                                                →
                                            </span>

                                        </div>

                                    </div>
                                ))}

                            </div>
                            {/* MOBILE TASK DETAIL POPUP */}
                            {selectedTask && (
                                <div
                                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                                    onClick={() => setSelectedTask(null)}
                                >
                                    <div
                                        className="bg-white w-full max-w-md rounded-xl shadow-xl p-5"
                                        onClick={(e) => e.stopPropagation()}
                                    >

                                        {/* HEADER */}
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {selectedTask.taskName}
                                            </h2>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedTask(null)}
                                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none cursor-pointer"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* DESCRIPTION */}
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Description
                                            </p>

                                            <p className="text-sm text-gray-800">
                                                {selectedTask.description || "No description provided"}
                                            </p>
                                        </div>

                                        {/* PRIORITY */}
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Priority
                                            </p>

                                            <p className="text-sm text-gray-800">
                                                {selectedTask.priority}
                                            </p>
                                        </div>

                                        {/* DUE DATE */}
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Due Date
                                            </p>

                                            <p className="text-sm text-gray-800">
                                                {selectedTask.dueDate?.split("T")[0]}
                                            </p>

                                            <span
                                                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDeadlineBadge(selectedTask.dueDate)}`}
                                            >
                                                {getDeadlineStatus(selectedTask.dueDate)}
                                            </span>
                                        </div>

                                        {/* LABEL */}
                                        <div className="mb-6">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Label
                                            </p>

                                            <p className="text-sm text-gray-800">
                                                {selectedTask.label?.name || "No label"}
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleUpdate(selectedTask);
                                                    setSelectedTask(null);
                                                }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDelete(selectedTask._id);
                                                    setSelectedTask(null);
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )}
                            <div className="flex justify-center items-center gap-4 mt-5">

                                <button
                                    onClick={() => setTaskPage(prev => prev - 1)}
                                    disabled={taskPage === 1}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
                                    Previous
                                </button>

                                <span>
                                    Page {taskPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setTaskPage(prev => prev + 1)}
                                    disabled={taskPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>
                    <footer className="mt-16 border-t border-gray-200 bg-white">

                        {/* ABOUT */}
                        <section
                            id="about-section"
                            className="px-6 py-10 text-center"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">
                                About Tickr
                            </h2>

                            <p className="mt-3 max-w-xl mx-auto text-sm text-gray-500">
                                Tickr is a simple task management workspace designed to
                                help you organize your tasks, stay focused, and keep
                                moving forward.
                                A project made for my IncodeVision Internship.

                            </p>
                        </section>

                        {/* CONTACT */}
                        <section
                            id="contact-section"
                            className="border-t border-gray-100 px-6 py-8 text-center"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">
                                Contact Us
                            </h2>

                            <p className="mt-3 text-sm text-gray-500">
                                Have feedback or found a bug?
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                                hello@tickr.app
                            </p>
                        </section>

                        {/* BOTTOM STRIP */}
                        <div className="border-t border-gray-100 px-6 py-4 text-center">
                            <p className="text-xs text-gray-400">
                                Made with ♥ for better productivity · © 2026 Tickr
                            </p>
                        </div>

                    </footer>
                    <ScrollToTop />
                </main>
            </div>
        </>
    );
}

export default Home;