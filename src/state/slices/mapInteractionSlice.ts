import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMapInteractionState {
  mapZoomed: boolean;
}

const initialState: IMapInteractionState = {
  mapZoomed: false,
};

export const mapInteractionSlice = createSlice({
  name: "mapInteraction",
  initialState,
  reducers: {
    setMapZoomed: (state, action: PayloadAction<boolean>) => {
      state.mapZoomed = action.payload;
    },
  },
});

export const { setMapZoomed } = mapInteractionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default mapInteractionSlice.reducer;
