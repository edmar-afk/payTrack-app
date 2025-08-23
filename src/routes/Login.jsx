import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import jhcscBg from "../assets/images/jhcsc.jpg";
import api from "../assets/api";
import { useState } from "react";
import Swal from "sweetalert2";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/login/", formData);
      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;

      // Save tokens in localStorage
      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", refreshToken);

      // Decode JWT payload
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (payload.is_staff || payload.is_superuser) {
          navigate("/dashboard");
        } else {
          navigate("/student-dashboard");
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid phone number or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${jhcscBg})`,
      }}
      className="relative min-h-screen flex items-center justify-center w-full bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

      <div className="relative max-w-4xl w-full bg-white/90 shadow sm:rounded-lg flex">
        <div className="w-full max-w-md p-6 sm:p-8">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-5xl xl:text-4xl font-medium">Login</h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                {/* Phone Number */}
                <div className="relative mt-6">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  />
                  <label
                    htmlFor="username"
                    className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-800"
                  >
                    Phone Number
                  </label>
                </div>

                {/* Password */}
                <div className="relative mt-6">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-800"
                  >
                    Password
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 flex items-center justify-center w-full py-1.5 border border-transparent text-base font-normal rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>

            <div className="flex justify-evenly items-center space-x-2 w-80 mt-4">
              <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
              <span className="flex-none uppercase text-md text-gray-900 mt-4 font-semibold">
                or
              </span>
              <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
            </div>
            <Link
              to={"/register"}
              className="mt-4 w-full flex flex-col items-center gap-3"
            >
              Register First
            </Link>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100/50 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${logo})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
