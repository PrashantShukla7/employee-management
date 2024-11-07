import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem("username");
        await axios.post('http://localhost:3000/api/auth/logout', {}, {withCredentials: true})
        navigate('/login')
    };
    return (
        <nav className="flex justify-around items-center h-[10vh] bg-zinc-300">
            <div>
                <Link to="/"> Home </Link>
            </div>
            <div className="flex flex-shrink-0 gap-x-[10%] whitespace-nowrap">
                <Link to="/employees"> Employee list </Link>
                <Link to="/new/employee"> Create Employee </Link>
            </div>
            <div className="flex flex-shrink-0 whitespace-nowrap">
                {username ? (
                    <Link to="/"> {username} </Link>
                ) : (
                    <div className="flex gap-x-5">
                        <Link to="/login"> Login </Link>
                        <Link to="/register"> Register </Link>
                    </div>
                )}
                <button onClick={handleLogout} className="ml-[35%]">
                    {" "}
                    Logout{" "}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
