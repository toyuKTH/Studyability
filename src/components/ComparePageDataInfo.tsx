import { NavLink } from "react-router";
import "./DataInfo.css";
import RankSVG from "./svg/RankSVG";
import MoneySVG from "./svg/MoneySVG";
import TemperatureSVG from "./svg/TemperatureSVG";
import LanguageSVG from "./svg/LanguageSVG";

export default function ComparePageDataInfo() {
  return (
    <>
      <h3>University Cards</h3>
      <div className="data-container">
        <p>
          Up to 5 universities can be compared at a time. You can either search
          for a university by typing in the search bar of the empty card or by
          selecting universities from the{" "}
          <NavLink to={"/"}>Explore page.</NavLink>
        </p>
        <h4>
          <RankSVG width={20} height={20} /> Rank
        </h4>
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
        <h4>
          <MoneySVG width={20} height={20} /> Tuition Fee
        </h4>
        <div className="data-container">
          Indicates the average yearly tuition fee for a master's program in USD
          for international students. Higher value = more expensive tuition fee
          to pay.
        </div>
        <h4>
          <TemperatureSVG width={20} height={20} /> Temperature
        </h4>
        <div className="data-container">
          <p>Indicates the average yearly country temperature in Celsius. Higher value = warmer temperature.</p>
        </div>
        <h4>
          <LanguageSVG width={20} height={20} /> English Profiency
        </h4>
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
      </div>
      <h3>Radial Bar Chart, Spider Chart, and Bar Chart</h3>
      <div className="data-container">
        <p>
          The different colors in the charts represent different "Lens" from QS
          World University Rankings. Each "Lens" consists of different
          "Indicators" with the following mapping (Read:{" "}
          <a
            href="https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings"
            target="_blank"
          >
            Methodology
          </a>
          )
        </p>
        <div className="legend-header">
          <div className="legend-color" style={{ background: "#3B508A" }} />
          <h4>Global Engagement</h4>
        </div>
        <div className="data-container">
          <ul>
            <li>International Faculty Ratio</li>
            <div className="data-container">
              <i>“The International Faculty Ratio (IFR) indicator looks at the
              ratio of international faculty staff to overall staff.”</i> - Read
              more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/4403961809554-International-Faculty-Ratio-Indicator#:~:text=The%20International%20Faculty%20Ratio%20(IFR,and%20teaching%20diversity%20and%20collaborations."
                target="_blank"
              >
                QS support
              </a>
            </div>
            <li>International Research Network</li>
            <div className="data-container">
              <i>“International Research Network (IRN) is a measure of an
              institution's success in creating and sustaining research
              partnerships with institutions in other locations.”</i> - Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/360021865579-International-Research-Network-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
            <li>International Student Ratio</li>
            <div className="data-container">
              <i>“The International Faculty Ratio (IFR) indicator looks at the
              ratio of international faculty staff to overall staff.”</i> - Read
              more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/4403961727506-International-Student-Ratio-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
          </ul>
        </div>
        <div className="legend-header">
          <div className="legend-color" style={{ background: "#FDE725" }} />
          <h4>Research and Discovery</h4>
        </div>
        <div className="data-container">
          <ul>
            <li>Academic Reputation</li>
            <div className="data-container">
              <i>“The Academic Reputation (AR) indicator measures the reputation of
              institutions and their programmes by asking academic experts to
              nominate universities based on their subject area of expertise.”</i> -
              Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/4405952675346-Academic-Reputation-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
            <li>Citations per Faculty</li>
            <div className="data-container">
              <i>“The Citations per Faculty (CPF) indicator is a measure of the
              relative intensity and volume of research being done at an
              institution.”</i> - Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/360019107580-Citations-per-Faculty-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
          </ul>
        </div>
        <div className="legend-header">
          <div className="legend-color" style={{ background: "#D4ED99" }} />
          <h4>Employability and Outcomes</h4>
        </div>
        <div className="data-container">
          <ul>
            <li>Employer Reputation</li>
            <div className="data-container">
              <i>“The Employer Reputation (ER) indicator measures the reputation of
              institutions and their programmes among employers.“</i> - Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/4407794203410-Employer-Reputation-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
            <li>Employment Outcomes</li>
            <div className="data-container">
              <i>“The Employment Outcomes (EO) indicator measures to what degree
              institutions can ensure a high level of employability for their
              graduates, and their record in producing graduates that have gone
              on to make a meaningful impact on society.”</i> - Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/4744563188508-Employment-Outcomes-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
          </ul>
        </div>
        <div className="legend-header">
          <div className="legend-color" style={{ background: "#2CA02C" }} />
          <h4>Sustainability</h4>
        </div>
        <div className="data-container">
          <ul>
            <li>Sustainability</li>
            <div className="data-container">
              <i>“The Sustainability (SUS) indicator highlights which institutions
              are demonstrating a commitment to a more sustainable existence,
              and encompasses a variety of factors across environmental, social
              and governance (ESG).”</i> - Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/8322582098460-Sustainability-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
          </ul>
        </div>
        <div className="legend-header">
          <div className="legend-color" style={{ background: "#461667" }} />
          <h4>Learning Experience</h4>
        </div>
        <div className="data-container">
          <ul>
            <li>Faculty Student Ratio</li>
            <div className="data-container">
              <i>“The Faculty-Student Ratio indicator is a measure of the number of
              academic staff that an institution has to teach its students.”</i> -
              Read more on{" "}
              <a
                href="https://support.qs.com/hc/en-gb/articles/360019108240-Faculty-Student-Ratio-Indicator"
                target="_blank"
              >
                QS support
              </a>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
