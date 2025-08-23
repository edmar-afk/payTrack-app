import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import jhcscBg from "../assets/images/jhcsc.jpg";
import api from "../assets/api";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    profile: {
      course: "BSIT",
      year_lvl: "First Year",
    },
    username: "", // phone number
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const courses = [
    "BSIT",
    "BIT",
    "BTVTED-FSM",
    "BTVTED-AP",
    "BTLED-Home Economics",
  ];
  const yearLevels = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  const validatePhone = (value) => {
    if (!/^09\d{9}$/.test(value)) {
      setPhoneError("Phone number must start with 09 and be 11 digits.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      if (value.length <= 11) {
        setFormData({ ...formData, [name]: value });
        validatePhone(value);
      }
    } else if (["course", "year_lvl"].includes(name)) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.username)) return;

    setLoading(true);
    try {
      await api.post("/api/register/", formData);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Student registered successfully.",
        allowOutsideClick: false,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Close",
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
          <div className="mt-6 flex flex-col items-center">
            <h1 className="text-3xl xl:text-2xl font-semibold">
              Student Registration
            </h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs space-y-6">
                {/* First Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  
                    className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 focus:border-gray-500 focus:outline-none"
                  />
                  <label className="absolute top-0 left-0 text-sm text-gray-800">
                    First Name
                  </label>
                </div>

                {/* Last Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                   
                    className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 focus:border-gray-500 focus:outline-none"
                  />
                  <label className="absolute top-0 left-0 text-sm text-gray-800">
                    Last Name
                  </label>
                </div>

                {/* Course */}
                <div className="relative">
                  <select
                    name="course"
                    value={formData.profile.course}
                    onChange={handleChange}
                    className="mt-2 w-full bg-transparent border-b-2 border-gray-300 py-1 focus:border-gray-500 focus:outline-none"
                  >
                    {courses.map((course, idx) => (
                      <option key={idx} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  <label className="absolute -top-3 left-0 text-sm text-gray-800">
                    Course
                  </label>
                </div>

                {/* Year Level */}
                <div className="relative">
                  <select
                    name="year_lvl"
                    value={formData.profile.year_lvl}
                    onChange={handleChange}
                    className="mt-2 w-full bg-transparent border-b-2 border-gray-300 py-1 focus:border-gray-500 focus:outline-none"
                  >
                    {yearLevels.map((lvl, idx) => (
                      <option key={idx} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <label className="absolute -top-3 left-0 text-sm text-gray-800">
                    Year Level
                  </label>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                   
                    maxLength={11}
                    className={`peer mt-2 w-full bg-transparent border-b-2 px-0 py-1 focus:outline-none ${
                      phoneError
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-gray-500"
                    }`}
                  />
                  <label className="absolute top-0 left-0 text-sm text-gray-800">
                    Phone Number
                  </label>
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  
                    className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 focus:border-gray-500 focus:outline-none"
                  />
                  <label className="absolute top-0 left-0 text-sm text-gray-800">
                    Password
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || phoneError || !formData.username}
                  className={`mt-8 flex items-center justify-center gap-2 w-full py-1.5 border border-transparent text-base font-normal rounded-md text-white ${
                    phoneError
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } disabled:opacity-70`}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      Registering... Please wait
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>

            <Link
              to={"/"}
              className="mt-4 w-full flex flex-col items-center gap-3"
            >
              Already registered? Login
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

export default Register;
