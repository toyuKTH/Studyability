import { IUniversity } from "../state/slices/dataSlice";
import PolarAreaChart from "./PolarAreaChart";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { addUniToCompare } from "../state/slices/uniSelectionSlice";

import "./CompareUniCard.css";
import { ChangeEvent, useState } from "react";
import SearchSVG from "./svg/SearchSVG";

export default function EmptyCompareCard() {
  const dispatch = useAppDispatch();

  const universities = useAppSelector((state) => state.data.universities);
  const unisToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<IUniversity[]>([]);
  const [noResults, setNoResults] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    const results = Object.values(universities).filter((uni) =>
      uni.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    if (results.length === 0) {
      setNoResults(true);
    }
    setSearchResults(results);
  };

  const handleUniClick = (uni: IUniversity) => {
    dispatch(addUniToCompare(uni));
    setInputValue("");
    setSearchResults([]);
  };

  const uniInCompare = (uni: IUniversity) =>
    unisToCompare.some((u) => u.name === uni.name);

  return (
    <div className="card-container">
      <div className="card-header-empty">
        <input
          type="text"
          placeholder="Search for a university"
          className="search-input"
          value={inputValue}
          onChange={handleInput}
        />
        <button>
          <SearchSVG width={30} height={30} />
        </button>
      </div>
      {searchResults.length === 0 && (
        <div className="card-empty-graph-container">
          <p>{noResults ? "University not found" : "Search to add"}</p>
          <PolarAreaChart uni={{} as IUniversity} empty={true} />
        </div>
      )}
      {searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.map((uni, index) => (
            <button
              className={
                uniInCompare(uni) ? "university-disabled" : "university-row"
              }
              key={`uni-${index}`}
              onClick={() => handleUniClick(uni)}
              disabled={uniInCompare(uni)}
            >
              <div className="university-name">
                #{uni.rank} {uni.name}
              </div>
              <div className="university-location">
                {uni.city}, {uni.countryName}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
