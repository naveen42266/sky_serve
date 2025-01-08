import { useUserDetails } from "@/context/userDetails";
import { Avatar, Card } from "@mui/material";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

const Profile = () => {
    const { user, updateUser } = useUserDetails();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Handle dialog open
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    const avatarUrl =
        user?.gender === "Male"
            ? "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
            : user?.gender === "Female"
                ? "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
                : user?.profilePicture || "";

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
        updateUser(null);
        handleClose();
        // setTimeout(() => {
        router.push("/");
        // }, 3000);
        toast.success('User logged out successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div>
            {/* className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center py-6" */}
            <ToastContainer />
            <div className={`min-h-screen flex flex-col bg-gray-100 text-gray-900' transition-colors duration-300 hidden-scrollbar`}>
                <header className='sticky top-0 left-0 right-0 z-10 px-4 py-6 bg-primary bg-white shadow-md'>
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="text-3xl font-bold flex" onClick={() => router.push('/')}>
                            SpaceXY
                        </div>
                    </div>
                </header>
                <main className='container mx-auto px-4 py-6'>
                    <div className="text-lg pb-4 cursor-pointer"><span className="hover:text-slate-500" onClick={() => router.push('/')}>Home</span> {'>'} <span className="hover:text-slate-500">User</span></div>
                    <Card className="p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6 bg-white">

                        {/* Profile Section */}
                        <div className="md:w-[50%]">
                            <div className=" bg-slate-200 flex flex-col items-center py-6">
                                {/* Centered Avatar */}
                                <div className="flex justify-center items-center">
                                    <div className="bg-slate-300 rounded-full p-5">
                                        <Avatar
                                            src={avatarUrl}
                                            sx={{ height: 100, width: 100 }}
                                            alt={`${user?.firstName || "User"} Avatar`}
                                        />
                                    </div>
                                </div>
                                {/* User Details */}
                                <h2 className="text-3xl font-bold mt-4 font-mono capitalize">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-lg">Your personal account</p>
                                <p className="text-gray-600 text-sm">{user?.email}</p>
                                <p className="text-gray-600 text-sm capitalize">{user?.gender}</p>
                            </div>
                            <p className="text-center mt-4 text-sm text-gray-500">
                                Membership Number: {user?.membershipId || "PXXXXXXX"}
                            </p>
                            <p className="text-center mt-4 text-sm text-gray-500">
                                We’ve made some changes to this area of the app.
                            </p>
                            <p className="text-center mt-4 text-sm text-gray-800 underline">Give us feedback</p>
                        </div>

                        {/* Action Section */}
                        <div className="md:w-[50%] flex flex-col ">
                            <div>
                                <div className="text-2xl font-bold mb-4">Your Account</div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <NotificationsNoneIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="text-base font-semibold">Inbox</div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <QuestionMarkIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="text-base font-semibold">Help</div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <FileCopyIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Statements and documents</div>
                                            <div className="text-slate-500">Download documents such as tax statements</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold mb-4">Settings</div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <NotificationsNoneIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Notification preferences</div>
                                            <div className="text-slate-500">Choose how you get updates and rate alerts</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <svg style={{ height: '35px', width: "35px" }} className="bg-gray-200 p-2 rounded-full" aria-hidden="true" focusable="false" role="none" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M8.143 9.428a2.143 2.143 0 1 0 0-4.285 2.143 2.143 0 0 0 0 4.285Zm0 1.715a3.859 3.859 0 0 0 3.761-3H21V6.428h-9.095a3.859 3.859 0 0 0-7.524 0h-1.38v1.715h1.38c.39 1.717 1.926 3 3.762 3Zm7.714 7.714a2.143 2.143 0 1 0 0-4.286 2.143 2.143 0 0 0 0 4.286Zm0 1.714a3.859 3.859 0 0 0 3.762-3H21v-1.714H19.62a3.859 3.859 0 0 0-7.523 0H3v1.714h9.096c.39 1.718 1.925 3 3.761 3Z" clip-rule="evenodd"></path></svg>
                                        {/* <FileCopyIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" /> */}
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Display, security and privacy</div>
                                            <div className="text-slate-500">Customise your app display, security and privacy settings</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <svg style={{ height: '35px', width: "35px" }} className="bg-gray-200 p-2 rounded-full" aria-hidden="true" focusable="false" role="none" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M14.571 10.284V12c0 2.828-2.314 5.143-5.143 5.143-2.828 0-5.142-2.315-5.142-5.143V6.856c0-2.829 2.314-5.143 5.143-5.143 2.485 0 4.628 1.714 5.1 4.114l-1.672.343c-.3-1.543-1.8-2.743-3.428-2.743a3.439 3.439 0 0 0-3.43 3.429v5.143a3.439 3.439 0 0 0 3.43 3.428A3.439 3.439 0 0 0 12.857 12v-1.715h1.714ZM9.428 12c0-2.828 2.315-5.143 5.143-5.143 2.829 0 5.143 2.315 5.143 5.143v5.143c0 2.829-2.314 5.143-5.143 5.143-2.485 0-4.671-1.714-5.143-4.114l1.715-.343c.3 1.586 1.757 2.743 3.428 2.743A3.439 3.439 0 0 0 18 17.143V12a3.439 3.439 0 0 0-3.429-3.428A3.439 3.439 0 0 0 11.143 12v1.715H9.428V12Z" clip-rule="evenodd"></path></svg>
                                        {/* <FileCopyIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" /> */}
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Integrations and tools</div>
                                            <div className="text-slate-500">Connect your account to third-party software</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <AccountBalanceOutlinedIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Payment methods</div>
                                            <div className="text-slate-500">Manage saved cards and bank accounts that are linked to this account</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <PersonOutlineOutlinedIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Personal details</div>
                                            <div className="text-slate-500">Update your personal information</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold mb-4">Your Account</div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <ErrorOutlineOutlinedIcon fontSize="large" className="bg-gray-200 p-2 rounded-full rotate-180" />
                                        <div className="text-base font-semibold">Our agreements</div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4">
                                    <div className="flex justify-start items-center space-x-2">
                                        <CancelOutlinedIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="flex flex-col justify-between">
                                            <div className="text-base font-semibold">Close account</div>
                                            <div className="text-slate-500">Close your personal account</div>
                                        </div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-slate-100 rounded-md p-4" onClick={handleClickOpen}>
                                    <div className="flex justify-start items-center space-x-2">
                                        <LogoutOutlinedIcon fontSize="large" className="bg-gray-200 p-2 rounded-full" />
                                        <div className="text-base font-semibold">Log out</div>
                                    </div>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="logout-dialog-title"
                        aria-describedby="logout-dialog-description"
                    >
                        <DialogTitle id="logout-dialog-title">{"Logout Confirmation"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="logout-dialog-description">
                                Are you sure you want to logout?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleLogout} color="primary" variant="contained">
                                Yes
                            </Button>
                            <Button onClick={handleClose} color="secondary" variant="outlined">
                                No
                            </Button>
                        </DialogActions>
                    </Dialog>

                </main>
            </div>
        </div>
    );
};

export default Profile;
