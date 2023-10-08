import React, { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import profileDefault from "../images/profile.jpg";
import { useNavigate } from "react-router-dom";
import {
  rejectFriendRequest,
  acceptFriendRequest,
} from "../services/FriendServices";
import { createNotification } from "../redux/notificationSlice";
import { friendRequestActions } from "../redux/friendRequestSlice";
import { SocketContext } from "../context/SocketContext";

const FriendRequests = () => {
  const requests = useAppSelector((state) => state.request.requests);
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const acceptRequestHandler = async (userId: number) => {
    const reqAccepted = await acceptFriendRequest(userId);

    if (reqAccepted) {
      dispatch(
        createNotification({ receiverId: userId, type: "friendRequest" })
      );

      dispatch(friendRequestActions.deleteFriendRequest(userId));

      socket?.emit("acceptFriendRequest", {
        senderInfo: loggedUserInfo,
        receiverId: userId,
      });

      const notification = {
        id: loggedUserInfo.id,
        first_name: loggedUserInfo.first_name,
        last_name: loggedUserInfo.last_name,
        image: loggedUserInfo.image,
        type: "friendRequest",
        created_at: new Date(),
        receiver_id: userId,
        post_id: null,
      };

      socket?.emit("sendNotification", notification);
    }
  };

  const rejectRequestHandler = async (userId: number) => {
    const reqRejected = await rejectFriendRequest(userId);

    if (reqRejected) {
      socket?.emit("rejectFriendRequest", userId);
      dispatch(friendRequestActions.deleteFriendRequest(userId));
    }
  };

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
              onClick={() => navigate(`/profile/${request.id}`)}
              src={request.image || profileDefault}
              alt=""
              className="border-2 w-[3rem] h-[3rem] rounded-full cursor-pointer"
            />

            <div className="flex flex-col">
              <span className="font-bold">
                {request.first_name} {request.last_name}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => acceptRequestHandler(request.id)}
                  type="submit"
                  className="bg-blue-500 text-[1rem] text-white rounded-md font-bold hover:bg-blue-600 px-2 py-1"
                >
                  Confirm
                </button>
                <button
                  onClick={() => rejectRequestHandler(request.id)}
                  className="border-2 border-blue-500 text-[1rem] rounded-md text-blue-500 hover:bg-gray-200 px-2 py-1"
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
