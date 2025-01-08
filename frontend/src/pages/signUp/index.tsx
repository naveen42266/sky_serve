import { useContext, useState } from "react";
import Header from "../../components/header";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserDetails } from "../../context/userDetails";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PropagateLoader } from "react-spinners";
import { useRouter } from "next/router";
import { googleLoginSignup, signup } from "@/services/user";

const SignUp = () => {
    const [formData, setFormData] = useState({ type: "User", secretKey: "", firstName: "", lastName: "", email: "", gender: "", password: "", confirmPassword: "" });
    const [open, setOpen] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState(false)
    const { user, updateUser } = useUserDetails();
    const router = useRouter();
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // signup("John", "Doe", "john@example.com", "userpassword", "userpassword", "male");


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        setInProgress(true)
        e.preventDefault();
        if (formData.type === "Admin" && formData.secretKey !== "Naveen") {
            toast.error("Wrong secret key", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setInProgress(false)
        }
        else {
            try {
                const response = await signup(formData.type, formData.firstName, formData.lastName, formData?.email, formData?.password, formData?.confirmPassword, formData?.gender);
                if (response.message == 'Signup successful') {
                    console.log(response.message);
                    localStorage.setItem("signUpMessage", response.message);
                    router.push("/signIn");
                } else {
                    console.log("SignUp failed: No response from server", response.error);
                    toast.error(response.error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (error: any) {
                console.error("SignUp error:", error);
                toast.error(error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } finally {
                setInProgress(false);
            }
        }
    };


    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => window.location.href = 
        // "https://forex-news-backend.onrender.com/api/auth/google",
        "http://localhost:8080/api/auth/google",
        // googleLoginApi(tokenResponse?.access_token),
        onError: error => console.log(error)
    });

    const googleLoginApi = async (credential: any) => {
        try {
            const response = await googleLoginSignup(credential);
            if (response.message === "Google login successful") {
                console.log(response.message);
                updateUser(response.user);
                localStorage.setItem("loginMessage", response.message);
                localStorage.setItem("authToken", response.token);
                const loginTime = Date.now();
                localStorage.setItem("loginTime", loginTime.toString());
                router.push("/");
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }

    }

    return (
        <div>
            <ToastContainer />
            <div className={`flex flex-col bg-gray-100 text-gray-900 transition-colors duration-300`}>
                <header className="sticky top-0 right-0 left-0 z-10 bg-white">
                    <Header setOpen={() => { setOpen(!open) }} />
                </header>
                <main className="flex-1 container mx-auto p-4">
                    <div className={`flex flex-col items-center justify-center min-h-screen `}>
                        <h2 className="text-3xl font-bold text-primary w-full max-w-md mb-4">Sign Up</h2>
                        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border-2 border-primary">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-600">Register As</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="User"
                                                checked={formData.type === "User"}
                                                onChange={handleInputChange}
                                                className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-primary focus:outline-none"
                                            />
                                            <span className="ml-2 text-gray-600">User</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Admin"
                                                checked={formData.type === "Admin"}
                                                onChange={handleInputChange}
                                                className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-primary focus:outline-none"
                                            />
                                            <span className="ml-2 text-gray-600">Admin</span>
                                        </label>
                                    </div>
                                </div>
                                {formData?.type === 'Admin' ?
                                    <div>
                                        <label className="block text-gray-600">Secret Key</label>
                                        <input
                                            type="text"
                                            name="secretKey"
                                            value={formData.secretKey}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div> : ''}
                                <div>
                                    <label className="block text-gray-600">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Gender</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === "Male"}
                                                onChange={handleInputChange}
                                                className="text-primary"
                                            />
                                            <span className="ml-2 text-gray-600">Male</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === "Female"}
                                                onChange={handleInputChange}
                                                className="text-primary"
                                            />
                                            <span className="ml-2 text-gray-600">Female</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Other"
                                                checked={formData.gender === "Other"}
                                                onChange={handleInputChange}
                                                className="text-primary"
                                            />
                                            <span className="ml-2 text-gray-600">Other</span>
                                        </label>
                                    </div>
                                </div>
                                {inProgress ?
                                    <button
                                        disabled
                                        className="w-full px-4 py-2 font-semibold bg-primary hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <PropagateLoader className="pb-3" color="white" />
                                    </button> :
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 font-semibold hover:text-white bg-slate-300 hover:bg-slate-400  rounded-md  focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        Sign Up
                                    </button>
                                }
                            </form>
                            <div className="flex flex-row justify-center gap-2">Already have a account? <div className="text-primary" onClick={() => router.push("/signIn")}>Login</div></div>
                            {formData.type === 'User' ?
                                <div className="flex flex-row justify-center ">
                                    <div></div>
                                    <span className="flex flex-row gap-1 px-4 py-2 hover:text-white bg-slate-300 hover:bg-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => googleLogin()}>SignUp with <div className="font-semibold">Google</div></span>
                                    <div></div>
                                </div>
                                : ""}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default SignUp;