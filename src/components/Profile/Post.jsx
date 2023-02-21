import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { BsCardImage } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { child, get, getDatabase, ref as fiRef, set } from "firebase/database";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { MdOutlineClose } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import Compressor from "compressorjs";
import {
  getDownloadURL,
  getStorage,
  ref as stRef,
  uploadString,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-slideshow-image/dist/styles.css";
import Pagination from "../Reuseable/Pagination";
import Confirm from "../Reuseable/Confirm";
const Post = (props) => {
  const [result, setResult] = useState([]);
  const [post, setPost] = useState("");
  const [isopen, setIsopen] = useState(false);
  const [file, setFile] = useState([]);
  const [image, setImage] = useState("");
  const [deleteID, setDeleteID] = useState("");
  const [showDel, setShowDel] = useState(false);
  const [cropper, setCropper] = useState("");

  const data = useSelector((state) => state.userInfo.user);
  const db = getDatabase();
  const storage = getStorage();
  const user = JSON.parse(data);

  const getUpdatedData = () => {
    get(child(fiRef(db), `post`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const newArr = [];
          const id = props.id ? props.id : user.uid;
          const resultArr = Object.entries(snapshot.val());
          resultArr.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
          resultArr.map(
            (item, index) => (item, index) =>
              item[1].id === id && newArr.push(resultArr[index])
          );
          setResult(newArr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    get(child(fiRef(db), `post`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const newArr = [];
          const id = props.id ? props.id : user.uid;
          const resultArr = Object.entries(snapshot.val());
          resultArr.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
          resultArr.map(
            (item, index) => item[1].id === id && newArr.push(resultArr[index])
          );
          setResult(newArr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user, data, db, props.id]);

  const postTypeHandler = (e) => {
    setPost(e.target.value);
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

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      const image = cropper.getCroppedCanvas().toDataURL();
      const oldFile = [...file];
      oldFile.push(image);
      setFile(oldFile);
      setImage("");
    }
  };

  const submitHandler = async () => {
    const imagesLinks = [];
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
        set(fiRef(db, `post/${uuidv4()}`), {
          id: user.uid,
          image:
            user.providerData[0].photoURL !== null
              ? user.providerData[0].photoURL
              : "no",
          name: user.displayName,
          email: user.email,
          post: post,
          images: imagesLinks,
          date: Date(),
        }).then(() => {
          get(child(fiRef(db), `post`))
            .then((snapshot) => {
              toast.success("Post Submitted Successfully", {
                type: "success",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              const newArr = [];
              const resultArr = Object.entries(snapshot.val());
              resultArr.sort(
                (a, b) => new Date(b[1].date) - new Date(a[1].date)
              );
              resultArr.map(
                (item, index) =>
                  item[1].id === user.uid && newArr.push(resultArr[index])
              );
              setResult(newArr);
              setPost("");
              setFile([]);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      });
    };

    UploadAllImages(file);
  };
  return (
    <>
      <ToastContainer />
      {props.edit && (
        <div className="px-[30px] bg-white pt-2 mb-4">
          <p className="uppercase font-nunito text-xs font-medium py-4 border-b">
            new post
          </p>
          <div className="relative flex items-end pb-5">
            <div className="w-[93%] pr-3">
              <ContentEditable
                html={post}
                onChange={(e) => postTypeHandler(e)}
                className="focus:outline-none relative z-20 py-2 pr-2"
              />
              {post ? (
                ""
              ) : (
                <p className="absolute z-10 top-2 left-0 text-lg font-nunito text-[rgba(24,24,24,0.2)] capitalize">
                  what's on your mind
                </p>
              )}
              {file && (
                <div className="flex items-center">
                  <>
                    {file.length > 2
                      ? file.map((item, index) =>
                          index === 1 ? (
                            <div className="relative flex-1 mx-1" key={index}>
                              <img
                                src={item}
                                alt=""
                                className="h-[250px]"
                              ></img>
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
                                <img
                                  src={item}
                                  alt=""
                                  className="h-[250px]"
                                ></img>
                              </div>
                            )
                          )
                        )
                      : file.map((item, index) => (
                          <div className="flex-1 mx-1" key={index}>
                            <img src={item} alt="" className="h-[250px]"></img>
                          </div>
                        ))}
                  </>
                </div>
              )}
            </div>
            <div className="relative">
              <BsCardImage className="text-theme justify-end cursor-pointer" />
              <input
                className="opacity-0 h-full absolute top-0 left-0 w-4 cursor-pointer"
                type="file"
                onChange={(e) => imageHandler(e)}
              />
            </div>
            <RiSendPlaneFill
              className="text-theme text-2xl ml-3 cursor-pointer"
              onClick={() => submitHandler()}
            />
          </div>
        </div>
      )}

      <Pagination
        perpage={5}
        data={result}
        id={props.id ? props.id : user && user.uid}
        userInfo={props.users}
        del={setShowDel}
        delID={setDeleteID}
      />
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
        <div className="absolute top-0 left-0 w-full h-screen">
          <div className="relative w-full h-screen bg-[#0004]">
            <div className="absolute top-2/4 w-2/4 translate-x-1/2 -translate-y-1/2 bg-white">
              <div className="pb-3 border-b flex justify-end mb-4 pr-5 pt-5">
                <MdOutlineClose
                  className="text-2xl cursor-pointer"
                  onClick={() => setIsopen(false)}
                />
              </div>
              <Gallery>
                {file.map((item, index) => (
                  <div key={index} className="inline-block w-1/3 px-2">
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
      {showDel && (
        <Confirm
          show={setShowDel}
          id={deleteID}
          id2={null}
          name="post"
          data={getUpdatedData}
          delModal={setShowDel}
        />
      )}
    </>
  );
};

export default Post;
