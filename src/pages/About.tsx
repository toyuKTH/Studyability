import { useLocation } from "react-router";
import "./About.css";
import { useEffect } from "react";

function About() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="about-container">
      <div className="about-section" id="overview">
        <h2>Project Overview</h2>
        <p>
          Studyability Map assists prospective students in finding the ideal
          university and location for their next study destination. The
          visualization will help those who are considering attending a
          university and are in search of their dream institution and place to
          live.
        </p>
        <p>
          Recognizing the difficulty in gathering and comparing information
          through internet searches, Studyability Map streamlines the process,
          making it easier for students to make informed decisions about their
          future. It can also be used by researchers, professors, and admission
          officers to gather and analyze important information about different
          universities.
        </p>
      </div>
      <div className="about-section" id="how">
        <h2>How To Use</h2>
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
      </div>
      <div className="about-section" id="team">
        <h2>Team</h2>
        <p>Lorem Ipsum</p>
      </div>
      <div className="about-section" id="data">
        <h2>Data</h2>
        <p>Lorem Ipsum</p>
      </div>
      <div className="about-section" id="changelog">
        <h2>Changelog</h2>
        <p>Lorem Ipsum</p>
      </div>
      <div className="about-section" id="resources">
        <h2>Project Resources</h2>
        <h3>References</h3>
        <ul>
          <li>Lorem Ipsum</li>
          <li>Lorem Ipsum</li>
        </ul>
        <h3>Source Code</h3>
        <p>Lorem Ipsum</p>
        <h3>Presentations</h3>
        <p>Lorem Ipsum</p>
      </div>
    </div>
  );
}

export default About;
