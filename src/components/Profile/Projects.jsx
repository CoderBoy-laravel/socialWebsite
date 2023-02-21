import { child, get, getDatabase, ref as dbRef, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Cropper } from "react-cropper";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Gallery, Item } from "react-photoswipe-gallery";

const Projects = (props) => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const storage = getStorage();
  const db = getDatabase();
  const [cropper, setCropper] = useState("");

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      const toastid = toast.loading("Please wait...");
      const image = cropper.getCroppedCanvas().toDataURL();
      const storageRef = ref(storage, uuidv4());
      const oldImages = [...files];
      uploadString(storageRef, image, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          oldImages.push(downloadURL);
          set(dbRef(db, `projects/${props.id}`), {
            urls: oldImages,
          }).then(() => {
            get(child(dbRef(db), `projects/${props.id}`))
              .then((snapshot) => {
                toast.update(toastid, {
                  render: "Successfully Updated",
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                  closeButton: true,
                });
                setImage("");
                props.result(snapshot.val().urls);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
      });
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

  useEffect(() => {
    setFiles(props.images);
  }, [props.images]);

  return (
    <>
      <ToastContainer />
      <div className="flex justify-between items-center">
        <p className="text-lg font-nunito font-bold">
          Projects
          <span className="text-sm font-nunito font-light ml-5">
            {show ? files.length : files.length > 3 ? "3" : files.length} of{" "}
            {files.length}
          </span>
        </p>
        {props.edit && (
          <div className="relative">
            <AiOutlineCloudUpload className="text-2xl cursor-pointer" />
            <input
              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
              type="file"
              onChange={imageHandler}
            />
          </div>
        )}
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-4">
          <Gallery>
            {files.map((item, index) =>
              show ? (
                <div key={index} className="inline-block w-full">
                  <Item
                    original={item}
                    thumbnail={item}
                    width="1024"
                    height="768"
                  >
                    {({ ref, open }) => (
                      <img ref={ref} onClick={() => open()} src={item} alt="" />
                    )}
                  </Item>
                </div>
              ) : index > 2 ? null : (
                <div key={index} className="inline-block w-full">
                  <Item
                    original={item}
                    thumbnail={item}
                    width="1024"
                    height="768"
                  >
                    {({ ref, open }) => (
                      <img ref={ref} onClick={() => open()} src={item} alt="" />
                    )}
                  </Item>
                </div>
              )
            )}
          </Gallery>
        </div>
        {files.length > 3 && (
          <p
            onClick={() => setShow(!show)}
            className="text-theme font-nunito text-base cursor-pointer font-bold block mt-5"
          >
            {!show ? "See All" : "See Less"}
          </p>
        )}
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
    </>
  );
};

export default Projects;
