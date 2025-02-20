import { createSelector, createSlice } from "@reduxjs/toolkit";
import data from "../../data/json_db.json";
import { RootState } from "../store";

export interface ICityDB {
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

export interface ICountryDB {
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

export interface IUniversityDB {
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
const selectFilters = (state: RootState) => state.filter;

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

export const selectUniversitiesMaxMinFilterValues = createSelector(
  selectUniversities,
  (universities) => {
    const maxQsScore = Math.max(
      ...Object.keys(universities).map((key) => {
        const parsedInt = parseInt(
          universities[key].qsRankingInfo.qs_overall_score
        );
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );
    const minQsScore = Math.min(
      ...Object.keys(universities).map((key) => {
        const parsedInt = parseInt(
          universities[key].qsRankingInfo.qs_overall_score
        );
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );

    const maxTuitionFee = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].tuitionFee.amount || 0
      )
    );

    const minTuitionFee = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].tuitionFee.amount || 10000
      )
    );

    const maxAcademicReputation = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.academic_reputation
      )
    );
    const minAcademicReputation = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.academic_reputation
      )
    );

    const maxEmploymentOutcomes = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.employment_outcomes
      )
    );

    const minEmploymentOutcomes = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.employment_outcomes
      )
    );

    const maxInternationalStudents = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.international_students || 0
      )
    );

    const minInternationalStudents = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.international_students || 10000
      )
    );

    const maxSustainability = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.sustainability || 0
      )
    );

    const minSustainability = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].qsRankingInfo.sustainability || 10000
      )
    );

    return {
      qsScore: {
        maxQsScore,
        minQsScore,
      },
      tuitionFee: {
        maxTuitionFee,
        minTuitionFee,
      },
      academicReputation: {
        maxAcademicReputation,
        minAcademicReputation,
      },
      employmentOutcomes: {
        maxEmploymentOutcomes,
        minEmploymentOutcomes,
      },
      internationalStudents: {
        maxInternationalStudents,
        minInternationalStudents,
      },
      sustainability: {
        maxSustainability,
        minSustainability,
      },
    };
  }
);

export const getFilteredCountries = createSelector(
  selectCountries,
  selectFilters,
  (countries, filters) => {
    const filteredCountriesCostOfLiving = Object.values(countries).filter(
      (country) => {
        let fitsCostOfLiving: boolean[] = [];
        Object.keys(filters.countries.costOfLiving).forEach((key) => {
          // @ts-ignore
          const domains = filters.countries.costOfLiving[key].domain;
          if (domains.length === 0) {
            // fitsCostOfLiving.push(true);
            return;
          }

          domains.forEach((domain: [number, number]) => {
            if (
              // @ts-ignore
              country.costOfLiving[key] <= domain[0] ||
              // @ts-ignore
              country.costOfLiving[key] >= domain[1]
            ) {
              fitsCostOfLiving.push(false);
            } else {
              fitsCostOfLiving.push(true);
            }
          });
        });

        return fitsCostOfLiving.includes(true);
      }
    );

    const filteredCountriesTemp = Object.values(
      filteredCountriesCostOfLiving
    ).filter((country) => {
      let fitsTemperature: boolean[] = [];
      const domains = filters.countries.temperature.domain;
      if (domains.length != 0) {
        domains.forEach((domain: [number, number]) => {
          if (!country.temperature) {
            fitsTemperature.push(false);
            return;
          }

          if (
            country.temperature <= domain[0] ||
            country.temperature >= domain[1]
          ) {
            fitsTemperature.push(false);
          } else {
            fitsTemperature.push(true);
          }
        });
      } else {
        fitsTemperature.push(true);
      }

      return fitsTemperature.includes(true);
    });

    const filteredCountriesEP = Object.values(filteredCountriesTemp).filter(
      (country) => {
        let fitsEP: boolean[] = [];
        Object.keys(filters.countries.efScore).forEach((key) => {
          // @ts-ignore
          const domains = filters.countries.efScore[key].domain;
          if (domains.length === 0) {
            // fitsCostOfLiving.push(true);
            return;
          }

          domains.forEach((domain: [number, number]) => {
            if (
              // @ts-ignore
              country.efScore[key] <= domain[0] ||
              // @ts-ignore
              country.efScore[key] >= domain[1]
            ) {
              fitsEP.push(false);
            } else {
              fitsEP.push(true);
            }
          });
        });

        return fitsEP.includes(true);
      }
    );

    console.log(filteredCountriesEP);

    return filteredCountriesEP;
  }
);

export default dataSlice.reducer;
