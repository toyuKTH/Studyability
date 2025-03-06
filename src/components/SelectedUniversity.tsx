import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { flyToUni } from "../state/slices/mapInteractionSlice";
import { setCurrentUniversity } from "../state/slices/uniSelectionSlice";
import RadialBar from "./RadialBar";
import "./SelectedUniversity.css";
import { fetchGeoJSON } from "../helpers/fetchGeoJSON";
import { GeoJSONFeature } from "mapbox-gl";
import { IStudiabilityFeatureProperties } from "./WorldMap";
import { IUniversity } from "../state/slices/dataSlice";
import CancelSVG from "./svg/CancelSVG";
import RankSVG from "./svg/RankSVG";
import MoneySVG from "./svg/MoneySVG";
import TemperatureSVG from "./svg/TemperatureSVG";
import LanguageSVG from "./svg/LanguageSVG";

enum InfoEnum {
  rank = "rank",
  tuition = "tuition",
  temperature = "temperature",
  ef_score = "ef_score",
}

function SelectedUniversity({
  currentUniversity,
}: {
  currentUniversity: IUniversity;
}) {
  const dispatch = useAppDispatch();

  const flyToUniStatus = useAppSelector(
    (state) => state.mapInteraction.flyToUni.state
  );

  const [canFlyToUni, setCanFlyToUni] = useState<{
    canFly: boolean;
    uniFeature: GeoJSONFeature | null;
  }>({
    canFly: false,
    uniFeature: null,
  });

  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);

  useEffect(() => {
    if (!currentUniversity) return;

    const fetchJSON = async () => {
      try {
        const data = await fetchGeoJSON();

        const uniFeature: GeoJSONFeature = data.features.find(
          (feature: GeoJSONFeature) => {
            const properties =
              feature.properties as IStudiabilityFeatureProperties;
            return properties.university_name === currentUniversity.name;
          }
        );

        if (!uniFeature) {
          setCanFlyToUni({
            canFly: false,
            uniFeature: null,
          });
          setGeoJsonLoaded(true);
          return;
        }

        setCanFlyToUni({
          canFly: true,
          uniFeature,
        });

        setGeoJsonLoaded(true);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        setGeoJsonLoaded(true);
        return null;
      }
    };

    fetchJSON();
  }, [currentUniversity]);

  function cancelUniSelection() {
    dispatch(setCurrentUniversity(null));
  }

  return (
    <div className="selected-university-container">
      {geoJsonLoaded && (
        <>
          <div className="selected-university-header">
            <div>
              <h2 className="selected-university-title">
                {currentUniversity?.name}
              </h2>
              <h3 className="selected-university-subtitle">
                {currentUniversity?.city}, {currentUniversity?.countryName}
              </h3>
            </div>
            <button
              className="cancel-selection"
              style={{ width: "24px", height: "24" }}
              onClick={cancelUniSelection}
            >
              <CancelSVG width={24} height={24} />
            </button>
          </div>
          <div className="selected-university-element">
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <div>
                <div className="info-row-header">Rank</div>
                <div className="info-row" id={InfoEnum.rank}>
                  <RankSVG width={24} height={24} />
                  <div>{currentUniversity?.rank}</div>
                </div>
              </div>
              <div>
                <div className="info-row-header">Tuition (USD)</div>
                <div className="info-row" id={InfoEnum.tuition}>
                  <MoneySVG width={24} height={24} />
                  <div>{currentUniversity?.tuitionFee}</div>
                </div>
              </div>
              <div>
                <div className="info-row-header">Temperature (°C)</div>
                <div className="info-row" id={InfoEnum.temperature}>
                  <TemperatureSVG width={24} height={24} />
                  <div>{currentUniversity.temperature}</div>
                </div>
              </div>
              <div>
                <div className="info-row-header">English proficiency</div>
                <div className="info-row" id={InfoEnum.ef_score}>
                  <LanguageSVG width={24} height={24} />
                  <div>{currentUniversity.ef_score}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                width: "60%",
              }}
            >
              <RadialBar />
            </div>
          </div>
          {/* {canFlyToUni.canFly && flyToUniStatus !== "flying" && (
            <button
              onClick={() => dispatch(flyToUni(canFlyToUni.uniFeature))}
              className="fly-to-uni"
            >
              Move map to university
            </button>
          )}
          {!canFlyToUni.canFly && <p>University location not available</p>} */}
        </>
      )}
      {!geoJsonLoaded && <p>Loading uni data...</p>}
    </div>
  );
}

export default SelectedUniversity;
