import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import FriendRequests from "../modals/FriendRequests";
import Profile from "../modals/Profile";
import { useAppSelector } from "../redux/hooks";
import profileDefault from "../images/profile.jpg";
import { BsMessenger } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import Notifications from "../modals/Notifications";
import Messenger from "../modals/messenger/Messenger";
import { AiOutlineSearch } from "react-icons/ai";
import Search from "../modals/Search";

const Navbar = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [reqOpen, setReqOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setOpenMessages] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const requestsCount = useAppSelector((state) => state.request.requests);
  const notificationsCount = useAppSelector(
    (state) => state.notification.notificationCount
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const arrivedMessages = useAppSelector((state) => state.chat.arrivedMessages);

  return (
    <div className="flex items-center justify-between border bg-white text-white p-3 sticky top-0 z-20">
      <div className="relative flex items-center space-x-2">
        <Link className="text-2xl text-blue-500 font-bold" to="/home">
          UN
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSearchOpen(true);
          }}
          className="bg-gray-200 w-[2.1rem] h-[2.1rem] flex items-center justify-center rounded-full hover:bg-gray-300 text-blue-500 text-xl outline-none"
        >
          <AiOutlineSearch />
        </button>

        {/* (searchSuggestions.length > 0 || searchOpen) */}

        {searchOpen && <Search setSearchOpen={setSearchOpen} />}
      </div>

      <div className="relative flex items-center space-x-2">
        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setOpenNotification((prev) => !prev);
            }}
          >
            <IoIosNotifications size={25} className="text-blue-500" />
          </button>

          {notificationsCount !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {notificationsCount}
            </span>
          )}

          {openNotification && <Notifications />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setReqOpen((prev) => !prev);
            }}
          >
            <FaUserFriends size={22} className="text-blue-500" />
          </button>

          {requestsCount.length !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {requestsCount.length}
            </span>
          )}

          {reqOpen && <FriendRequests setReqOpen={setReqOpen} />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={() => setOpenMessages((prev) => !prev)}
          >
            <BsMessenger size={19} className="text-blue-500" />
          </button>

          {arrivedMessages?.length !== 0 &&
            arrivedMessages[0].sender_id !== loggedUserInfo.id && (
              <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
                {arrivedMessages.length}
              </span>
            )}

          {messagesOpen && <Messenger setOpenMessages={setOpenMessages} />}
        </div>

        <div className="relative">
          <img
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((prev) => !prev);
            }}
            src={loggedUserInfo?.image || profileDefault}
            alt=""
            className="w-[2.5rem] h-[2.5rem] border-2 rounded-[100%] hover:cursor-pointer"
          />

          {profileOpen && <Profile setProfileOpen={setProfileOpen} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
