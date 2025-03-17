import { useLocation } from "react-router";
import { useEffect, useRef } from "react";
import AboutChangelog from "../components/AboutChangelog";
import AboutOverview from "../components/AboutOverview";
import AboutHow from "../components/AboutHow";
import AboutTeam from "../components/AboutTeam";
import AboutData from "../components/AboutData";
import AboutResources from "../components/AboutResources";
import "./About.css";

function About() {
  const { hash } = useLocation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const sectionCollection = [
    {
      hash: "overview",
      ref: useRef<HTMLDivElement>(null),
      title: "Project Overview",
      element: <AboutOverview />,
    },
    {
      hash: "how",
      ref: useRef<HTMLDivElement>(null),
      title: "How To Use",
      element: <AboutHow />,
    },
    {
      hash: "team",
      ref: useRef<HTMLDivElement>(null),
      title: "Team",
      element: <AboutTeam />,
    },
    {
      hash: "data",
      ref: useRef<HTMLDivElement>(null),
      title: "Data",
      element: <AboutData />,
    },
    {
      hash: "changelog",
      ref: useRef<HTMLDivElement>(null),
      title: "Changelog",
      element: <AboutChangelog />,
    },
    {
      hash: "resources",
      ref: useRef<HTMLDivElement>(null),
      title: "Project Resources",
      element: <AboutResources />,
    },
  ];

  function scrollToHash(hash: string) {
    const matchSection = sectionCollection.find((s) => s.hash === hash);
    if (matchSection?.ref.current) {
      matchSection.ref.current.scrollIntoView();
    }
  }

  useEffect(() => {
    if (bodyRef.current && hash) {
      scrollToHash(hash);
    }
  }, [hash]);

  function handleClick(hash: string) {
    return () => {
      history.pushState({}, "", `#${hash}`);
      scrollToHash(hash);
    };
  }

  return (
    <div className="about-container">
      <div className="about-sidebar">
        {sectionCollection.map(({ hash, title }) => (
          <button
            key={`link-${hash}`}
            className="about-link"
            onClick={handleClick(hash)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="about-body" ref={bodyRef}>
        {sectionCollection.map(({ hash, title, ref: sectionRef, element }) => (
          <div
            className="about-section"
            id={hash}
            ref={sectionRef}
            key={`body-${hash}`}
          >
            <h2 className="about-section-title">{title}</h2>
            {element}
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
