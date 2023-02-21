import { getAuth, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userUpdate } from "../../Slices/UserSlice";

const Verify = () => {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const data = useSelector((state) => state.userInfo.user);

  const redirectHandler = () => {
    dispatch(userUpdate(JSON.stringify(auth.currentUser)));
    localStorage.removeItem("user", JSON.stringify(auth.currentUser));
    if (auth.currentUser.emailVerified) {
      redirect("/");
    } else {
      toast.error("Email Not Verfied", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const logoutHandler = () => {
    signOut(auth).then(() => {
      dispatch(userUpdate(null));
      localStorage.removeItem("user");
      redirect("/login");
    });
  };

  useEffect(() => {
    if (data.emailVerified) {
      redirect("/");
    }
  }, []);
  return (
    <div className="lg:w-[1440px] w-full lg:px-0 px-5 m-auto flex items-center h-screen justify-center">
      <ToastContainer />
      <div className="text-center">
        <p className="text-theme font-nunito font-bold md:text-4xl text-xl">
          Please Verify your Email to process further
        </p>
        <p className="text-theme font-nunito font-bold md:text-xl text-base md:mt-0 mt-5">
          Verified ? Click to go.{" "}
        </p>
        <button
          className="text-white bg-theme rounded-md py-1 w-20"
          onClick={redirectHandler}
        >
          Verfied
        </button>
        <button
          className="text-white bg-red-400 rounded-md py-1 w-20 ml-5"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Verify;
