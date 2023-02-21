import React, { useState } from "react";
import { useEffect } from "react";
import { FaUserClock } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { child, get, getDatabase, ref as dbRef, set } from "firebase/database";
import { Link } from "react-router-dom";

const Friends = (props) => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const db = getDatabase();

  const statusUpdateHandler = (recieverId, senderId, id) => {
    set(dbRef(db, "freind/" + id), {
      senderId: senderId,
      recieverId: recieverId,
      status: "approved",
    }).then(() => {
      get(child(dbRef(db), `freind/`))
        .then((snapshot) => {
          if (snapshot.val()) {
            const arr = [];
            const data = snapshot.val();
            const find = Object.entries(data).filter(
              (item) =>
                item[1].senderId === props.id || item[1].recieverId === props.id
            );
            find.map((item) =>
              item[1].senderId === props.id && item[1].recieverId !== props.id
                ? !arr.includes(item[1].recieverId) &&
                  arr.push(item[1].recieverId)
                : item[1].senderId !== props.id &&
                  item[1].recieverId === props.id
                ? !arr.includes(item[1].senderId) && arr.push(item[1].senderId)
                : null
            );
            setFriends(find);
            props.dataUpdate(arr);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  useEffect(() => {
    const find = props.data.filter(
      (item) => item[1].senderId === props.id || item[1].recieverId === props.id
    );
    setFriends(find);
    setUsers(props.userData);
  }, [props.data, props.userData, props.id]);
  return (
    <div className="mt-5">
      <div className="text-base font-nunito font-bold text-center">
        Friend Requests
      </div>
      <div className="mt-5">
        {users &&
          users.map(
            (item, index) =>
              friends.length >= 1 &&
              friends.map(
                (friend) =>
                  item[0] !== props.id &&
                  ((friend[1].senderId === props.id &&
                    friend[1].recieverId === item[0]) ||
                    (friend[1].recieverId === props.id &&
                      friend[1].senderId === item[0])) && (
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
                        <Link to={`/profile/${item[0]}`}>
                          <div className="flex justify-between items-center">
                            <p className="font-nunito text-base font-bold">
                              {item[1].name}
                            </p>
                          </div>
                        </Link>
                      </div>
                      {friend[1].status === "pending" ? (
                        friend[1].senderId !== props.id ? (
                          <div
                            onClick={() =>
                              statusUpdateHandler(
                                props.id,
                                friend[1].senderId,
                                friend[0]
                              )
                            }
                            className="p-2 duration-200 cursor-pointer rounded-md border bg-amber-400 border-amber-400 text-white hover:bg-amber-400 hover:text-white"
                          >
                            <FaUserClock className="text-lg" />
                          </div>
                        ) : (
                          <div className="p-2 duration-200 cursor-pointer rounded-md border bg-amber-400 border-amber-400 text-white hover:bg-amber-400 hover:text-white">
                            <FaUserClock className="text-lg" />
                          </div>
                        )
                      ) : (
                        <div className="p-2 duration-200 cursor-pointer rounded-md border bg-green-400 text-white hover:border-green-400 hover:bg-green-400 hover:text-white">
                          <FiUserCheck className="text-lg" />
                        </div>
                      )}
                    </div>
                  )
              )
          )}
      </div>
    </div>
  );
};

export default Friends;
