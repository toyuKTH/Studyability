interface IStyle {
  label: string;
  color: string;
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
  },
  employment_outcomes: {
    label: "Employment Outcomes",
    color: "#D4ED99",
  },
  international_students: {
    label: "International Student Ratio",
    color: "#3B508A",
  },
  sustainability: {
    label: "Sustainability",
    color: "#2CA02C",
  },
  employer_reputation: {
    label: "Employer Reputation",
    color: "#D4ED99",
  },
  faculty_student: {
    label: "Faculty Student Ratio",
    color: "#461667",
  },
  citations_per_faculty: {
    label: "Citations Per Faculty",
    color: "#FDE725",
  },
  international_faculty: {
    label: "International Faculty Ratio",
    color: "#3B508A",
  },
  international_research_network: {
    label: "International Research Network",
    color: "#3B508A",
  },
};

export const qsAttributeKeys = [
  "academic_reputation",
  "employment_outcomes",
  "international_students",
  "sustainability",
  "employer_reputation",
  "faculty_student",
  "citations_per_faculty",
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
