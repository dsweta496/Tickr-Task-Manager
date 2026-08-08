import React, { useState } from "react";
import Navbar from "./component/Navbar.jsx";
import Home from "./component/Home.jsx";

const App = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Navbar setIsSidebarOpen={setIsSidebarOpen} />

            <Home
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </>
    );
};

export default App;