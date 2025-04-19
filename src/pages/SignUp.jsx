import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/moivesAPI";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";
const SignUp = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            console.log("Đăng ký thành công:", data);
            navigate("/login");
        },
        onError: (error) => {
            console.error("Đăng ký thất bại:", error);
        },
    });

    const formik = useFormik({
        initialValues: {
            taiKhoan: "",
            matKhau: "",
            email: "",
            soDt: "",
            maNhom: "GP01",
            hoTen: "",
        },
        validationSchema: Yup.object({
            taiKhoan: Yup.string().required("Username is required"),
            matKhau: Yup.string()
                .min(3, "Minimum 3 characters")
                .required("Password is required"),
            email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
            soDt: Yup.string().required("Phone number is required"),
            hoTen: Yup.string().required("Full name is required"),
        }),
        onSubmit: (values) => {
            console.log("Dữ liệu gửi đi nè:", values);
            mutation.mutate(values);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 pt-30 pb-20">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-md text-white ">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Sign Up
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <InputField
                        label="Username"
                        id="taiKhoan"
                        formik={formik}
                        type="text"
                        placeholder="Enter your username"
                    />

                    <InputField
                        label="Password"
                        id="matKhau"
                        formik={formik}
                        type="password"
                        placeholder="Enter your password"
                    />

                    <InputField
                        label="Email"
                        id="email"
                        formik={formik}
                        type="email"
                        placeholder="Enter your email"
                    />

                    <InputField
                        label="Phone Number"
                        id="soDt"
                        formik={formik}
                        type="text"
                        placeholder="Enter your phone number"
                    />

                    <InputField
                        label="Full Name"
                        id="hoTen"
                        formik={formik}
                        type="text"
                        placeholder="Enter your full name"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition duration-300 mt-1"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? "Signing up..." : "Sign Up"}
                    </button>

                    <div className="text-center mt-4 text-sm">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-yellow-400 hover:underline hover:text-yellow-300 ml-2"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
