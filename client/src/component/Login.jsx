import React, { useState } from "react";
import { authBaseUrl } from "../axiosInstance.js";
import { MdMailOutline, MdLockOutline } from "react-icons/md";

const Login = ({ setShowSignup, setIsAuthenticated }) => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await authBaseUrl.post("/login", formData);

            if (data.success) {
                localStorage.setItem("token", data.token);

                const userName = `${data.firstName} ${data.lastName}`.trim();
                localStorage.setItem("userName", userName);
                localStorage.setItem("userEmail", data.email);

                setIsAuthenticated(true);
            }

            else {
                setMessage(data.message);
            }

        } catch (error) {
            console.log("Login error:", error);

            setMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div
            className="h-screen items-center justify-center
                       bg-cover bg-center bg-no-repeat
                       relative px-4 py-8
                       md:bg-[#2B124C]"
            style={{
                backgroundImage: "url('/login-bg-mobile.png')"
            }}
        >

            {/* MOBILE BACKGROUND OVERLAY */}
            <div className="absolute inset-0 bg-[#2B124C]/45 md:hidden" />

            {/* DESKTOP AUTH CARD */}
            <div className="relative z-10
                w-full max-w-7xl min-h-[680px]
                bg-transparent
                md:bg-white
                rounded-2xl md:rounded-3xl
                overflow-hidden
                shadow-none md:shadow-2xl
                flex flex-1 flex-auto">

                {/* LEFT VISUAL PANEL */}
                <div
                    className="hidden md:flex md:w-[50%] relative bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/login-bg-desktop.png')"
                    }}
                >

                    <div className="absolute inset-0 bg-[#2B124C]/20" />

                    <div className="relative z-10 flex flex-col justify-between w-full p-10">

                        {/* BRAND */}
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                TICKR
                            </h1>

                            <div className="w-12 h-1 bg-[#DFB6B2] rounded-full mt-3" />
                        </div>

                        {/* DESKTOP MESSAGE */}
                        <div className="max-w-sm">

                            <p className="mt-6 text-base lg:text-lg leading-7 text-white/80 max-w-md">
                                Welcome
                            </p>

                            <h2 className="text-4xl xl:text-[3.25rem] font-semibold text-white leading-tight">
                                Stay organized.
                                <br />
                                Stay on track.
                            </h2>

                            <p className="mt-6 text-base lg:text-lg leading-7 text-white/80 max-w-md">
                                Your tasks, your priorities, your progress —
                                all in one place.
                            </p>

                        </div>

                        <div className="text-xs text-white/60">
                            © 2026 Tickr
                        </div>

                    </div>
                </div>


                {/* FORM PANEL */}
                <div className="w-full md:w-[50%]
                                flex items-center justify-center
                                px-6 sm:px-14 lg:px-16 py-10">

                    <div
                        className="w-[100%] max-w-[350px]
           min-h-[350px]
           bg-white
           rounded-2xl
           px-6 py-7
           sm:w-full sm:max-w-md
           sm:min-h-0
           sm:bg-transparent
           sm:px-0 sm:py-0
           shadow-2xl sm:shadow-none"
                    >

                        {/* MOBILE LOGO */}
                        <div className="md:hidden text-center mb-8">

                            <h1 className="text-2xl font-bold text-[#2B124C]">
                                TICKR
                            </h1>

                            <div className="w-10 h-1 bg-[#DFB6B2] rounded-full mx-auto mt-2" />

                        </div>


                        {/* HEADING */}
                        <div className="mb-8">

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl
                                           font-bold text-center md:text-left
                                           text-[#2B124C]
                                           leading-[1.05]
                                           tracking-tight">
                                LOGIN
                            </h2>

                        </div>


                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* EMAIL */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="block text-xs font-medium text-[#854F6C] mb-2"
                                >
                                    Email
                                </label>

                                <div className="flex items-center
                                                border-b border-[#854F6C]/40
                                                focus-within:border-[#522B5B]
                                                transition-colors">

                                    <MdMailOutline
                                        className="text-[#854F6C] mr-2 shrink-0"
                                        size={19}
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-transparent
                                                   px-1 py-2.5
                                                   text-sm text-[#2B124C]
                                                   placeholder:text-[#854F6C]/50
                                                   outline-none"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-[#854F6C] mb-2"
                                >
                                    Password
                                </label>

                                <div className="flex items-center
                                                border-b border-[#854F6C]/40
                                                focus-within:border-[#522B5B]
                                                transition-colors">

                                    <MdLockOutline
                                        className="text-[#854F6C] mr-2 shrink-0"
                                        size={19}
                                    />

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-transparent
                                                   px-1 py-2.5
                                                   text-sm text-[#2B124C]
                                                   placeholder:text-[#854F6C]/50
                                                   outline-none"
                                        required
                                    />

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                className="w-full
                                           bg-[#2B124C]
                                           text-white
                                           rounded-full
                                           py-3
                                           text-sm
                                           font-medium
                                           hover:bg-[#522B5B]
                                           transition-all
                                           duration-200
                                           cursor-pointer
                                           shadow-md
                                           hover:shadow-lg"
                            >
                                Login
                            </button>

                        </form>


                        {/* MESSAGE */}
                        {message && (
                            <p
                                className={`text-sm text-center mt-5 ${message.toLowerCase().includes("success")
                                    ? "text-green-600"
                                    : "text-[#854F6C]"
                                    }`}
                            >
                                {message}
                            </p>
                        )}


                        {/* SIGNUP */}
                        <p className="text-sm text-center mt-7 text-[#854F6C]">

                            Don't have an account?{" "}

                            <button
                                type="button"
                                onClick={() => setShowSignup(true)}
                                className="text-[#522B5B]
                                           font-semibold
                                           hover:text-[#854F6C]
                                           hover:underline
                                           cursor-pointer"
                            >
                                Sign up
                            </button>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;