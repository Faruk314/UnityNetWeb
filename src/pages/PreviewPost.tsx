import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../cards/Post";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPost } from "../redux/postSlice";

const PreviewPost = () => {
  const { postId } = useParams();
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.post.post);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPost(parseInt(postId)));
    }
  }, [dispatch, postId]);

  return (
    <>
      <Navbar />
      <section className="flex justify-center max-w-5xl p-2 mx-auto mt-10">
        <div className="w-[30rem]">
          <Post
            postId={post.id}
            userId={post.user_id}
            firstName={post.first_name}
            lastName={post.last_name}
            image={post.image}
            postText={post.text_content}
            createdAt={post.created_at}
            postPhoto={post.photo}
            type={post.type}
            edited={post.edited}
          />
        </div>
      </section>
    </>
  );
};

export default PreviewPost;
