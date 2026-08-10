import React from "react";
import {
    MdLabelOutline,
    MdChecklist,
    MdCheckCircleOutline,
    MdHome,
    MdInfoOutline,
    MdMailOutline,
    MdLogout,
    MdClose
} from "react-icons/md";
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
    onLabelDeleted,
    onLogout
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
                border-r border-tickr-rose/50
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
                    ? "bg-tickr-blush text-tickr-dark font-medium"
                    : "hover:bg-tickr-blush"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <MdChecklist size={18} />
                    <span>All Tasks</span>
                </div>
            </button>

            {/* LABELS */}
            <p className="text-xs font-semibold text-tickr-mauve px-3 mb-2">
                LABELS
            </p>
            {labels.map((label) => (
                <div
                    key={label._id}
                    className={`w-full flex items-center rounded-md text-sm ${selectedLabel === label._id
                        ? "bg-tickr-blush text-tickr-primary font-medium"
                        : "hover:bg-tickr-blush"
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
                        className="px-2 py-2 text-tickr-mauve hover:text-red-500 cursor-pointer"
                        title="Delete label"
                    >
                        ×
                    </button>

                </div>
            ))}

            {/* COMPLETED TASKS */}
            <div className="border-t border-tickr-rose/50 mt-5 pt-4 flex flex-col gap-1">

                <button
                    type="button"
                    onClick={() => {
                        setCurrentPage("completed");
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${currentPage === "completed"
                        ? "bg-tickr-blush text-tickr-primary font-medium"
                        : "hover:bg-tickr-blush"
                        }`}                >
                    Completed Tasks
                </button>

            </div>

            {/* NAVIGATION */}
            <div className="border-t border-tickr-rose/50 mt-5 pt-4 flex flex-col gap-1">

                <button
                    type="button"
                    onClick={() => {
                        setCurrentPage("home");
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${currentPage === "home"
                        ? "bg-tickr-blush text-tickr-dark font-medium"
                        : "hover:bg-tickr-blush"
                        }`}                >
                    <div className="flex items-center gap-2">
                        <MdHome size={18} />
                        <span>Home</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        document.getElementById("about-section")?.scrollIntoView({
                            behavior: "smooth"
                        });
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-tickr-blush cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <MdInfoOutline size={18} />
                        <span>About</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        document.getElementById("contact-section")?.scrollIntoView({
                            behavior: "smooth"
                        });
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-tickr-blush cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <MdMailOutline size={18} />
                        <span>Contact</span>
                    </div>
                </button>

            </div>
            <img
                src="/foliage.png"
                alt=""
                className="absolute bottom-0 left-0 w-60 h-60 opacity-80 object-contain pointer-events-none select-none z-0"
            />
            <div className="md:hidden relative z-10 mt-8 border-t border-tickr-rose/50 pt-5 pb-2">
                {/* PROFILE */}
                <div className="flex flex-col items-center text-center px-2">

                    {/* INITIALS */}
                    <div className="w-12 h-12 rounded-full bg-tickr-mauve text-white flex items-center justify-center text-sm font-semibold">
                        {localStorage.getItem("userName")
                            ? localStorage
                                .getItem("userName")
                                .split(" ")
                                .filter(Boolean)
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"
                        }
                    </div>

                    {/* NAME */}
                    <p className="mt-2 text-sm font-semibold text-tickr-ink">
                        {localStorage.getItem("userName") || "User"}
                    </p>

                    {/* EMAIL */}
                    <p className="text-xs text-tickr-mauve mt-0.5 break-all">
                        {localStorage.getItem("userEmail") || "user@example.com"}
                    </p>

                </div>

                {/* LOGOUT */}
                <button
                    type="button"
                    onClick={onLogout}
                    className="mt-4 mx-3 w-[calc(100%-1.5rem)] flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-tickr-mauve text-tickr-primary text-sm font-medium hover:bg-tickr-primary hover:text-white transition-all duration-200 cursor-pointer"
                >
                    <MdLogout size={18} />
                    <span>Logout</span>
                </button>


            </div>

        </aside>
    );
};



export default Sidebar;