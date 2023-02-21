import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { BiHomeCircle, BiLogOutCircle } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { userUpdate } from "../../Slices/UserSlice";
import { useDispatch } from "react-redux";

const Navbar = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const redirect = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      dispatch(userUpdate(null));
      localStorage.removeItem("user");
      redirect("/login");
    });
  };
  return (
    <>
      <div className="justify-between items-center bg-white md:flex hidden">
        <Link to={"/"} className="w-[130px] lg:border-r">
          <img src="/Logo.png" alt="Logo" className="m-auto py-2" />
        </Link>
        <div className="w-[450px] lg:border-r h-20"></div>
        <div className="w-[367px] items-center lg:flex hidden">
          <FiSearch className="text-theme text-2xl" />
          <input
            className="pl-3 py-2 focus:outline-none text-base font-light font-nunito w-full"
            placeholder="Search"
          />
        </div>
        <div className="w-[330px] break-words">
          <div className="relative">
            <div
              className="flex items-center cursor-pointer break-words"
              onClick={() => setDropdown(!dropdown)}
            >
              <img
                src={props.image ? props.image : "default.png"}
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
              <p className="font-nunito text-sm font-bold ml-3 break-words">
                {props.name}
              </p>
            </div>
            {dropdown ? (
              <ul className="absolute top-11 left-0 rounded shadow bg-white z-10 w-40">
                <li>
                  <Link
                    to={"/profile"}
                    className="w-full py-3 pl-5 hover:bg-theme hover:text-white flex items-center justify-start cursor-pointer border-b rounded-t"
                  >
                    <FaRegUser className="mr-3" />
                    Profile
                  </Link>
                </li>
                <li
                  className="w-full py-3 pl-5 hover:bg-[#ff5151] hover:text-white flex items-center justify-start cursor-pointer rounded-b"
                  onClick={logoutHandler}
                >
                  <BiLogOutCircle className="mr-3" />
                  Logout
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white md:hidden">
        <Link to={"/"} className="w-[130px]">
          <img src="/Logo.png" alt="Logo" className="m-auto py-2" />
        </Link>
        <div className="">
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setDropdown(!dropdown)}
            >
              <AiOutlineMenu className="h-7 w-7" />
            </div>
            {dropdown ? (
              <ul className="absolute top-7 right-2 rounded shadow bg-white z-40 w-40">
                <li className="text-center pt-5">
                  <img
                    src={props.image ? props.image : "default.png"}
                    alt="profile"
                    className="h-10 w-10 rounded-full m-auto"
                  />
                  <p className="font-nunito text-sm font-bold ml-3 break-words">
                    {props.name}
                  </p>
                </li>
                <li>
                  <Link
                    to={"/"}
                    className="w-full py-3 pl-5 hover:bg-theme hover:text-white flex items-center justify-start cursor-pointer border-b rounded-t"
                  >
                    <BiHomeCircle className="mr-3" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/profile"}
                    className="w-full py-3 pl-5 hover:bg-theme hover:text-white flex items-center justify-start cursor-pointer border-b"
                  >
                    <FaRegUser className="mr-3" />
                    Profile
                  </Link>
                </li>
                <li
                  className="w-full py-3 pl-5 hover:bg-[#ff5151] hover:text-white flex items-center justify-start cursor-pointer rounded-b"
                  onClick={logoutHandler}
                >
                  <BiLogOutCircle className="mr-3" />
                  Logout
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
