import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFilter {
  showing: boolean;
}

interface IUniversityRankingsFilter extends IFilter {
  domain: [number, number];
}

interface IFilterState {
  universityRankings: IUniversityRankingsFilter;
}

const initialState: IFilterState = {
  universityRankings: {
    showing: false,
    domain: [0, 100],
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    showUniversityFilter: (state) => {
      state.universityRankings.showing = true;
    },
    hideUniversityFilter: (state) => {
      state.universityRankings.showing = false;
    },
    setUniversityFilterMin: (state, action: PayloadAction<number>) => {
      state.universityRankings.domain[0] = action.payload;
    },
    setUniversityFilterMax: (state, action: PayloadAction<number>) => {
      state.universityRankings.domain[1] = action.payload;
    },
  },
});

export const {
  showUniversityFilter,
  hideUniversityFilter,
  setUniversityFilterMin,
  setUniversityFilterMax,
} = filterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default filterSlice.reducer;
