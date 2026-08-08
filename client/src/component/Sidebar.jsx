import React from "react";
import { MdLabelOutline } from "react-icons/md";

const Sidebar = ({
    labels,
    selectedLabel,
    setSelectedLabel,
    setTaskPage,
    setCurrentPage,
    currentPage,
    isSidebarOpen,
    setIsSidebarOpen
}) => {

    return (
        <aside
            className={`
                fixed md:static
                top-0 left-0
                z-50
                w-52
                min-h-[calc(100vh-60px)]
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
                    setCurrentPage("home");
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
                <button
                    key={label._id}
                    onClick={() => {
                        setSelectedLabel(label._id);
                        setTaskPage(1);
                        setIsSidebarOpen(false);
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

            {/* COMPLETED TASKS */}
            <div className="border-t border-gray-200 mt-5 pt-4 flex flex-col gap-1">

                <button
                    type="button"
                    onClick={() => {
                        setCurrentPage("completed");
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
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
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
                    Home
                </button>

                <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
                    About
                </button>

                <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                >
                    Contact
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;