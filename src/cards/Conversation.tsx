import React, { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import profileDefault from "../images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { chatActions } from "../redux/chatSlice";
import { BiCheckDouble } from "react-icons/bi";
import moment from "moment-timezone";

interface Props {
  id: number;
  conversationId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  lastMessage: string | null;
  senderId: number | null;
  seenAt: Date | null;
}

const Conversation = ({
  id,
  firstName,
  lastName,
  image,
  conversationId,
  lastMessage,
  senderId,
  seenAt,
}: Props) => {
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const modifiedMessage =
    lastMessage && lastMessage.length > 15
      ? `${lastMessage?.slice(0, 15)}...`
      : lastMessage;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          chatActions.setChat({
            userId: id,
            firstName,
            lastName,
            image,
            conversationId,
            open: true,
          })
        );
      }}
      key={id}
      className="flex items-center justify-between p-1 space-x-4 rounded-md hover:bg-gray-100 hover:cursor-pointer"
    >
      <div className="flex space-x-3">
        <div className="">
          <img
            className="border-2 w-[3rem] h-[3rem] rounded-full"
            alt=""
            src={image || profileDefault}
          />
        </div>

        <div className="">
          <h3 className="font-bold">
            {firstName} {lastName}
          </h3>
          {lastMessage && (
            <span
              className="text-[0.9rem]"
              style={
                senderId !== loggedUserInfo.id && !seenAt
                  ? { color: "#3B82F6", fontWeight: "bold" }
                  : {}
              }
            >
              {senderId === loggedUserInfo.id && `You: ${modifiedMessage}`}
              {senderId !== loggedUserInfo.id && modifiedMessage}
            </span>
          )}
        </div>
      </div>

      {seenAt && senderId === loggedUserInfo.id && (
        <div
          className="relative"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <BiCheckDouble className="text-blue-500" size={20} />

          {isHovering && (
            <div className="absolute bottom-4 right-0 w-max py-4 px-2 h-[1.5rem] text-[0.9rem] flex items-center justify-center text-white bg-black opacity-[0.6] rounded-md">
              <span>
                seen by {firstName} {lastName}{" "}
                {moment(seenAt).tz("Europe/Sarajevo").fromNow()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Conversation;
