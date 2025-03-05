import { NavLink } from "react-router";
import "./PageNav.css";
import { useAppSelector } from "../state/hooks";

function PageNav() {
  const unisToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  return (
    <nav className="nav-container">
      <NavLink to="/" end>
        Explore
      </NavLink>
      <NavLink to="/compare" end>
        Compare
        {unisToCompare.length > 0 && (
          <div className="unis-selected">{unisToCompare.length}</div>
        )}
      </NavLink>
    </nav>
  );
}

export default PageNav;
