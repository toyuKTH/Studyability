import { DSVParsedArray } from "d3";
import {
  ICountryCityUniversityData,
  IUniversityRankings,
} from "../data/CountryData";

export interface IContextData {
  universityRankingsData: DSVParsedArray<IUniversityRankings> | null;
  countryCityUniversityData: DSVParsedArray<ICountryCityUniversityData> | null;
}
export interface ICountryContext {
  selectedCountry: string;
  hoveredCountry: string;
  selectedFilter: string;
  data: IContextData | null;
}

export enum IDispatchType {
  addInitData = "addInitData",
  addCountries = "addCountries",
  selectCountry = "selectCountry",
  deselectCountry = "deSelectCountry",
  selectFilter = "selectFilter",
  deselectFilter = "deselectFilter",
  hoverCountry = "hoverCountry",
}

export interface ICountryDispatch {
  type: IDispatchType;
  data: IContextData | string;
}

// export interface AddCountriesDispatch extends CountryDispatch {
//   type: "addCountries";
//   data: any;
// }

// export interface SelectCountryDispatch extends CountryDispatch {
//   type: "selectCountry";
//   data: any;
// }

// export interface DeselectCountryDispatch extends CountryDispatch {
//   type: "deSelectCountry";
//   data: any;
// }

// export interface SelectFilterDispatch extends CountryDispatch {
//   type: "selectFilter";
//   data: any;
// }

// export interface DeSelectFilterDispatch extends CountryDispatch {
//   type: "deselectFilter";
//   data: any;
// }
