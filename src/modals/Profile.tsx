import React, { useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { authActions } from "../redux/authSlice";

interface Props {
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile = ({ setProfileOpen }: Props) => {
  const navigate = useNavigate();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", () => {
      setProfileOpen(false);
    });
  }, [setProfileOpen]);

  const logoutHandler = async () => {
    try {
      await axios.get(`http://localhost:7000/api/auth/logout`);
      dispatch(authActions.setLogin(false));
      navigate("/");
    } catch (err) {}
  };

  return (
    <div className="absolute right-0 top-[3.1rem] w-[10rem] bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 rounded-md z-20 text-black">
      <div className="flex flex-col space-y-2">
        <Link to={`/profile/${loggedUserInfo.id}`}>
          <button className="flex items-center space-x-2 hover:text-blue-500">
            <CgProfile />
            <span>View profile</span>
          </button>
        </Link>

        <button
          onClick={logoutHandler}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <BiLogOut />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
