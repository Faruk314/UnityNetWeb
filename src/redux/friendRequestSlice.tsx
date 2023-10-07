import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { User } from "../types/types";

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
  friends: User[];
}

const initialState: InitialState = {
  requests: [],
  isRemovedFromFriends: false,
  isFriendRequestRejected: false,
  friends: [],
};

const friendRequestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    saveReceivedRequest(state, action) {
      const requestExists = state.requests.some(
        (request) => request.id === action.payload.id
      );

      if (!requestExists) state.requests.push(action.payload);
    },
    deleteFriendRequest(state, action) {
      let updatedRequests = state.requests.filter(
        (request) => request.id !== action.payload
      );

      state.requests = updatedRequests;
    },
    saveFriends(state, action) {
      state.friends = action.payload;
    },
    removeFromFriends(state, action) {
      const updatedFriends = state.friends.filter(
        (friend) => friend.id !== action.payload
      );

      state.friends = updatedFriends;
    },
    updateFriends(state, action) {
      const friendExists = state.friends.some(
        (friend) => friend.id === action.payload.id
      );

      if (!friendExists) state.friends.push(action.payload);
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
