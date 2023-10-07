import React, { useContext } from "react";
import { User } from "../types/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { GrFormCheckmark } from "react-icons/gr";

import {
  sendFriendRequest,
  removeFromFriends,
} from "../services/FriendServices";
import { SocketContext } from "../context/SocketContext";
import { friendRequestActions } from "../redux/friendRequestSlice";

interface Request {
  status: boolean;
  receiver: number;
  sender: number;
}

interface Props {
  friendStatus: boolean;
  friendReqStatus: Request;
  setFriendStatus: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: User;
  setFriendReqStatus: React.Dispatch<React.SetStateAction<Request>>;
}

const ProfileButtons = ({
  friendStatus,
  userInfo,
  setFriendStatus,
  friendReqStatus,
  setFriendReqStatus,
}: Props) => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const { socket } = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const friendHandler = async () => {
    const friendRequestSent = await sendFriendRequest(userInfo.id);

    if (friendRequestSent) {
      socket?.emit("sendFriendRequest", {
        senderInfo: loggedUserInfo,
        receiverId: userInfo.id,
      });
      let updatedStatus = {
        status: true,
        receiver: userInfo.id,
        sender: loggedUserInfo.id,
      };

      setFriendReqStatus(updatedStatus);
    }
  };

  const unfriendHandler = async () => {
    const unfriended = await removeFromFriends(userInfo.id);

    if (unfriended) {
      dispatch(friendRequestActions.removeFromFriends(userInfo.id));
      setFriendStatus(false);
      socket?.emit("removeFromFriends", userInfo.id);
    }
  };

  return (
    <div className="mb-6 ml-5">
      {!friendReqStatus.status &&
        userInfo.id !== loggedUserInfo.id &&
        !friendStatus && (
          <button
            onClick={friendHandler} //
            type="submit"
            className="p-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Add to friends
          </button>
        )}

      {friendStatus && loggedUserInfo.id !== userInfo.id && (
        <div className="flex items-center space-x-2">
          <GrFormCheckmark />
          <span>Friends</span>
          <button
            onClick={unfriendHandler}
            type="submit"
            className="p-1 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Unfriend
          </button>
        </div>
      )}

      {friendReqStatus.status && loggedUserInfo.id !== userInfo.id && (
        <div className="flex items-center space-x-1">
          {" "}
          <GrFormCheckmark className="" />
          <span className="text-blue-600">pending friend request</span>
        </div>
      )}
    </div>
  );
};

export default ProfileButtons;
