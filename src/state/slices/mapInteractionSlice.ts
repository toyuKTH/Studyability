import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMapInteractionState {
  hoveredCountry: string | null;
  selectedCountry: string | null;
  mapZoomed: boolean;
}

const initialState: IMapInteractionState = {
  hoveredCountry: null,
  selectedCountry: null,
  mapZoomed: false,
};

export const mapInteractionSlice = createSlice({
  name: "mapInteraction",
  initialState,
  reducers: {
    setHoveredCountry: (state, action: PayloadAction<string | null>) => {
      state.hoveredCountry = action.payload;
    },
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
    setMapZoomed: (state, action: PayloadAction<boolean>) => {
      state.mapZoomed = action.payload;
    },
  },
});

export const { setHoveredCountry, setSelectedCountry, setMapZoomed } =
  mapInteractionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default mapInteractionSlice.reducer;
