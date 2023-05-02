import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../services/socket";
import { User } from "../types/types";

interface Request {
  senderId: number;
  receiverId: number;
}

export const getFriendRequests = createAsyncThunk(
  "auth/getFriendRequests",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/getFriendRequests`
      );

      return response.data;
    } catch (err) {}
  }
);

interface InitialState {
  requests: User[];
  isRemovedFromFriends: boolean;
  isFriendRequestRejected: boolean;
}

const initialState: InitialState = {
  requests: [],
  isRemovedFromFriends: false,
  isFriendRequestRejected: false,
};

// export const sendFriendRequest = createAsyncThunk(
//   "sendFriendRequest",
//   async function ({ request, receiverId }: Request, { dispatch }) {
//     window.socketClient.emit("sendFriendRequest", { request, receiverId });
//   }
// );

export const sendFriendRequest =
  ({ senderId, receiverId }: Request) =>
  (dispatch: any) => {
    socket.emit("sendFriendRequest", { senderId, receiverId });
  };

export const removeFromFriendsList =
  (receiverId: number) => (dispatch: any) => {
    socket.emit("removeFromFriends", receiverId);
  };

export const onRemovedFromFriends = () => (dispatch: any) => {
  socket.on("removedFromFriends", (data) => {
    dispatch(friendRequestActions.removeFromFriends(data));
  });
};

export const rejectFriendRequest = (receiverId: number) => (dispatch: any) => {
  socket.emit("rejectFriendRequest", receiverId);
};

export const onRejectedFriendRequest = () => (dispatch: any) => {
  socket.on("rejectedFriendRequest", (data) => {
    dispatch(friendRequestActions.rejectFriendRequest(data));
  });
};

// export const subscribeToFriendRequests = createAsyncThunk(
//   "subscribeToFriendRequests",
//   async function () {
//     window.socketClient.on("getFriendRequest");
//   }
// );

export const subscribeToFriendRequests = () => (dispatch: any) => {
  socket.on("getFriendRequest", (data) => {
    dispatch(friendRequestActions.saveReceivedRequest(data));
  });
};

// export const unsubscribeFromFriendRequests = createAsyncThunk(
//   "subscribeToFriendRequests",
//   async function () {
//     window.socketClient.off("getFriendRequest");
//   }
// );

export const unsubscribeFromFriendRequests = () => () => {
  socket.off("getFriendRequest");
};

// export const createFriendRequestNotification = ({senderId, receiverId, }) => () => {

// }

const friendRequestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    saveReceivedRequest(state, action) {
      state.requests.push(action.payload);
    },
    removeFromFriends(state, action) {
      state.isRemovedFromFriends = action.payload;
      console.log("removeFromF", state.isRemovedFromFriends);
    },
    rejectFriendRequest(state, action) {
      state.isFriendRequestRejected = action.payload;

      console.log("rejectedFReq", state.isFriendRequestRejected);
    },
    setRejectFriendRequest(state) {
      state.isFriendRequestRejected = false;
    },
    setRemovedFromFriends(state) {
      state.isRemovedFromFriends = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getFriendRequests.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.requests = action.payload;
      }
    );
  },
});

export const friendRequestActions = friendRequestSlice.actions;

export default friendRequestSlice.reducer;
