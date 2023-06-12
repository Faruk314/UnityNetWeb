import React, { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { User } from "../types/types";
import { getUserInfo } from "../services/services";
import { Link } from "react-router-dom";
import PostOptions from "../modals/PostOptions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  createNotification,
  sendNotification,
} from "../redux/notificationSlice";
import profileDefault from "../images/profile.jpg";

interface Props {
  commentId: number;
  postId: number;
  userId: number;
  comment: string;
}

interface Count {
  likes: number;
}

const PostComment = ({ userId, postId, commentId, comment }: Props) => {
  const [openOptions, setOpenOptions] = useState(false);
  const [user, setUser] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
    image: "",
  });
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<Count>({ likes: 0 });
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  const likePostCommentHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/comments/likePostComment/${commentId}`
      );

      if (!liked && loggedUserInfo.id !== userId) {
        dispatch(
          sendNotification({
            id: loggedUserInfo.id,
            first_name: loggedUserInfo.first_name,
            last_name: loggedUserInfo.last_name,
            image: loggedUserInfo.image,
            type: "commentLike",
            created_at: new Date(),
            receiver_id: userId,
            post_id: postId,
          })
        );
        dispatch(
          createNotification({
            receiverId: userId,
            type: "commentLike",
            postId: postId,
          })
        );
      }

      setLiked((prev) => !prev);
    } catch (err) {}
  };

  useEffect(() => {
    const isPostCommentLiked = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/comments/isCommentLiked/${commentId}`
        );
        setLiked(response.data);
      } catch (err) {}
    };

    isPostCommentLiked();
  }, [commentId]);

  useEffect(() => {
    const getPostCommentLikesCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/comments/getCommentLikesCount/${commentId}`
        );
        setCount(response.data);
      } catch (err) {}
    };

    getPostCommentLikesCount();
  }, [commentId, liked, dispatch]);

  useEffect(() => {
    const getInfo = async () => {
      let data = await getUserInfo(userId);
      setUser(data);
    };

    getInfo();
  }, [userId]);

  return (
    <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-2 max-w-[30rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-start justify-between w-full space-x-2">
          <div className="flex w-full space-x-2">
            <Link to={`/profile/${userId}`}>
              <img
                src={user.image || profileDefault}
                alt=""
                className="border-2 w-[3rem] h-[3rem] rounded-full"
              />
            </Link>
            <div className="w-full">
              <h3 className="font-bold">
                {user.first_name} {user.last_name}
              </h3>

              <p className="break-all">{comment}</p>
            </div>
          </div>
          <div className="relative">
            <button>
              <BiDotsVerticalRounded
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenOptions((prev) => !prev);
                }}
                size={25}
              />
            </button>

            {openOptions && (
              <PostOptions
                postId={postId}
                setOpenOptions={setOpenOptions}
                userId={userId}
                commentId={commentId}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center mt-2 space-x-2">
        <button onClick={likePostCommentHandler}>
          <AiFillHeart
            size={25}
            style={liked ? { color: "red" } : { color: "black" }}
          />
        </button>

        <button>
          <span>{count.likes} </span>
          <span>{count.likes > 1 ? "likes" : "like"}</span>
        </button>
      </div>
    </div>
  );
};

export default PostComment;
