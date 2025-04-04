import { NavLink } from "react-router";

function AboutHow() {
  return (
    <>
      <p>
        Studyability Map focuses on the following formal tasks{" "}
        <NavLink to={"/about#resources"}>(Munzner, 2014)</NavLink>
      </p>
      <ul>
        <li>
          <strong>Analyze:</strong>
          <span> Discover</span>
          <ul>
            <li>Find previously unknown new knowledge</li>
          </ul>
        </li>
        <li>
          <strong>Search:</strong>
          <span> Explore</span>
          <ul>
            <li>
              Start with an overview and explore nothing specific in the
              beginning
            </li>
          </ul>
        </li>
        <li>
          <strong>Query:</strong>
          <span> Compare</span>
          <ul>
            <li>Compare different university alternatives</li>
          </ul>
        </li>
        <li>
          <strong>Target:</strong>
          <span> Features</span>
          <ul>
            <li>Rank, find similarities and differences to compare</li>
          </ul>
        </li>
      </ul>
      <p>Three steps to use Studyability Map</p>
      <ol>
        <li>
          <strong>Explore</strong>
          <span> the possibilities by adjusting your preferences</span>
        </li>
        <li>
          <strong>Select</strong>
          <span> up to 5 universities that matches your interest</span>
        </li>
        <li>
          <strong>Compare</strong>
          <span> in details to help your decision making</span>
        </li>
      </ol>
      <h4>Watch our video to learn more</h4>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/REak3zI7U2U?si=F-1wqiktvrDU9SwB"
        title="Studiability Map Demo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen={true}
        style={{ borderRadius: "10px" }}
      />
      <h4>Limitations</h4>
      <ul>
        <li>
          Visualization is only supported in Desktop-view (not optimized for
          mobile view)
        </li>
        <li>
          Temperature and cost of living index are displayed in country-level,
          not available on city-level
        </li>
        <li>
          Tuition fees are displayed for international students, with no waiver
          available based on possession of a passport or residence permit
        </li>
      </ul>
    </>
  );
}

export default AboutHow;
