import React from "react";

const Navbar = ({ setIsSidebarOpen }) => {
    return (
        <nav className="sticky top-0 z-50 w-full h-16 border-b border-gray-200 bg-white flex items-center px-4 sm:px-6">

            {/* MOBILE HAMBURGER */}
            <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-2xl text-gray-700 mr-3 cursor-pointer"
            >
                ☰
            </button>

            {/* LOGO */}
            <div className="font-bold text-xl text-gray-800">
                <h1 className="font-bold text-lg md:text-[30px] text-gray-800 md:ml-4">
           TICKR
</h1>
            </div>


        </nav>
    );
};

export default Navbar;