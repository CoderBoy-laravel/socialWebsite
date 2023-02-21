import React from "react";
import ReactDOM from "react-dom/client";
import Firebase from "./firebase.config";
import { Provider } from "react-redux";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import store from "./store";
import Home from "./components/Home/Home";
import Verify from "./components/Verify/Verify";
import Profile from "./components/Profile/Profile";
import FriendProfile from "./components/FriendProfile/FriendProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "profile/:userId",
    element: <FriendProfile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
