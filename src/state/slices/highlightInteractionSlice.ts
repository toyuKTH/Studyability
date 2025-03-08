import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";

interface IHighlightInteractionState {
  isParaplotHighlighted: boolean;
  uniToHighlight: IUniversity | null;
  qsAttributeToHighlight: string | null;
}

const initialState: IHighlightInteractionState = {
  isParaplotHighlighted: false,
  uniToHighlight: null,
  qsAttributeToHighlight: null,
};

export const highlightInteractionSlice = createSlice({
  name: "highlightInteraction",
  initialState,
  reducers: {
    setParaplotHighlight: (state, action: PayloadAction<boolean>) => {
      state.isParaplotHighlighted = action.payload;
    },
    setUniToHighlight: (state, action: PayloadAction<IUniversity | null>) => {
      state.uniToHighlight = action.payload;
    },
    setQSAttributeToHighlight: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.qsAttributeToHighlight = action.payload;
    },
  },
});

export const {
  setParaplotHighlight,
  setUniToHighlight,
  setQSAttributeToHighlight,
} = highlightInteractionSlice.actions;

export default highlightInteractionSlice.reducer;
