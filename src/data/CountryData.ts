import * as d3 from "d3";
import UniversityRankings from "../models/UniversityRankings.type";

export const universityRankings = await d3.csv(
  "../../data/university_rankings.csv",
  (d): UniversityRankings => {
    return {
      "2025_rank": d["2025_rank"],
      "2024_rank": d["2024_rank"],
      university: d.university,
      alpha_2: d.alpha_2,
      academic_reputation: +d.academic_reputation,
      employer_reputation: +d.employer_reputation,
      international_students: +d.international_students,
      employment_outcomes: +d.employment_outcomes,
      sustainability: +d.sustainability,
      qs_overall_score: +d.qs_overall_score,
    };
  }
);
