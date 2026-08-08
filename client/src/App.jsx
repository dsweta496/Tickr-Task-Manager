import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar.jsx";
import Home from "./component/Home.jsx";
import CompletedTasks from "./component/CompletedTasks.jsx";
import { labelBaseUrl } from "./axiosInstance.js";

const App = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("home");
    const [labels, setLabels] = useState([]);

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

    return (
        <>
            <Navbar setIsSidebarOpen={setIsSidebarOpen} />

            {currentPage === "home" ? (
                <Home
                    labels={labels}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setCurrentPage={setCurrentPage}
                />
            ) : (
                <CompletedTasks
                    labels={labels}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </>
    );
};

export default App;