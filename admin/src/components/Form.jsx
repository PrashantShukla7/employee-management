import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Form = () => {
    const [info, setInfo] = useState({});
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);
    const [file, setFile] = useState("")
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };


    const handleSelect = (e) => {
        if (e.target.checked) {
            setCourse((prev) => [...prev, e.target.value]);
        } else {
            setCourse((prev) => prev.filter((course) => course !== e.target.value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if(info.mobile.length != 10)  return setError('Enter a valid mobile number')
        if(course.length <= 0)     return setError('Choose atlease one course')

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "uploads")
        try{
            const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, data);
            const {url} = uploadRes.data
            await axios.post("http://localhost:3000/api/employee", {
                ...info,
                course: course,
                image: url
            });
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-center text-xl font-semibold">
                Create Employee
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-[40%] ml-[50%] translate-x-[-50%] bg-zinc-100 p-5 rounded"
            >
                {error && (
                    <p className="text-red-600 my-3 text-center">{error}</p>
                )}
                <label htmlFor="name">Name <span className="text-red-500 text-lg">*</span></label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="p-2 outline-2 outline-blue-600 my-2"
                    onChange={handleChange}
                    autoFocus
                    required
                />

                <label htmlFor="email">Email <span className="text-red-500 text-lg">*</span></label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="p-2 outline-2 outline-blue-600 my-2"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="mobile">Mobile number <span className="text-red-500 text-lg">*</span></label>
                <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    className="p-2 outline-2 outline-blue-600 my-2"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="designation">Designation <span className="text-red-500 text-lg">*</span></label>
                <select
                    name="designation"
                    id="designation"
                    className="p-2 outline-2 outline-blue-600 my-2"
                    onChange={handleChange}
                    required
                >
                    <option value="HR" id="HR">
                        HR
                    </option>
                    <option value="Manager" id="Manager">
                        Manager
                    </option>
                    <option value="Sales" id="Sales">
                        Sales
                    </option>
                </select>

                <label htmlFor="gender">Gender <span className="text-red-500 text-lg">*</span></label>
                <div>
                    <input
                        type="radio"
                        name="gender"
                        id="gender"
                        value="Male"
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="male">Male</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="gender"
                        id="gender"
                        value="Female"
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="female">Female</label>
                </div>

                <label htmlFor="course">Course <span className="text-red-500 text-lg">*</span></label>
                <div>
                    <input
                        type="checkbox"
                        name="course"
                        id="course"
                        value="MCA"
                        onChange={handleSelect}
                    />
                    <label htmlFor="MCA">MCA</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="course"
                        id="course"
                        value="BCA"
                        onChange={handleSelect}
                    />
                    <label htmlFor="MCA">BCA</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="course"
                        id="course"
                        value="BSC"
                        onChange={handleSelect}
                    />
                    <label htmlFor="MCA">BSC</label>
                </div>

                <label htmlFor="image"> Upload image <span className="text-red-500 text-lg">*</span></label>
                <input type="file" id="image" accept="image/png, image/jpg" onChange={(e) => setFile(e.target.files[0])} required/>

                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-400 text-white font-semibold mt-4"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form;
