import { ReactNode, useReducer } from "react";
import {
  countryReducer,
  CountryContext,
  CountryDispatchContext,
} from "../context/Context";

export default function AppContext({ children }: { children: ReactNode }) {
  const [countriesContext, countryDispatch] = useReducer(countryReducer, {
    data: {
      universityRankingsData: undefined,
      countryCityUniversityData: undefined,
      selectedCountry: "",
      selectedFilter: "",
      hoveredCountry: "",
    },
  });

  return (
    <CountryContext.Provider value={countriesContext}>
      <CountryDispatchContext.Provider value={countryDispatch}>
        {children}
      </CountryDispatchContext.Provider>
    </CountryContext.Provider>
  );
}
