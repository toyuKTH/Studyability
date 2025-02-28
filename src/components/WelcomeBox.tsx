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
    <div className='welcome-box-wrapper'>
      <h2>Welcome!</h2>
      <ul>
        <li>Top 50 QS-ranked universities are displayed by default.</li>
        <li>
          Use filters in the{" "}
          <span
            className='paraplot-name'
            onMouseEnter={enableParaplotHighlight}
            onMouseLeave={disableParaplotHighlight}
          >
            Parallel Coordinate Chart
          </span>{" "}
          to refine results
        </li>
        <li>See results on the map, scatter plot, and university list.</li>
      </ul>
      <p>Start exploring now!</p>
    </div>
  );
}

export default WelcomeBox;
