import { ITeamMember } from "./AboutTeam";

import "./TeamMemberContainer.css";

export default function TeamMemberContainer({
  teamMember,
}: {
  teamMember: ITeamMember;
}) {
  return (
    <div className="container">
      <div className="image-container">
        <img src={teamMember.image} alt={teamMember.name} />
      </div>
      <div className="info-container">
        <h3
          style={{
            fontSize:
              teamMember.name === "Fauzan H. Sudaryanto" ? "19px" : "20px",
          }}
        >
          {teamMember.name}
        </h3>
        <div>
          {teamMember.role.split(",").map((role) => (
            <p key={role}>{role}</p>
          ))}
        </div>
        <a
          href={`mailto:${teamMember.contact}`}
          target="_blank"
          rel="noreferrer"
        >
          {teamMember.contact}
        </a>
      </div>
    </div>
  );
}
