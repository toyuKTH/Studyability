import { createSelector, createSlice } from "@reduxjs/toolkit";
import data from "../../data/json_db.json";
import { RootState } from "../store";
import { IFilterState } from "./filterSlice";

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
      cost_of_living_index: number | null;
      cost_of_living_plus_rent_index: number | null;
      groceries_index: number | null;
      local_purchasing_power_index: number | null;
      rent_index: number | null;
      restaurant_price_index: number | null;
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
interface IUniversityBase {
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
    employer_reputation: number | null;
    faculty_student: number | null;
    citations_per_faculty: number | null;
    international_faculty: number | null;
    international_research_network: number | null;
  };
  tuitionFee: {
    amount: number | null;
    provinance: string | null;
  };
  website: string;
}
export interface IUniversity {
  city: string | null;
  countryCode: keyof typeof data.country_db;
  cost_of_living_index: number | null;
  cost_of_living_plus_rent_index: number | null;
  groceries_index: number | null;
  local_purchasing_power_index: number | null;
  rent_index: number | null;
  restaurant_price_index: number | null;
  ef_level: string | null;
  ef_score: number | null;
  countryName: string;
  temperature: number | null;
  name: string;
  academic_reputation: number;
  employment_outcomes: number;
  international_students: number | null;
  qs_overall_score: string;
  rank: string;
  sustainability: number | null;
  tuitionFee: number | null;
  tuitionFeeProvinance: string | null;
  website: string;
  employer_reputation: number | null;
  faculty_student: number | null;
  citations_per_faculty: number | null;
  international_faculty: number | null;
  international_research_network: number | null;
}

export interface IUniversityDB {
  [uniId: string]: IUniversity;
}

interface IDataState {
  cities: ICityDB;
  countries: ICountryDB;
  universities: IUniversityDB;
  geoJSONUnis: any;
}

const uniNamesSet = new Set();

