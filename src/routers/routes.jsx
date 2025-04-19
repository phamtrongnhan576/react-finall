import LayoutDefault from "../template/LayoutDefault.jsx";
import LayoutAdmin from "../template/admin/layout.jsx";
import Home from "../pages/Home";
import SeatSelection from "../pages/SeatSelection";
import Detail from "../pages/Detail";
import Error404 from "../pages/Error404";
import AdminDashBoardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile.jsx";

export const routes = [
    {
        //Tuyến đường cho user
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                path: "*",
                element: <Error404 />,
            },
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/SeatSelection/:maLichChieu",
                element: <SeatSelection />,
            },
            {
                path: "/Detail/:maPhim",
                element: <Detail />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
        ],
    },
    {
        //Tuyến đường cho admin
        path: "/admin",
        element: <LayoutAdmin />,
        children: [
            { index: true, element: <AdminDashBoardPage /> },
            { path: "film", element: <AdminDashBoardPage /> },
            { path: "user", element: <AdminUsersPage /> },
            { path: "*", element: <Error404 /> },
        ],
    },
];
