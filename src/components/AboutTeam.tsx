import TeamMemberContainer from "./TeamMemberContainer";

export interface ITeamMember {
  name: string;
  role: string;
  contact: string;
  image: string;
}

const teamData: ITeamMember[] = [
  {
    name: "Bora Berke Sahin",
    role: "Data Handling Lead",
    contact: "bbsahin@kth.se",
    image: `${import.meta.env.BASE_URL}bora.jpg`,
  },
  {
    name: "Diagnosa Fenomena",
    role: "Backend Development Lead, Frontend Development, User Evaluation",
    contact: "diagnosa@kth.se",
    image: `${import.meta.env.BASE_URL}sasa.jpg`,
  },
  {
    name: "Fauzan H. Sudaryanto",
    role: "User Evaluation Lead, Data Handling, Visualization Design",
    contact: "fhsu@kth.se",
    image: `${import.meta.env.BASE_URL}fauzan.jpg`,
  },
  {
    name: "Gianluca Beltran",
    role: "Frontend Development Lead, Backend Development, Data Handling",
    contact: "gbeltran@kth.se",
    image: `${import.meta.env.BASE_URL}luca.png`,
  },
  {
    name: "Tong Yu",
    role: "Visualization Design Lead, Frontend Development, User Evaluation",
    contact: "toyu@kth.se",
    image: `${import.meta.env.BASE_URL}tong.jpg`,
  },
];

function AboutTeam() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {teamData.map((teamMember) => (
        <TeamMemberContainer teamMember={teamMember} key={teamMember.name} />
      ))}
    </div>
  );
}

export default AboutTeam;
