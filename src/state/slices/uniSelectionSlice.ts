import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";
import { GeoJSONFeature } from "mapbox-gl";

interface IUniSelectionState {
  currentUniversity: IUniversity | null;
  currenUniversityGeoJSON: any | null;
  uniToCompare: IUniversity[];
}

const initialState: IUniSelectionState = {
  currentUniversity: null,
  currenUniversityGeoJSON: null,
  uniToCompare: [],
};

export const uniSelectionSlice = createSlice({
  name: "uniSelection",
  initialState,
  reducers: {
    setCurrentUniversity: (
      state,
      action: PayloadAction<IUniversity | null>
    ) => {
      state.currentUniversity = action.payload;
    },
    setCurrentUniversityGeoJSON: (
      state,
      action: PayloadAction<GeoJSONFeature | null>
    ) => {
      state.currenUniversityGeoJSON = action.payload;
    },
    addUniToCompare: (state, action: PayloadAction<IUniversity>) => {
      if (state.uniToCompare.some((uni) => uni.name === action.payload.name)) {
        state.uniToCompare = [...state.uniToCompare].filter((uni) => {
          return uni.name !== action.payload.name;
        });
      } else state.uniToCompare.push(action.payload);
    },
    removeUniToCompare: (state, action: PayloadAction<IUniversity>) => {
      state.uniToCompare = [...state.uniToCompare].filter((uni) => {
        return uni.name !== action.payload.name;
      });
    },
  },
});

export const {
  setCurrentUniversity,
  setCurrentUniversityGeoJSON,
  addUniToCompare,
  removeUniToCompare,
} = uniSelectionSlice.actions;

export default uniSelectionSlice.reducer;
