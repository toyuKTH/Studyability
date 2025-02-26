import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFilter {
  domain: [[number, number]] | [];
}

export interface IFilterState {
  universityRankings: {
    academic_reputation: IFilter;
    employment_outcomes: IFilter;
    international_students: IFilter;
    qs_overall_score: IFilter;
    rank: IFilter;
    sustainability: IFilter;
    tuitionFee: IFilter;
  };
  countries: {
    cost_of_living_index: IFilter;
    cost_of_living_plus_rent_index: IFilter;
    groceries_index: IFilter;
    local_purchasing_power_index: IFilter;
    rent_index: IFilter;
    restaurant_price_index: IFilter;
    ef_level: IFilter;
    ef_score: IFilter;
    temperature: IFilter;
  };
}

const initialState: IFilterState = {
  universityRankings: {
    academic_reputation: {
      domain: [],
    },
    employment_outcomes: {
      domain: [],
    },
    international_students: {
      domain: [],
    },
    qs_overall_score: {
      domain: [],
    },
    rank: {
      domain: [[1, 50]],
    },
    sustainability: {
      domain: [],
    },
    tuitionFee: {
      domain: [],
    },
  },
  countries: {
    cost_of_living_index: {
      domain: [],
    },
    cost_of_living_plus_rent_index: {
      domain: [],
    },
    groceries_index: {
      domain: [],
    },
    local_purchasing_power_index: {
      domain: [],
    },
    rent_index: {
      domain: [],
    },
    restaurant_price_index: {
      domain: [],
    },
    ef_level: {
      domain: [],
    },
    ef_score: {
      domain: [],
    },
    temperature: {
      domain: [],
    },
  },
};

export enum FilterType {
  UniversityRankings = "universityRankings",
  Countries = "countries",
}

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter: (
      state,
      action: PayloadAction<{
        filterAttribute:
          | keyof IFilterState["universityRankings"]
          | keyof IFilterState["countries"];
        domain: [[number, number]];
      }>
    ) => {
      const { filterAttribute, domain } = action.payload;

      if (filterAttribute in state.universityRankings) {
        state.universityRankings[
          filterAttribute as keyof IFilterState["universityRankings"]
        ].domain = domain;
      } else if (filterAttribute in state.countries) {
        state.countries[
          filterAttribute as keyof IFilterState["countries"]
        ].domain = domain;
      }
    },
  },
});

export const { updateFilter } = filterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default filterSlice.reducer;
