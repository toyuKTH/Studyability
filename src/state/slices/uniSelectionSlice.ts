import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";

interface IUniSelectionState {
    currentUniversity: IUniversity | null;
    uniToCompare: IUniversity[] | null;
}

const initialState: IUniSelectionState = {
    currentUniversity: null,
    uniToCompare: null
}

export const uniSelectionSlice = createSlice({
    name: 'uniSelection',
    initialState,
    reducers: {
        setCurrentUniversity: (state, action: PayloadAction<IUniversity | null>) => {
            state.currentUniversity = action.payload;
        },
        setUniToCompare: (state, action: PayloadAction<IUniversity[] | null>) => {
            state.uniToCompare = action.payload;
        }
    }
});

export const { setCurrentUniversity, setUniToCompare} =
  uniSelectionSlice.actions;

export default uniSelectionSlice.reducer;
