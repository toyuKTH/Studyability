import { useState } from "react";
import "./App.css";
import * as d3 from "d3";
import LinePlot from "./components/LinePlot";

function App() {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  function onMouseMove(event: React.MouseEvent) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  return (
    <div onMouseMove={onMouseMove} className="App">
      <LinePlot data={data} />
    </div>
  );
}

export default App;
