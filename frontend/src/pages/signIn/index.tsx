import { useState, useEffect } from "react";
import { useUserDetails } from "../../context/userDetails";
import Header from "../../components/header";
import { useGoogleLogin } from '@react-oauth/google';
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PropagateLoader } from "react-spinners";
import { useRouter } from "next/router";
import { login } from "@/services/user";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, updateUser } = useUserDetails();
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setInProgress(true);
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password);
      if (response.message === "Login successful") {
        updateUser(response.user);
        localStorage.setItem("loginMessage", response.message);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("loginTime", Date.now().toString());
        router.push("/");
      } else {
        toast.error(response.error, { position: "top-right" });
      }
    } catch (error: any) {
      toast.error(error.message, { position: "top-right" });
    } finally {
      setInProgress(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => window.location.href =
      // "http://localhost:8080/api/auth/google",  // For local development
      "https://sky-serve.onrender.com/api/auth/google",
    onError: error => console.log(error)
  });

  useEffect(() => {
    const signUpMessage = localStorage.getItem("signUpMessage");
    if (signUpMessage) {
      toast.success('Signed Up successfully', { position: "top-right" });
      localStorage.removeItem("signUpMessage");
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 relative">
        <header className="sticky top-0 left-0 right-0 z-10 bg-white">
          <Header setOpen={() => { }} />
        </header>
        <main className="flex-1 container mx-auto p-4">
          <div className="flex flex-col items-center justify-center h-[500px]">
            <h2 className="text-3xl font-bold text-primary w-full max-w-md mb-4">Login</h2>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border-2 border-primary">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
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
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full px-4 py-2 font-semibold  hover:text-white bg-slate-300 hover:bg-slate-400 ${inProgress ? 'opacity-50' : ''}`}
                  disabled={inProgress}
                >
                  {inProgress ? <PropagateLoader color="white" /> : "Login"}
                </button>
              </form>
              <div className="flex flex-row justify-center gap-2">
                Don't have an account?
                <div className="text-primary cursor-pointer underline" onClick={() => router.push('/signUp')}>SignUp</div>
              </div>
              <div className="flex flex-row justify-center">
                <button
                  className="flex items-center gap-1 px-4 py-2  hover:text-white bg-slate-300 hover:bg-slate-400 rounded-md"
                  onClick={() => googleLogin()}
                >
                  Login with <span className="font-semibold">Google</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignIn;
