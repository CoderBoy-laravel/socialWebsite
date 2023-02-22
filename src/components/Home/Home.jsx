import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { BsCardImage } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref as fiRef,
  set,
} from "firebase/database";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Navbar from "../Reuseable/Navbar";
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

const Home = () => {
  const redirect = useNavigate();
  const [result, setResult] = useState([]);
  const [post, setPost] = useState("");
  const [isopen, setIsopen] = useState(false);
  const [file, setFile] = useState([]);
  const [image, setImage] = useState("");
  const [cropper, setCropper] = useState("");
  const [bio, setBio] = useState("");
  const [cover, setCover] = useState("");
  const [users, setUsers] = useState([]);
  const [deleteID, setDeleteID] = useState("");
  const [showDel, setShowDel] = useState(false);
  const data = useSelector((state) => state.userInfo.user);
  const db = getDatabase();
  const storage = getStorage();
  const user = JSON.parse(data);

  useEffect(() => {
    if (!data) {
      redirect("/login");
    } else {
      if (!user.emailVerified) {
        redirect("/verify");
      }
    }
    get(child(fiRef(db), `post`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const resultArr = Object.entries(snapshot.val());
          resultArr.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
          setResult(resultArr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    get(child(fiRef(db), `users/`))
      .then((snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          setUsers(Object.entries(data));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    onValue(fiRef(db, "users/" + user.uid), (snapshot) => {
      const information = snapshot.val();
      setBio(information && information.bio);
      setCover(information && information.cover);
    });
  }, [user, data, db, redirect]);

  const postTypeHandler = (e) => {
    setPost(e.target.value);
  };
  const getUpdatedData = () => {
    get(child(fiRef(db), `post`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const resultArr = Object.entries(snapshot.val());
          resultArr.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
          setResult(resultArr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
      const toastid = toast.loading("Please wait...");
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
          toast.update(toastid, {
            render: "Post Submitted Successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
            closeButton: true,
          });
          get(child(fiRef(db), `post`))
            .then((snapshot) => {
              const resultArr = Object.entries(snapshot.val());
              resultArr.sort(
                (a, b) => new Date(b[1].date) - new Date(a[1].date)
              );
              setPost("");
              setFile([]);
              setResult(resultArr);
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
    <div className="bg-[#F7F9FB] relative min-h-screen">
      <ToastContainer />
      <Navbar
        name={user && user.displayName}
        image={user && user.providerData[0].photoURL}
      />
      <div className="xl:w-[1440px] w-full m-auto lg:flex lg:px-[130px] px-5">
        <div className="xl:w-[850px] w-full mt-10">
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
                  <div className="flex items-center mt-5">
                    <>
                      {file.length > 2
                        ? file.map((item, index) =>
                            index === 1 ? (
                              <div className="relative flex-1 mx-1" key={index}>
                                <img
                                  src={item}
                                  alt=""
                                  className="md:h-[250px]"
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
                                    className="md:h-[250px]"
                                  ></img>
                                </div>
                              )
                            )
                          )
                        : file.map((item, index) => (
                            <div className="flex-1 mx-1" key={index}>
                              <img
                                src={item}
                                alt=""
                                className="md:h-[250px]"
                              ></img>
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
          <Pagination
            perpage={5}
            data={result}
            id={user && user.uid}
            userInfo={users}
            del={setShowDel}
            delID={setDeleteID}
          />
        </div>
        <div className="w-[290px] mt-10 ml-10 relative xl:block hidden">
          <div>
            <img
              src={cover ? cover : "background-b.png"}
              alt="background"
              className="h-28"
            />
            <img
              src={
                user && user.providerData[0].photoURL
                  ? user.providerData[0].photoURL
                  : "default.png"
              }
              alt="profile"
              className="absolute top-14 h-[100px] left-1/2 -translate-x-1/2 w-[100px] rounded-full border-4 border-white m-auto"
            />
          </div>
          <div className="p-1 text-center bg-white pt-14 pb-6">
            <p className="text-sm font-nunito font-bold">
              {user && user.displayName}
            </p>
            <p className="text-xs font-nunito font-light px-6">{bio}</p>
          </div>
        </div>
      </div>
      {image && (
        <div className="fixed top-0 left-0 w-full h-screen z-20">
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
    </div>
  );
};

export default Home;
