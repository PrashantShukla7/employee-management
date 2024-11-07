import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Form  from "./Form";
import { useNavigate } from "react-router-dom";

const NewEmployee = ({name}) => {
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
            <Form/>
        </>
    );
};

export default NewEmployee;
