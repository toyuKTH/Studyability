import LanguageSVG from "./svg/LanguageSVG";
import MoneySVG from "./svg/MoneySVG";
import RankSVG from "./svg/RankSVG";
import TemperatureSVG from "./svg/TemperatureSVG";

function AboutData() {
  return (
    <>
      <h3>Mean temperature for countries by year</h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>World Bank Climate Knowledge</li>
          <li>
            Downloaded from:{" "}
            <a
              href="https://www.kaggle.com/datasets/palinatx/mean-temperature-for-countries-by-year-2014-2022"
              target="_blank"
              rel="noreferrer"
            >
              https://www.kaggle.com/datasets/palinatx/mean-temperature-for-countries-by-year-2014-2022
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed as <TemperatureSVG width={20} height={20} />
            <strong> Temperature </strong>
            in Explore and Compare page
          </div>
        </li>
        <ul>
          <li>
            The data consists of multiple years, and our visualization only
            displays the latest year available (2022)
          </li>
          <li>
            AI disclosure: OpenAI o3-mini is used to generate temperatures for
            countries with null data
          </li>
        </ul>
      </ul>
      <h3>Cost of Living Index by Country 2025</h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>Numbeo</li>
          <li>
            Scraped from:{" "}
            <a
              href="https://www.numbeo.com/cost-of-living/rankings_by_country.jsp"
              target="_blank"
              rel="noreferrer"
            >
              https://www.numbeo.com/cost-of-living/rankings_by_country.jsp
            </a>
          </li>
        </ul>
        <li>
          Displayed as <strong>Cost of Living Index</strong> in Explore and
          Compare page
        </li>
        <ul>
          <li>
            The data consists of multiple attributes, and our visualization only
            displays “Cost of Living Index (Excl. Rent)”
          </li>
        </ul>
      </ul>
      <h3>EF English Proficiency Index 2024</h3>
      <ul>
        <li>Data Origin</li>
        <ul>
          <li>Education First (EF)</li>
          <li>
            Scraped from:{" "}
            <a
              href="https://www.ef.se/epi/downloads/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.ef.se/epi/downloads/
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed as <LanguageSVG width={20} height={20} />{" "}
            <strong>English proficiency</strong> in Explore and Compare page
          </div>
        </li>
        <ul>
          <li>
            Our visualization displays the “scores” of the English Proficiency
            Index per country
          </li>
          <li>
            AI disclosure: OpenAI o3-mini is used to generate English
            proficiency for countries with null data
          </li>
        </ul>
      </ul>
      <h3>QS World University Rankings 2025: Top global universities</h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>Quacquarelli Symonds (QS)</li>
          <li>
            Downloaded from:{" "}
            <a
              href="https://www.kaggle.com/datasets/darrylljk/worlds-best-universities-qs-rankings-2025"
              target="_blank"
              rel="noreferrer"
            >
              https://www.kaggle.com/datasets/darrylljk/worlds-best-universities-qs-rankings-2025
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed as <RankSVG width={20} height={20} />{" "}
            <strong>Rank</strong> and <strong>Indicators</strong> in Explore and
            Compare page
          </div>
        </li>
        <ul>
          <li>Our visualization only display the 2025 rank</li>
          <li>
            The values of “Indicators” are also displayed on 0-100 scale for
            each university
          </li>
          <li>
            The mapping of “Indicators” to “Lenses” in Compare page are sourced
            from{" "}
            <a
              href="https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings"
              target="_blank"
              rel="noreferrer"
            >
              https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings
            </a>
          </li>
        </ul>
      </ul>
      <h3>
        Yearly tuition fee for master’s degree for international students in USD
      </h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>Quacquarelli Symonds (QS)</li>
          <li>
            Scraped from:{" "}
            <a
              href="https://www.topuniversities.com/universities/{university_name}"
              target="_blank"
              rel="noreferrer"
            >
              https://www.topuniversities.com/universities/{"{university_name}"}
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed as <MoneySVG width={20} height={20} />
            <strong>Tuition Fee</strong> in Explore and Compare page
          </div>
        </li>
        <ul>
          <li>The value is displayed as it is from the source (in USD)</li>
          <li>
            AI disclosure: OpenAI o3-mini is used to generate tuition fee for
            universities with null data
          </li>
        </ul>
      </ul>
      <h3>Geolocation of universities</h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>OpenStreetMap</li>
          <li>
            Retrieved using API from:{" "}
            <a
              href="https://nominatim.org/release-docs/latest/api/Search/"
              target="_blank"
              rel="noreferrer"
            >
              https://nominatim.org/release-docs/latest/api/Search/
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed on the <strong>Map</strong> in Explore page
          </div>
        </li>
        <ul>
          <li>
            The visualization retrieves the coordinate from *.geojson retrieved
            from the API
          </li>
          <li>
            Some locations might not be “accurate” due to potential mismatches
            from the API results
          </li>
        </ul>
      </ul>
      <h3>Website of universities</h3>
      <ul>
        <li>Data origin</li>
        <ul>
          <li>OpenStreetMap</li>
          <li>
            Retrieved using API from:{" "}
            <a
              href="https://nominatim.org/release-docs/latest/api/Search/"
              target="_blank"
              rel="noreferrer"
            >
              https://nominatim.org/release-docs/latest/api/Search/
            </a>
          </li>
        </ul>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Displayed on the <strong>Map</strong> in Explore page
          </div>
        </li>
        <ul>
          <li>
            The URL of the websites is retrieved from the API (if it exists)
          </li>
          <li>Only ~58% of the universities have a website from the source</li>
        </ul>
      </ul>
      <p>
        All stated AI usage was done so under the direct approval of the course
        supervisor
      </p>
    </>
  );
}

export default AboutData;
