import { useEffect, useState } from "react";
import "./App.css";
// import LinePlot from "./components/LinePlot";
import WorldMap from "./components/WorldMap";
import { data } from "./topologyData/countryTopology";

function App() {
  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  function handleResize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // function onMouseMove(event: React.MouseEvent) {
  //   const [x, y] = d3.pointer(event);
  //   setData(data.slice(-200).concat(Math.atan2(x, y)));
  // }

  // get window width

  return (
    <div className="App">
      <WorldMap width={width} height={height} data={data as any} />
    </div>
  );
}

export default App;
