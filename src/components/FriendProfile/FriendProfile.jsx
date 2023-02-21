import React, { useCallback, useEffect, useState } from "react";
import "cropperjs/dist/cropper.css";
import { useSelector } from "react-redux";
import Navbar from "../Reuseable/Navbar";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref as dbRef,
} from "firebase/database";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "../Profile/About";
import Projects from "../Profile/Projects";
import Experience from "../Profile/Experience";
import Education from "../Profile/Education";
import Post from "../Profile/Post";
import { AiOutlineCloudUpload, AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate, useParams } from "react-router";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const FriendProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState("");
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [educations, setEducations] = useState([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [cover, setCover] = useState("");
  const [location, setLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [friends, setFriends] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.user);
  const user = JSON.parse(data);
  const [active, setActive] = useState("profile");
  const redirect = useNavigate();

  const getData = useCallback(
    (id) => {
      if (!data) {
        redirect("/login");
      } else {
        if (!user.emailVerified) {
          redirect("/verify");
        }
      }
      get(child(dbRef(db), `projects/${id}`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const data = snapshot.val();
            setProjects(data.urls);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `experience/${id}`))
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
            setFriends(arr);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef(db), `education/${id}`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const data = snapshot.val();
            setExperience(Object.entries(data));
          }
        })
        .catch((error) => {
          console.error(error);
        });
      onValue(dbRef(db, "users/" + id), (snapshot) => {
        const information = snapshot.val();
        setBio(information && information.bio);
        setName(information && information.name);
        setAbout(information && information.about);
        setCover(information && information.cover);
        setLocation(information && information.location);
        setProfile(information && information.profile);
      });
    },
    [db, data, redirect, user.emailVerified, user.uid]
  );
  const findFriendsHandler = (e) => {
    const find = userList.filter((user) =>
      user[1].name.startsWith(e.target.value)
    );
    setUsers(find);
  };
  useEffect(() => {
    getData(userId);
  }, [getData, userId]);
  return (
    <div className="bg-[#F7F9FB] relative min-h-screen">
      <Navbar
        name={user && user.displayName}
        image={user && user.providerData[0].photoURL}
      />
      <div className="w-[1440px] m-auto flex px-[130px]">
        <ToastContainer />
        <div className="w-[850px]">
          <div className="my-10">
            <Link to={"/profile"}>
              <span className="rounded-full bg-theme text-white py-2 font-bold flex items-center justify-center">
                <RiArrowGoBackFill />
                Go Back
              </span>
            </Link>
          </div>
          <div className="relative">
            <img
              src={cover ? cover : "/background-b.png"}
              alt="background"
              className="w-full h-[180px]"
            />
          </div>
          <div className="flex items-center relative bg-white pb-8 rounded-b-lg shadow min-h-[170px]">
            <div className="group">
              <img
                src={profile ? profile : "default.png"}
                alt="profile"
                className="h-[170px] w-[170px] rounded-full border-[10px] border-white absolute -top-5 left-6"
              />
              <div className="absolute py-16 -top-5 left-6 h-[170px] w-[170px] rounded-full bg-[#0000006b] opacity-0 group-hover:opacity-100 duration-300 cursor-pointer">
                <AiOutlineCloudUpload className="text-white text-4xl m-auto" />
              </div>
              <input
                className="h-[170px] w-[170px] rounded-full opacity-0 absolute -top-5 left-6"
                type="file"
              />
            </div>
            <div className="ml-[210px] mt-3 pr-8 w-full">
              <div className="flex justify-between items-center">
                <p className="font-nunito text-lg font-bold">{name}</p>
                <p className="font-nunito text-[10px] font-light">{location}</p>
              </div>
              <p className="font-nunito text-sm font-light mt-2">{bio}</p>
            </div>
          </div>
          <div className="mt-7 flex items-end border-b">
            <button
              className={`uppercase border px-[100px] font-nunito text-sm ${
                active === "profile"
                  ? "py-5 bg-theme text-white rounded-t-lg"
                  : "py-3 rounded-tl-lg"
              }`}
              onClick={() => setActive("profile")}
            >
              Profile
            </button>
            <button
              className={`uppercase border px-[100px] font-nunito text-sm ${
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
                  about={about}
                  cover={cover}
                  setAbout={setAbout}
                  bio={bio}
                  id={userId && userId}
                  edit={false}
                />
              </div>

              <div className="mt-10 bg-white p-7 rounded">
                <Projects
                  images={projects}
                  id={userId && userId}
                  result={setProjects}
                  edit={false}
                />
              </div>
              <div className="mt-10 bg-white p-7 rounded">
                <Experience
                  id={userId && userId}
                  data={experience}
                  experience={setExperience}
                  edit={false}
                />
              </div>
              <div className="mt-10 bg-white p-7 rounded">
                <Education
                  id={userId && userId}
                  data={educations}
                  educations={setEducations}
                  edit={false}
                />
              </div>
            </>
          )}
          {active === "post" && (
            <Post id={userId && userId} users={users} edit={false} />
          )}
        </div>
        <div className="w-[290px] mt-10 ml-10 bg-white p-2 pt-5">
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
                        <div className="p-2 duration-200 cursor-pointer rounded-md border border-theme hover:bg-theme hover:text-white">
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
                        <div className="p-2 duration-200 cursor-pointer rounded-md border border-theme hover:bg-theme hover:text-white">
                          <AiOutlineUserAdd className="text-lg" />
                        </div>
                      </div>
                    )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
