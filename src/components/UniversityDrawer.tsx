import { useState } from "react";
import "./UniversityDrawer.css";
import ChevronLeftSVG from "./svg/ChevronLeftSVG";
import { NavLink } from "react-router";
import { useAppSelector } from "../state/hooks";
import UniversityDrawerRow from "./UniversityDrawerRow";

export default function UniversityDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  function toggleDrawer() {
    setIsOpen(!isOpen);
  }
  return (
    <div className={`uni-drawer-container${isOpen ? " open" : ""}`}>
      <button
        onClick={() => {
          toggleDrawer();
        }}
        className="uni-drawer-button"
      >
        <ChevronLeftSVG />
      </button>
      <div className="uni-drawer-body">
        <h2 className="uni-drawer-header ">Selected Universities</h2>
        <div>
          {uniToCompare.map((uni) => (
            <UniversityDrawerRow key={`drawer-${uni.name}`} uni={uni} />
          ))}
        </div>
        <NavLink to="/compare" className="uni-compare-link">
          Compare
        </NavLink>
      </div>
    </div>
  );
}
