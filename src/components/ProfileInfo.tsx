import React from "react";
import { AiFillHome } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { useAppSelector } from "../redux/hooks";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";

interface UserInfo extends User {
  last_active: number | null;
  country: string | null;
  city: string | null;
}

interface Props {
  userInfo: UserInfo;
}

const ProfileInfo = ({ userInfo }: Props) => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const navigate = useNavigate();

  return (
    <div className="p-3 flex flex-col space-y-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mx-2 rounded-md min-w-[10rem] max-w-[30rem] mb-6">
      <span className="flex items-center space-x-2">
        <span className="font-bold">Country:</span>
        <span>{userInfo.country}</span>
      </span>

      <span className="flex items-center space-x-2">
        <span className="font-bold">City:</span>
        <span>{userInfo.city}</span>
      </span>

      {loggedUserInfo.id === userInfo.id && (
        <button
          onClick={() => navigate(`/editProfile/${loggedUserInfo.id}`)}
          className="bg-blue-500 text-white p-2 rounded-md font-bold hover:bg-blue-600 w-max"
        >
          Edit profile
        </button>
      )}
    </div>
  );
};

export default ProfileInfo;
