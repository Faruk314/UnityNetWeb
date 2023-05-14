import React, { useState } from "react";
import { AiFillEdit, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import UserInfo from "./UserInfo";
import UsersByLikes from "../modals/UsersByLikes";
import CommentsAndLikes from "./CommentsAndLikes";
import CommentsContent from "./CommentsContent";
import UsersByShares from "../modals/UsersByShares";
import { useAppSelector } from "../redux/hooks";

interface Props {
  userId: number;
  type: string;
}

const ImageSliderContent = ({ userId, type }: Props) => {
  const photos = useAppSelector((state) => state.post.photos);
  const [openLikes, setOpenLikes] = useState(false);
  const [count, setCount] = useState(0);
  const [openShares, setOpenShares] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 lg:overflow-hidden md:h-full">
      <div id="slider" className="lg:col-span-3">
        <div className="relative bg-black h-[30rem] md:h-full flex items-center">
          <img
            src={photos[count]?.photo || ""}
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
          imageType={
            type === "cover"
              ? "cover"
              : type === "profile"
              ? "profile"
              : undefined
          }
        />

        <div className="p-3 break-all">
          {!seeMore && photos[count]?.text_content?.length > 120 ? (
            <p className="">
              {photos[count]?.text_content.slice(1, 140)}
              <button
                className="text-blue-600 "
                onClick={() => setSeeMore(true)}
              >
                ... more
              </button>
            </p>
          ) : (
            <p>{photos[count]?.text_content}</p>
          )}

          {photos[count]?.edited !== 0 && (
            <p className="flex items-center mt-1 space-x-1 text-gray-400">
              <AiFillEdit />
              <span>Edited</span>
            </p>
          )}
        </div>

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
