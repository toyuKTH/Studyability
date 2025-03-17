import { NavLink, useLocation } from "react-router";
import "./PageNav.css";
import { useAppSelector } from "../state/hooks";

function PageNav() {
  const route = useLocation();

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
        {unisToCompare.length > 0 && route.pathname !== "/compare" && (
          <div className="unis-selected">{unisToCompare.length}</div>
        )}
      </NavLink>
      <NavLink to="/about" end>
        About
      </NavLink>
    </nav>
  );
}

export default PageNav;
