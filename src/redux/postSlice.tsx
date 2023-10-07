import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IPost } from "../types/types";
import { IPostComment } from "../types/types";

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
  photos: Post[];
  photoDeleted: boolean;
  photoUploaded: boolean;
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
  photos: [],
  photoDeleted: false,
  photoUploaded: false,
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
  async (userId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getUserPosts/${userId}`
      );

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/posts/getPosts`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    deletePost(state, action) {
      let filteredPosts = state.posts.filter(
        (post) => post.id !== action.payload
      );
      state.posts = filteredPosts;

      let filteredUserPosts = state.userPosts.filter(
        (post) => post.id !== action.payload
      );

      state.userPosts = filteredUserPosts;

      let filteredPhotos = state.photos.filter(
        (post) => post.id !== action.payload
      );

      state.photos = filteredPhotos;
    },
    emptyPosts(state) {
      state.userPosts = [];
    },
    editPost(state, action) {
      let postIdx = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );

      let userPostIdx = state.userPosts.findIndex(
        (post) => post.id === action.payload.id
      );

      let photoPostIdx = state.photos.findIndex(
        (post) => post.id === action.payload.id
      );

      if (postIdx !== -1) {
        state.posts[postIdx].text_content = action.payload.textContent;
        state.posts[postIdx].edited = 1;
      }

      if (userPostIdx !== -1) {
        state.userPosts[userPostIdx].text_content = action.payload.textContent;
        state.userPosts[userPostIdx].edited = 1;
      }

      if (photoPostIdx !== -1) {
        state.photos[photoPostIdx].text_content = action.payload.textContent;
        state.photos[photoPostIdx].edited = 1;
      }
    },
    setPhotos(state, action) {
      state.photos = action.payload;
    },

    setPhotoUploaded(state, action) {
      state.photoUploaded = action.payload;
    },
    setPhotoDeleted(state, action) {
      state.photoDeleted = action.payload;
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
            state.posts.sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);

              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                // If either date is not valid, return 0 to leave the order unchanged.
                return 0;
              }

              return dateB.getTime() - dateA.getTime();
            });
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
            state.userPosts.sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);

              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                // If either date is not valid, return 0 to leave the order unchanged.
                return 0;
              }

              return dateB.getTime() - dateA.getTime();
            });
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
