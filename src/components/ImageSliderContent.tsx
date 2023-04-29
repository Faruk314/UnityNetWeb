import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { IPhoto } from "../types/types";
import UserInfo from "./UserInfo";
import UsersByLikes from "../modals/UsersByLikes";
import CommentsAndLikes from "./CommentsAndLikes";
import CommentsContent from "./CommentsContent";
import UsersByShares from "../modals/UsersByShares";

interface Props {
  photos: any[];
  userId: number;
}

const ImageSliderContent = ({ userId, photos }: Props) => {
  const [openLikes, setOpenLikes] = useState(false);
  const [count, setCount] = useState(0);
  const [openShares, setOpenShares] = useState(false);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 lg:overflow-hidden md:h-full">
      <div id="slider" className="lg:col-span-3">
        <div className="relative bg-black h-[30rem] md:h-full flex items-center">
          <img
            src={photos[count]?.photo}
            alt=""
            className="object-contain w-full h-full max-h-[50rem]"
          />

          {count > 0 && (
            <div
              id="left"
              className="absolute h-full left-4 top-[50%] w-[5rem] hover:translate-x-[-0.5rem] transition ease-out"
            >
              <button
                className="bg-white text-black w-[3rem] h-[3rem] flex items-center justify-center rounded-full hover:bg-gray-200"
                onClick={() => setCount((prev) => (count > 0 ? prev - 1 : 0))}
              >
                <AiOutlineLeft className="" />
              </button>
            </div>
          )}

          {count < photos.length - 1 && (
            <div
              id="right"
              className="absolute right-0 top-[50%]  h-full w-[5rem] hover:translate-x-[0.5rem] transition ease-out"
            >
              <button
                className="bg-white text-black w-[3rem] h-[3rem] flex items-center justify-center rounded-full hover:bg-gray-200"
                onClick={() =>
                  setCount((prev) =>
                    count < photos.length - 1 ? prev + 1 : photos.length - 1
                  )
                }
              >
                <AiOutlineRight />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white overflow-y-auto h-[29rem] md:h-full">
        <UserInfo
          userId={userId}
          firstName={photos[count]?.first_name}
          lastName={photos[count]?.last_name}
          image={photos[count]?.image}
          postId={photos[count]?.id}
          createdAt={photos[count]?.created_at}
          type={photos[count]?.type}
        />

        <p className="px-4 py-2">{photos[count]?.description}</p>

        <div className="px-4">
          <CommentsAndLikes
            userId={userId}
            postId={photos[count]?.id}
            setOpenLikes={setOpenLikes}
            setOpenShares={setOpenShares}
          />
        </div>

        <div className="m-4 my-4">
          {
            <CommentsContent
              userId={userId}
              postId={photos[count]?.id}
              image={photos[count]?.image}
            />
          }
        </div>

        {openLikes && (
          <UsersByLikes
            postId={photos[count]?.id}
            setOpenLikes={setOpenLikes}
          />
        )}

        {openShares && (
          <UsersByShares
            postId={photos[count]?.id}
            setOpenShares={setOpenShares}
          />
        )}
      </div>
    </div>
  );
};

export default ImageSliderContent;
