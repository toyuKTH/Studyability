import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getFilteredData } from "../state/slices/dataSlice";
import {
  addUniToCompare,
  setCurrentUniversity,
} from "../state/slices/uniSelectionSlice";
import UniversityRow from "./UniversityRow";
import "./WorldMapFilter.css";

export default function WorldMapFilter() {
  const dispatch = useAppDispatch();
  const filteredData = useAppSelector(getFilteredData);

  const currentUniversity = useAppSelector(
    (state) => state.uniSelection.currentUniversity
  );

  const unisToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  return (
    <div className="filtering-list-container">
      <div className="map-filtering-title">
        <h2 style={{ margin: 0, marginTop: "5px" }}>Filtered universities</h2>
        <div className="map-filtering-info">
          {filteredData.filteredUniversities.length > 0 && (
            <p>
              {filteredData.filteredUniversities.length} universities in{" "}
              {filteredData.filterdCountries.length} countries
            </p>
          )}
          <p>compare</p>
        </div>
      </div>
      <div className="map-filtering-body">
        <table style={{ width: "100%" }}>
          <tbody>
            {filteredData.filteredUniversities.map((uni, index) => (
              <UniversityRow
                uni={uni}
                key={`uni-${index}`}
                isSelectedToCompare={unisToCompare.some(
                  (u) => u.name === uni.name
                )}
                selected={currentUniversity?.name === uni.name}
                onClick={(_) => {
                  if (uni.name === currentUniversity?.name) {
                    dispatch(setCurrentUniversity(null));
                  } else {
                    dispatch(setCurrentUniversity(uni));
                  }
                }}
                onToggleCheckbox={(_) => {
                  dispatch(addUniToCompare(uni));
                }}
                disabled={
                  unisToCompare.length >= 5 &&
                  !unisToCompare.some((u) => u.name === uni.name)
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
