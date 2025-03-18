# Studyability Map

<img width="600" alt="image" src="https://gits-15.sys.kth.se/storage/user/27025/files/cc8c7c94-5f62-4a0f-972d-e4506dcbefd5">

**Studyability Map** assists prospective students in finding the ideal university and study destination. It also serves as a tool for researchers, professors, and admission officers who need to compare and analyze university data effectively.

## Project Overview

- **Purpose:** Helps prospective students compare universities based on factors like temperature, cost of living, tuition fee, education quality, and English proficiency.
- **Key Features:**
  - **Explore** the possibilities by adjusting your preferences
  - **Select** up to 5 universities that matches your interest
  - **Compare** in details to help your decision making
- This project is an output of a 8 weeks group project of [DH2321 Information Visualization](https://www.kth.se/student/kurser/kurs/DH2321?l=en) course at KTH Royal Institute of Technology.

## Running the App Locally

To run Studyability Map:

After cloning the repository run both of the following commands from the root directory of the project
```bash
npm install
npm run dev
```

## Data Sources & Insights

The project integrates multiple data sources to power its visualizations:

- 🌡️ **Temperature** from World Bank Climate Knowledge
- 💸 **Cost of Living Index** from Numbeo
- 🗣️ **English Proficiency Index 2024** from Education First (EF)
- 🏫 **University Rankings & Tuition Fees** from Quacquarelli Symonds (QS)
- 📍 **Geolocation & Website Information** OpenStreetMap

*AI disclosure: OpenAI o3-mini is used to generate temperature, English proficiency, and tuition fee for countries/universities with null data*

## More Information

Learn more about overall project, the team, data sources, and other resources here: [Studyability Map - About](https://gits-15.sys.kth.se/pages/DH2321-2025-Group-10/studyability/about)
