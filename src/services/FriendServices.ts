import axios from "axios";

const sendFriendRequest = async (userId: number) => {
  try {
    await axios.post(
      `http://localhost:7000/api/followers/sendFriendRequest/${userId}`
    );

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

const removeFromFriends = async (userId: number) => {
  try {
    await axios.get(
      `http://localhost:7000/api/followers/removeFromFriends/${userId}`
    );

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

const rejectFriendRequest = async (senderId: number) => {
  try {
    await axios.delete(
      `http://localhost:7000/api/followers/rejectFriendRequest/${senderId}`
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getFriendReqStatus = async (userId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/followers/checkFriendRequestStatus/${userId}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const acceptFriendRequest = async (senderId: number) => {
  try {
    await axios.get(
      `http://localhost:7000/api/followers/acceptFriendRequest/${senderId}`
    );

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

const getFriendStatus = async (userId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/followers/checkFriendsStatus/${userId}`
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return false;
  }
};

const getFriends = async (id: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/users/getUserFriends/${id}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export {
  sendFriendRequest,
  removeFromFriends,
  rejectFriendRequest,
  getFriendReqStatus,
  acceptFriendRequest,
  getFriendStatus,
  getFriends,
};
