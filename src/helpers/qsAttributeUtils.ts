interface IStyle {
  label: string;
  color: string;
  fontColor: string;
}

interface IQSAttributeStyles {
  academic_reputation: IStyle;
  employment_outcomes: IStyle;
  international_students: IStyle;
  sustainability: IStyle;
  employer_reputation: IStyle;
  faculty_student: IStyle;
  citations_per_faculty: IStyle;
  international_faculty: IStyle;
  international_research_network: IStyle;
}

const qsAttributeStyles: IQSAttributeStyles = {
  academic_reputation: {
    label: "Academic Reputation",
    color: "#FDE725",
    fontColor: "black",
  },
  employment_outcomes: {
    label: "Employment Outcomes",
    color: "#D4ED99",
    fontColor: "black",
  },
  international_students: {
    label: "International Student Ratio",
    color: "#3B508A",
    fontColor: "white",
  },
  sustainability: {
    label: "Sustainability",
    color: "#2CA02C",
    fontColor: "white",
  },
  employer_reputation: {
    label: "Employer Reputation",
    color: "#D4ED99",
    fontColor: "black",
  },
  faculty_student: {
    label: "Faculty Student Ratio",
    color: "#461667",
    fontColor: "white",
  },
  citations_per_faculty: {
    label: "Citations Per Faculty",
    color: "#FDE725",
    fontColor: "black",
  },
  international_faculty: {
    label: "International Faculty Ratio",
    color: "#3B508A",
    fontColor: "white",
  },
  international_research_network: {
    label: "International Research Network",
    color: "#3B508A",
    fontColor: "white",
  },
};

export const qsAttributeKeys = [
  "academic_reputation",
  "citations_per_faculty",
  "employment_outcomes",
  "employer_reputation",
  "sustainability",
  "faculty_student",
  "international_students",
  "international_faculty",
  "international_research_network",
];

export function getQSAttributeLabel(key: string) {
  return qsAttributeStyles[key as keyof IQSAttributeStyles].label;
}

export function getQSAttributeKey(nameToSearch: string) {
  const index = Object.entries(qsAttributeStyles).find((v) => {
    return v[1].label == nameToSearch;
  });
  return index ? index[0] : "";
}

export function getQSAttributeColor(key: string) {
  return qsAttributeStyles[key as keyof IQSAttributeStyles].color;
}

export function getQSAttributeFontColor(key: string) {
  return qsAttributeStyles[key as keyof IQSAttributeStyles].fontColor;
}
