import React from "react";
import { MdLabelOutline } from "react-icons/md";
import { labelBaseUrl } from "../axiosInstance.js";

const Sidebar = ({
    labels,
    selectedLabel,
    setSelectedLabel,
    setTaskPage,
    setCurrentPage,
    currentPage,
    isSidebarOpen,
    setIsSidebarOpen,
    onLabelDeleted
}) => {

    const handleDeleteLabel = async (labelId) => {
        try {
            const confirmed = window.confirm(
                "Are you sure you want to delete this label?"
            );

            if (!confirmed) {
                return;
            }

            const { data } = await labelBaseUrl.delete(
                `/deletelabel/${labelId}`
            );

            if (data && data.Success) {


                if (onLabelDeleted) {
                    onLabelDeleted(labelId);
                }


                if (String(selectedLabel) === String(labelId)) {
                    setSelectedLabel("All");
                    setTaskPage(1);
                    setCurrentPage("home");
                }


                setIsSidebarOpen(false);
            }

        } catch (error) {
            console.log("Error deleting label:", error);
        }
    };

    return (
        <aside
            className={`
                fixed md:sticky
                top-0 md:top-16
                left-0
                z-[60] md:z-40
                w-52
                h-screen md:h-[calc(100vh-64px)]
                overflow-y-auto
                bg-white
                border-r border-gray-200
                px-4 py-5
                transform transition-transform duration-300
                ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full md:translate-x-0"
                }
            `}
        >

            {/* MOBILE HEADER */}
            <div className="flex items-center justify-between mb-4 md:hidden">

                <h2 className="font-bold text-lg text-gray-800">
                    TICKR
                </h2>

                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-2xl text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                    ×
                </button>

            </div>

            {/* ALL TASKS */}
            <button
                onClick={() => {
                    setSelectedLabel("All");
                    setTaskPage(1);
                    setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm mb-3 cursor-pointer ${selectedLabel === "All"
                    ? "bg-gray-200 font-medium"
                    : "hover:bg-gray-100"
                    }`}
            >
                All Tasks
            </button>

            {/* LABELS */}
            <p className="text-xs font-semibold text-gray-400 px-3 mb-2">
                LABELS
            </p>
            {labels.map((label) => (
                <div
                    key={label._id}
                    className={`w-full flex items-center rounded-md text-sm ${selectedLabel === label._id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                        }`}
                >

                    {/* LABEL */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedLabel(label._id);
                            setTaskPage(1);
                            setIsSidebarOpen(false);
                        }}
                        className="flex-1 flex items-center gap-2 text-left px-3 py-2 cursor-pointer min-w-0"
                    >
                        <MdLabelOutline size={17} />

                        <span className="truncate">
                            {label.name}
                        </span>
                    </button>

                    {/* DELETE LABEL */}
                    <button
                        type="button"
                        onClick={() => handleDeleteLabel(label._id)}
                        className="px-2 py-2 text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Delete label"
                    >
                        ×
                    </button>

                </div>
            ))}

            {/* COMPLETED TASKS */}
            <div className="border-t border-gray-200 mt-5 pt-4 flex flex-col gap-1">

                <button
                    type="button"
                    onClick={() => {
                        setCurrentPage("completed");
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${currentPage === "completed"
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                        }`}                >
                    Completed Tasks
                </button>

            </div>

            {/* NAVIGATION */}
            <div className="border-t border-gray-200 mt-5 pt-4 flex flex-col gap-1">

                <button
                    type="button"
                    onClick={() => {
                        setCurrentPage("home");
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${currentPage === "home"
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                        }`}                >
                    Home
                </button>

                <button
                    type="button"
                    onClick={() => {
                        document.getElementById("about-section")?.scrollIntoView({
                            behavior: "smooth"
                        });
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
                    About
                </button>

                <button
                    type="button"
                    onClick={() => {
                        document.getElementById("contact-section")?.scrollIntoView({
                            behavior: "smooth"
                        });
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
                    Contact
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;