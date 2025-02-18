import { createSelector, createSlice } from "@reduxjs/toolkit";
import data from "../../data/json_db.json";
import { RootState } from "../store";

interface ICityDB {
  [city: string]: {
    costOfLiving: {
      cost_of_living_index: number;
      cost_of_living_plus_rent_index: number;
      groceries_index: number;
      local_purchasing_power_index: number;
      rent_index: number;
      restaurant_price_index: number;
    };
    country: string;
    country_code: string | null;
    efScore: {
      ef_level: string | null;
      ef_score: number | null;
    };
    name: string;
    temperature: number | null;
    universities: number[];
  };
}

interface ICountryDB {
  [country: string]: {
    costOfLiving: {
      cost_of_living_index: number;
      cost_of_living_plus_rent_index: number;
      groceries_index: number;
      local_purchasing_power_index: number;
      rent_index: number;
      restaurant_price_index: number;
    };
    efScore: {
      ef_level: string | null;
      ef_score: number | null;
    };
    name: string;
    temperature: number | null;
    universities: number[];
  };
}

interface IUniversityDB {
  [uniId: string]: {
    location: {
      city: string | null;
      countryCode: string;
    };
    name: string;
    qsRankingInfo: {
      academic_reputation: number;
      employment_outcomes: number;
      international_students: number | null;
      qs_overall_score: string;
      rank: string;
      sustainability: number | null;
    };
    tuitionFee: {
      amount: number | null;
      provinance: string | null;
    };
    website: string;
  };
}

interface IDataState {
  cities: ICityDB;
  countries: ICountryDB;
  universities: IUniversityDB;
}

const initialState: IDataState = {
  cities: {
    ...(data.city_db as ICityDB),
  },
  countries: {
    ...(data.country_db as ICountryDB),
  },
  universities: {
    ...(data.uni_db as IUniversityDB),
  },
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
});

export const {} = dataSlice.actions;

// Other code such as selectors can use the imported `RootState` type

const selectUniversities = (state: RootState) => state.data.universities;
const selectCountries = (state: RootState) => state.data.countries;

export const selectUniversitiesByFilter = createSelector(
  selectUniversities,
  (universities) => {
    return Object.keys(universities).map((key) => universities[key].name);
  }
);

export const selectCountriesMaxMinFilterValues = createSelector(
  selectCountries,
  (countries) => {
    const maxCostOfLiving = Math.max(
      ...Object.keys(countries).map(
        (key) => countries[key].costOfLiving.cost_of_living_index
      )
    );
    const minCostOfLiving = Math.min(
      ...Object.keys(countries).map(
        (key) => countries[key].costOfLiving.cost_of_living_index
      )
    );

    const maxTemperature = Math.max(
      ...Object.keys(countries).map((key) => countries[key].temperature || 0)
    );

    const minTemperature = Math.min(
      ...Object.keys(countries).map((key) => countries[key].temperature || 100)
    );

    const maxEnglishProficiency = Math.max(
      ...Object.keys(countries).map(
        (key) => countries[key].efScore.ef_score || 0
      )
    );

    const minEnglishProficiency = Math.min(
      ...Object.keys(countries).map(
        (key) => countries[key].efScore.ef_score || 10000
      )
    );

    return {
      costOfLiving: {
        maxCostOfLiving,
        minCostOfLiving,
      },
      temperature: {
        maxTemperature,
        minTemperature,
      },
      englishProficiency: {
        maxEnglishProficiency,
        minEnglishProficiency,
      },
    };
  }
);

export default dataSlice.reducer;
