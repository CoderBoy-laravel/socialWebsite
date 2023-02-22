import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { userUpdate } from "../../Slices/UserSlice";
import { getDatabase, ref as dbRef, set } from "firebase/database";

const Register = () => {
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [emailerr, setEmailerr] = useState("");
  const [nameerr, setNameerr] = useState("");
  const [passworderr, setPassworderr] = useState("");
  const auth = getAuth();
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.user);

  const emailHandler = (e) => {
    if (e.target.value.length > 0) {
      if (e.target.value.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)) {
        setEmail(e.target.value);
        setEmailerr("");
      } else {
        setEmailerr("Email Is not Valid");
      }
    } else {
      setEmailerr("Email Field Required");
    }
  };

  const nameHandler = (e) => {
    if (e.target.value.length > 0) {
      setName(e.target.value);
      setNameerr("");
    } else {
      setNameerr("Username Field Required");
    }
  };
  const passHandler = (e) => {
    if (e.target.value.length > 0) {
      if (!/^(?=.*[a-z])/.test(e.target.value)) {
        setPassworderr("Lowercase required");
      } else if (!/^(?=.*[0-9])/.test(e.target.value)) {
        setPassworderr("Numeric character required");
      } else if (!/^(?=.*[!@#$%^&*])/.test(e.target.value)) {
        setPassworderr("Special character required");
      } else if (!/^(?=.{8,})/.test(e.target.value)) {
        setPassworderr("Minimun 8 character required");
      } else {
        setPass(e.target.value);
        setPassworderr("");
      }
    } else {
      setPassworderr("Password Field Required");
    }
  };

  const submitHandler = () => {
    if (!email) {
      setEmailerr("Email Field Required");
    }
    if (!name) {
      setNameerr("Username Field Required");
    }
    if (!pass) {
      setPassworderr("Password Field Required");
    }
    if (email && name && pass) {
      const toastid = toast.loading("Please wait...");
      createUserWithEmailAndPassword(auth, email, pass)
        .then((user) => {
          const userData = user.user;
          sendEmailVerification(userData).then(() => {
            set(dbRef(db, "users/" + userData.uid), {
              bio: "",
              name: name,
              about: "",
              cover: "",
              profile: "no",
              location: "",
            });
            updateProfile(userData, {
              displayName: name,
            });
            toast.update(toastid, {
              render: "Registered Successfully",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeButton: true,
            });
            signInWithEmailAndPassword(auth, email, pass)
              .then((userCredential) => {
                const user = userCredential.user;
                dispatch(userUpdate(JSON.stringify(user)));
                localStorage.setItem("user", JSON.stringify(user));
                redirect("/");
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
          });
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
    }
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
        <img className="m-auto mb-11" src="Logo.png" alt="logo" />
        <p className="font-nunito text-[#11175D] md:text-[34px] text-2xl font-bold">
          Get started with easily register
        </p>
        <p className="font-nunito text-[#11175D] text-[11px] mt-3 text-xl">
          Free register and you can enjoy it
        </p>
      </div>
      <div className="w-full md:w-[500px] m-auto">
        <div className="relative mt-8">
          <input
            className="font-nunito text-xl font-semibold sm:px-[70px] px-5 py-5 border border-[#11175d33] rounded-lg w-full"
            onChange={(e) => {
              emailHandler(e);
            }}
            type="email"
          />
          <label className="absolute -top-2 px-7 z-10 bg-white left-[70px] text-xs font-nunito font-semibold ">
            Email Address
          </label>
        </div>
        {emailerr && (
          <p className="py-1 px-2 rounded font-nunito text-xs font-bold bg-red-500 text-white mt-3">
            {emailerr}
          </p>
        )}
        <div className="relative mt-8">
          <input
            className="font-nunito text-xl font-semibold sm:px-[70px] px-5 py-5 border border-[#11175d33] rounded-lg w-full"
            onChange={(e) => {
              nameHandler(e);
            }}
            type="text"
          />
          <label className="absolute -top-2 px-7 z-10 bg-white left-[70px] text-xs font-nunito font-semibold">
            Full name
          </label>
        </div>
        {nameerr && (
          <p className="py-1 px-2 rounded font-nunito text-xs font-bold bg-red-500 text-white mt-3">
            {nameerr}
          </p>
        )}
        <div className="relative mt-8">
          <input
            className="font-nunito text-xl font-semibold sm:px-[70px] px-5 py-5 border border-[#11175d33] rounded-lg w-full"
            onChange={(e) => {
              passHandler(e);
            }}
            type="password"
          />
          <label className="absolute -top-2 px-7 z-10 bg-white left-[70px] text-xs font-nunito font-semibold ">
            Password
          </label>
        </div>
        {passworderr && (
          <p className="py-1 px-2 rounded font-nunito text-xs font-bold bg-red-500 text-white mt-3">
            {passworderr}
          </p>
        )}
        <Link className="float-right mt-5 text-[#11175D]" to={`/login`}>
          Already has an account?
        </Link>
        <button
          className="py-5 bg-theme text-white rounded-[86px] w-full mt-[50px]"
          onClick={submitHandler}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Register;
