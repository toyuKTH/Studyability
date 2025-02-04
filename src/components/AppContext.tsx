import { ReactNode, useReducer } from "react";
import {
  countryReducer,
  CountryContext,
  CountryDispatchContext,
  initContext,
} from "../context/Context";

export default function AppContext({ children }: { children: ReactNode }) {
  const [countriesContext, countryDispatch] = useReducer(
    countryReducer,
    initContext
  );

  return (
    <CountryContext.Provider value={countriesContext}>
      <CountryDispatchContext.Provider value={countryDispatch}>
        {children}
      </CountryDispatchContext.Provider>
    </CountryContext.Provider>
  );
}
