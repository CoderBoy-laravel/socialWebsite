import Compressor from "compressorjs";
import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import { Cropper } from "react-cropper";
import { MdOutlineClose } from "react-icons/md";
import { Gallery, Item } from "react-photoswipe-gallery";
import "react-slideshow-image/dist/styles.css";
import { child, get, getDatabase, ref as fiRef, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as stRef,
  uploadString,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const EditPost = (props) => {
  const [post, setPost] = useState(props.post.post);
  const [imaglink, setImageLinks] = useState(props.post.images);
  const [file, setFile] = useState(props.post.images);
  const [newFile, setNewFile] = useState([]);
  const [image, setImage] = useState("");
  const [cropper, setCropper] = useState("");
  const [isopen, setIsopen] = useState(false);
  const db = getDatabase();
  const storage = getStorage();
  const postTypeHandler = (e) => {
    setPost(e.target.value);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      const image = cropper.getCroppedCanvas().toDataURL();
      if (file) {
        const oldFile = [...file];
        oldFile.push(image);
        setFile(oldFile);
        const oldnewFile = [...newFile];
        oldnewFile.push(image);
        setNewFile(oldnewFile);
      } else {
        const oldFile = [];
        oldFile.push(image);
        setFile(oldFile);
        const oldnewFile = [];
        oldnewFile.push(image);
        setNewFile(oldnewFile);
      }
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
    new Compressor(files[0], {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedResult);
        reader.onloadend = function () {
          setImage(reader.result);
        };
      },
    });
  };

  const submitHandler = async () => {
    const toastid = toast.loading("Please wait...");
    if (newFile.length >= 1) {
      const imagesLinks = [];
      if (imaglink) {
        imagesLinks.push(imaglink);
      }
      const uploadImage = (item) => {
        const uid = uuidv4();
        const storageRef = stRef(storage, uid);
        return uploadString(storageRef, item, "data_url")
          .then((snapshot) => {
            return getDownloadURL(storageRef);
          })
          .then((downloadURL) => {
            imagesLinks.push(downloadURL);
          });
      };

      const UploadAllImages = (file) => {
        const promises = file.map((item) => uploadImage(item));
        return Promise.all(promises).then(() => {
          set(fiRef(db, `post/${props.id}`), {
            id: props.uid,
            image: props.post.image,
            name: props.post.name,
            email: props.post.email,
            post: post,
            images: imagesLinks,
            date: props.post.date,
          }).then(() => {
            toast.update(toastid, {
              render: "Post Submitted Successfully",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeButton: true,
            });
            get(child(fiRef(db), `post`))
              .then((snapshot) => {
                if (props.setting === "own") {
                  const newArr = [];
                  const resultArr = Object.entries(snapshot.val());
                  resultArr.sort(
                    (a, b) => new Date(b[1].date) - new Date(a[1].date)
                  );
                  resultArr.map(
                    (item, index) =>
                      item[1].id === props.uid && newArr.push(resultArr[index])
                  );
                  props.result(newArr);
                  props.edit(false);
                  setPost("");
                  setNewFile([]);
                } else {
                  const resultArr = Object.entries(snapshot.val());
                  resultArr.sort(
                    (a, b) => new Date(b[1].date) - new Date(a[1].date)
                  );
                  setPost("");
                  setNewFile([]);
                  props.result(resultArr);
                  props.edit(false);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
      };

      UploadAllImages(newFile);
    } else {
      set(fiRef(db, `post/${props.id}`), {
        id: props.uid,
        image: props.post.image,
        name: props.post.name,
        email: props.post.email,
        post: post,
        images: props.post.images,
        date: props.post.date,
      }).then(() => {
        toast.update(toastid, {
          render: "Post Submitted Successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        get(child(fiRef(db), `post`))
          .then((snapshot) => {
            if (props.setting === "own") {
              const newArr = [];
              const resultArr = Object.entries(snapshot.val());
              resultArr.sort(
                (a, b) => new Date(b[1].date) - new Date(a[1].date)
              );
              resultArr.map(
                (item, index) =>
                  item[1].id === props.uid && newArr.push(resultArr[index])
              );
              props.result(newArr);
              props.edit(false);
              setPost("");
              setNewFile([]);
            } else {
              const resultArr = Object.entries(snapshot.val());
              resultArr.sort(
                (a, b) => new Date(b[1].date) - new Date(a[1].date)
              );
              setPost("");
              setNewFile([]);
              props.result(resultArr);
              props.edit(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  };

  return (
    <div className="mt-5 bg-white">
      <ToastContainer />
      <div className="py-5 px-3 border-b relative md:flex justify-end text-right">
        <button
          className="px-7 py-2 rounded text-white bg-red-500 md:mr-5 md:mb-0 mb-2"
          onClick={() => props.edit(false)}
        >
          Cancel
        </button>
        <div className="relative">
          <button className="px-7 py-2 rounded text-white bg-sky-500 md:mr-5 cursor-pointer md:mb-0 mb-2">
            New Image
          </button>
          <input
            className="opacity-0 absolute top-0 left-0 cursor-pointer w-full h-full"
            type="file"
            onChange={(e) => imageHandler(e)}
          />
        </div>
        <button
          className="px-7 py-2 rounded text-white bg-theme md:mb-0"
          onClick={() => submitHandler()}
        >
          Save
        </button>
      </div>
      <div className="pb-5 shadow rounded">
        <div className="px-3 flex items-center mt-4">
          <img
            src={
              props.info.profile !== "no" ? props.info.profile : "default.png"
            }
            alt="profile"
            className="w-[52px] h-[52px] rounded-full"
          />
          <p className="font-nunito text-sm font-bold ml-3">
            {props.post.name}
          </p>
        </div>
        <ContentEditable
          html={post}
          onChange={(e) => postTypeHandler(e)}
          className="focus:outline-none relative z-20 py-2 pr-2 border my-5 mx-3 px-2"
        />
        {post ? (
          ""
        ) : (
          <p className="absolute z-10 top-2 left-0 text-lg font-nunito text-[rgba(24,24,24,0.2)] capitalize">
            what's on your mind
          </p>
        )}
        {file && (
          <div className="flex items-center mx-3">
            <>
              {file.length > 2
                ? file.map((item, index) =>
                    index === 1 ? (
                      <div className="relative flex-1 mx-1" key={index}>
                        <img src={item} alt="" className="md:h-[250px]"></img>
                        <div
                          onClick={() => setIsopen(true)}
                          className="absolute cursor-pointer top-0 left-0 h-full w-full bg-[#0000007a] text-white font-nunito text-center flex items-center justify-center"
                        >
                          {file.length - 2} More
                        </div>
                      </div>
                    ) : (
                      index < 2 && (
                        <div className="flex-1 mx-1" key={index}>
                          <img src={item} alt="" className="md:h-[250px]"></img>
                        </div>
                      )
                    )
                  )
                : file.map((item, index) => (
                    <div className="flex-1 mx-1" key={index}>
                      <img src={item} alt="" className="md:h-[250px]"></img>
                    </div>
                  ))}
            </>
          </div>
        )}
      </div>
      {image && (
        <div className="absolute top-0 left-0 w-full h-screen z-20">
          <div className="relative w-full h-screen bg-[#0004]">
            <div className="absolute top-2/4 w-2/4 h-2/4 translate-x-1/2 -translate-y-1/2">
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
      {isopen && (
        <div className="fixed top-0 left-0 w-full md:h-screen z-50 overflow-scroll">
          <div className="relative w-full h-screen bg-[#0004]">
            <div className="absolute md:top-2/4 top-0 w-3/4 left-1/2 -translate-x-1/2 md:-translate-y-1/2 bg-white z-50">
              <div className="pb-3 border-b flex justify-end mb-4 pr-5 pt-5">
                <MdOutlineClose
                  className="text-2xl cursor-pointer"
                  onClick={() => setIsopen(false)}
                />
              </div>
              <Gallery>
                {file.map((item, index) => (
                  <div
                    key={index}
                    className="md:inline-block md:w-1/3 w-full px-2 md:py-0 py-2"
                  >
                    <Item
                      original={item}
                      thumbnail={item}
                      width="1024"
                      height="768"
                    >
                      {({ ref, open }) => (
                        <img
                          ref={ref}
                          onClick={() => open()}
                          src={item}
                          alt=""
                        />
                      )}
                    </Item>
                  </div>
                ))}
              </Gallery>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
