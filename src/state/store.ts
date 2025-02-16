import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./slices/filterSlice";
import mapInteractionSlice from "./slices/mapInteractionSlice";
// ...

export const store = configureStore({
  reducer: {
    filter: filterSlice,
    mapInteraction: mapInteractionSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
