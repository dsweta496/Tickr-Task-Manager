import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar.jsx";
import Home from "./component/Home.jsx";
import CompletedTasks from "./component/CompletedTasks.jsx";
import { labelBaseUrl } from "./axiosInstance.js";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";

const App = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("home");
    const [labels, setLabels] = useState([]);
    const [showSignup, setShowSignup] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    useEffect(() => {
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

        getAllLabels();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        setIsAuthenticated(false);
        setCurrentPage("home");
    };

    return (
        !isAuthenticated ? (
            showSignup ? (
                <Signup setShowLogin={() => setShowSignup(false)} />
            ) : (
                <Login
                    setShowSignup={setShowSignup}
                    setIsAuthenticated={setIsAuthenticated}
                />
            )
        ) : (
            currentPage === "home" ? (
                <Home
                    labels={labels}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    onLogout={handleLogout}
                />
            ) : (
                <CompletedTasks
                    labels={labels}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    onLogout={handleLogout}
                />
            )
        )
    );
};

export default App;