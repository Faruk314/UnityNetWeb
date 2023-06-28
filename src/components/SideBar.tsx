import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AllFriends from "../modals/AllFriends";
import { AiFillEdit } from "react-icons/ai";
import profileDefault from "../images/profile.jpg";

const SideBar = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const navigate = useNavigate();
  const [openFriends, setOpenFriends] = useState(false);

  return (
    <div className="hidden md:block md:w-[30rem] lg:w-[25rem] mt-5 font-bold bg-white rounded-md p-2 sticky top-[6rem] h-max shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10">
      <span className="p-2 text-2xl">Profile</span>

      <div className="mt-5">
        <div
          onClick={() => navigate(`/profile/${loggedUserInfo.id}`)}
          className="flex items-center justify-between p-2 mt-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-2">
            <img
              src={loggedUserInfo.image || profileDefault}
              alt=""
              className="rounded-full border-2 w-[2.5rem] h-[2.2rem]"
            />
            <span className="font-bold">{loggedUserInfo.first_name}</span>
            <span className="font-bold">{loggedUserInfo.last_name}</span>
          </div>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenFriends(true);
          }}
          className="flex items-center justify-between p-2 mt-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-2">
            <FaUserFriends size={30} className="text-blue-500" />

            <span className="font-bold">View</span>
            <span className="font-bold">Friends</span>
          </div>

          {openFriends && (
            <AllFriends
              id={loggedUserInfo.id}
              setOpenAllFriends={setOpenFriends}
            />
          )}
        </div>

        <div
          onClick={() => navigate(`/editProfile/${loggedUserInfo.id}`)}
          className="flex items-center justify-between p-2 mt-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-2">
            <AiFillEdit size={30} className="text-blue-500" />
            <span className="font-bold">Edit</span>
            <span className="font-bold">profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
