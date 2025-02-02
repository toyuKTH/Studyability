import { ReactNode, useReducer } from "react";
import {
  countryReducer,
  CountryContext,
  CountryDispatchContext,
} from "../models/Context";

export default function AppContext({ children }: { children: ReactNode }) {
  const [countriesContext, countryDispatch] = useReducer(countryReducer, {
    selectedCountry: "",
    selectedFilter: "",
    data: null,
  });

  return (
    <CountryContext.Provider value={countriesContext}>
      <CountryDispatchContext.Provider value={countryDispatch}>
        {children}
      </CountryDispatchContext.Provider>
    </CountryContext.Provider>
  );
}
