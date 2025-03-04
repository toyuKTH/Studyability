import { NavLink } from "react-router";
import "./PageNav.css";

function PageNav() {
  return (
    <nav className='nav-container'>
      <NavLink to='/' end>
        Home
      </NavLink>
      <NavLink to='/compare' end>
        Compare
      </NavLink>
    </nav>
  );
}

export default PageNav;
