import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFilter {
  domain: [[number, number]] | [];
}

interface IFilterState {
  universityRankings: {
    qsRankingInfo: {
      academic_reputation: IFilter;
      employment_outcomes: IFilter;
      international_students: IFilter;
      qs_overall_score: IFilter;
      rank: IFilter;
      sustainability: IFilter;
    };
    tuitionFee: {
      amount: IFilter;
    };
  };
  countries: {
    costOfLiving: {
      cost_of_living_index: IFilter;
      cost_of_living_plus_rent_index: IFilter;
      groceries_index: IFilter;
      local_purchasing_power_index: IFilter;
      rent_index: IFilter;
      restaurant_price_index: IFilter;
    };
    efScore: {
      ef_level: IFilter;
      ef_score: IFilter;
    };
    temperature: IFilter;
  };
}

const initialState: IFilterState = {
  universityRankings: {
    qsRankingInfo: {
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
        domain: [],
      },
      sustainability: {
        domain: [],
      },
    },
    tuitionFee: {
      amount: {
        domain: [],
      },
    },
  },
  countries: {
    costOfLiving: {
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
    },
    efScore: {
      ef_level: {
        domain: [],
      },
      ef_score: {
        domain: [],
      },
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

export enum FilterAttribute {
  QSRankingInfo = "qsRankingInfo",
  TuitionFee = "tuitionFee",
  CostOfLiving = "costOfLiving",
  EfScore = "efScore",
  Temperature = "temperature",
}

export enum FilterSubAttribute {
  AcademicReputation = "academic_reputation",
  EmploymentOutcomes = "employment_outcomes",
  InternationalStudents = "international_students",
  QSOverallScore = "qs_overall_score",
  Rank = "rank",
  Sustainability = "sustainability",
  TuitionFee = "amount",
  CostOfLivingIndex = "cost_of_living_index",
  CostOfLivingPlusRentIndex = "cost_of_living_plus_rent_index",
  GroceriesIndex = "groceries_index",
  LocalPurchasingPowerIndex = "local_purchasing_power_index",
  RentIndex = "rent_index",
  RestaurantPriceIndex = "restaurant_price_index",
  EFLevel = "ef_level",
  EFScore = "ef_score",
  Temperature = "temperature",
}

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter: (
      state,
      action: PayloadAction<{
        filterData: FilterType;
        filterAttribute: FilterAttribute;
        filterSubAttribute?: FilterSubAttribute;
        domain: [number, number];
      }>
    ) => {
      switch (action.payload.filterData) {
        case FilterType.UniversityRankings:
          console.log(action.payload);
          // @ts-ignore
          state.universityRankings[action.payload.filterAttribute][
            action.payload.filterSubAttribute
          ].domain = action.payload.domain;
          break;
        case FilterType.Countries:
          if (!action.payload.filterSubAttribute) {
            // @ts-ignore
            state.countries[action.payload.filterAttribute].domain =
              action.payload.domain;
            break;
          }
          // @ts-ignore
          state.countries[action.payload.filterAttribute][
            action.payload.filterSubAttribute
          ].domain = action.payload.domain;
          break;
      }
    },
  },
});

export const { updateFilter } = filterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default filterSlice.reducer;
