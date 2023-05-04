import React, { useEffect, useState } from "react";
import UserInfo from "../components/UserInfo";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPost, fetchPosts, postActions } from "../redux/postSlice";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import profileDefault from "../images/profile.jpg";
import axios from "axios";
import Confirmation from "./Confirmation";

interface Props {
  setPostEdit: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
}

const EditPost = ({ setPostEdit, postId }: Props) => {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.post.post);
  const [textContent, setTextContent] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const editPostHandler = async () => {
    try {
      await axios.put(`http://localhost:7000/api/posts/editPost/${postId}`, {
        textContent,
      });

      dispatch(postActions.editPost({ id: postId, textContent }));
      setConfirmation(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(fetchPost(postId));
  }, [dispatch, postId]);

  useEffect(() => {
    if (post) {
      setTextContent(post.text_content);
    }
  }, [post]);

  return (
    <div className="fixed flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="w-[40rem] mx-4 rounded bg-white">
        <div className="bg-white p-2 border flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPostEdit(false);
            }}
            className="bg-gray-200 rounded-full flex items-center space-x-2 px-3 py-1 w-[2rem] hover:bg-gray-300"
          >
            X
          </button>

          {post.type === "profile" && (
            <span className="font-bold text-xl">PROFILE PHOTO</span>
          )}
          {post.type === "shared" && (
            <span className="font-bold text-xl">SHARED POST</span>
          )}
          {post.type === "cover" && (
            <span className="font-bold text-xl">COVER PHOTO</span>
          )}

          {!post.type && <span className="font-bold text-xl">POST</span>}
        </div>

        <div className="h-[40rem] overflow-auto p-5">
          <div className=" bg-white rounded-md w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="flex space-x-2 p-3">
              <Link to={`/profile/${post.user_id}`}>
                <img
                  src={post.image || profileDefault}
                  alt=""
                  className="border-2 w-[3rem] h-[3rem] rounded-full"
                />
              </Link>
              <div>
                <h3 className="">
                  <span className="font-bold">
                    {post.first_name} {post.last_name}
                  </span>
                </h3>
                <span className="text-[0.9rem]">
                  {moment(post.created_at).tz("Europe/Sarajevo").fromNow()}
                </span>
              </div>
            </div>
            <div className="p-3 break-all">
              <textarea
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Add your text"
                value={textContent}
                rows={5}
                className="border w-full p-2 outline-blue-500"
              ></textarea>
            </div>

            {post.photo && (
              <div className="relative bg-black">
                <img
                  className="h-[28rem] md:h-[38rem] hover:cursor-pointer w-full object-contain"
                  src={post.photo}
                  alt=""
                />
              </div>
            )}
          </div>
          <button
            onClick={editPostHandler}
            className="bg-blue-500 text-white p-2 rounded-md font-bold hover:bg-blue-600 mt-2"
          >
            Confirm
          </button>
        </div>
      </div>
      {confirmation && (
        <Confirmation
          message="Post was successfully edited"
          setOpen={setPostEdit}
        />
      )}
    </div>
  );
};

export default EditPost;
