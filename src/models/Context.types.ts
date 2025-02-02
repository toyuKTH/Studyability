export interface ICountryContext {
  selectedCountry: string;
  selectedFilter: string;
  data: any;
}

export enum IDispatchType {
  addCountries = "addCountries",
  selectCountry = "selectCountry",
  deselectCountry = "deSelectCountry",
  selectFilter = "selectFilter",
  deselectFilter = "deselectFilter",
}

export interface ICountryDispatch {
  type: IDispatchType;
  data: any;
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
