import * as d3 from "d3";

export interface IUniversityRankings {
  "2025_rank": string;
  "2024_rank": string;
  university: string;
  alpha_2: string;
  academic_reputation: number;
  employer_reputation: number;
  international_students: number;
  employment_outcomes: number;
  sustainability: number;
  qs_overall_score: number;
}

export interface ICountryCityUniversityData {
  university: string;
  country: string;
  city: string;
  alpha_2: string;
  alpha_3: string;
  region: string;
  sub_region: string;
}

const alpha_2_to_alpha_3 = {} as { [key: string]: string };

const alpha_3_to_alpha_2 = {} as { [key: string]: string };

var universityRankingsByCountry = [] as IUniversityRankings[];

export const loadData = async () => {
  universityRankingsByCountry = await d3.csv(
    "../../data/university_rankings.csv",
    (d): IUniversityRankings => {
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
  await d3.csv(
    "../../data/country_city_universities.csv",
    (d): ICountryCityUniversityData => {
      alpha_2_to_alpha_3[d.alpha_2] = d.alpha_3;
      alpha_3_to_alpha_2[d.alpha_3] = d.alpha_2;
      return {
        university: d.university,
        country: d.country,
        city: d.city,
        alpha_2: d.alpha_2,
        alpha_3: d.alpha_3,
        region: d.region,
        sub_region: d.sub_region,
      };
    }
  );
};

// export const universityRankingsByCountry = universityRankings.reduce(
//   (acc, curr) => {
//     if (!acc[curr.alpha_2]) {
//       acc[curr.alpha_2] = [];
//     }
//     acc[curr.alpha_2].push(curr);
//     return acc;
//   },
//   {} as { [key: string]: IUniversityRankings[] }
// );

export const getAlpha_2 = (alpha_3: string) => {
  const alpha_2 = alpha_3_to_alpha_2[alpha_3];
  return alpha_2 ? alpha_2 : alpha_3;
};

export const getNumberOfUniversityRankings = (alpha_3: string) => {
  const alpha_2 = getAlpha_2(alpha_3);
  return universityRankingsByCountry.filter((d) => d.alpha_2 === alpha_2)
    .length;
};
