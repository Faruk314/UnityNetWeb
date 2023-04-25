import React from "react";
import CommentsContent from "../components/CommentsContent";

import PostContent from "../components/PostContent";

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
  // getCommAndLikesCount: () => void;
}

const PostComments = ({
  postId,
  userId,
  firstName,
  lastName,
  image,
  postText,
  createdAt,
  postPhoto,
  type,
  setOpenComments,
  setOpenLikes,
  setOpenShares,
}: Props) => {
  return (
    <div className="fixed flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="w-[40rem] mx-4">
        <div className="bg-white p-2 border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenComments(false);
            }}
            className="bg-gray-200 rounded-full flex items-center space-x-2 px-3 py-1 w-[2rem] hover:bg-gray-300"
          >
            X
          </button>
        </div>

        <div className="h-[40rem] overflow-auto bg-white p-4">
          <PostContent
            postId={postId}
            userId={userId}
            firstName={firstName}
            lastName={lastName}
            image={image}
            postPhoto={postPhoto}
            postText={postText}
            createdAt={createdAt}
            setOpenLikes={setOpenLikes}
            setOpenComments={setOpenComments}
            setOpenShares={setOpenShares}
            type={type}
          />

          <div className="">
            <CommentsContent userId={userId} postId={postId} image={image} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
