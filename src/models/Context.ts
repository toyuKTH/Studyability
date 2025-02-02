import { createContext, Dispatch } from "react";
import * as d3 from "d3";
import {
  ICountryContext,
  ICountryDispatch,
  IDispatchType,
} from "./Context.types";

export const initContext: ICountryContext = {
  selectedCountry: "",
  selectedFilter: "",
  data: null,
};

export const CountryContext = createContext(initContext);
export const CountryDispatchContext = createContext<Dispatch<ICountryDispatch>>(
  () => {}
);

export const d3Dispatch = d3.dispatch("countrySelected", "resetZoom");

export function countryReducer(
  context: ICountryContext,
  action: ICountryDispatch
) {
  switch (action.type) {
    case IDispatchType.addCountries: {
      return {
        ...context,
        data: action.data,
      };
    }
    case IDispatchType.selectCountry: {
      d3Dispatch.call("countrySelected", {}, { country: action.data });

      return {
        ...context,
        selectedCountry: action.data,
      };
    }
    case IDispatchType.deselectCountry: {
      return {
        ...context,
        selectedCountry: "",
      };
    }
    case IDispatchType.selectFilter: {
      return {
        ...context,
        selectedFilter: action.data,
      };
    }
    case IDispatchType.deselectFilter: {
      return {
        ...context,
        selectedFilter: "",
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
