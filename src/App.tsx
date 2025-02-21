import { useEffect, useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import WorldMapFilter from "./components/WorldMapFilter";
import "./App.css";
import ParallelPlot from "./components/ParallelPlot";
import ScatterPlot from "./components/ScatterPlot";

function App() {
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const mapDivRef = useRef<HTMLDivElement>(null);

  const resizeTimeout = useRef<number>(0);

  useEffect(() => {
    if (!mapDivRef.current) return;

    setMapWidth(mapDivRef.current.offsetWidth);
    setMapHeight(mapDivRef.current.offsetHeight);

    window.addEventListener("resize", handleResizeEvent);

    function handleResizeEvent() {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
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
  }, [mapDivRef.current]);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <div ref={mapDivRef} className="map-container">
          {mapDivRef.current && (
            <WorldMap width={mapWidth} height={mapHeight} />
          )}
        </div>
        <div className="plot-group-container">
          <div className="parallel-plot-container">
            <ParallelPlot />
          </div>
          <div className="scatter-plot-container">
            <ScatterPlot />
          </div>
        </div>
      </div>
      <WorldMapFilter />
    </div>
  );
}

export default App;
