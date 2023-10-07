import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User } from "../types/types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Post from "../cards/Post";
import { fetchUserPosts, postActions } from "../redux/postSlice";
import Navbar from "../components/Navbar";
import ProfileInfo from "../components/ProfileInfo";
import ProfileFriends from "../components/ProfileFriends";
import ProfileHeader from "../components/ProfileHeader";
import ProfileButtons from "../components/ProfileButtons";
import profileDefault from "../images/profile.jpg";
import CreatePost from "../modals/CreatePost";
import { SlPicture } from "react-icons/sl";
import AddPhoto from "../modals/photoModals/AddPhoto";
import { getFriendStatus } from "../services/FriendServices";

interface UserInfo extends User {
  last_active: number | null;
  country: string | null;
  city: string | null;
}

const Profile = () => {
  const [openAddPhoto, setOpenAddPhoto] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const friends = useAppSelector((state) => state.request.friends);
  const friendRequests = useAppSelector((state) => state.request.requests);
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    first_name: "",
    last_name: "",
    image: "",
    cover_image: "",
    last_active: null,
    country: null,
    city: null,
  });
  const [friendStatus, setFriendStatus] = useState(false);
  const posts = useAppSelector((state) => state.post.userPosts);
  const { id } = useParams();
  const userId = parseInt(id!);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const photoDeleted = useAppSelector((state) => state.post.photoDeleted);
  const photoUploaded = useAppSelector((state) => state.post.photoUploaded);

  useEffect(() => {
    dispatch(postActions.emptyPosts());
  }, [dispatch]);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `http://localhost:7000/api/users/getUserInfo/${userId}`
      );

      dispatch(postActions.setPhotoUploaded(false));
      dispatch(postActions.setPhotoDeleted(false));
      setUserInfo(response.data);
    };

    if (userId) {
      getUser();
    }
  }, [userId, photoDeleted, photoUploaded, dispatch]);

  useEffect(() => {
    if (userId) dispatch(fetchUserPosts(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const friendStatusHandler = async () => {
      const isFriend = await getFriendStatus(userId);

      setFriendStatus(isFriend);
    };

    friendStatusHandler();
  }, [userId, friends, friendRequests]);

  return (
    <div className="h-[100vh]">
      <Navbar />

      <section className="max-w-5xl mx-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-100">
        <ProfileHeader userInfo={userInfo} />
        <div className="my-4 mt-20 text-center w-max">
          <h2 className="ml-5 text-2xl font-bold">
            {userInfo.first_name} {userInfo.last_name}
          </h2>

          <ProfileButtons
            userInfo={userInfo}
            setFriendStatus={setFriendStatus}
            friendStatus={friendStatus}
          />
        </div>

        <div className="grid grid-cols-1 md:grid md:grid-cols-2">
          <div className="w-full">
            <ProfileInfo userInfo={userInfo} />

            {friendStatus && userId && (
              <ProfileFriends friendStatus={friendStatus} userId={userId} />
            )}
          </div>

          <div className="mx-2 mt-2 md:mt-0">
            <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 rounded-lg w-full">
              <div
                onClick={() => setOpenCreatePost(true)}
                className="flex items-center space-x-2"
              >
                <Link to={`/profile/${loggedUserInfo.id}`}>
                  <img
                    src={loggedUserInfo.image || profileDefault}
                    alt=""
                    className="rounded-full w-[2.5rem] h-[2rem]"
                  />
                </Link>
                <input
                  className="w-full px-3 py-2 bg-gray-100 rounded-full"
                  placeholder={
                    loggedUserInfo.id === userId
                      ? "What is on your mind?"
                      : `Write to ${userInfo.first_name}`
                  }
                />
              </div>
              <div className="relative flex p-1 mt-2 space-x-2 rounded-md hover:bg-gray-100 w-max">
                <button onClick={() => setOpenAddPhoto(true)}>
                  <SlPicture size={25} />
                </button>

                {openAddPhoto && (
                  <AddPhoto
                    profileId={userId}
                    setOpenAddPhoto={setOpenAddPhoto}
                  />
                )}
              </div>
            </div>

            {openCreatePost && (
              <CreatePost setOpen={setOpenCreatePost} profileId={userId} />
            )}

            {posts.length === 0 && (
              <p className="mt-5 text-center text-blue-600">
                There is no existing posts
              </p>
            )}
            {posts.length > 0 &&
              userId &&
              posts.map((post: any) => (
                <Post
                  key={post.id}
                  postText={post.text_content}
                  type={post.type}
                  postPhoto={post.photo}
                  postId={post.id}
                  userId={post.user_id}
                  createdAt={post.created_at}
                  firstName={post.first_name}
                  lastName={post.last_name}
                  image={post.image}
                  edited={post.edited}
                  otherUserInfo={
                    post.profile_id &&
                    post.profile_id === userInfo.id &&
                    userInfo.id !== post.user_id
                      ? {
                          firstName: userInfo.first_name,
                          lastName: userInfo.last_name,
                        }
                      : undefined
                  }
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
