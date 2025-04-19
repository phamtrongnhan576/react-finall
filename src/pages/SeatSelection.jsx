import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSeatList, bookTickets } from "../api/moivesAPI";
import { USER_LOGIN } from "../utils/settings";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const SeatSelection = () => {
    const { maLichChieu } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const navigate = useNavigate();

    const notyf = new Notyf({
        position: {
            x: "right",
            y: "top",
        },
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["seatList", maLichChieu],
        queryFn: () => getSeatList(maLichChieu),
        enabled: !!maLichChieu,
    });

    const handleSeatClick = (seat) => {
        if (!seat.daDat) {
            setSelectedSeats((prev) => {
                const isSelected = prev.some((s) => s.maGhe === seat.maGhe);
                return isSelected
                    ? prev.filter((s) => s.maGhe !== seat.maGhe)
                    : [...prev, seat];
            });
        }
    };

    const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.giaVe, 0);

    const handleBookTicket = async () => {
        const user = JSON.parse(localStorage.getItem(USER_LOGIN));
        if (!user) {
            notyf.error("Please log in to book tickets.");
            navigate("/login");
            return;
        }

        try {
            await bookTickets(maLichChieu, selectedSeats);
            notyf.success("Booking successful!");
            setIsModalVisible(false);
            setSelectedSeats([]);
            await refetch();
        } catch (error) {
            notyf.error(error.message || "An error occurred while booking.");
        }
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFA500]"></div>
            </div>
        );

    if (error)
        return (
            <Alert
                message="Error"
                description="Unable to load seat list. Please try again later."
                type="error"
                showIcon
                className="m-4"
            />
        );

    if (!data) return null;

    const { thongTinPhim, danhSachGhe } = data;

    const rows = [];
    for (let i = 0; i < danhSachGhe.length; i += 16) {
        rows.push(danhSachGhe.slice(i, i + 16));
    }

    return (
        <div className="bg-black pt-25 pb-5">
            <div className="container p-4">
                <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {thongTinPhim.tenPhim}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Cinema:</span>{" "}
                            {thongTinPhim.tenCumRap}
                        </div>
                        <div>
                            <span className="text-gray-400">Showtime:</span>{" "}
                            {thongTinPhim.gioChieu}
                        </div>
                        <div>
                            <span className="text-gray-400">Date:</span>{" "}
                            {thongTinPhim.ngayChieu}
                        </div>
                        <div>
                            <span className="text-gray-400">Room:</span>{" "}
                            {thongTinPhim.tenRap}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-center text-white mb-4">
                                <div className="text-lg font-medium">
                                    SCREEN
                                </div>
                                <div className="h-1 bg-orange-500 w-1/3 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-2">
                                {rows.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="flex justify-center gap-1"
                                    >
                                        {row.map((seat) => {
                                            const isSelected =
                                                selectedSeats.some(
                                                    (s) =>
                                                        s.maGhe === seat.maGhe
                                                );
                                            const isBooked = seat.daDat;
                                            const isVip =
                                                seat.loaiGhe === "Vip";

                                            return (
                                                <button
                                                    key={seat.maGhe}
                                                    onClick={() =>
                                                        handleSeatClick(seat)
                                                    }
                                                    disabled={isBooked}
                                                    className={`
                                                        w-8 h-8 rounded-sm text-xs font-bold flex items-center justify-center
                                                        ${
                                                            isBooked
                                                                ? "bg-gray-600 cursor-not-allowed"
                                                                : isSelected
                                                                ? "bg-green-500 text-white"
                                                                : isVip
                                                                ? "bg-yellow-500 hover:bg-yellow-400"
                                                                : "bg-gray-300 hover:bg-gray-200"
                                                        }
                                                    `}
                                                    title={`Seat ${
                                                        seat.tenGhe
                                                    } - ${seat.giaVe.toLocaleString()}đ`}
                                                >
                                                    {seat.tenGhe}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-4 text-white text-sm">
                                {[
                                    { color: "bg-gray-300", label: "Regular" },
                                    { color: "bg-yellow-500", label: "VIP" },
                                    {
                                        color: "bg-green-500",
                                        label: "Selected",
                                    },
                                    { color: "bg-gray-600", label: "Booked" },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className={`w-4 h-4 ${item.color} rounded-sm`}
                                        ></div>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-96 bg-gray-800 p-6 rounded-lg text-white">
                        <h2 className="text-xl font-bold mb-4">Booking Info</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Number of seats:</span>
                                <span className="font-medium">
                                    {selectedSeats.length}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Total price:</span>
                                <span className="text-orange-500 font-bold">
                                    {totalPrice.toLocaleString()}đ
                                </span>
                            </div>

                            <div className="pt-4 mt-4 border-t border-gray-700">
                                <button
                                    className={`w-full py-3 rounded-lg font-bold transition-colors ${
                                        selectedSeats.length > 0
                                            ? "bg-orange-500 hover:bg-orange-600"
                                            : "bg-gray-600 cursor-not-allowed"
                                    }`}
                                    disabled={selectedSeats.length === 0}
                                    onClick={handleBookTicket}
                                >
                                    Book Now
                                </button>
                            </div>

                            {selectedSeats.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold mb-2">
                                        Selected Seats:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map((seat) => (
                                            <span
                                                key={seat.maGhe}
                                                className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                                            >
                                                {seat.tenGhe} ({seat.loaiGhe})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
