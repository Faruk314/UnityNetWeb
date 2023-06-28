import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageSliderContent from "../components/ImageSliderContent";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { postActions } from "../redux/postSlice";

interface Props {
  userId: number;
  setImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  photoId?: number;
  type: string;
}

const ImageSlider = ({ userId, setImageOpen, photoId, type }: Props) => {
  const dispatch = useAppDispatch();
  const numberOfPhotos = useAppSelector((state) => state.post.photos).length;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        if (photoId && type === "post") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getPhoto/${userId}/${photoId}`
          );

          dispatch(postActions.setPhotos(response.data));
        }

        if (type === "profile") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getUserProfilePhotos/${userId}`
          );
          dispatch(postActions.setPhotos(response.data));
        }

        if (type === "cover") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getUserCoverPhotos/${userId}`
          );
          dispatch(postActions.setPhotos(response.data));
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getPhotos();
  }, [userId, photoId, type, dispatch]);

  useEffect(() => {
    const closePhotos = () => {
      setImageOpen(false);
    };

    if (!loading && numberOfPhotos === 0) {
      closePhotos();
    }
  }, [numberOfPhotos, setImageOpen, loading]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30">
      <button
        onClick={() => setImageOpen(false)}
        className="absolute top-0 z-40 bg-gray-300 rounded-full w-[2rem] h-[2rem] hover:bg-gray-200 m-2"
      >
        X
      </button>

      {!loading && <ImageSliderContent userId={userId} type={type} />}
    </div>
  );
};

export default ImageSlider;
