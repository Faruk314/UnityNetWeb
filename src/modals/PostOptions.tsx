import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useAppDispatch } from "../redux/hooks";
import { fetchPostComments, postActions } from "../redux/postSlice";
import EditPost from "./EditPost";

interface Props {
  setOpenOptions: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
  userId: number;
  commentId?: number;
}

const PostOptions = ({ setOpenOptions, postId, userId, commentId }: Props) => {
  const dispatch = useAppDispatch();
  const [commentEdit, setCommentEdit] = useState(false);
  const [postEdit, setPostEdit] = useState(false);

  const deletePostHandler = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/posts/deletePost/${postId}`
      );

      dispatch(postActions.deletePost(postId));
    } catch (err) {}
  };

  const deletePostCommentHandler = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/comments/deletePostComment/${commentId}`
      );

      dispatch(fetchPostComments(postId));
    } catch (err) {}
  };

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      setOpenOptions(false);
    };

    !postEdit && window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [postEdit, setOpenOptions]);

  return (
    <div className="absolute right-2 top-7 w-[12rem] bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 rounded-md z-20">
      <div className="flex flex-col space-y-2">
        <button
          onClick={
            postId && commentId ? deletePostCommentHandler : deletePostHandler
          }
          className="flex items-center space-x-2 hover:text-red-500"
        >
          <AiFillDelete />
          <span>Delete {postId && commentId ? "comment" : "post"}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            postId && commentId ? setCommentEdit(true) : setPostEdit(true);
          }}
          className="flex items-center space-x-2 hover:text-green-500"
        >
          <AiFillEdit />
          <span>Edit {postId && commentId ? "comment" : "post"}</span>
        </button>
      </div>
      {postEdit === true && (
        <EditPost setPostEdit={setPostEdit} postId={postId} />
      )}
    </div>
  );
};

export default PostOptions;
