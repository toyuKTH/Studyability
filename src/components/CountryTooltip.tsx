import "./CountryTooltip.css";
import { useAppSelector } from "../state/hooks";

export default function CountryTooltip() {
  const country = useAppSelector(
    (state) => state.mapInteraction.hoveredCountry
  );

  return (
    <>
      <div className="country-tooltip" style={{ opacity: country ? "1" : "0" }}>
        {/* {country && ( */}
        <>
          <h2>{country}</h2>
          <p>Population: 123456</p>
          <p>Capital: City name</p>
        </>
        {/* )} */}
      </div>
    </>
  );
}
