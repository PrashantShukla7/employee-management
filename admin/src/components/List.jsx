import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const List = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            navigate("/login");
        }
    }, []);

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(undefined);
    const [deleteError, setDeleteError] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        designation: "HR",
        gender: "",
        course: [],
        image: ""
    });

    const columns = [
        {
            name: "Image",
            selector: (row) => (
                <img
                    src={row.image || "/no-image.png"}
                    alt="Employee"
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                    }}
                />
            ),
            sortable: false,
        },
        {
            name: "Name",
            selector: (row) => (
                <span title={row.name}>{row.name}</span>
            ),
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => (
                <span title={row.email}>{row.email}</span>
            ),
            sortable: true,
        },
        {
            name: "Mobile Number",
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: "Designation",
            selector: (row) => row.designation,
            sortable: false,
        },
        {
            name: "Gender",
            selector: (row) => row.gender,
            sortable: false,
        },
        {
            name: "Course",
            selector: (row) => row.course,
            sortable: false,
        },
        {
            name: "Create Date",
            selector: (row) =>
                row.createdAt
                    ? format(new Date(row.createdAt), "dd-MM-yyyy")
                    : "",
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-x-5 items-center">
                    <button
                        className="p-2 rounded-md bg-blue-400 text-white font-semibold flex-shrink-0"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </button>
                    <button
                        className="p-2 rounded-md bg-red-500 text-white font-semibold flex-shrink-0"
                        onClick={() => handleDelete(row)}
                    >
                        Delete
                    </button>
                </div>
            ),
            sortable: false,
        },
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/employee"
                );
                setData(res.data);
                setFilteredData(res.data);
            } catch (error) {
                console.log("error in fetching data", error);
            }
        };
        getData();
    }, []);

    const handleEdit = async (row) => {
        setOpen(true);
        setId(row._id);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/employee/${row._id}`
            );
            const employeeData = response.data;
            
            // Convert course to array if it's not already
            const courseArray = Array.isArray(employeeData.course) 
                ? employeeData.course 
                : [employeeData.course];

                setFormData({
                    name: employeeData.name || "",
                    email: employeeData.email || "",
                    mobile: employeeData.mobile || "",
                    designation: employeeData.designation || "HR",
                    gender: employeeData.gender?.toLowerCase() || "",
                    course: courseArray,
                    image: employeeData.image || "" // Preserve existing image URL
                });
        } catch (error) {
            console.error("Error fetching employee:", error);
            setError("Failed to load employee data");
        }
    };

    const handleDelete = async (row) => {
        try {
            await axios.delete(`http://localhost:3000/api/employee/${row._id}`);
            const newData = data.filter((emp) => emp._id !== row._id);
            setData(newData);
            setFilteredData(newData);
        } catch (error) {
            setDeleteError(
                error.response?.data?.message ||
                    "Something is causing trouble in deleting data"
            );
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Handle checkbox changes
    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            course: checked
                ? [...prev.course, value]
                : prev.course.filter(course => course !== value)
        }));
    };
    console.log(formData)

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        
        if (formData.course.length === 0) {
            setError("Choose at least one course");
            return;
        }

        try {
            let imageUrl = formData.image;
            
            
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "uploads");
                
                const uploadRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
                    formData
                );
                imageUrl = uploadRes.data.url;
            }

            await axios.put(`http://localhost:3000/api/employee/${id}`, {
                ...formData,
                image: imageUrl || formData.image
            });

            const res = await axios.get("http://localhost:3000/api/employee");
            setData(res.data);
            setFilteredData(res.data);
            setOpen(false);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleFilter = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const newData = data.filter((row) =>
            row.name.toLowerCase().includes(searchValue)
        );
        setFilteredData(newData);
    };

    return (
        <>
            <Navbar />
            <div className="px-[10%] py-10 bg-zinc-50 min-h-screen">
                <h1 className="text-center text-2xl font-bold">
                    Employees list
                </h1>
                {deleteError && (
                    <p className="text-red-600 text-center">{deleteError}</p>
                )}
                <div className="w-full flex justify-end items-center mb-3">
                    <h2 className="mr-2">Search : </h2>
                    <input
                        type="text"
                        className="border-2 rounded border-black p-2 "
                        onChange={handleFilter}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    fixedHeader
                    highlightOnHover
                />

                {open && (
                    <div className="mt-10">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col w-[40%] ml-[50%] translate-x-[-50%] bg-zinc-100 p-5 rounded"
                        >
                            {error && (
                                <p className="text-red-600 my-3 text-center">
                                    {error}
                                </p>
                            )}
                            
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="p-2 outline-2 outline-blue-600 my-2"
                                onChange={handleChange}
                                value={formData.name}
                                required
                            />

                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="p-2 outline-2 outline-blue-600 my-2"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />

                            <label htmlFor="mobile">Mobile no</label>
                            <input
                                type="tel"
                                name="mobile"
                                id="mobile"
                                className="p-2 outline-2 outline-blue-600 my-2"
                                onChange={handleChange}
                                value={formData.mobile}
                                required
                            />

                            <label htmlFor="designation">Designation</label>
                            <select
                                name="designation"
                                id="designation"
                                className="p-2 outline-2 outline-blue-600 my-2"
                                onChange={handleChange}
                                value={formData.designation}
                                required
                            >
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales</option>
                            </select>

                            <label>Gender</label>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    id="gender"
                                    value="male"
                                    onChange={handleChange}
                                    checked={formData.gender === "male"}
                                    required
                                />
                                <label htmlFor="male" className="ml-2">Male</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    id="gender"
                                    value="female"
                                    onChange={handleChange}
                                    checked={formData.gender === "female"}
                                    required
                                />
                                <label htmlFor="female" className="ml-2">Female</label>
                            </div>

                            <label>Course</label>
                            <div>
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="MCA"
                                    onChange={handleCourseChange}
                                    checked={formData.course.includes('MCA')}
                                />
                                <label className="ml-2">MCA</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BCA"
                                    onChange={handleCourseChange}
                                    checked={formData.course.includes('BCA')}
                                />
                                <label className="ml-2">BCA</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BSC"
                                    onChange={handleCourseChange}
                                    checked={formData.course.includes('BSC')}
                                />
                                <label className="ml-2">BSC</label>
                            </div>

                            <label htmlFor="image" className="mt-4">Upload image</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/png, image/jpg"
                                onChange={(e) => setFile(e.target.files[0])}
                            />

                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-green-400 text-white font-semibold mt-4"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default List;