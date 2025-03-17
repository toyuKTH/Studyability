import "./DataInfo.css";

export default function ExplorPageDataInfo() {
  return (
    <>
      <h3>Parallel Coordinate Chart</h3>
      <div className="data-container">
        <p>
          You can interact with the parallel coordinate plot by dragging on the
          axis of each dimension. Each dimension supports multiple filters.
          Single clicks on the axis will remove the filter. Dimensions can also
          be reordered by dragging the axis label.
        </p>
        <h4>Temperature</h4>
        <div className="data-container">
          <p>Indicates the average yearly country temperature in Celsius</p>
        </div>
        <h4>English Profiency</h4>
        <div className="data-container">
          Indicates the value of EF English Proficiency Index 2024 in
          country-level. Higher value = better English-speaking country. <br />
          From{" "}
          <a
            href="https://www.ef.se/epi/about-epi/#proficiency-bands"
            target="_blank"
          >
            EF EPI Proficiency Bands
          </a>
          <br />
          <ul>
            <li>Very high proficiency (score 600+)</li>
            <li>High proficiency (score 550 - 599)</li>
            <li>Moderate proficiency (score 500 - 549)</li>
            <li>Low proficiency (score 450 - 499)</li>
            <li>Very low proficiency (score {"<"} 450)</li>
          </ul>
        </div>
        <h4>Cost of Living</h4>
        <div className="data-container">
          Indicates Numbeo’s Cost of Living Index (Excl. Rent) 2025 in
          country-level. Higher value = relatively higher cost to live in the
          chosen country. <br />
          From{" "}
          <a
            href="https://www.numbeo.com/cost-of-living/cpi_explained.jsp"
            target="_blank"
          >
            Numbeo's Cost of Living Indexes
          </a>{" "}
          <ul>
            “Cost of Living Index (Excl. Rent): This index indicates the
            relative prices of consumer goods like groceries, restaurants,
            transportation, and utilities. It excludes accommodation expenses
            such as rent or mortgage. For instance, a city with a Cost of Living
            Index of 120 is estimated to be 20% more expensive than New York
            City (excluding rent)”.
          </ul>
        </div>
        <h4>Rank</h4>
        <div className="data-container">
          Indicates how the university is ranked within{" "}
          <a
            href="https://www.topuniversities.com/world-university-rankings"
            target="_blank"
          >
            QS World University Rankings 2025.
          </a>{" "}
          Higher value = lower ranking.
        </div>
        <h4>Tuition Fee</h4>
        <div className="data-container">
          Indicates the average yearly tuition fee for a master's program in USD
          for international students. Higher value = more expensive tuition fee
          to pay.
        </div>
      </div>
      <h3>Scatter Plot</h3>
      <div className="data-container">
        <p>
          You can interact with the scatter plot by changing the x and y axis
          attributes from the dropdown menu. Hovering over the data points will
          show the university name and the value of the x and y axis. Clicking
          on the data points will select the university and show the detailed
          information in the right panel as well as move the map to the location
          of the university.
        </p>
        <h4>Academic Reputation</h4>
        <div className="data-container">
          “The Academic Reputation (AR) indicator measures the reputation of
          institutions and their programmes by asking academic experts to
          nominate universities based on their subject area of expertise.” -
          Read more on{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/4405952675346-Academic-Reputation-Indicator"
            target="_blank"
          >
            QS support
          </a>
        </div>
        <h4>Employment Outcomes</h4>
        <div className="data-container">
          “The Employment Outcomes (EO) indicator measures to what degree
          institutions can ensure a high level of employability for their
          graduates, and their record in producing graduates that have gone on
          to make a meaningful impact on society.” - Read more on{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/4744563188508-Employment-Outcomes-Indicator"
            target="_blank"
          >
            QS support
          </a>
        </div>
        <h4>International Student Ratio</h4>
        <div className="data-container">
          “The International Faculty Ratio (IFR) indicator looks at the ratio of
          international faculty staff to overall staff.” - Read more on{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/4403961727506-International-Student-Ratio-Indicator"
            target="_blank"
          >
            QS support
          </a>
        </div>
        <h4>Faculty Student Ratio</h4>
        <div className="data-container">
          “The Faculty-Student Ratio indicator is a measure of the number of
          academic staff that an institution has to teach its students.” - Read
          more on{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/360019108240-Faculty-Student-Ratio-Indicator"
            target="_blank"
          >
            QS support
          </a>
        </div>
        <h4>Sustainability</h4>
        <div className="data-container">
          “The Sustainability (SUS) indicator highlights which institutions are
          demonstrating a commitment to a more sustainable existence, and
          encompasses a variety of factors across environmental, social and
          governance (ESG).” - Read more on{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/8322582098460-Sustainability-Indicator"
            target="_blank"
          >
            QS support
          </a>
        </div>
      </div>
    </>
  );
}
