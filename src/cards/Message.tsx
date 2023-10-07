import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import profileDefault from "../images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { SocketContext } from "../context/SocketContext";

interface Props {
  id: number;
  message: string;
  userImage: string;
  receiverId: number;
  messageId: number;
  lastSeen: null | number;
  firstName: string;
  lastName: string;
}

const Message = ({
  id,
  message,
  userImage,
  messageId,
  lastSeen,
  firstName,
  lastName,
}: Props) => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    const markMessageAsSeen = async () => {
      try {
        await axios.put(
          `http://localhost:7000/api/messages/markMessageAsSeen/${messageId}`
        );

        let data = {
          message_id: messageId,
          receiver_id: id,
          sender_id: loggedUserInfo.id,
          seen_at: new Date(),
        };

        socket?.emit("emitSeen", data);
      } catch (err) {
        console.log(err);
      }
    };

    if (id !== loggedUserInfo.id) {
      markMessageAsSeen();
    }
  }, [id, loggedUserInfo, messageId, socket]);

  return (
    <div
      className="relative flex space-x-2"
      style={
        id === loggedUserInfo.id
          ? { alignSelf: "flex-end" }
          : { alignSelf: "flex-start" }
      }
    >
      {id !== loggedUserInfo.id && (
        <img
          src={userImage || profileDefault}
          alt=""
          className="border-2 w-[2rem] h-[2rem] rounded-full mt-2"
        />
      )}

      <div
        className="text-[0.9rem] py-1 px-3 rounded-lg max-w-[11rem] mt-2"
        style={
          id !== loggedUserInfo.id
            ? {
                backgroundColor: "#F3F4F6",
                color: "black",
              }
            : { backgroundColor: "#1A56DB", color: "white" }
        }
      >
        {message}
      </div>

      {lastSeen && id === loggedUserInfo.id && (
        <div
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          className="absolute bottom-[-1.2rem] right-[-0.2rem]"
        >
          <BiCheckDouble className="text-blue-500" size={20} />

          {isHovering && (
            <div className="absolute bottom-4 right-0 w-max py-4 px-2 h-[1.5rem] text-[0.9rem] flex items-center justify-center text-white bg-black opacity-[0.6] rounded-md">
              <span>
                seen by {firstName} {lastName}{" "}
                {moment(lastSeen).tz("Europe/Sarajevo").fromNow()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
