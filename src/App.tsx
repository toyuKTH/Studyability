import { useEffect, useReducer, useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import WorldMapFilter from "./components/WorldMapFilter";
import { loadData } from "./data/CountryData";
import { d3Dispatch } from "./state/Context";
import "./App.css";
import { useAppSelector } from "./state/hooks";

export interface IMapFilterState {
  universityRankingsData: {
    showScale: boolean;
    minVal: number;
    maxVal: number;
    data: any[];
  };
  countryCityUniversityData: any;
}

export interface IMapFilterAction {
  type: IDispatchType;
  data: any;
}

export enum IDispatchType {
  universityFilterMax = "universityFilterMax",
  universityFilterMin = "universityFilterMin",
  universityFilterShowScale = "universityFilterShowScale",
}

function mapFilterReducer(
  state: IMapFilterState,
  action: IMapFilterAction
): IMapFilterState {
  switch (action.type) {
    case IDispatchType.universityFilterMax:
      return {
        ...state,
        universityRankingsData: {
          ...state.universityRankingsData,
          maxVal: action.data,
        },
      };
    case IDispatchType.universityFilterMin:
      return {
        ...state,
        universityRankingsData: {
          ...state.universityRankingsData,
          minVal: action.data,
        },
      };
    case IDispatchType.universityFilterShowScale:
      return {
        ...state,
        universityRankingsData: {
          ...state.universityRankingsData,
          showScale: !state.universityRankingsData.showScale,
        },
      };
    default:
      return { ...state };
  }
}

function mapFilterStateInit() {
  return {
    universityRankingsData: {
      showScale: false,
      minVal: 0,
      maxVal: 100,
      data: [],
    },
    countryCityUniversityData: [],
  };
}

function App() {
  const [mapFilterState, mapFilterDispatch] = useReducer(
    mapFilterReducer,
    mapFilterStateInit()
  );

  const [loadingData, setLoadingData] = useState(true);
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  // const dispatchContext = useContext(CountryDispatchContext);

  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapDivRef.current || loadingData) return;

    setMapWidth(mapDivRef.current.offsetWidth);
    setMapHeight(mapDivRef.current.offsetHeight);

    window.addEventListener("resize", handleResizeEvent);
    var resizeTimeout: number;

    function handleResizeEvent() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
      }, 200);
    }

    function handleResize() {
      if (mapDivRef.current) {
        d3Dispatch.call("resetZoom", {});
        setMapWidth(mapDivRef.current.offsetWidth);
        setMapHeight(mapDivRef.current.offsetHeight);
      }
    }
    return () => window.removeEventListener("resize", handleResizeEvent);
  }, [mapDivRef, loadingData]);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();

      setLoadingData(false);
      // dispatchContext({
      //   type: IDispatchType.addInitData,
      //   data: {
      //     universityRankingsData: data.universityRankingsData,
      //     countryCityUniversityData: data.countryCityUniversityData,
      //   },
      // });
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {loadingData && <div className="loading">Loading data...</div>}
      {!loadingData && (
        <>
          <div ref={mapDivRef} className="map-container">
            <WorldMap
              width={mapWidth}
              height={mapHeight}
              mapFilterState={mapFilterState}
            />
          </div>
          <WorldMapFilter mapFilterDispatch={mapFilterDispatch} />
        </>
      )}
    </div>
  );
}

export default App;
