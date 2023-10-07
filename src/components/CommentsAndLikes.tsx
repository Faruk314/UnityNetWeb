import React, { useContext, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import axios from "axios";
import { AiFillHeart } from "react-icons/ai";
import { VscComment } from "react-icons/vsc";
import { BsShare } from "react-icons/bs";
import SharePost from "../modals/SharePost";
import { createNotification } from "../redux/notificationSlice";
import { SocketContext } from "../context/SocketContext";

interface Props {
  userId: number;
  postId: number;
  setOpenLikes: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenComments?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenShares: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string | null;
  sharedPostId?: number;
}

const CommentsAndLikes = ({
  postId,
  setOpenLikes,
  setOpenComments,
  setOpenShares,
  userId,
  type,
  sharedPostId,
}: Props) => {
  const [openSharePost, setOpenSharePost] = useState(false);
  const [liked, setLiked] = useState(false);
  const dispatch = useAppDispatch();
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const postComments = useAppSelector((state) => state.post.postComments);
  const { socket } = useContext(SocketContext);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const isLiked = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/posts/isPostLiked/${postId}`
        );
        setLiked(response.data);
      } catch (err) {}
    };

    isLiked();
  }, [postId]);

  const likePostHandler = async () => {
    try {
      await axios.get(`http://localhost:7000/api/posts/likePost/${postId}`);

      if (!liked && loggedUserInfo.id !== userId) {
        const notification = {
          id: loggedUserInfo.id,
          first_name: loggedUserInfo.first_name,
          last_name: loggedUserInfo.last_name,
          image: loggedUserInfo.image,
          type: "like",
          created_at: new Date(),
          receiver_id: userId,
          post_id: postId,
        };

        socket?.emit("sendNotification", notification);

        dispatch(
          createNotification({
            receiverId: userId,
            type: "like",
            postId: postId,
          })
        );
      }

      setLiked((prev) => !prev);
    } catch (err) {}
  };

  useEffect(() => {
    const getPostCommentsCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/posts/getPostCommentsCount/${postId}`
        );

        setCommentsCount(response.data.comment_count);
      } catch (err) {
        console.log(err);
      }
    };

    getPostCommentsCount();
  }, [postComments]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getPostSharesCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/posts/getSharesCount/${postId}`
        );

        setSharesCount(response.data.shares_count);
      } catch (err) {
        console.log(err);
      }
    };

    getPostSharesCount();
  }, [postId]);

  useEffect(() => {
    const getPostLikesCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/posts/getPostLikesCount/${postId}`
        );

        setLikesCount(response.data.likes_count);
      } catch (err) {
        console.log(err);
      }
    };

    getPostLikesCount();
  }, [postId, liked]);

  return (
    <div className="flex items-center mt-2 space-x-2">
      <button onClick={likePostHandler}>
        {" "}
        <AiFillHeart
          size={25}
          style={liked ? { color: "red" } : { color: "black" }}
        />
      </button>
      <button
        onClick={() => setOpenLikes(true)}
        className="flex space-x-1 hover:text-blue-500"
      >
        <span>{likesCount}</span>
        <span>{likesCount > 1 ? "Likes" : "Like"}</span>
      </button>

      <VscComment size={25} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenComments ? setOpenComments((prev) => !prev) : setFocus(true);
        }}
        className="flex space-x-1 hover:text-blue-500"
      >
        <span>{commentsCount}</span>
        <span>{commentsCount > 1 ? "Comments" : "Comment"}</span>
      </button>

      <div className="flex items-center space-x-2">
        <button onClick={() => setOpenSharePost(true)} className="space-x-2">
          <BsShare />
        </button>

        {type !== "shared" && (
          <button
            onClick={() => setOpenShares(true)}
            className="flex space-x-1 hover:text-blue-500"
          >
            <span>{sharesCount}</span>
            <span>{sharesCount > 1 ? "Shares" : "Share"}</span>
          </button>
        )}
      </div>

      {openSharePost && (
        <SharePost
          postId={postId}
          sharedPostId={sharedPostId}
          setOpenSharePost={setOpenSharePost}
        />
      )}
    </div>
  );
};

export default CommentsAndLikes;
