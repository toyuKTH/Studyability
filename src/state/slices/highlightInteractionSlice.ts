import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IHighlightInteractionState {
  isParaplotHighlighted: boolean;
}

const initialState: IHighlightInteractionState = {
  isParaplotHighlighted: false,
};

export const highlightInteractionSlice = createSlice({
  name: "highlightInteraction",
  initialState,
  reducers: {
    setParaplotHighlight: (state, action: PayloadAction<boolean>) => {
      state.isParaplotHighlighted = action.payload;
    },
  },
});

export const { setParaplotHighlight } = highlightInteractionSlice.actions;

export default highlightInteractionSlice.reducer;
