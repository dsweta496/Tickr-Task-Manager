import React, { useState } from "react";
import { authBaseUrl } from "../axiosInstance.js";

const Signup = ({ setShowLogin }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
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
            const { data } = await authBaseUrl.post("/create", formData);

            if (data.success) {
                setMessage("Account created successfully! Please login.");
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: ""
                });
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            console.log("Signup error:", error);

            setMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 shadow-sm">

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Create your Tickr account
                </h1>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Stay organized. Stay on track.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                    <div className="grid grid-cols-2 gap-3">

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            required
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />

                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-700"
                    >
                        Create Account
                    </button>

                </form>

                {message && (
                    <p className="text-sm text-center mt-4 text-gray-600">
                        {message}
                    </p>
                )}

                <p className="text-sm text-center mt-6 text-gray-500">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setShowLogin(true)}
                        className="text-gray-800 font-medium hover:underline"
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
};

export default Signup;