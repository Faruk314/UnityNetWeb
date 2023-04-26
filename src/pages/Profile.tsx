import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types/types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Post from "../cards/Post";
import { fetchUserPosts } from "../redux/postSlice";
import Navbar from "../components/Navbar";
import ProfileInfo from "../components/ProfileInfo";
import ProfileFriends from "../components/ProfileFriends";
import ProfileHeader from "../components/ProfileHeader";
import ProfileButtons from "../components/ProfileButtons";

const Profile = () => {
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

  const userId: number = id ? parseInt(id) : 0;

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
    dispatch(fetchUserPosts({ userId, page }));
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
