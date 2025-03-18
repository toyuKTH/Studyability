import { NavLink } from "react-router";

function AboutOverview() {
  return (
    <>
      <p>
        Studyability Map assists prospective students in finding the ideal
        university and location for their next study destination. The
        visualization will help those who are considering attending a university
        and are in search of their dream institution and place to live.
      </p>
      <p>
        There are many considerations for a student to choose their study
        destination. <NavLink to={"/about#resources"}>Lee (2014)</NavLink> found
        that students prefer a comfortable climate and value the “reputation of
        education quality,” which includes how well the education is recognized
        by employers.{" "}
        <NavLink to={"/about#resources"}>Doda et al. (2024)</NavLink> pointed
        out that lower living costs and tuition fees can attract students, while{" "}
        <NavLink to={"/about#resources"}>Eder et al. (2010)</NavLink> observed
        that language is an important factor, with many students leaning towards
        English-speaking countries.
      </p>
      <p>
        Recognizing the difficulty in gathering and comparing information
        through internet searches, Studyability Map streamlines the process,
        making it easier for students to make informed decisions about their
        future. It can also be used by researchers, professors, and admission
        officers to gather and analyze important information about different
        universities.
      </p>
      <p>
        Studyability Map is an output of a 8 weeks group project of{" "}
        <a
          href="https://www.kth.se/student/kurser/kurs/DH2321?l=en"
          target="_blank"
        >
          DH2321 Information Visualization
        </a>{" "}
        course at KTH Royal Institute of Technology.
      </p>
    </>
  );
}

export default AboutOverview;
