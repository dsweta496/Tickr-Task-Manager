import React from "react";
import { taskBaseUrl, labelBaseUrl } from "../axiosInstance.js";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const CompletedTasks = ({
    isSidebarOpen,
    setIsSidebarOpen,
    setCurrentPage,
    currentPage,
    onLogout
}) => {

    const [completedTasks, setCompletedTasks] = React.useState([]);
    const [selectedTask, setSelectedTask] = React.useState(null);

    const [labels, setLabels] = React.useState([]);
    const [selectedLabel, setSelectedLabel] = React.useState("All");
    const [taskPage, setTaskPage] = React.useState(1);


    // COMPLETED TASKS
    const getCompletedTasks = async () => {
        try {
            const { data } = await taskBaseUrl.get("/completedTasks");

            if (data && data.Success) {

                console.log(
                    "COMPLETED TASKS:",
                    data.taskList
                );

                data.taskList.forEach((task) => {
                    console.log(
                        "TASK:",
                        task.taskName,
                        "| LABEL:",
                        task.label,
                        "| LABEL TYPE:",
                        typeof task.label
                    );
                });

                setCompletedTasks(data.taskList);
            }

        } catch (error) {
            console.log(
                "Error fetching completed tasks:",
                error
            );
        }
    };


    //GET LABELS
    const getAllLabels = async () => {
        try {
            const { data } = await labelBaseUrl.get("/labels");

            if (data && data.Success) {

                console.log(
                    "COMPLETED PAGE LABELS:",
                    data.labels
                );

                data.labels.forEach((label) => {
                    console.log(
                        "LABEL:",
                        label.name,
                        "| ID:",
                        label._id,
                        "| ID TYPE:",
                        typeof label._id
                    );
                });

                setLabels(data.labels);
            }

        } catch (error) {
            console.log(
                "Error fetching labels:",
                error
            );
        }
    };


    React.useEffect(() => {
        getCompletedTasks();
        getAllLabels();
    }, []);


    // GROUP TASKS 
    const groupedTasks = completedTasks.reduce((groups, task) => {

        if (!task.completedAt) {
            return groups;
        }


        if (selectedLabel === "All") {

        } else {

            const taskLabelId =
                typeof task.label === "object"
                    ? task.label?._id
                    : task.label;


            if (String(taskLabelId) !== String(selectedLabel)) {
                return groups;
            }
        }

        const date = new Date(task.completedAt);

        const monthYear = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }

        groups[monthYear].push(task);

        return groups;

    }, {});


    return (
        <>
            <Navbar
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={onLogout}
            />
            <div className="flex w-full min-h-[calc(100vh-64px)] bg-gray-50">

                {/* SIDEBAR */}

                <Sidebar
                    labels={labels}
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                    setTaskPage={setTaskPage}
                    setCurrentPage={setCurrentPage}
                    currentPage="completed"
                    isSidebarOpen={isSidebarOpen}
                    onLogout={onLogout}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onLabelDeleted={(deletedLabelId) => {
                        setCompletedTasks((prevTasks) =>
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

                        setLabels((prevLabels) =>
                            prevLabels.filter(
                                (label) =>
                                    String(label._id) !== String(deletedLabelId)
                            )
                        );

                        if (String(selectedLabel) === String(deletedLabelId)) {
                            setSelectedLabel("All");
                            setTaskPage(1);
                        }
                    }}
                />


                {/* MAIN CONTENT */}

                <main className="flex-1 min-w-0 p-5">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Completed Tasks
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Your completed tasks
                    </p>


                    <div className="mt-6">

                        {Object.keys(groupedTasks).length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                                No completed tasks found.
                            </div>

                        ) : (

                            <div className="flex flex-col gap-8">

                                {Object.entries(groupedTasks).map(
                                    ([monthYear, tasks]) => (

                                        <div key={monthYear}>

                                            <h2 className="text-lg font-bold text-gray-800 mb-3">
                                                {monthYear}
                                            </h2>


                                            <div className="flex flex-col gap-3">

                                                {tasks.map((task) => (

                                                    <button
                                                        key={task._id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedTask(task)
                                                        }
                                                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            {/* COMPLETED ICON */}

                                                            <span className="text-green-600 text-lg">
                                                                ✓
                                                            </span>


                                                            {/* TASK DETAILS */}

                                                            <div>

                                                                <p className="font-semibold text-gray-800">
                                                                    {task.taskName}
                                                                </p>


                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Completed on{" "}
                                                                    {task.completedAt?.split(
                                                                        "T"
                                                                    )[0]}
                                                                </p>


                                                                {/* LABEL */}

                                                                {task.label?.name && (
                                                                    <p className="text-xs text-blue-600 mt-1">
                                                                        {task.label.name}
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </button>

                                                ))}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* TASK DETAILS MODAL */}

                    {selectedTask && (

                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                            <div className="bg-white rounded-lg w-full max-w-md p-5">

                                {/* MODAL HEADER */}

                                <div className="flex items-center justify-between mb-5">

                                    <h2 className="text-lg font-bold text-gray-800">
                                        {selectedTask.taskName}
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedTask(null)
                                        }
                                        className="text-gray-500 hover:text-gray-800 text-xl"
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* DETAILS */}

                                <div className="space-y-3">

                                    {/* DESCRIPTION */}

                                    <div>

                                        <p className="text-xs text-gray-500 uppercase">
                                            Description
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedTask.description ||
                                                "No description"}
                                        </p>

                                    </div>


                                    {/* PRIORITY */}

                                    <div>

                                        <p className="text-xs text-gray-500 uppercase">
                                            Priority
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedTask.priority}
                                        </p>

                                    </div>


                                    {/* DUE DATE */}

                                    <div>

                                        <p className="text-xs text-gray-500 uppercase">
                                            Due Date
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedTask.dueDate?.split(
                                                "T"
                                            )[0]}
                                        </p>

                                    </div>


                                    {/* LABEL */}

                                    <div>

                                        <p className="text-xs text-gray-500 uppercase">
                                            Label
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedTask.label?.name ||
                                                "No label"}
                                        </p>

                                    </div>


                                    {/* COMPLETED DATE */}

                                    <div>

                                        <p className="text-xs text-gray-500 uppercase">
                                            Completed On
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedTask.completedAt?.split(
                                                "T"
                                            )[0]}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                )}
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

                </main>

            </div>
        </>
    );
};

export default CompletedTasks;