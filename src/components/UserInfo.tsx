import React, { useState } from "react";
import PostOptions from "../modals/PostOptions";
import { OtherUserInfo } from "../types/types";
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
  type?: string | null;
  otherUserInfo?: OtherUserInfo;
  imageType?: string;
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
  imageType,
}: Props) => {
  const [openOptions, setOpenOptions] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  return (
    <div className="flex items-center justify-between">
      <div className="flex p-3 space-x-2">
        <Link to={`/profile/${userId}`}>
          <img
            src={image || profileDefault}
            alt=""
            className="border-2  w-[3rem] h-[3rem] rounded-full"
          />
        </Link>
        <div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              <span className="font-bold text-[0.9rem]">
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

            {type === "shared" && (
              <span className="hidden md:block"> shared a post</span>
            )}
            {type === "profile" && (
              <span className="hidden md:block text-[0.6rem] md:text-[0.9rem]">
                {" "}
                updated his profile picture
              </span>
            )}
            {type === "cover" && (
              <span className="hidden md:block text-[0.6rem] md:text-[0.9rem]">
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
              imageType={imageType}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
