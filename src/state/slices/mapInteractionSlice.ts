import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";

interface IMapInteractionState {
  hoveredCountry: string | null;
  selectedCountry: string | null;
  mapZoomed: boolean;
  flyToUni: IUniversity | null;
}

const initialState: IMapInteractionState = {
  hoveredCountry: null,
  selectedCountry: null,
  mapZoomed: false,
  flyToUni: null,
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
    flyToUni: (state, action: PayloadAction<IUniversity>) => {
      state.flyToUni = action.payload;
    },
    flyToUniComplete: (state) => {
      state.flyToUni = null;
    },
  },
});

export const {
  setHoveredCountry,
  setSelectedCountry,
  setMapZoomed,
  flyToUni,
  flyToUniComplete,
} = mapInteractionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default mapInteractionSlice.reducer;
