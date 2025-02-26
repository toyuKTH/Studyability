import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoJSONFeature } from "mapbox-gl";

interface IMapInteractionState {
  hoveredCountry: string | null;
  selectedCountry: string | null;
  mapZoomed: boolean;
  flyToUni: {
    state: "idle" | "flying";
    uni: GeoJSONFeature | null;
  };
}

const initialState: IMapInteractionState = {
  hoveredCountry: null,
  selectedCountry: null,
  mapZoomed: false,
  flyToUni: {
    state: "idle",
    uni: null,
  },
};

export const mapInteractionSlice = createSlice({
  name: "mapInteraction",
  initialState,
  reducers: {
    setMapZoomed: (state, action: PayloadAction<boolean>) => {
      state.mapZoomed = action.payload;
    },
    flyToUni: (state, action: PayloadAction<any>) => {
      state.flyToUni.uni = action.payload;
      state.flyToUni.state = "flying";
    },
    flyToUniComplete: (state) => {
      state.flyToUni.state = "idle";
    },
  },
});

export const { setMapZoomed, flyToUni, flyToUniComplete } =
  mapInteractionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default mapInteractionSlice.reducer;