const initialState: IDataState = {
  cities: {
    ...(data.city_db as ICityDB),
  },
  countries: {
    ...(data.country_db as ICountryDB),
  },
  universities: {
    ...Object.keys(data.uni_db).reduce((acc: IUniversityDB, uniId) => {
      const tempUni: IUniversityBase =
        data.uni_db[uniId as keyof typeof data.uni_db];
      if (uniNamesSet.has(tempUni.name)) {
        return acc;
      }
      if (
        data.country_db[
          tempUni.location.countryCode as keyof typeof data.country_db
        ] === undefined
      ) {
        return acc;
      }

      let countryCode = tempUni.location
        .countryCode as keyof typeof data.country_db;

      const newUni: IUniversity = {
        name: tempUni.name,
        academic_reputation: tempUni.qsRankingInfo.academic_reputation,
        employment_outcomes: tempUni.qsRankingInfo.employment_outcomes,
        international_students: tempUni.qsRankingInfo.international_students,
        qs_overall_score: tempUni.qsRankingInfo.qs_overall_score,
        rank: tempUni.qsRankingInfo.rank,
        sustainability: tempUni.qsRankingInfo.sustainability,
        tuitionFee: tempUni.tuitionFee.amount,
        tuitionFeeProvinance: tempUni.tuitionFee.provinance,
        website: tempUni.website,
        city: tempUni.location.city,
        temperature: data.country_db[countryCode].temperature,
        countryCode: countryCode,
        cost_of_living_index:
          data.country_db[countryCode].costOfLiving.cost_of_living_index,
        ef_score: data.country_db[countryCode].efScore.ef_score,
        countryName: data.country_db[countryCode].name,
        cost_of_living_plus_rent_index:
          data.country_db[countryCode].costOfLiving
            .cost_of_living_plus_rent_index,
        groceries_index:
          data.country_db[countryCode].costOfLiving.groceries_index,
        local_purchasing_power_index:
          data.country_db[countryCode].costOfLiving
            .local_purchasing_power_index,
        rent_index: data.country_db[countryCode].costOfLiving.rent_index,
        restaurant_price_index:
          data.country_db[countryCode].costOfLiving.restaurant_price_index,
        ef_level: data.country_db[countryCode].efScore.ef_level,
        employer_reputation: tempUni.qsRankingInfo.employer_reputation,
        faculty_student: tempUni.qsRankingInfo.faculty_student,
        citations_per_faculty: tempUni.qsRankingInfo.citations_per_faculty,
        international_faculty: tempUni.qsRankingInfo.international_faculty,
        international_research_network:
          tempUni.qsRankingInfo.international_research_network,
      };

      uniNamesSet.add(tempUni.name);
      acc[uniId] = newUni;
      return acc;
    }, {}),
  },
  geoJSONUnis: {},
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

export const selectCountriesMaxMinFilterValues = createSelector(
  selectCountries,
  (countries) => {
    const maxCostOfLiving = Math.max(
      ...Object.keys(countries).map(
        (key) => countries[key].costOfLiving.cost_of_living_index || 0
      )
    );
    const minCostOfLiving = Math.min(
      ...Object.keys(countries).map(
        (key) => countries[key].costOfLiving.cost_of_living_index || 10000
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
        const parsedInt = parseInt(universities[key].qs_overall_score);
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );
    const minQsScore = Math.min(
      ...Object.keys(universities).map((key) => {
        const parsedInt = parseInt(universities[key].qs_overall_score);
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );

    const maxRank = Math.max(
      ...Object.keys(universities).map((key) => {
        const parsedInt = parseInt(universities[key].rank.split("-")[0]);
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );

    const minRank = Math.min(
      ...Object.keys(universities).map((key) => {
        const parsedInt = parseInt(universities[key].rank.split("-")[0]);
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
      })
    );

    const maxTuitionFee = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].tuitionFee || 0
      )
    );

    const minTuitionFee = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].tuitionFee || 10000
      )
    );

    const maxAcademicReputation = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].academic_reputation
      )
    );
    const minAcademicReputation = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].academic_reputation
      )
    );

    const maxEmploymentOutcomes = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].employment_outcomes
      )
    );

    const minEmploymentOutcomes = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].employment_outcomes
      )
    );

    const maxInternationalStudents = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].international_students || 0
      )
    );

    const minInternationalStudents = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].international_students || 10000
      )
    );

    const maxSustainability = Math.max(
      ...Object.keys(universities).map(
        (key) => universities[key].sustainability || 0
      )
    );

    const minSustainability = Math.min(
      ...Object.keys(universities).map(
        (key) => universities[key].sustainability || 10000
      )
    );

    return {
      rank: {
        maxRank,
        minRank,
      },
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

export const getFilteredData = createSelector(
  selectUniversities,
  selectFilters,
  (universities, filters) => {
    const filteredCountriesSet = new Set<keyof typeof data.country_db>();
    const filterdCountries = Object.values(universities).filter((uni) => {
      const countryFilters = filters.countries;
      let fitsFilters: boolean[] = [];
      Object.keys(countryFilters).forEach((key) => {
        let fitsCurrentFilter = false;

        const domains =
          countryFilters[key as keyof IFilterState["countries"]].domain;

        if (domains.length === 0) {
          fitsFilters.push(true);
          return;
        }

        domains.forEach((domain: [number, number]) => {
          if (fitsCurrentFilter) {
            return;
          }

          let value = uni[key as keyof IUniversity];

          if (value === null) {
            fitsCurrentFilter = true;
            return;
          }

          value = parseInt(value as string);

          if (isNaN(value)) {
            fitsCurrentFilter = true;
            return;
          }

          if (value >= domain[0] && value <= domain[1]) {
            fitsCurrentFilter = true;
          }
        });

        fitsFilters.push(fitsCurrentFilter);
      });

      const fitsAllFilters = !fitsFilters.includes(false);
      return fitsAllFilters;
    });

    const filteredUniversitiesSet = new Set<string>();
    const filteredUniversities = Object.values(filterdCountries).filter(
      (uni) => {
        if (filteredUniversitiesSet.has(uni.name)) {
          return false;
        }
        const universityFilters = filters.universityRankings;
        let fitsFilters: boolean[] = [];
        Object.keys(universityFilters).forEach((key) => {
          let fitsCurrentFilter = false;

          const domains =
            universityFilters[key as keyof IFilterState["universityRankings"]]
              .domain;
          if (domains.length === 0) {
            fitsFilters.push(true);
            return;
          }

          domains.forEach((domain: [number, number]) => {
            if (fitsCurrentFilter) {
              return;
            }

            let value = uni[key as keyof IUniversity];

            if (value === null) {
              fitsCurrentFilter = true;
              return;
            }

            value = parseInt(value as string);

            if (isNaN(value)) {
              fitsCurrentFilter = true;
              return;
            }

            if (value >= domain[0] && value <= domain[1]) {
              fitsCurrentFilter = true;
            }
          });

          fitsFilters.push(fitsCurrentFilter);
        });

        filteredUniversitiesSet.add(uni.name);

        const fitsAllFilters = !fitsFilters.includes(false);
        if (fitsAllFilters) {
          filteredCountriesSet.add(uni.countryCode);
        }
        return fitsAllFilters;
      }
    );

    const filteredCountriesObject = Array.from(filteredCountriesSet).reduce(
      (acc: ICountryDB, countryCode) => {
        acc[countryCode] = data.country_db[countryCode];
        return acc;
      },
      {}
    );

    return {
      filterdCountries: Object.values(filteredCountriesObject),
      filteredUniversities,
    };
  }
);

export default dataSlice.reducer;
