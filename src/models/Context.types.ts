import { DSVParsedArray } from "d3";
import {
  ICountryCityUniversityData,
  IUniversityRankings,
} from "../data/CountryData";

export interface IContextData {
  universityRankingsData: DSVParsedArray<IUniversityRankings> | undefined;
  countryCityUniversityData:
    | DSVParsedArray<ICountryCityUniversityData>
    | undefined;
  selectedCountry: string;
  selectedFilter: string;
  hoveredCountry: string;
}
export interface ICountryContext {
  data: IContextData;
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
  data: IContextData;
}
