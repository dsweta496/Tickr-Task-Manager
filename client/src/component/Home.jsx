import React, { useEffect } from "react";
import { taskBaseUrl } from "../axiosInstance.js";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const Home = () => {
    console.log("HOME COMPONENT LOADED");
    const [taskForm, setTaskForm] = React.useState({
        taskName: "",
        description: "",
        priority: "",
        dueDate: ""
    });

    const [taskList, setTaskList] = React.useState([]);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [sortBy, setSortBy] = React.useState("");
    const [filterPriority, setFilterPriority] = React.useState("All");
    
    const getAllTasksList = async () => {
        try{
            const {data} = await taskBaseUrl.get("/tasklists");
            setTaskList(data.taskList);
        }catch(error){
            console.log("Error fetching task list:", error);
        }};

    React.useEffect(() => {
        getAllTasksList();
    }, []); 

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
    try {

        if (!taskForm.taskName || !taskForm.description || !taskForm.priority || !taskForm.dueDate) {
            alert("All fields are required");
            return;
        }

        if (isUpdating) {

            const {data} = await taskBaseUrl.put("/updateTask", taskForm);

            if (data && data.Success) {
                alert(data.message);

                setTaskForm({
                    taskName: "",
                    description: "",
                    priority: "",
                    dueDate: ""
                });

                setIsUpdating(false);
                getAllTasksList();
            }

        } else {

            const {data} = await taskBaseUrl.post("/addTask", taskForm);

            if (data && data.Success) {
                alert(data.message);

                setTaskForm({
                    taskName: "",
                    description: "",
                    priority: "",
                    dueDate: ""
                });

                getAllTasksList();
            }
        }

    } catch(error) {
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
            const {data} = await taskBaseUrl.post("/deleteTask", {Id: taskId});
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
        dueDate: data.dueDate
    });
    setIsUpdating(true);
};

const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
};

const filteredTasks = taskList.filter((task) => {
    if (filterPriority === "All") {
        return true;
    }

    return task.priority === filterPriority;
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

    return(
        <div className="w-full px-5 min-h-[calc(100vh-60px)]">
            <div className="w-full grid grid-cols-4 gap-5 items-center justify-center mt-5 my-4">
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="">Task Name</label>
                    <input type="text" name="taskName" value={taskForm.taskName} onChange={handleFormChange} placeholder="TaskTitle" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2 " />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="">Description</label>
                    <input type="text" name="description" value={taskForm.description} onChange={handleFormChange} placeholder="Description" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2"/>
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
                    <input type="date" name="dueDate" value={taskForm.dueDate} onChange={handleFormChange} placeholder="Due Date" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2"/>
                </div>
            </div>
            <div className="w-full flex justify-end">
                <button className="bg-gray-700 text-white h-9 rounded-md cursor-pointer w-22" onClick={handleSubmit}>
                    SUBMIT
                </button>
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-300 rounded-md h-9 px-2"
            >
                <option value="">Sort By</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>   
            </select>
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
                            {sortedTasks.map((task, index) => {return (
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
                                            <button className="bg-blue-500 text-white h-8 rounded-md cursor-pointer w-8 flex items-center justify-center" onClick={() => handleUpdate(task)}>
                                                <MdEdit size={20} />
                                            </button>
                                                                
                                            <button className="bg-red-500 text-white h-8 rounded-md cursor-pointer w-8 flex items-center justify-center" onClick={() => handleDelete(task._id)}>
                                                <MdDeleteForever size={20} />
                                            </button>
                                        </div>
                                    </td>
                            </tr>)})}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Home;