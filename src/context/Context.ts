import { createContext, Dispatch } from "react";
import * as d3 from "d3";
import {
  ICountryContext,
  ICountryDispatch,
  IDispatchType,
} from "../models/Context.types";

export const initContext: ICountryContext = {
  selectedCountry: "",
  selectedFilter: "",
  hoveredCountry: "",
  data: null,
};

export const CountryContext = createContext(initContext);
export const CountryDispatchContext = createContext<Dispatch<ICountryDispatch>>(
  () => {}
);

export const d3Dispatch = d3.dispatch(
  "countrySelected",
  "resetZoom",
  "filterByUniversity"
);

export function countryReducer(
  context: ICountryContext,
  action: ICountryDispatch
) {
  switch (action.type) {
    case IDispatchType.addInitData: {
      return {
        ...context,
        data: action.data,
      };
    }
    case IDispatchType.addCountries: {
      return {
        ...context,
        data: action.data,
      };
    }
    case IDispatchType.selectCountry: {
      d3Dispatch.call("countrySelected", {}, { country: action.data });
      console.log("selecting country: ", action.data);
      // const newCountry =
      //   action.data === context.selectedCountry ? "" : action.data;
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
      // if (action.data === "university") {
      d3Dispatch.call("filterByUniversity");
      // }
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
    case IDispatchType.hoverCountry: {
      return {
        ...context,
        hoveredCountry: action.data,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
