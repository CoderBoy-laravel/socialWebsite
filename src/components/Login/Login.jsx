import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userUpdate } from "../../Slices/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const auth = getAuth();
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const data = useSelector((state) => state.userInfo.user);

  const loginHandler = () => {
    const toastid = toast.loading("Please wait...");
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.update(toastid, {
          render: "Successfully Authenticated",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        setTimeout(() => {
          dispatch(userUpdate(JSON.stringify(user)));
          localStorage.setItem("user", JSON.stringify(user));
          redirect("/");
        }, 1500);
      })
      .catch((error) => {
        toast.update(toastid, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      });
  };
  useEffect(() => {
    if (data) {
      redirect("/");
    }
  }, [data, redirect]);
  return (
    <div className="lg:w-[1440px] w-full lg:px-0 px-5 m-auto pb-5">
      <ToastContainer />
      <div className="text-center md:mt-[140px] mt-12 mb-8">
        <img className="m-auto md:mb-11 mb-5" src="Logo.png" alt="logo" />
        <p className="font-nunito text-[#11175D] md:text-[34px] text-2xl font-bold">
          Login
        </p>
        <p className="font-nunito text-[#11175D] text-[11px] mt-3 text-xl">
          Free register and you can enjoy it
        </p>
      </div>
      <div className="w-full md:w-[500px] m-auto">
        <div className="relative mt-8">
          <input
            className="font-nunito text-xl font-semibold sm:px-[70px] px-5 py-5 border border-[#11175d33] rounded-lg w-full"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <label className="absolute -top-2 px-7 z-10 bg-white left-[70px] text-xs font-nunito font-semibold ">
            Email Address
          </label>
        </div>
        <div className="relative mt-8">
          <input
            className="font-nunito text-xl font-semibold sm:px-[70px] px-5 py-5 border border-[#11175d33] rounded-lg w-full"
            onChange={(e) => setPass(e.target.value)}
            type="password"
          />
          <label className="absolute -top-2 px-7 z-10 bg-white left-[70px] text-xs font-nunito font-semibold ">
            Password
          </label>
        </div>
        <Link className="float-right mt-5 text-[#11175D]" to={`/register`}>
          Make an account?
        </Link>
        <button
          className="py-5 bg-theme text-white rounded-[86px] w-full mt-[50px]"
          onClick={loginHandler}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;
