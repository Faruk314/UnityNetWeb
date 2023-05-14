import React, { useState, useEffect } from "react";
import { User } from "../types/types";
import axios from "axios";
import Friend from "../cards/Friend";
import AllFriends from "../modals/AllFriends";

interface Props {
  userId: number;
  friendStatus: boolean;
}

const ProfileFriends = ({ userId, friendStatus }: Props) => {
  const [openAllFriends, setOpenAllFriends] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getUserFriends/${userId}`
        );

        setFriends(response.data);
      } catch (err) {}
    };

    getFriends();
  }, [userId, friendStatus]);

  return (
    <div className="p-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mx-2 min-w-[20rem] max-w-[30rem] rounded-md">
      <div className="">
        <h3 className="font-bold text-[1.2rem]">Friends ({friends.length})</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 my-3">
        {friends.map((friend) => (
          <Friend
            key={friend.id}
            id={friend.id}
            firstName={friend.first_name}
            lastName={friend.last_name}
            photo={friend.image}
          />
        ))}
      </div>

      <button
        onClick={() => setOpenAllFriends(true)}
        type="submit"
        className="w-full p-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        See all friends
      </button>

      {openAllFriends && (
        <AllFriends id={userId} setOpenAllFriends={setOpenAllFriends} />
      )}
    </div>
  );
};

export default ProfileFriends;
