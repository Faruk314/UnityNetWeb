import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Chat, Message } from "../types/types";

interface ArrivalMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  createdAt: Date;
  seen_at: number | null;
}

interface InitialState {
  messages: ArrivalMessage[];
  messageSeen: number;
  arrivalMessage: ArrivalMessage | null;
  messageStatus: string;
  messagesSubscription: string;
  arrivedMessages: Message[];
  chats: Chat[];
}

const initialState: InitialState = {
  messages: [],
  messageSeen: 0,
  arrivalMessage: null,
  messageStatus: "",
  messagesSubscription: "unsubscribed",
  arrivedMessages: [],
  chats: [],
};

export const fetchMessages = createAsyncThunk(
  "socket/fetchMessages",
  async (conversationId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/messages/getMessages/${conversationId}`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setGetMessageStatus(state, action) {
      state.messagesSubscription = action.payload;
    },
    markMessageAsSeen(state, action) {
      state.messageSeen = action.payload.message_id;
      state.messages.map((message) => {
        if (message.id === action.payload.message_id) {
          return (message.seen_at = action.payload.seen_at);
        } else {
          return message.seen_at;
        }
      });
    },
    saveReceivedMessages(state, action) {
      state.messages.push(action.payload);
      state.arrivedMessages.push(action.payload);
    },
    setChat(state, action) {
      const chatExists = state.chats.find(
        (chat) => chat.userId === action.payload.userId
      );

      state.chats.map((chat) => (chat.open = false));

      if (!chatExists) {
        state.chats.push(action.payload);
      } else {
        chatExists.open = true;
      }
    },
    deleteArrivedMessages(state) {
      state.arrivedMessages = [];
    },
    closeChat(state, action) {
      const filtered = state.chats.filter(
        (chat) => chat.userId !== action.payload
      );

      state.chats = filtered;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(sendMessage.pending, (state) => {
    //   state.messageStatus = "Sending";
    // });
    // builder.addCase(sendMessage.fulfilled, (state) => {
    //   state.messageStatus = "Sent successfully";
    // });
    // builder.addCase(sendMessage.rejected, (state) => {
    //   state.messageStatus = "Send failed";
    // });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
