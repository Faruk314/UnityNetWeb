import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import PostComment from "../cards/PostComment";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import { fetchPostComments } from "../redux/postSlice";
import axios from "axios";
import {
  createNotification,
  sendNotification,
} from "../redux/notificationSlice";

interface Props {
  userId: number;
  postId: number;
  image: string | null;
}

const CommentsContent = ({ postId, image, userId }: Props) => {
  const postComments = useAppSelector((state) => state.post.postComments);
  const [comment, setComment] = useState("");
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  useEffect(() => {
    dispatch(fetchPostComments(postId));
  }, [dispatch, postId]);

  const createComment = async () => {
    if (!comment) {
      return;
    }

    let data = {
      comment,
    };

    try {
      await axios.post(
        `http://localhost:7000/api/comments/commentPost/${postId}`,
        data
      );

      if (loggedUserInfo.id !== userId) {
        dispatch(
          sendNotification({
            id: loggedUserInfo.id,
            first_name: loggedUserInfo.first_name,
            last_name: loggedUserInfo.last_name,
            image: loggedUserInfo.image,
            type: "comment",
            created_at: new Date(),
            receiver_id: userId,
            post_id: postId,
          })
        );
        dispatch(
          createNotification({
            receiverId: userId,
            type: "comment",
            postId: postId,
          })
        );
      }

      setComment("");
      dispatch(fetchPostComments(postId));
    } catch (err) {}
  };

  return (
    <>
      <div className="flex space-x-2 items-center justify-between py-5 max-w-[30rem]">
        <img
          src=""
          alt=""
          className="border-2 w-[3.5rem] h-[2.5rem] rounded-full"
        />

        <textarea
          className="w-full p-2 bg-gray-100 rounded-full outline-none"
          placeholder="Write a comment"
          rows={1}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />

        <button onClick={createComment} className="">
          <IoMdSend size={30} className="text-blue-500" />
        </button>
      </div>

      <div className="flex flex-col space-y-5">
        {postComments.length === 0 && (
          <p className="text-center text-blue-600">
            There is currently no comments.
          </p>
        )}

        {postComments.map((comment) => (
          <PostComment
            key={comment.id}
            userId={comment.user_id}
            comment={comment.comment}
            commentId={comment.id}
            postId={postId}
          />
        ))}
      </div>
    </>
  );
};

export default CommentsContent;
