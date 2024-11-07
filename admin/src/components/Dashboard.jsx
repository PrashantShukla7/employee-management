import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
      const username = localStorage.getItem("username");
      console.log(username)
        if (!username) {
            navigate("/login");
        }
    }, []);
    return (
        <>
            <Navbar />
            <div className="h-[90vh]">
                <h1 className="text-center mt-10 text-xl font-semibold">
                    Welcome to admin panel
                </h1>
            </div>
        </>
    );
};

export default Dashboard;
