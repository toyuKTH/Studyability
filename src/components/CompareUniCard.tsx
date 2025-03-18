import { IUniversity } from "../state/slices/dataSlice";
import PolarAreaChart from "./PolarAreaChart";
import LanguageSVG from "./svg/LanguageSVG";
import RemoveSVG from "./svg/RemoveSVG";
import MoneySVG from "./svg/MoneySVG";
import RankSVG from "./svg/RankSVG";
import TemperatureSVG from "./svg/TemperatureSVG";
import LocationSVG from "./svg/LocationSVG";
import { useAppDispatch } from "../state/hooks";
import { addUniToCompare } from "../state/slices/uniSelectionSlice";

import "./CompareUniCard.css";

export default function CompareUniCard({
  currentUniversity,
}: {
  currentUniversity: IUniversity;
}) {
  const dispatch = useAppDispatch();

  function removeFromCompare() {
    dispatch(addUniToCompare(currentUniversity));
  }

  return (
    <div className="card-container">
      <button className="remove-from-compare" onClick={removeFromCompare}>
        <RemoveSVG width={20} height={20} />
      </button>
      <div className="card-header">
        <h2>{currentUniversity.name || "University name"}</h2>
      </div>
      <PolarAreaChart uni={currentUniversity} />
      <p
        style={{
          margin: 0,
          paddingLeft: "10px",
          fontSize: "small",
          textAlign: "center",
        }}
      >
        {currentUniversity.city}, {currentUniversity.countryName}
      </p>
      <div className="card-stats-container">
        <div className="card-stats-header">
          <div className="info-row-header">Rank</div>
          <div className="card-stat">
            <RankSVG width={20} height={20} />
            <p>{currentUniversity.rank}</p>
          </div>
        </div>
        <div className="card-stats-header">
          <div className="info-row-header">Tuition Fee (USD)</div>
          <div className="card-stat">
            <MoneySVG width={20} height={20} />
            <p>{currentUniversity.tuitionFee}</p>
          </div>
        </div>
        <div className="card-stats-header">
          <div className="info-row-header">Temperature (°C)</div>
          <div className="card-stat">
            <TemperatureSVG width={20} height={20} />
            <p>{currentUniversity.temperature}</p>
          </div>
        </div>
        <div className="card-stats-header">
          <div className="info-row-header">English Proficiency</div>
          <div className="card-stat">
            <LanguageSVG width={20} height={20} />
            <p>{currentUniversity.ef_score}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
