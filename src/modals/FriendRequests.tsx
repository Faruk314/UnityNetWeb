import React, { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getFriendRequests,
  rejectFriendRequest,
} from "../redux/friendRequestSlice";
import {
  createNotification,
  sendNotification,
} from "../redux/notificationSlice";

interface Props {
  setReqOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FriendRequests = ({ setReqOpen }: Props) => {
  const requests = useAppSelector((state) => state.request.requests);
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  const acceptRequestHandler = async (requestId: number) => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/acceptFriendRequest/${requestId}`
      );

      dispatch(
        sendNotification({
          id: loggedUserInfo.id,
          first_name: loggedUserInfo.first_name,
          last_name: loggedUserInfo.last_name,
          image: loggedUserInfo.image,
          type: "friendRequest",
          created_at: new Date(),
          receiver_id: requestId,
          post_id: null,
        })
      );
      dispatch(
        createNotification({ receiverId: requestId, type: "friendRequest" })
      );
      dispatch(getFriendRequests());
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequestHandler = async (requestId: number) => {
    try {
      await axios.delete(
        `http://localhost:7000/api/followers/rejectFriendRequest/${requestId}`
      );

      dispatch(rejectFriendRequest(requestId));
      dispatch(getFriendRequests());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setReqOpen(false);
    });
  });

  return (
    <div className="absolute top-[3.2rem] right-[-4rem] bg-white text-black shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-2 z-20">
      <h2 className="text-[1.2rem] text-center font-bold mb-3">
        Friend Requests
      </h2>
      <div className="flex flex-col space-y-3 overflow-y-auto h-[15rem] w-[17rem] py-2">
        {requests.length === 0 && (
          <p className="text-[0.9rem] text-center text-blue-500">
            You dont have any friend requests
          </p>
        )}
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center space-x-2 w-[15rem]"
          >
            <img
              src=""
              alt=""
              className="border-2 w-[3rem] h-[3rem] rounded-full"
            />

            <div className="flex flex-col">
              <span className="font-bold">
                {request.first_name} {request.last_name}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => acceptRequestHandler(request.id)}
                  type="submit"
                  className="bg-blue-500 text-[1rem] text-white rounded-md font-bold hover:bg-blue-600 px-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => rejectRequestHandler(request.id)}
                  className="border-2 border-blue-500 text-[1rem] rounded-md text-blue-500 hover:bg-gray-200 px-2"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
