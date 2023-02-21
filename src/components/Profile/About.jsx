import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const About = (props) => {
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const db = getDatabase();
  const submitHandler = () => {
    const toastid = toast.loading("Please wait...");
    set(dbRef(db, "users/" + props.id), {
      bio: props.bio ? props.bio : "",
      about: props.about ? props.about : "",
      cover: props.cover ? props.cover : "",
    }).then(() => {
      toast.update(toastid, {
        render: "Successfully Updated",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
      setEdit(!edit);
    });
  };
  return (
    <>
      <ToastContainer />
      {props.edit && (
        <div className=" flex items-center justify-between">
          <p className="text-lg font-nunito font-bold">About</p>
          <BiEdit
            className="text-lg cursor-pointer"
            onClick={() => setEdit(!edit)}
          />
        </div>
      )}

      {edit ? (
        <>
          <textarea
            className="w-full py-2 px-2 border focus:outline-none rounded mt-2"
            value={props.about}
            onChange={(e) => props.setAbout(e.target.value)}
          />
          {props.about && (
            <button
              className="text-base font-nunito font-semibold px-20 py-2 rounded-lg bg-teal-500 text-white"
              onClick={submitHandler}
            >
              Update
            </button>
          )}
        </>
      ) : (
        <p className="font-nunito text-sm font-light mt-2">
          {show ? props.about : props.about && props.about.substring(0, 240)}
          {show ? (
            <span
              className="text-theme font-nunito font-bold mt-2 cursor-pointer"
              onClick={() => setShow(false)}
            >
              See Less
            </span>
          ) : (
            props.about &&
            props.about.length > 240 && (
              <>
                ...
                <span
                  className="text-theme font-nunito font-bold mt-2 cursor-pointer"
                  onClick={() => setShow(true)}
                >
                  See More
                </span>
              </>
            )
          )}
        </p>
      )}
    </>
  );
};

export default About;
