import { configureStore } from '@reduxjs/toolkit';
import loggedInReducer from './slices/loggedInSlice';
import newProductReducer from './slices/newProductSlice';

export const store = configureStore({
  reducer: {
    isLoggedIn: loggedInReducer,
    newProduct: newProductReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
