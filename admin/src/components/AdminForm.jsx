import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminForm = ({ route }) => {
    const [credentials, setCredentials] = useState({});
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:3000/api/auth/${route}`,
                credentials,
                { withCredentials: true }
            );
            localStorage.setItem("username", credentials.username);
            if(route === 'login')
            navigate("/");
          else  navigate('/login')
        } catch (error) {
          setError(error.response?.data?.message || "Something went wrong")
        }
    };
    return (
        <div className="h-screen bg-zinc-50">
            <h1 className="text-2xl text-center font-bold py-5 capitalize">Admin {route}</h1>
            <form className="bg-zinc-100 w-[40%] p-10 ml-[50%] translate-x-[-50%] mt-5 rounded">
              {error && <p className="text-red-600 text-center my-3">{error}</p>}
                <label htmlFor="username">Username :</label>
                <br />
                <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    className="w-full p-2 my-2 rounded outline-2 outline-blue-400"
                    required
                />
                <br />
                <label htmlFor="password">Password:</label>
                <br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    className="w-full p-2 my-2 rounded outline-2 outline-blue-400"
                    required
                />
                <br />
                <button type="submit" className="capitalize bg-green-400 px-4 py-2 rounded font-semibold mt-3" onClick={handleSubmit}>{route}</button>
                {route === "login" ? (
                    <p className="text-center my-3">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600"> Sign up</Link>
                    </p>
                ) : (
                    <p className="text-center my-3">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600"> Log in</Link>
                    </p>
                )}
            </form>
        </div>
    );
};

export default AdminForm;
