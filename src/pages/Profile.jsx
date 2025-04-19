import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { getUserInfo, editUserInfo } from "../api/moivesAPI";
import InputField from "../components/InputField";

const notyf = new Notyf({
    position: {
        x: "right",
        y: "top",
    },
});

const Profile = () => {
    const [visibleMovies, setVisibleMovies] = useState(3);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: userInfo,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userInfo"],
        queryFn: getUserInfo,
        onError: (err) => {
            notyf.error(err.message || "Lỗi khi tải thông tin người dùng");
        },
    });

    const { mutate: updateUser } = useMutation({
        mutationFn: editUserInfo,
        onSuccess: () => {
            notyf.success("Cập nhật thông tin thành công");
            queryClient.invalidateQueries(["userInfo"]);
            setIsModalVisible(false);
            formik.resetForm();
        },
        onError: (error) => {
            notyf.error(error.response?.data?.content || "Cập nhật thất bại");
        },
    });

    const formik = useFormik({
        initialValues: {
            hoTen: "",
            email: "",
            soDT: "",
            matKhau: "",
        },
        onSubmit: (values) => {
            updateUser({
                ...userInfo,
                hoTen: values.hoTen,
                email: values.email,
                soDT: values.soDT,
                matKhau: values.matKhau || userInfo.matKhau,
            });
        },
    });

    const loadMoreMovies = () => setVisibleMovies((prev) => prev + 3);

    const handleEditClick = () => {
        formik.setValues({
            hoTen: userInfo.hoTen,
            email: userInfo.email,
            soDT: userInfo.soDT,
            matKhau: "",
        });
        setIsModalVisible(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFA500]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-gray-900 min-h-screen">
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                    <strong>Lỗi!</strong> Không thể tải thông tin người dùng.
                </div>
            </div>
        );
    }

    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto py-4 max-w-4xl pt-35 pb-25">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold mb-6 text-[#FFA500]">
                            Thông tin cá nhân
                        </h1>
                        <button
                            onClick={handleEditClick}
                            className="text-[#FFA500] hover:text-[#FF8C00] focus:outline-none"
                            aria-label="Chỉnh sửa"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center md:w-1/3">
                            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-[#FFA500]">
                                {userInfo.avatar ? (
                                    <img
                                        src={userInfo.avatar}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-gray-300">
                                        {userInfo.hoTen?.charAt(0) || "U"}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-center text-gray-100">
                                {userInfo.hoTen}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm mt-2 text-white ${
                                    userInfo.maLoaiNguoiDung === "QuanTri"
                                        ? "bg-[#FFA500]"
                                        : "bg-green-500"
                                }`}
                            >
                                {userInfo.loaiNguoiDung?.tenLoai ||
                                    "Khách hàng"}
                            </span>
                        </div>

                        <div className="md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                    <p className="text-gray-400 text-sm">
                                        Tài khoản
                                    </p>
                                    <p className="font-medium text-gray-100">
                                        {userInfo.taiKhoan}
                                    </p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                    <p className="text-gray-400 text-sm">
                                        Email
                                    </p>
                                    <p className="font-medium text-gray-100">
                                        {userInfo.email}
                                    </p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                    <p className="text-gray-400 text-sm">
                                        Số điện thoại
                                    </p>
                                    <p className="font-medium text-gray-100">
                                        {userInfo.soDT}
                                    </p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                    <p className="text-gray-400 text-sm">
                                        Nhóm
                                    </p>
                                    <p className="font-medium text-gray-100">
                                        {userInfo.maNhom}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#FFA500]">
                                    Chỉnh sửa thông tin
                                </h2>
                                <button
                                    onClick={() => setIsModalVisible(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-4">
                                    <InputField
                                        label="Họ tên"
                                        id="hoTen"
                                        formik={formik}
                                        type="text"
                                    />
                                </div>
                                <div className="mb-4">
                                    <InputField
                                        label="Email"
                                        id="email"
                                        formik={formik}
                                        type="email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <InputField
                                        label="Số điện thoại"
                                        id="soDT"
                                        formik={formik}
                                        type="tel"
                                    />
                                </div>
                                <InputField
                                    label="Mật khẩu mới "
                                    id="matKhau"
                                    formik={formik}
                                    type="password"
                                />

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalVisible(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-[#FFA500] hover:bg-[#FF8C00] text-white transition-colors"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-[#FFA500]">
                        Lịch sử đặt vé
                    </h2>

                    {userInfo.thongTinDatVe?.length > 0 ? (
                        <div className="space-y-6">
                            {userInfo.thongTinDatVe
                                .slice(0, visibleMovies)
                                .map((ticket) => (
                                    <div
                                        key={ticket.maVe}
                                        className="border-b border-gray-700 last:border-b-0 pb-6 last:pb-0"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="md:w-1/4">
                                                <img
                                                    src={ticket.hinhAnh}
                                                    alt={ticket.tenPhim}
                                                    className="rounded-lg border border-gray-600 w-full h-auto"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/300x450?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                            <div className="md:w-3/4 space-y-2 text-gray-300">
                                                <h3 className="text-lg font-bold text-gray-100">
                                                    {ticket.tenPhim}
                                                </h3>
                                                <p>
                                                    <span className="text-gray-400">
                                                        Ngày đặt:{" "}
                                                    </span>
                                                    {new Date(
                                                        ticket.ngayDat
                                                    ).toLocaleDateString(
                                                        "vi-VN",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-gray-400">
                                                        Thời lượng:{" "}
                                                    </span>
                                                    {ticket.thoiLuongPhim} phút
                                                </p>
                                                <p>
                                                    <span className="text-gray-400">
                                                        Giá vé:{" "}
                                                    </span>
                                                    <span className="text-green-400">
                                                        {ticket.giaVe.toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        đ
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="text-gray-400">
                                                        Rạp:{" "}
                                                    </span>
                                                    {
                                                        ticket.danhSachGhe[0]
                                                            ?.tenHeThongRap
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        ticket.danhSachGhe[0]
                                                            ?.tenCumRap
                                                    }
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="text-gray-400">
                                                        Ghế:{" "}
                                                    </span>
                                                    {ticket.danhSachGhe.map(
                                                        (ghe) => (
                                                            <span
                                                                key={ghe.maGhe}
                                                                className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-sm"
                                                            >
                                                                {ghe.tenGhe}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            {visibleMovies < userInfo.thongTinDatVe.length && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={loadMoreMovies}
                                        className="px-6 py-3 rounded-lg bg-[#FFA500] hover:bg-[#FF8C00] text-white transition-colors"
                                    >
                                        Xem thêm
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-700 border border-gray-600 text-gray-300 px-4 py-3 rounded">
                            Bạn chưa có lịch sử đặt vé nào.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
