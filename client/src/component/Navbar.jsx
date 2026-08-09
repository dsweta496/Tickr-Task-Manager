import React from "react";

const Navbar = ({ setIsSidebarOpen, onLogout, userName }) => {

    // Get initials from the user's name
    const initials = userName
        ? userName
            .split(" ")
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    return (
        <nav className="sticky top-0 z-50 w-full h-16 border-b border-tickr-rose/50 bg-tickr-blush flex items-center px-4 sm:px-6">

            {/* MOBILE HAMBURGER */}
            <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-2xl text-tickr-mauve mr-3 cursor-pointer"
            >
                ☰
            </button>

            {/* LOGO + FLORAL DETAIL */}
            <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-[30px] text-tickr-dark md:ml-4 tracking-tight">
                    TICKR
                </h1>

            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:flex ml-auto items-center gap-3">

                {/* USER NAME */}
                <span className="text-xs sm:text-sm font-medium text-tickr-mauve">
                    {userName}
                </span>

                {/* INITIALS CIRCLE */}
                <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-tickr-mauve text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0"
                    title={userName}
                >
                    {initials}
                </div>

                {/* LOGOUT */}
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border border-tickr-mauve text-tickr-primary text-xs sm:text-sm font-medium hover:bg-tickr-primary hover:text-white transition-all duration-200 cursor-pointer"
                >
                    {/* Logout icon */}
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 5H6C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H10"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                        <path
                            d="M13 8L17 12L13 16"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 12H17"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>

                    <span>Logout</span>
                </button>

            </div>

        </nav>
    );
};

export default Navbar;