import React, { useState } from "react";
import PostComments from "../modals/PostComments";
import UsersByLikes from "../modals/UsersByLikes";
import PostContent from "../components/PostContent";
import UsersByShares from "../modals/UsersByShares";
import { OtherUserInfo } from "../types/types";

interface Props {
  postId: number;
  userId: number;
  postText: string;
  firstName: string;
  lastName: string;
  image: string | null;
  createdAt: Date | number;
  postPhoto: string | null;
  type: string;
  edited: number;
  otherUserInfo?: OtherUserInfo;
}

const Post = ({
  postId,
  userId,
  postText,
  createdAt,
  firstName,
  lastName,
  postPhoto,
  image,
  type,
  edited,
  otherUserInfo,
}: Props) => {
  const [openLikes, setOpenLikes] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [openShares, setOpenShares] = useState(false);

  return (
    <div className="my-6">
      <PostContent
        postId={postId}
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        image={image}
        postText={postText}
        createdAt={createdAt}
        setOpenLikes={setOpenLikes}
        setOpenComments={setOpenComments}
        setOpenShares={setOpenShares}
        postPhoto={postPhoto}
        type={type}
        edited={edited}
        otherUserInfo={otherUserInfo}
      />

      {openComments && (
        <PostComments
          postId={postId}
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          image={image}
          postText={postText}
          createdAt={createdAt}
          setOpenComments={setOpenComments}
          setOpenLikes={setOpenLikes}
          setOpenShares={setOpenShares}
          postPhoto={postPhoto}
          type={type}
          edited={edited}
        />
      )}

      {openLikes && (
        <UsersByLikes postId={postId} setOpenLikes={setOpenLikes} />
      )}
      {openShares && type !== "shared" && (
        <UsersByShares postId={postId} setOpenShares={setOpenShares} />
      )}
    </div>
  );
};

export default Post;
