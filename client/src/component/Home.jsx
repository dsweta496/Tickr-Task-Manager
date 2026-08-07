import React, { useEffect } from "react";
import { taskBaseUrl } from "../axiosInstance.js";

const Home = () => {
    console.log("HOME COMPONENT LOADED");
    const [taskForm, setTaskForm] = React.useState({
        taskName: "",
        description: "",
        priority: "",
        dueDate: ""
    });

    const [taskList, setTaskList] = React.useState([]); 
    
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
        try{
            if(!taskForm.taskName || !taskForm.description || !taskForm.priority || !taskForm.dueDate){
                alert("All fields are required");
                return;
            }

            const {data} = await taskBaseUrl.post("/addTask", taskForm);
            if(data && data.Success){
                alert(data.message);
                setTaskForm({
                    taskName: "",
                    description: "",
                    priority: "",
                    dueDate: ""
                });
            }
            console.log("Task submitted successfully:", data); 
        }catch(error){
            console.log("Error submitting task:", error);
        }
    };
    
    console.log("Task Form Data:", taskForm);

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
                    <input type="text" name="priority" value={taskForm.priority} onChange={handleFormChange} placeholder="Priority" className="w-full border-2 text-grey-800 border-gray-300 rounded-sm outline-none h-8 px-2"/>
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
                            {taskList.map((task, index) => {return (
                                <tr className="Hover:bg-gray-200" key={index}>
                                    <td className="px-6 py-3 whitespace-nowrap">{task.taskName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">{task.description}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">{task.priority}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">{task.dueDate}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                    <button className="bg-blue-500 text-white h-8 rounded-md cursor-pointer w-20">Edit</button>
                                    <button className="bg-red-500 text-white h-8 rounded-md cursor-pointer w-20 ml-2">Delete</button>
                                </td>
                            </tr>)})}
                            
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Home;