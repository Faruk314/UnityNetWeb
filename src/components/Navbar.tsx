import React, { useEffect, useState } from "react";
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
import { ModalState } from "../types/types";

const Navbar = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const requestsCount = useAppSelector((state) => state.request.requests);
  const notificationsCount = useAppSelector(
    (state) => state.notification.notificationCount
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const arrivedMessages = useAppSelector((state) => state.chat.arrivedMessages);
  const [isOpen, setIsOpen] = useState<ModalState>({
    profile: false,
    messages: false,
    notifications: false,
    requests: false,
  });

  const toggleModal = (modalName: string) => {
    setIsOpen((prevState) => {
      const newState = { ...prevState };
      const modalState = prevState[modalName];

      // Close all other modals
      Object.keys(newState).forEach((key) => {
        if (key !== modalName) {
          newState[key] = false;
        }
      });

      // Toggle the target modal
      newState[modalName] = !modalState;

      return newState;
    });
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between p-3 text-white bg-white border">
      <div className="relative flex items-center space-x-2">
        <Link className="text-2xl font-bold text-blue-500" to="/home">
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
            className="bg-gray-200 w-[2.3rem] h-[2.2rem] md:w-[2.5rem] text-xl  md:text-2xl md:h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              toggleModal("notifications");
            }}
          >
            <IoIosNotifications className="text-blue-500" />
          </button>

          {notificationsCount !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {notificationsCount}
            </span>
          )}

          {isOpen.notifications && <Notifications />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.3rem] h-[2.2rem] md:w-[2.5rem] text-xl  md:text-2xl md:h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              toggleModal("requests");
            }}
          >
            <FaUserFriends className="text-blue-500" />
          </button>

          {requestsCount && requestsCount.length !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {requestsCount.length}
            </span>
          )}

          {isOpen.requests && <FriendRequests />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.3rem] h-[2.2rem] md:w-[2.5rem] text-xl  md:text-md md:h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={() => {
              toggleModal("messages");
            }}
          >
            <BsMessenger className="text-blue-500" />
          </button>

          {arrivedMessages?.length !== 0 &&
            arrivedMessages[0].sender_id !== loggedUserInfo.id && (
              <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
                {arrivedMessages.length}
              </span>
            )}

          {isOpen.messages && <Messenger />}
        </div>

        <div className="relative">
          <img
            onClick={(e) => {
              e.stopPropagation();
              toggleModal("profile");
            }}
            src={loggedUserInfo?.image || profileDefault}
            alt=""
            className="w-[2.5rem] h-[2.5rem] border-2 rounded-[100%] hover:cursor-pointer"
          />

          {isOpen.profile && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
