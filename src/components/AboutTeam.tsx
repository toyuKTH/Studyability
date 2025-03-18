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
    image: "/bora.jpg",
  },
  {
    name: "Diagnosa Fenomena",
    role: "Frontend Development, User Evaluation",
    contact: "diagnosa@kth.se",
    image: "/sasa.jpg",
  },
  {
    name: "Fauzan Helmi Sudaryanto",
    role: "User Evaluation Lead, Data Handling, Design",
    contact: "fhsu@kth.se",
    image: "/fauzan.jpg",
  },
  {
    name: "Gianluca Beltran",
    role: "Frontend Development Lead, Data Handling",
    contact: "gbeltran@kth.se",
    image: "/luca.png",
  },
  {
    name: "Tong Yu",
    role: "Design Lead, Frontend Development, User Evaluation",
    contact: "toyu@kth.se",
    image: "/tong.jpg",
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
