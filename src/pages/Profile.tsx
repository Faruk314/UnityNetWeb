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

const Profile = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
    image: "",
    cover_image: "",
  });
  const [friendStatus, setFriendStatus] = useState(false);
  const posts = useAppSelector((state) => state.post.userPosts);
  console.log(friendStatus);
  const { id } = useParams();
  const [userId, setUserId] = useState(0);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  useEffect(() => {
    if (id) {
      setUserId(parseInt(id));
      setPage(1);
      dispatch(postActions.emptyPosts());
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchUserPosts({ userId, page }));
  }, [page, dispatch, userId]);

  // const rejectRequestHandler = async () => {
  //   try {
  //   } catch (err) {}
  // };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        setPage(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `http://localhost:7000/api/users/getUserInfo/${userId}`
      );

      setUserInfo(response.data);
    };

    getUser();
  }, [userId]);

  return (
    <>
      <Navbar />
      <section className="max-w-5xl mx-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-100">
        <ProfileHeader userInfo={userInfo} />
        <div className="my-4 mt-20 w-max text-center">
          <h2 className="text-2xl font-bold ml-5">
            {userInfo.first_name} {userInfo.last_name}
          </h2>
          <ProfileButtons
            userInfo={userInfo}
            setFriendStatus={setFriendStatus}
            friendStatus={friendStatus}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="w-full mt-6">
            <ProfileInfo />

            <ProfileFriends friendStatus={friendStatus} userId={userId} />
          </div>

          <div className="mx-2">
            <div className="flex items-center space-x-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 mt-5 rounded-lg w-full">
              <Link to={`/profile/${loggedUserInfo.id}`}>
                <img
                  src={loggedUserInfo.image || profileDefault}
                  alt=""
                  className="rounded-full w-[2.5rem] h-[2rem]"
                />
              </Link>
              <input
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCreatePost(true);
                }}
                className="bg-gray-100 rounded-full px-3 py-2 w-full"
                placeholder={
                  loggedUserInfo.id === userId
                    ? `What is on your mind?`
                    : `Write something to ${userInfo.first_name}`
                }
              />
            </div>

            {openCreatePost && (
              <CreatePost setOpen={setOpenCreatePost} profileId={userId} />
            )}

            {posts.length === 0 && (
              <span className="text-center text-blue-600">
                There is no existing posts
              </span>
            )}
            {posts.map((post: any) => (
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
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
