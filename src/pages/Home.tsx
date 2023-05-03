import React, { useEffect, useRef, useState } from "react";
import CreatePost from "../modals/CreatePost";
import { fetchPosts } from "../redux/postSlice";
import Post from "../cards/Post";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link } from "react-router-dom";
import profileDefault from "../images/profile.jpg";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { SlPicture } from "react-icons/sl";
import AddPhoto from "../modals/photoModals/AddPhoto";

const Home = () => {
  const [openAddPhoto, setOpenAddPhoto] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const isRemovedFromFriends = useAppSelector(
    (state) => state.request.isRemovedFromFriends
  );
  const isMounted = useRef(false);

  console.log("page", page);

  useEffect(() => {
    if (!isMounted.current) {
      dispatch(fetchPosts(page));
      isMounted.current = true;
    }
  }, [dispatch, page, isRemovedFromFriends]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        setPage(page + 1);
        isMounted.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  return (
    <div className="">
      <Navbar />
      <section className="relative space-x-2 px-4 md:flex lg:grid lg:grid-cols-3">
        <SideBar />

        {open && <CreatePost setOpen={setOpen} profileId={null} />}
        <main className="my-2 lg:w-[40rem]">
          <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] mt-5 p-2 rounded-lg w-full">
            <div
              onClick={() => setOpen(true)}
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
                className="bg-gray-100 rounded-full px-3 py-2 w-full"
                placeholder="What is on your mind?"
              />
            </div>
            <div className="relative flex space-x-2 mt-2 hover:bg-gray-100 w-max p-1 rounded-md">
              <button onClick={() => setOpenAddPhoto(true)}>
                <SlPicture size={25} />
              </button>

              {openAddPhoto && <AddPhoto setOpenAddPhoto={setOpenAddPhoto} />}
            </div>
          </div>

          {posts.length === 0 && (
            <p className="text-center mt-5 text-blue-500">
              There is no existing posts
            </p>
          )}
          {posts?.map((post: any) => (
            <Post
              key={post.id}
              postId={post.id}
              postText={post.text_content}
              type={post.type}
              postPhoto={post.photo}
              userId={post.user_id}
              createdAt={post.created_at}
              firstName={post.first_name}
              lastName={post.last_name}
              image={post.image}
              edited={post.edited}
            />
          ))}
        </main>
      </section>
    </div>
  );
};

export default Home;
