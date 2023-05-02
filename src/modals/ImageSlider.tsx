import axios from "axios";
import React, { useEffect, useState } from "react";
import { IPhoto } from "../types/types";
import ImageSliderContent from "../components/ImageSliderContent";
import Navbar from "../components/Navbar";

interface Props {
  userId: number;
  setImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  photoId?: number;
  type: string;
}

const ImageSlider = ({ userId, setImageOpen, photoId, type }: Props) => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        if (photoId && type === "post") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getPhoto/${userId}/${photoId}`
          );

          setPhotos(response.data);
        }

        if (type === "profile") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getUserProfilePhotos/${userId}`
          );
          setPhotos(response.data);
        }

        if (type === "cover") {
          const response = await axios.get(
            `http://localhost:7000/api/photos/getUserCoverPhotos/${userId}`
          );
          setPhotos(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getPhotos();
  }, [userId, photoId, type]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-30">
      <button
        onClick={() => setImageOpen(false)}
        className="absolute top-0 z-40 bg-gray-300 rounded-full w-[2rem] h-[2rem] hover:bg-gray-200 m-2"
      >
        X
      </button>

      <ImageSliderContent photos={photos} userId={userId} />
    </div>
  );
};

export default ImageSlider;
