import React, { useState, useEffect } from "react";
import PostOptions from "../modals/PostOptions";
import { OtherUserInfo, User } from "../types/types";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useAppSelector } from "../redux/hooks";
import { BiDotsVerticalRounded } from "react-icons/bi";
import profileDefault from "../images/profile.jpg";
import { MdArrowRight } from "react-icons/md";

interface Props {
  userId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  postId: number;
  sharedPostId?: number | null;
  createdAt?: Date | number;
  type: string | null;
  otherUserInfo?: OtherUserInfo;
}

const UserInfo = ({
  userId,
  postId,
  createdAt,
  type,
  sharedPostId,
  firstName,
  lastName,
  image,
  otherUserInfo,
}: Props) => {
  const [openOptions, setOpenOptions] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-2 p-3">
        <Link to={`/profile/${userId}`}>
          <img
            src={image || profileDefault}
            alt=""
            className="border-2 w-[3rem] h-[3rem] rounded-full"
          />
        </Link>
        <div>
          <div className="flex space-x-1 items-center">
            <div className="flex items-center">
              <span className="font-bold">
                {firstName} {lastName}
              </span>
              {otherUserInfo && (
                <>
                  <MdArrowRight size={25} />
                  <span className="font-bold">
                    {" "}
                    {otherUserInfo.firstName} {otherUserInfo.lastName}
                  </span>
                </>
              )}
            </div>

            {type === "shared" && <span> shared a post</span>}
            {type === "profile" && (
              <span className="block text-[0.8rem]">
                {" "}
                updated his profile picture
              </span>
            )}
            {type === "cover" && (
              <span className="block text-[0.9rem]">
                {" "}
                updated his cover picture
              </span>
            )}
          </div>
          <span className="text-[0.9rem]">
            {moment(createdAt).tz("Europe/Sarajevo").fromNow()}
          </span>
        </div>
      </div>

      {loggedUserInfo.id === userId && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenOptions((prev) => !prev);
            }}
          >
            <BiDotsVerticalRounded className="" size={30} />
          </button>

          {/* {openOptions && sharedPostId && <SharedPostOptions />} */}

          {openOptions && (
            <PostOptions
              setOpenOptions={setOpenOptions}
              postId={postId}
              userId={userId}
              type={type}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
