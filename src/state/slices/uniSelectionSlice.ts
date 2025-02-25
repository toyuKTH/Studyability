import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";

interface IUniSelectionState {
    currentUniversity: IUniversity | null;
    uniToCompare: IUniversity[];
}

const initialState: IUniSelectionState = {
    currentUniversity: null,
    uniToCompare: []
}

export const uniSelectionSlice = createSlice({
  name: 'uniSelection',
  initialState,
  reducers: {
    setCurrentUniversity: (
      state,
      action: PayloadAction<IUniversity | null>
    ) => {
      state.currentUniversity = action.payload;
    },
    addUniToCompare: (state, action: PayloadAction<IUniversity>) => {
      state.uniToCompare.push(action.payload);
    },
    removeUniToCompare: (state, action: PayloadAction<IUniversity>) => {
      state.uniToCompare = [...state.uniToCompare].filter((uni) => {
        return Object.is(uni, action.payload);
      });
    },
  },
});

export const { setCurrentUniversity, addUniToCompare, removeUniToCompare } =
  uniSelectionSlice.actions;

export default uniSelectionSlice.reducer;
