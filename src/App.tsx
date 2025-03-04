import { useEffect, useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import WorldMapFilter from "./components/WorldMapFilter";
import "./App.css";
import ParallelPlot from "./components/ParallelPlot";
import ScatterPlot from "./components/ScatterPlot";
import TopSidebar from "./components/TopSidebar";

function App() {
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const mapDivRef = useRef<HTMLDivElement>(null);

  const resizeTimeout = useRef<NodeJS.Timeout>();

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
      <div className="center-area-container">
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
      <div className="right-sidebar-container">
        <TopSidebar />
        <WorldMapFilter />
      </div>
    </div>
  );
}

export default App;
