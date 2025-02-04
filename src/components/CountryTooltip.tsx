import "./CountryTooltip.css";

export default function CountryTooltip({
  selectedCountry,
}: {
  selectedCountry: string;
}) {
  return <div className="country-tooltip">{selectedCountry}</div>;
}
