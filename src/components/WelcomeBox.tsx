import { NavLink } from "react-router";
import { useAppDispatch } from "../state/hooks";
import { setParaplotHighlight } from "../state/slices/highlightInteractionSlice";
import "./WelcomeBox.css";

function WelcomeBox() {
  const dispatch = useAppDispatch();

  function enableParaplotHighlight() {
    dispatch(setParaplotHighlight(true));
  }

  function disableParaplotHighlight() {
    dispatch(setParaplotHighlight(false));
  }

  return (
    <div className="welcome-box-wrapper">
      <h2 style={{ textAlign: "center" }}>Welcome!</h2>
      <p>
        This is a data visualization tool for exploring university rankings data
        from{" "}
        <a
          href="https://www.topuniversities.com/world-university-rankings"
          target="_blank"
        >
          QS World University Rankings.
        </a>
      </p>
      <p>Here are some tips to get started:</p>
      <ul>
        <li>Top 50 QS-ranked universities are displayed by default</li>
        <li>
          Use filters in the{" "}
          <span
            className="paraplot-name"
            onMouseEnter={enableParaplotHighlight}
            onMouseLeave={disableParaplotHighlight}
          >
            Parallel Coordinate Chart
          </span>{" "}
          by dragging the y axis of each dimension to refine results
        </li>
        <li>See results on the map, scatter plot, and university list</li>
        <li>
          Select the universities you want to compare and head to the{" "}
          <NavLink to={"/compare"}>compare page</NavLink>
        </li>
      </ul>
      <p>Start exploring now!</p>
    </div>
  );
}

export default WelcomeBox;
