import { useEffect, useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import WorldMapFilter from "./components/WorldMapFilter";
import { loadData } from "./data/CountryData";
import "./App.css";

function App() {
  const [loadingData, setLoadingData] = useState(true);
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

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
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {loadingData && <div className="loading">Loading data...</div>}
      {!loadingData && (
        <>
          <div ref={mapDivRef} className="map-container">
            <WorldMap width={mapWidth} height={mapHeight} />
          </div>
          <WorldMapFilter />
        </>
      )}
    </div>
  );
}

export default App;
