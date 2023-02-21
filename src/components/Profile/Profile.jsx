import React, { useCallback, useEffect, useState } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Reuseable/Navbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref as dbRef,
  set,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { getAuth, updateProfile } from "firebase/auth";
import { userUpdate } from "../../Slices/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./About";
import Projects from "./Projects";
import Experience from "./Experience";
import Education from "./Education";
import Friends from "./Friends";
import Post from "./Post";
import { AiOutlineCloudUpload, AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router";
const Profile = () => {
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [educations, setEducations] = useState([]);
  const [info, setInfo] = useState({
    name: "",
    bio: "",
    about: "",
    cover: "",
    location: "",
  });
  const [cropper, setCropper] = useState("");
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [file, setFile] = useState("");
  const [active, setActive] = useState("profile");
  const storage = getStorage();
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userInfo.user);
  const user = JSON.parse(data);
  const auth = getAuth();
  const redirect = useNavigate();

  const getData = useCallback(
    (user) => {
      if (!data) {
        redirect("/login");
      } else {
        if (!user.emailVerified) {
          redirect("/verify");
        }
      }
      const usersArr = [];
      get(child(dbRef(db), `projects/${user.uid}`))
        .then((snapshot) => {
          setImage("");
          if (snapshot.val()) {
            const data = snapshot.val();
            setProjects(data.urls);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `experience/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const data = snapshot.val();
            setExperience(Object.entries(data));
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `users/`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const data = snapshot.val();
            setUsers(Object.entries(data));
            setUserList(Object.entries(data));
            Object.entries(data).map((item) => usersArr.push(item));
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `freind/`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const arr = [];
            const data = snapshot.val();
            const find = Object.entries(data).filter(
              (item) =>
                item[1].senderId === user.uid || item[1].recieverId === user.uid
            );
            find.map((item) =>
              item[1].senderId === user.uid && item[1].recieverId !== user.uid
                ? !arr.includes(item[1].recieverId) &&
                  arr.push(item[1].recieverId)
                : item[1].senderId !== user.uid &&
                  item[1].recieverId === user.uid
                ? !arr.includes(item[1].senderId) && arr.push(item[1].senderId)
                : null
            );
            setFriendList(Object.entries(data));
            setFriends(arr);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `education/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const data = snapshot.val();
            setExperience(Object.entries(data));
          }
        })
        .catch((error) => {
          console.error(error);
        });
      onValue(dbRef(db, "users/" + user.uid), (snapshot) => {
        const information = snapshot.val();
        setInfo((prev) => ({
          ...prev,
          bio: information && information.bio,
          name: information && information.name,
          about: information && information.about,
          cover: information && information.cover,
          location: information && information.location,
        }));
      });
      setInfo((prev) => ({
        ...prev,
        name: user && user.displayName,
      }));
      setModal(false);
      setImage("");
    },
    [db, data, redirect, setInfo]
  );

  const submitForm = () => {
    const toastid = toast.loading("Please wait...");
    if (file) {
      const storageRef = ref(storage, `${user.uid}_cover`);
      uploadString(storageRef, file, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(dbRef(db, "users/" + user.uid), {
            bio: info.bio ? info.bio : "",
            name: info.name ? info.name : "",
            about: info.about ? info.about : "",
            location: info.location ? info.location : "",
            profile: auth ? auth.currentUser.photoURL : "",
            cover: downloadURL,
          });
          updateProfile(auth.currentUser, {
            displayName: info.name,
          }).then(() => {
            localStorage.setItem("user", JSON.stringify(auth.currentUser));
            dispatch(userUpdate(JSON.stringify(auth.currentUser)));
            setModal(false);
            setImage("");
            setFile("");
            toast.update(toastid, {
              render: "Successfully Updated",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeButton: true,
            });
          });
        });
      });
    } else {
      set(dbRef(db, "users/" + user.uid), {
        bio: info.bio ? info.bio : "",
        name: info.name ? info.name : "",
        about: info.about ? info.about : "",
        cover: info.cover ? info.cover : "",
        profile: auth ? auth.currentUser.photoURL : "",
        location: info.location ? info.location : "",
      });
      updateProfile(auth.currentUser, {
        displayName: info.name,
      }).then(() => {
        localStorage.setItem("user", JSON.stringify(auth.currentUser));
        dispatch(userUpdate(JSON.stringify(auth.currentUser)));
        setModal(false);
        setImage("");
        setFile("");
        toast.update(toastid, {
          render: "Successfully Updated",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
      });
    }
  };

  const frindRequestHnadler = (id) => {
    set(dbRef(db, "freind/" + uuidv4()), {
      senderId: user && user.uid,
      recieverId: id,
      status: "pending",
    }).then(() => {
      get(child(dbRef(db), `freind/`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const arr = [];
            const data = snapshot.val();
            const find = Object.entries(data).filter(
              (item) =>
                item[1].senderId === user.uid || item[1].recieverId === user.uid
            );
            find.map((item) =>
              item[1].senderId === user.uid && item[1].recieverId !== user.uid
                ? !arr.includes(item[1].recieverId) &&
                  arr.push(item[1].recieverId)
                : item[1].senderId !== user.uid &&
                  item[1].recieverId === user.uid
                ? !arr.includes(item[1].senderId) && arr.push(item[1].senderId)
                : null
            );
            setFriendList(Object.entries(data));
            setFriends(arr);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
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

  const profileHandler = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      const image = cropper.getCroppedCanvas().toDataURL();
      setFile(image);
      setImage("");
    }
  };

  const profileUpload = () => {
    if (typeof cropper !== "undefined") {
      const toastid = toast.loading("Please wait...");
      const storageRef = ref(storage, user.uid);
      const file = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, file, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              set(dbRef(db, "users/" + user.uid), {
                bio: info.bio ? info.bio : "",
                name: info.name ? info.name : "",
                about: info.about ? info.about : "",
                cover: info.cover ? info.cover : "",
                profile: downloadURL,
                location: info.location ? info.location : "",
              });
              toast.update(toastid, {
                render: "Successfully Updated",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              setProfile("");
              localStorage.setItem("user", JSON.stringify(auth.currentUser));
              dispatch(userUpdate(JSON.stringify(auth.currentUser)));
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

  const findFriendsHandler = (e) => {
    const find = userList.filter((user) =>
      user[1].name.startsWith(e.target.value)
    );
    setUsers(find);
  };

  const setAbout = (about) => {
    setInfo((prev) => ({
      ...prev,
      about: about,
    }));
  };

  useEffect(() => {
    getData(JSON.parse(data));
  }, [data, getData]);

  return (
    <div className="bg-[#F7F9FB] relative min-h-screen">
      <Navbar
        name={user && user.displayName}
        image={user && user.providerData[0].photoURL}
      />
      <div className="xl:w-[1440px] w-full m-auto flex md:px-[130px]">
        <ToastContainer />
        <div className="xl:w-[850px] w-full mt-10">
          <div className="relative">
            <img
              src={info.cover ? info.cover : "background-b.png"}
              alt="background"
              className="w-full h-[180px]"
            />
            <button
              className="absolute top-5 right-8 bg-white px-4 py-2 flex items-center rounded"
              onClick={() => setModal(true)}
            >
              <BiMessageSquareEdit />
              <p className="text-xs font-nunito font-light ml-3">
                Edit Profile
              </p>
            </button>
          </div>
          <div className="md:flex items-center relative bg-white pb-8 rounded-b-lg shadow min-h-[170px]">
            <div className="group h-[170px] w-[170px] md:h-0 md:w-0 m-auto md:m-0">
              <img
                src={
                  user && user.providerData[0].photoURL
                    ? user.providerData[0].photoURL
                    : "default.png"
                }
                alt="profile"
                className="h-[170px] w-[170px] rounded-full border-[10px] border-white absolute -top-5 left-2/4 -translate-x-1/2 md:-translate-x-0 md:left-6"
              />
              <div className="absolute py-16 -top-5 left-2/4 -translate-x-1/2 md:-translate-x-0 md:left-6 h-[170px] w-[170px] rounded-full bg-[#0000006b] opacity-0 group-hover:opacity-100 duration-300 cursor-pointer">
                <AiOutlineCloudUpload className="text-white text-4xl m-auto" />
              </div>
              <input
                className="h-[170px] w-[170px] rounded-full opacity-0 absolute -top-5 left-2/4 -translate-x-1/2 md:-translate-x-0 md:left-6"
                type="file"
                onChange={profileHandler}
              />
            </div>
            <div className="md:ml-[210px] mt-3 md:pr-8 w-full text-center md:text-left px-3 md:px-0">
              <div className="md:flex justify-between items-center">
                <p className="font-nunito text-lg font-bold">
                  {user && user.displayName}
                </p>
                <p className="font-nunito text-[10px] font-light">
                  {info.location}
                </p>
              </div>
              <p className="font-nunito text-sm font-light mt-2">{info.bio}</p>
            </div>
          </div>
          <div className="mt-7 flex items-end border-b">
            <button
              className={`uppercase border w-1/3 font-nunito text-sm ${
                active === "profile"
                  ? "py-5 bg-theme text-white rounded-t-lg"
                  : "py-3 rounded-tl-lg"
              }`}
              onClick={() => setActive("profile")}
            >
              Profile
            </button>
            <button
              className={`uppercase border w-1/3 font-nunito text-sm ${
                active === "friends"
                  ? "py-5 bg-theme text-white rounded-t-lg"
                  : "py-3"
              }`}
              onClick={() => setActive("friends")}
            >
              Friends
            </button>
            <button
              className={`uppercase border w-1/3 font-nunito text-sm ${
                active === "post"
                  ? "py-5 bg-theme text-white rounded-t-lg"
                  : "py-3 rounded-tr-lg"
              }`}
              onClick={() => setActive("post")}
            >
              Post
            </button>
          </div>
          {active === "profile" && (
            <>
              <div className="mt-10 bg-white p-7 rounded">
                <About
                  about={info.about}
                  cover={info.cover}
                  setAbout={setAbout}
                  bio={info.bio}
                  id={user && user.uid}
                  edit={true}
                />
              </div>

              <div className="mt-10 bg-white p-7 rounded">
                <Projects
                  images={projects}
                  id={user && user.uid}
                  result={setProjects}
                  edit={true}
                />
              </div>
              <div className="mt-10 bg-white p-7 rounded">
                <Experience
                  id={user && user.uid}
                  data={experience}
                  experience={setExperience}
                  edit={true}
                />
              </div>
              <div className="mt-10 bg-white p-7 rounded">
                <Education
                  id={user && user.uid}
                  data={educations}
                  educations={setEducations}
                  edit={true}
                />
              </div>
            </>
          )}
          {active === "friends" && (
            <Friends
              data={friendList}
              userData={users && users}
              id={user && user.uid}
              dataUpdate={setFriends}
            />
          )}
          {active === "post" && <Post edit={true} users={users} />}
        </div>
        <div className="w-[290px] mt-10 ml-10 bg-white p-2 pt-5 hidden xl:block">
          <div className="text-center">
            <p className="text-xl font-nunito font-bold">Find People</p>
            <input
              className="py-2 px-3 font-nunito w-full rounded-full border border-[#9e9e9e] focus:outline-none"
              placeholder="Type Name"
              onChange={findFriendsHandler}
            />
          </div>
          <div className="mt-5">
            {users &&
              users.map((item, index) =>
                friends.length >= 1
                  ? item[0] !== user.uid &&
                    !friends.includes(item[0]) && (
                      <div
                        className="flex items-center relative pb-4 rounded-b-lg"
                        key={index}
                      >
                        <div className="w-24">
                          <img
                            src={item[1].profile}
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                          />
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <p className="font-nunito text-base font-bold">
                              {item[1].name}
                            </p>
                          </div>
                        </div>
                        <div
                          className="p-2 duration-200 cursor-pointer rounded-md border border-theme hover:bg-theme hover:text-white"
                          onClick={() => frindRequestHnadler(item[0])}
                        >
                          <AiOutlineUserAdd className="text-lg" />
                        </div>
                      </div>
                    )
                  : item[0] !== user.uid && (
                      <div
                        className="flex items-center relative pb-4 rounded-b-lg"
                        key={index}
                      >
                        <div className="w-24">
                          <img
                            src={item[1].profile}
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                          />
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <p className="font-nunito text-base font-bold">
                              {item[1].name}
                            </p>
                          </div>
                        </div>
                        <div
                          className="p-2 duration-200 cursor-pointer rounded-md border border-theme hover:bg-theme hover:text-white"
                          onClick={() => frindRequestHnadler(item[0])}
                        >
                          <AiOutlineUserAdd className="text-lg" />
                        </div>
                      </div>
                    )
              )}
          </div>
        </div>
      </div>
      {modal && (
        <div className="fixed top-0 left-0 w-full h-screen">
          <div className="relative w-full h-screen bg-[#0004]">
            <div className="absolute top-2/4 md:w-2/4 w-full md:translate-x-1/2 -translate-y-1/2 bg-white">
              <div className="pb-3 border-b flex justify-end mb-4 pr-5 pt-5">
                <MdOutlineClose
                  className="text-2xl cursor-pointer"
                  onClick={() => setModal(false)}
                />
              </div>
              <div className="p-7">
                <div>
                  <label className="text-base">Name</label>
                  <input
                    className="w-full py-2 px-2 border focus:outline-none rounded mt-2"
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    value={info.name}
                  />
                </div>
                <div>
                  <label className="text-base">Bio</label>
                  <textarea
                    className="w-full py-2 px-2 border focus:outline-none rounded mt-2"
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    value={info.bio && info.bio}
                  />
                </div>
                <div>
                  <label className="text-base">Address</label>
                  <input
                    className="w-full py-2 px-2 border focus:outline-none rounded mt-2"
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    value={info.location && info.location}
                  />
                </div>
                <div>
                  <label className="text-base">Image</label>
                  <input
                    className="w-full py-2 px-2 border focus:outline-none rounded mt-2"
                    type="file"
                    onChange={imageHandler}
                  />
                </div>
                {file && (
                  <div className="flex-1 mx-1">
                    <img src={file} alt="" className="h-[250px]"></img>
                  </div>
                )}
                <div className="text-center mt-5">
                  <button
                    className="text-base font-nunito font-semibold px-20 py-2 rounded-lg bg-teal-500 text-white"
                    onClick={submitForm}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {image && (
        <div className="fixed top-0 left-0 w-full h-screen z-20">
          <div className="relative w-full h-screen bg-[#000000b2]">
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
      {profile && (
        <div className="fixed top-0 left-0 w-full h-screen z-20">
          <div className="relative w-full h-screen bg-[#000000b2]">
            <div className="absolute top-2/4 w-2/4 h-2/4 translate-x-1/2 -translate-y-1/2">
              <Cropper
                style={{ height: "100%", width: "100%" }}
                src={profile}
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
                  onClick={() => profileUpload()}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
