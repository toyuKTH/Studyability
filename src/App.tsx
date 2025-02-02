import { useEffect, useRef, useState } from "react";
import "./App.css";
// import LinePlot from "./components/LinePlot";
import WorldMap from "./components/WorldMap";
import { data } from "./topologyData/countryTopology";
import WorldMapFilter from "./components/WorldMapFilter";
import * as d3 from "d3";

function App() {
  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapDivRef.current) return;

    setMapWidth(mapDivRef.current.offsetWidth);
    setMapHeight(mapDivRef.current.offsetHeight);

    window.addEventListener("resize", handleResize);
    function handleResize() {
      if (mapDivRef.current) {
        setMapWidth(mapDivRef.current.offsetWidth);
        setMapHeight(mapDivRef.current.offsetHeight);
      }
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [mapDivRef]);

  // function onMouseMove(event: React.MouseEvent) {
  //   const [x, y] = d3.pointer(event);
  //   setData(data.slice(-200).concat(Math.atan2(x, y)));
  // }

  // get window width

  const dispatch = d3.dispatch("countrySelected", "resetZoom");

  return (
    <div className="App">
      <div ref={mapDivRef} className="map-container">
        <WorldMap
          width={mapWidth}
          height={mapHeight}
          data={data as any}
          costumeDispatch={dispatch}
        />
      </div>
      <WorldMapFilter costumeDispatch={dispatch} />
    </div>
  );
}

export default App;
