import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUniversity } from "./dataSlice";
import { qsAttributeKeys } from "../../helpers/qsAttributeUtils";

interface IHighlightInteractionState {
  isParaplotHighlighted: boolean;
  uniToHighlight: IUniversity | null;
  qsAttributeToHighlight: string | null;
  qsCategoriesToInclude: string[];
}

const initialState: IHighlightInteractionState = {
  isParaplotHighlighted: false,
  uniToHighlight: null,
  qsAttributeToHighlight: null,
  qsCategoriesToInclude: qsAttributeKeys,
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
    updateCategoriesToInclude: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.qsCategoriesToInclude.includes(category)) {
        state.qsCategoriesToInclude = state.qsCategoriesToInclude.filter(
          (cat) => cat !== category
        );
      } else {
        state.qsCategoriesToInclude.push(category);
      }
    },
  },
});

export const {
  setParaplotHighlight,
  setUniToHighlight,
  setQSAttributeToHighlight,
  updateCategoriesToInclude,
} = highlightInteractionSlice.actions;

export default highlightInteractionSlice.reducer;
