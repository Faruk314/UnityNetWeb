import React from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../images/profile.jpg";

interface Props {
  firstName: string;
  lastName: string;
  image: string;
  type: string;
  receiverId: number;
  postId: number | null;
}

const Notification = ({
  firstName,
  lastName,
  image,
  type,
  receiverId,
  postId,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (postId) {
          navigate(`/previewPost/${postId}`);
        } else {
          return;
        }
      }}
      className="hover:bg-gray-100 rounded-md p-[0.3rem] cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <img
          src={image || profileDefault}
          alt=""
          className="w-[2.5rem] h-[2.5rem] border-2 rounded-[100%] hover:cursor-pointer"
        />

        <div>
          <div className="flex space-x-1 font-bold">
            <span>{firstName}</span>
            <span> {lastName}</span>
          </div>

          {type === "friendRequest" && (
            <span className="text-[0.8rem]">Accepted your friend request</span>
          )}

          {type === "like" && (
            <span className="text-[0.8rem]">liked your post</span>
          )}

          {type === "comment" && (
            <span className="text-[0.8rem]">commented on your post</span>
          )}

          {type === "commentLike" && (
            <span className="text-[0.8rem]">liked your comment</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
