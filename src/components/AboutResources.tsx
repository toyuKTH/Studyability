interface IReference {
  bib: string;
  year: number;
  author: string;
  link: string;
}

interface IPresentation {
  date: string;
  title: string;
  link: string;
}

function AboutResources() {
  const projectReferences = [
    {
      year: 2024,
      bib: "Doda, S., Hysa, A., & Liça, D. (2024). International Student Mobility: Pushing-Pulling Factors for International Students. Journal of Educational and Social Research, 14(6), 402–423.",
      author: "Doda et al.",
      link: "https://doi.org/10.36941/jesr-2024-0182",
    },
    {
      year: 2014,
      bib: "Lee, C.-F. (2014). An Investigation of Factors Determining the Study Abroad Destination Choice: A Case Study of Taiwan. Journal of Studies in International Education, 18(4), 362–381.",
      author: "Lee",
      link: "https://doi.org/10.1177/1028315313497061",
    },
    {
      year: 2010,
      bib: "Eder, J., Smith, W. W., & Pitts, R. E. (2010). Exploring Factors Influencing Student Study Abroad Destination Choice. Journal of Teaching in Travel & Tourism, 10(3), 232–250.",
      author: "Eder et al",
      link: "https://doi.org/10.1080/15313220.2010.503534",
    },
    {
      year: 2014,
      bib: "Munzner, T. (2014). Visualization Analysis and Design (1st ed.). A K Peters/CRC Press.",
      author: "Munzner",
      link: "https://doi.org/10.1201/b17511",
    },
  ] as IReference[];

  const projectPresentations = [
    {
      date: "2025/02/07",
      title: "Studyability Map (Group 10) - Proposal Slides",
      link: "https://docs.google.com/presentation/d/1pyHoztGRmOjRuezNDBLDzdZrXoCTycAMHskrsw46VP8/edit?usp=drive_link",
    },
    {
      date: "2025/02/14",
      title: "Studyability Map (Group 10) - Sketches",
      link: "https://docs.google.com/presentation/d/1S7AFlvh-CbBerOpwEZ-o4dKOmj2Ir_R_xTL-6jzpJBo/edit?usp=drive_link",
    },
    {
      date: "2025/02/28",
      title: "Studyability Map (Group 10) - First Look Demo",
      link: "https://docs.google.com/presentation/d/13lsFUkVRTH2y6fYMLByafoAZxWmbNC2NuApO2p0Dvys/edit?usp=drive_link",
    },
    {
      date: "2025/03/10",
      title: "Studyability Map (Group 10) - Final Presentation",
      link: "https://docs.google.com/presentation/d/1hcKsV1T61Hjd0igF-KSuT3TaVM1jyJ4rN_JwHXw_31Q/edit?usp=drive_link",
    },
  ] as IPresentation[];

  return (
    <>
      <h3>References</h3>
      <ol>
        {projectReferences.map(({ bib, link }) => (
          <li key={`ref-${link}`}>
            <span>{bib} </span>
            <a href={link} target="_blank">
              {link}
            </a>
          </li>
        ))}
      </ol>
      <h3>Source Code</h3>
      <p>
        <a
          href="https://gits-15.sys.kth.se/DH2321-2025-Group-10/studyability"
          target="_blank"
        >
          GitHub Repository
        </a>
      </p>
      <h3>Presentations</h3>
      <ul>
        {projectPresentations.map(({ date, link, title }) => (
          <li key={`presentation-${date}`}>
            <span>{date} - </span>
            <a href={link} target="_blank">
              {title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default AboutResources;
