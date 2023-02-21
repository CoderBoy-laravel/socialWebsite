import { child, get, getDatabase, ref as dbRef, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Cropper } from "react-cropper";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { GrChapterAdd } from "react-icons/gr";
import { HiOfficeBuilding } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDeleteForever } from "react-icons/md";
import Confirm from "../Reuseable/Confirm";

const Experience = (props) => {
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [newExperience, setNew] = useState(false);
  const [cropper, setCropper] = useState("");
  const [work, setWrork] = useState("");
  const [company, setCompany] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [description, setDescription] = useState("");
  const [expriences, setExperiences] = useState([]);
  const [deleteID, setDeleteID] = useState("");
  const [showDel, setShowDel] = useState(false);
  const db = getDatabase();
  const storage = getStorage();

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      //   const toastid = toast.loading("Please wait...");
      const image = cropper.getCroppedCanvas().toDataURL();
      setFile(image);
      setImage("");
    }
  };

  const imageHandler = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const submitHandler = () => {
    const toastid = toast.loading("Please wait...");
    if (file) {
      const storageRef = ref(storage, uuidv4());
      uploadString(storageRef, file, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(dbRef(db, `experience/${props.id}/${uuidv4()}`), {
            work: work ? work : "",
            company: company ? company : "",
            from: from ? from : "",
            to: to ? to : "",
            description: description ? description : "",
            image: downloadURL,
            date: Date(),
          }).then(() => {
            get(child(dbRef(db), `experience/${props.id}`))
              .then((snapshot) => {
                toast.update(toastid, {
                  render: "Successfully Updated",
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                  closeButton: true,
                });
                setWrork("");
                setCompany("");
                setFrom("");
                setTo("");
                setCropper("");
                setNew(false);
                setFile("");
                setImage("");
                if (snapshot.val()) {
                  const data = snapshot.val();
                  setExperiences(Object.entries(data));
                  props.experience(Object.entries(data));
                }
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
      });
    } else {
      set(dbRef(db, `experience/${props.id}/${uuidv4()}`), {
        work: work ? work : "",
        company: company ? company : "",
        from: from ? from : "",
        to: to ? to : "",
        description: description ? description : "",
        image: file ? file : "",
        date: Date(),
      }).then(() => {
        get(child(dbRef(db), `experience/${props.id}`))
          .then((snapshot) => {
            toast.update(toastid, {
              render: "Successfully Updated",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeButton: true,
            });
            setWrork("");
            setCompany("");
            setFrom("");
            setTo("");
            setCropper("");
            setNew(false);
            setFile("");
            setImage("");
            if (snapshot.val()) {
              const data = snapshot.val();
              setExperiences(Object.entries(data));
              props.experience(Object.entries(data));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  };

  useEffect(() => {
    setExperiences(props.data);
  }, [props.data]);

  return (
    <>
      <ToastContainer />
      <div className="flex justify-between items-center">
        <p className="text-lg font-nunito font-bold">Experience</p>
        {props.edit && (
          <div className="relative">
            <GrChapterAdd
              className="text-2xl cursor-pointer"
              onClick={() => setNew(true)}
            />
          </div>
        )}
      </div>
      <div className="mt-5">
        {newExperience && (
          <div className=" py-5">
            <div className="flex justify-end">
              <button
                className="px-5 py-2 bg-theme text-white text-sm mr-5 rounded"
                onClick={() => submitHandler()}
              >
                Submit
              </button>
              <button
                className="px-5 py-2 bg-red-400 text-white text-sm rounded"
                onClick={() => {
                  setWrork("");
                  setCompany("");
                  setFrom("");
                  setTo("");
                  setCropper("");
                  setImage("");
                  setFile("");
                  setNew(false);
                }}
              >
                Cancel
              </button>
            </div>
            <div className="flex mt-5">
              <div
                className={`h-[100px] w-[100px] rounded-full ${
                  !file && "bg-sky-300 py-6 px-[26px]"
                } relative group`}
              >
                {file ? (
                  <img src={file} alt="" className="rounded-full h-[100px]" />
                ) : (
                  <HiOfficeBuilding className="text-5xl text-white m-auto" />
                )}

                <div className="absolute top-0 left-0 h-[100px] w-[100px] rounded-full bg-[#000000a4] py-8 opacity-0 duration-300 cursor-pointer text-white group-hover:opacity-100">
                  <BiImageAdd className="text-3xl m-auto" />
                </div>
                <input
                  className="h-full w-full opacity-0 cursor-pointer absolute top-0 left-0"
                  type="file"
                  onChange={(e) => imageHandler(e)}
                />
              </div>
              <div className="ml-5">
                <input
                  placeholder="Position"
                  onChange={(e) => setWrork(e.target.value)}
                  className="block border focus:outline-none px-2 py-2 w-full"
                />
                <input
                  placeholder="Company"
                  onChange={(e) => setCompany(e.target.value)}
                  className="block border focus:outline-none px-2 py-2 w-full mt-1"
                />
                <div className="flex items-center mt-1">
                  <input
                    placeholder="From"
                    onChange={(e) => setFrom(e.target.value)}
                    className="block border focus:outline-none px-2 py-2 w-full mr-1"
                  />
                  <input
                    placeholder="To"
                    onChange={(e) => setTo(e.target.value)}
                    className="block border focus:outline-none px-2 py-2 w-full ml-1"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="block border focus:outline-none px-2 py-2 w-full mt-1"
                ></textarea>
              </div>
            </div>
          </div>
        )}
        {expriences &&
          expriences.map((item, index) => (
            <div key={index} className={`pt-5 ${index !== 0 && "border-t"}`}>
              <div className="flex justify-end">
                {props.edit && (
                  <MdDeleteForever
                    className="text-3xl text-red-500 cursor-pointer"
                    onClick={() => {
                      setShowDel(true);
                      setDeleteID(item[0]);
                    }}
                  />
                )}
              </div>
              <div className={`py-5 flex`}>
                <div
                  className={`h-[100px] w-[100px] rounded-full ${
                    !item[1].image && "bg-sky-300 py-6 px-[26px]"
                  } relative group`}
                >
                  {item[1].image ? (
                    <img
                      src={item[1].image}
                      alt=""
                      className="rounded-full h-[100px]"
                    />
                  ) : (
                    <HiOfficeBuilding className="text-5xl text-white m-auto" />
                  )}
                </div>
                <div className="ml-5">
                  <p className="font-nunito text-lg font-medium">
                    {item[1].work}
                  </p>
                  <p className="font-nunito text-sm font-medium mt-3">
                    {item[1].company}
                  </p>
                  <p className="font-nunito text-sm font-medium my-2">
                    {item[1].from} — {item[1].to}
                  </p>
                  <p className="font-nunito text-sm font-medium">
                    {item[1].description}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {image && (
        <div className="fixed top-0 left-0 w-full h-screen z-20">
          <div className="relative w-full h-screen bg-[#000000b2]">
            <div className="absolute top-2/4 w-2/4 h-2/4 translate-x-1/2 -translate-y-1/2">
              <div className="flex justify-end">
                <AiOutlineClose
                  className="text-white text-xl cursor-pointer"
                  onClick={() => setImage("")}
                />
              </div>
              <Cropper
                style={{ height: "100%", width: "100%" }}
                src={image}
                initialAspectRatio={16 / 9}
                aspectRatio={1}
                background={false}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
              <div className="text-center mt-5">
                <button
                  className="text-base font-nunito font-semibold px-20 py-2 rounded-lg bg-teal-500 text-white"
                  onClick={() => getCropData()}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDel && (
        <Confirm
          show={setShowDel}
          id={props.id}
          id2={deleteID}
          name="experience"
          data={setExperiences}
        />
      )}
    </>
  );
};

export default Experience;
