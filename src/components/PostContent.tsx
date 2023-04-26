import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import CommentsAndLikes from "./CommentsAndLikes";
import axios from "axios";
import Post from "../cards/Post";
import ImageSlider from "../modals/ImageSlider";
import { AiFillEdit } from "react-icons/ai";

interface Props {
  postId: number;
  userId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  postText: string;
  createdAt: Date | number;
  postPhoto: string | null;
  type: string | null;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLikes: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenShares: React.Dispatch<React.SetStateAction<boolean>>;
  edited: number;
}

const PostContent = ({
  postId,
  userId,
  postText,
  createdAt,
  firstName,
  lastName,
  image,
  postPhoto,
  setOpenComments,
  setOpenLikes,
  setOpenShares,
  type,
  edited,
}: Props) => {
  const [seeMore, setSeeMore] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>({});
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    if (type === "shared") {
      const getSharedPost = async () => {
        try {
          const response = await axios.get(
            `http://localhost:7000/api/posts/getSharedPost/${postId}`
          );

          setSharedPost(response.data[0]);
        } catch (err) {}
      };

      getSharedPost();
    }
  }, [type, postId]);

  return (
    <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white rounded-md w-full">
      <UserInfo
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        image={image}
        postId={postId}
        createdAt={createdAt}
        type={type}
      />
      <div className="p-3 break-all">
        {!seeMore && postText?.length > 120 ? (
          <p className="">
            {postText.slice(1, 140)}
            <button className=" text-blue-600" onClick={() => setSeeMore(true)}>
              ... more
            </button>
          </p>
        ) : (
          <p>{postText}</p>
        )}

        {edited !== 0 && (
          <p className="mt-1 text-gray-400 flex items-center space-x-1">
            <AiFillEdit />
            <span>Edited</span>
          </p>
        )}
      </div>

      {postPhoto && (
        <div className="relative bg-black">
          <img
            onClick={() => setImageOpen(true)}
            className="h-[28rem] md:h-[38rem] hover:cursor-pointer w-full object-contain"
            src={postPhoto}
            alt=""
          />
          {imageOpen && (
            <ImageSlider
              userId={userId}
              photoId={postId}
              setImageOpen={setImageOpen}
              type={"post"}
            />
          )}
        </div>
      )}

      {type === "shared" && (
        <div className="px-2 pb-5">
          <Post
            postId={sharedPost.id}
            userId={sharedPost.user_id}
            postText={sharedPost.text_content}
            postPhoto={sharedPost.photo}
            firstName={sharedPost.first_name}
            lastName={sharedPost.last_name}
            image={sharedPost.image}
            createdAt={sharedPost.created_at}
            type={sharedPost.likes}
            edited={edited}
          />
        </div>
      )}

      <div className="p-2 mx-2">
        <CommentsAndLikes
          userId={userId}
          postId={postId}
          setOpenComments={setOpenComments}
          setOpenLikes={setOpenLikes}
          setOpenShares={setOpenShares}
          type={type}
          sharedPostId={sharedPost.id}
        />
      </div>
    </div>
  );
};

export default PostContent;
