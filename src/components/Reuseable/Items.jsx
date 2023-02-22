import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import EditPost from "../Home/EditPost";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { BsThreeDots } from "react-icons/bs";
import ContentEditable from "react-contenteditable";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const Items = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [dropId, setDropId] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.userInfo.user);
  const user = JSON.parse(userData);
  useEffect(() => {
    const arr = [];
    props.currentItems.map((item, index) =>
      props.userInfo.map(
        (user, userIndex) =>
          item[1].id === user[0] &&
          arr.push({
            postId: item[0],
            data: item[1],
            info: user[1],
          })
      )
    );
    setData(arr);
  }, [props.currentItems, props.userInfo]);
  return (
    <>
      {data.map((item, index) =>
        edit ? (
          editId === item.postId ? (
            <EditPost
              id={editId}
              uid={props.uid}
              post={item.data}
              key={index}
              result={props.result}
              edit={setEdit}
              info={item.info}
              setting="own"
            />
          ) : (
            <div className="mt-5 bg-white" key={index}>
              {user.uid === item.data.id && (
                <div className="py-5 px-3 border-b relative">
                  <BsThreeDots
                    className="ml-auto text-2xl cursor-pointer"
                    data-id={item.postId}
                    onClick={() => {
                      if (dropId === index) {
                        setDropdown(!dropdown);
                        setDropId(index);
                      } else {
                        setDropdown(true);
                        setDropId(index);
                      }
                    }}
                  />
                  {dropdown && dropId === index ? (
                    <ul className="absolute top-11 right-0 rounded shadow bg-white z-10 w-40">
                      <li
                        onClick={() => {
                          setEdit(true);
                          setEditId(item.postId);
                          setDropdown(!dropdown);
                        }}
                        className="w-full py-3 pl-5 hover:bg-theme hover:text-white flex items-center justify-start cursor-pointer border-b rounded-t"
                      >
                        <FiEdit className="mr-3" />
                        Edit
                      </li>
                      <li
                        className="w-full py-3 pl-5 hover:bg-[#ff5151] hover:text-white flex items-center justify-start cursor-pointer rounded-b"
                        onClick={() => {
                          setDropdown(false);
                          props.del(true);
                          props.delID(item.postId);
                        }}
                      >
                        <MdDeleteOutline className="mr-3 text-xl" />
                        Delete
                      </li>
                    </ul>
                  ) : null}
                </div>
              )}

              <div className="pb-5 pt-1 shadow rounded">
                <div className="px-3 flex items-center mt-4">
                  <img
                    src={
                      item.info.profile.length > 3
                        ? item.info.profile
                        : "default.png"
                    }
                    alt="profile"
                    className="w-[52px] h-[52px] rounded-full"
                  />
                  <p className="font-nunito text-sm font-bold ml-3">
                    {item.data.name}
                  </p>
                </div>
                <ContentEditable
                  html={item.data.post}
                  disabled={true}
                  className="text-base font-nunito px-3 mt-4"
                />
                <div className="mt-3">
                  {item.data.images &&
                    (item.data.images.length > 1 ? (
                      <Zoom scale={0.4}>
                        {item.data.images.map((slideImage, imageindex) => (
                          <div key={imageindex}>
                            <div
                              className="flex items-center justify-center bg-cover md:h-[400px] h-[200px]"
                              style={{
                                backgroundImage: `url(${slideImage})`,
                              }}
                            ></div>
                          </div>
                        ))}
                      </Zoom>
                    ) : (
                      item.data.images.map((slideImage, imageindex) => (
                        <div key={imageindex}>
                          <div
                            className="flex items-center justify-center bg-cover md:h-[400px] h-[200px]"
                            style={{
                              backgroundImage: `url(${slideImage})`,
                            }}
                          ></div>
                        </div>
                      ))
                    ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="mt-5 bg-white" key={index}>
            {user.uid === item.data.id && (
              <div className="py-5 px-3 border-b relative">
                <BsThreeDots
                  className="ml-auto text-2xl cursor-pointer"
                  data-id={item.data.id}
                  onClick={() => {
                    if (dropId === index) {
                      setDropdown(!dropdown);
                      setDropId(index);
                    } else {
                      setDropdown(true);
                      setDropId(index);
                    }
                  }}
                />
                {dropdown && dropId === index ? (
                  <ul className="absolute top-11 right-0 rounded shadow bg-white z-10 w-40">
                    <li
                      onClick={() => {
                        setEdit(true);
                        setEditId(item.postId);
                        setDropdown(!dropdown);
                      }}
                      className="w-full py-3 pl-5 hover:bg-theme hover:text-white flex items-center justify-start cursor-pointer border-b rounded-t"
                    >
                      <FiEdit className="mr-3" />
                      Edit
                    </li>
                    <li
                      className="w-full py-3 pl-5 hover:bg-[#ff5151] hover:text-white flex items-center justify-start cursor-pointer rounded-b"
                      onClick={() => {
                        setDropdown(false);
                        props.del(true);
                        props.delID(item.postId);
                      }}
                    >
                      <MdDeleteOutline className="mr-3 text-xl" />
                      Delete
                    </li>
                  </ul>
                ) : null}
              </div>
            )}
            <div className="pb-5 pt-1 shadow rounded">
              <div className="px-3 flex items-center mt-4">
                <img
                  src={
                    item.info.profile.length > 3
                      ? item.info.profile
                      : "default.png"
                  }
                  alt="profile"
                  className="w-[52px] h-[52px] rounded-full"
                />
                <p className="font-nunito text-sm font-bold ml-3">
                  {item.data.name}
                </p>
              </div>
              <ContentEditable
                html={item.data.post}
                disabled={true}
                className="text-base font-nunito px-3 mt-4"
              />
              <div className="mt-3">
                {item.data.images &&
                  (item.data.images.length > 1 ? (
                    <Zoom scale={0.4}>
                      {item.data.images.map((slideImage, imageindex) => (
                        <div key={imageindex}>
                          <div
                            className="flex items-center justify-center bg-cover md:h-[400px] h-[200px]"
                            style={{
                              backgroundImage: `url(${slideImage})`,
                            }}
                          ></div>
                        </div>
                      ))}
                    </Zoom>
                  ) : (
                    item.data.images.map((slideImage, imageindex) => (
                      <div key={imageindex}>
                        <div
                          className="flex items-center justify-center bg-cover md:h-[400px] h-[200px]"
                          style={{
                            backgroundImage: `url(${slideImage})`,
                          }}
                        ></div>
                      </div>
                    ))
                  ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Items;
