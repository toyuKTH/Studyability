import { useEffect, useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import WorldMapFilter from "./components/WorldMapFilter";
import "./App.css";

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
      <div ref={mapDivRef} className="map-container">
        {mapDivRef.current && <WorldMap width={mapWidth} height={mapHeight} />}
      </div>
      <div id={"scatterplot"}></div>
      <WorldMapFilter />
    </div>
  );
}

export default App;
