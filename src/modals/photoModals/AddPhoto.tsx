import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import uploadPhoto from "../../images/uploadPhoto.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { fetchPosts, fetchUserPosts, postActions } from "../../redux/postSlice";
import profileDefault from "../../images/profile.jpg";
import Confirmation from "../Confirmation";

interface Props {
  setOpenAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfilePic?: boolean;
  updateCoverPic?: boolean;
  profileId?: number;
}

const AddPhoto = ({
  setOpenAddPhoto,
  updateProfilePic,
  updateCoverPic,
  profileId,
}: Props) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [photo, setPhoto] = useState<any>("");
  const [confirmation, setConfirmation] = useState(false);

  const addPhotoHandler = async () => {
    // if (!imagePreview) {
    //   setMessage("Please add your image");
    //   return;
    // }

    let data = new FormData();

    data.append("description", description);
    data.append("photo", photo);
    if (profileId) {
      data.append("profileId", String(profileId));
    }

    try {
      if (profileId) {
        await axios.post(`http://localhost:7000/api/posts/addPhoto`, data);

        dispatch(fetchUserPosts(profileId));
      }

      if (!profileId && !updateProfilePic && !updateCoverPic) {
        await axios.post(`http://localhost:7000/api/posts/addPhoto`, data);

        dispatch(fetchPosts());
      }

      if (updateProfilePic) {
        await axios.put(
          `http://localhost:7000/api/photos/uploadProfilePicture`,
          data
        );

        dispatch(postActions.setPhotoUploaded(true));
        dispatch(fetchUserPosts(loggedUserInfo.id));
      }

      if (updateCoverPic) {
        await axios.put(
          `http://localhost:7000/api/photos/uploadCoverPicture`,
          data
        );

        dispatch(postActions.setPhotoUploaded(true));
        dispatch(fetchUserPosts(loggedUserInfo.id));
      }

      setConfirmation(true);
    } catch (err) {
      console.log(err);
    }
  };

  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    setImagePreview(URL.createObjectURL(e.target?.files[0]));
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="relative p-3 mx-3 bg-white rounded-md">
        {!updateCoverPic && !updateProfilePic && (
          <h2 className="text-2xl font-bold text-center">Add photo</h2>
        )}
        {updateProfilePic && (
          <h2 className="text-2xl font-bold text-center">Add profile photo</h2>
        )}
        {updateCoverPic && (
          <h2 className="text-2xl font-bold text-center">Add cover photo</h2>
        )}
        <button
          onClick={() => {
            setOpenAddPhoto(false);
          }}
          className="absolute top-3 right-2 font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] hover:bg-gray-300"
        >
          X
        </button>
        <div className="flex items-center my-4 space-x-2">
          <Link to={`/profile/${userInfo.id}`}>
            <img
              alt=""
              src={userInfo.image || profileDefault}
              className="w-[3rem] h-[3rem] rounded-full border-2"
            />
          </Link>
          <h3 className="font-bold">
            {userInfo.first_name} {userInfo.last_name}
          </h3>
        </div>

        <div className="my-4">
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-100 rounded-md outline-none"
            value={description}
            placeholder="add description"
          />
        </div>

        <div>
          <span className="font-bold">Upload your photo</span>
          <img
            src={imagePreview || uploadPhoto}
            alt=""
            className="bg-gray-100 w-full h-[10rem]"
          />

          <input
            name="photo"
            onChange={imageChangeHandler}
            type="file"
            className="relative my-4 m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 dark:border-neutral-600 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 dark:text-neutral-200 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 dark:file:bg-neutral-700 file:px-3 file:py-[0.32rem] file:text-neutral-700 dark:file:text-neutral-100 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
          />
        </div>

        <button
          onClick={addPhotoHandler}
          type="submit"
          className="p-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>
      {confirmation && (
        <Confirmation
          message="Photo successfully uploaded"
          setOpen={setOpenAddPhoto}
        />
      )}
    </div>
  );
};

export default AddPhoto;
