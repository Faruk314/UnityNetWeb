import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import profileDefault from "../images/profile.jpg";

interface Props {
  postId: number;
  setOpenLikes: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersByLikes = ({ postId, setOpenLikes }: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getUsersByLikes/${postId}`
        );

        setUsers(response.data);
      } catch (err) {}
    };

    getUsers();
  }, [postId]);

  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="bg-white w-[19rem] h-[20rem] p-3 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Users who liked this post</h2>
          <button
            onClick={() => setOpenLikes(false)}
            className="font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] hover:bg-gray-300"
          >
            X
          </button>
        </div>

        <div className="flex flex-col space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${user.id}`}>
                  <img
                    src={user.image || profileDefault}
                    alt=""
                    className="border-2 w-[3rem] h-[3rem] rounded-full"
                  />
                </Link>

                <span className="font-bold">{user.first_name}</span>
                <span className="font-bold">{user.last_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersByLikes;
