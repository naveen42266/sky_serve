import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import TaskIcon from '@mui/icons-material/Task';
import { useRouter } from 'next/router';
import { useUserDetails } from '@/context/userDetails';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
interface HeaderProps {
    setOpen: (value: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ setOpen }) => {
    const { user, updateUser } = useUserDetails();

    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
        updateUser(null);
        // navigate("/signIn"); 
        toast.success('User logged out successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };


    return (
        <div className="p-4 text-black">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <div className="text-3xl font-bold flex" onClick={() => router.push('/')}>
                    SpaceXY
                </div>
                <div className='flex flex-row justify-end gap-4 items-center'>
                    {/* <button
                        onClick={toggleTheme}
                        className={`px-1 pb-1 ${!isDarkMode ? " text-white hover:bg-gray-100 hover:text-black" : ' text-white hover:bg-slate-700 hover:text-white'}  rounded transition-colors duration-300`}
                    >
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </button> */}
                    {user ? <div className='flex flex-row justify-end gap-4 items-center cursor-pointer hover:bg-slate-200 hover:text-gray-900 rounded-full px-3 py-2' onClick={() => setOpen(true)}>
                        {/* <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-500 transition-colors duration-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </button> */}
                        <Avatar
                            src={user?.profilePicture || undefined} // Use the profile picture if available
                            sx={{ height: 40, width: 40, margin: "0 auto" }}
                            alt={`${user?.firstName || "User"} Avatar`}
                        >
                            {!user?.profilePicture && `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
                        </Avatar>

                        <div className='flex justify-between items-center space-x-1 capitalize'>
                            <div>{user?.firstName}</div>
                            <div>{user?.lastName}</div>
                            <ArrowForwardIosIcon />
                        </div>
                        {/* <AccountCircleIcon fontSize='medium' onClick={() => setOpen(true)} />  */}

                    </div> :
                        <button className={`px-3 pb-2 pt-1 font-semibold bg-gray-100 text-black  rounded transition-colors duration-300`} onClick={() => router.push('/signIn')}>Login</button>}
                    {/* <AccountCircleIcon fontSize='medium' onClick={setOpen} /> */}
                </div>
            </div>
        </div>
    )

}

export default Header;