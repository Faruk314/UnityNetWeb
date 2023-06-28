import React from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../images/profile.jpg";

interface Props {
  id: number;
  firstName: string;
  lastName: string;
  photo: string;
}

const Friend = ({ id, firstName, lastName, photo }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/profile/${id}`)}
      className="text-center hover:cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md"
    >
      <img
        className=" md:h-[7rem] w-full rounded-md"
        src={photo || profileDefault}
        alt=""
      ></img>

      <h5 className="text-[0.9rem] my-2 font-bold">
        {firstName} {lastName}
      </h5>
    </div>
  );
};

export default Friend;
