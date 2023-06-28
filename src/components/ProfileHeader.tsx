import React, { useState } from "react";
import { MdOutlinePhotoCamera } from "react-icons/md";
import AddPhoto from "../modals/photoModals/AddPhoto";
import ImageSlider from "../modals/ImageSlider";
import { User } from "../types/types";
import { useAppSelector } from "../redux/hooks";
import coverDefault from "../images/cover.jpg";
const profileDefault = require("../images/profile.jpg");

interface Props {
  userInfo: User;
}

const ProfileHeader = ({ userInfo }: Props) => {
  const [imageOpen, setImageOpen] = useState(false);
  const [openAddCoverPhoto, setOpenAddCoverPhoto] = useState(false);
  const [coverPhotoOpen, setOpenCoverPhoto] = useState(false);
  const [openAddPhoto, setOpenAddPhoto] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  return (
    <div className="relative h-[17rem] md:h-[30rem]">
      <img
        onClick={() => {
          userInfo.cover_image
            ? setOpenCoverPhoto(true)
            : setOpenCoverPhoto(false);
        }}
        src={userInfo.cover_image || coverDefault}
        alt=""
        className="w-full h-full hover:cursor-pointer"
      />

      {coverPhotoOpen && userInfo.cover_image !== null && (
        <ImageSlider
          userId={userInfo.id}
          setImageOpen={setOpenCoverPhoto}
          type={"cover"}
        />
      )}

      {loggedUserInfo.id === userInfo.id && (
        <button
          onClick={() => setOpenAddCoverPhoto(true)}
          className="absolute right-2 bottom-2 bg-white border-2 w-[3rem] rounded-md h-[2.5rem] flex items-center justify-center hover:bg-gray-200"
        >
          <MdOutlinePhotoCamera size={25} className="text-black" />
        </button>
      )}

      {openAddCoverPhoto && (
        <AddPhoto
          updateCoverPic={true}
          setOpenAddPhoto={setOpenAddCoverPhoto}
        />
      )}

      <div className="">
        <img
          onClick={() =>
            userInfo.image ? setImageOpen(true) : setImageOpen(false)
          }
          src={userInfo.image || profileDefault}
          alt=""
          className="absolute bottom-[-4rem] left-2 border-2 h-[8rem] w-[8rem] rounded-full hover:cursor-pointer"
        />
      </div>

      {loggedUserInfo.id === userInfo.id && (
        <button
          onClick={() => setOpenAddPhoto(true)}
          className="relative left-[7rem] bottom-[-1rem] bg-white border-2 w-[2.5rem] rounded-full h-[2.5rem] flex items-center justify-center hover:bg-gray-200"
        >
          <MdOutlinePhotoCamera size={25} className="text-black" />
        </button>
      )}

      {imageOpen && userInfo.image && (
        <ImageSlider
          userId={userInfo.id}
          setImageOpen={setImageOpen}
          type={"profile"}
        />
      )}

      {openAddPhoto && (
        <AddPhoto updateProfilePic={true} setOpenAddPhoto={setOpenAddPhoto} />
      )}
    </div>
  );
};

export default ProfileHeader;
