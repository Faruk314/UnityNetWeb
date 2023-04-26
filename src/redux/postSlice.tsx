import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IPost } from "../types/types";
import { IPostComment } from "../types/types";

interface UserPostsArgs {
  userId: number;
  page?: number;
}

interface Post extends IPost {
  user_id: number;
  first_name: string;
  last_name: string;
  image: string;
  edited: number;
}

interface InitialState {
  posts: Post[];
  post: Post;
  userPosts: Post[];
  postComments: IPostComment[];
}

const initialState: InitialState = {
  posts: [],
  post: {
    user_id: 0,
    first_name: "",
    last_name: "",
    image: "",
    text_content: "",
    created_at: 0,
    photo: "",
    type: "",
    id: 0,
    updated_at: 0,
    edited: 0,
  },
  userPosts: [],
  postComments: [],
};

export const fetchPostComments = createAsyncThunk(
  "post/fetchPostComments",
  async (postId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/comments/getPostComments/${postId}`
      );

      return response.data;
    } catch (err) {}
  }
);

export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async (postId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getPost/${postId}`
      );

      return response.data;
    } catch (err) {}
  }
);

export const fetchUserPosts = createAsyncThunk(
  "post/fetchUsersPosts",
  async ({ userId, page }: UserPostsArgs) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getUserPosts/${userId}/${page}`
      );

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getPosts/${page}`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    deletePost(state, action) {
      let filteredPosts = state.posts.filter(
        (post) => post.id !== action.payload
      );
      state.posts = filteredPosts;

      console.log("redux", state.posts);

      let filteredUserPosts = state.userPosts.filter(
        (post) => post.id !== action.payload.id
      );

      state.userPosts = filteredUserPosts;
    },
    emptyPosts(state) {
      state.userPosts = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        let fetchedPosts = action.payload;

        fetchedPosts.forEach((fetchedPost) => {
          const index = state.posts.findIndex(
            (post) => post.id === fetchedPost.id
          );

          if (index === -1) {
            state.posts.push(fetchedPost);
          }
        });
      }
    );

    builder.addCase(
      fetchUserPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        let fetchedPosts = action.payload;

        fetchedPosts.forEach((fetchedPost) => {
          const index = state.userPosts.findIndex(
            (post) => post.id === fetchedPost.id
          );

          if (index === -1) {
            state.userPosts.push(fetchedPost);
          }
        });
      }
    );

    builder.addCase(
      fetchPostComments.fulfilled,
      (state, action: PayloadAction<IPostComment[]>) => {
        state.postComments = action.payload;
      }
    );
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.post = action.payload;
    });
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
