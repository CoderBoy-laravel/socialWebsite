import React from "react";
import { child, get, getDatabase, ref, remove } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Confirm = (props) => {
  const db = getDatabase();
  const confirmHandler = () => {
    if (props.id2) {
      const toastid = toast.loading("Please wait...");
      const selector = child(ref(db), `${props.name}/${props.id}/${props.id2}`);
      remove(selector).then(() => {
        get(child(ref(db), `${props.name}/${props.id}`))
          .then((snapshot) => {
            toast.update(toastid, {
              render: "Deleted Successfully",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeButton: true,
            });
            if (snapshot.val()) {
              const data = snapshot.val();
              props.data(Object.entries(data));
              props.show(false);
            } else {
              props.data([]);
              props.show(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
    } else if (props.id) {
      const toastid = toast.loading("Please wait...");
      const selector = child(ref(db), `${props.name}/${props.id}`);
      remove(selector).then(() => {
        toast.update(toastid, {
          render: "Deleted Successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        props.delModal(false);
      });
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="fixed top-0 left-0 w-full h-screen z-20">
        <div className="relative w-full h-screen bg-[#000000b2]">
          <div className="absolute top-2/4 w-1/4 h-1/4 -translate-x-1/2 -translate-y-1/2 bg-white left-1/2 text-center rounded-lg">
            <div className="p-5">
              <p className="text-lg">Are you Sure?</p>
              <p className="text-base">You want to delete this {props.name}?</p>
              <div className="flex justify-center items-center mt-10">
                <button
                  className="px-5 py-2 bg-theme text-white text-sm font-nunito mr-1 rounded"
                  onClick={confirmHandler}
                >
                  Confirm
                </button>
                <button
                  className="px-5 py-2 bg-red-400 text-white text-sm font-nunito ml-1 rounded"
                  onClick={() => props.show(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
