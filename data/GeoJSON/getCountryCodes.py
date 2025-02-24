import pandas as pd

# Parse the json file and get the cities that have universities
# and return a string that can be used in Overpass Turbo to get the universities in those cities

df = pd.read_csv('./data/university_rankings.csv')
countryCodes = df['alpha_2'].unique().tolist()

print("Number of countries in the university_db: ", len(countryCodes), "\n")

print("How many countries do you want to query at once?")

numberItemsPerQuery = int(input())

for i in range(0, len(countryCodes), numberItemsPerQuery):
    #  make all elements of the list look like this: {{geocodeArea:countryCode}}
    currentCountryCodes = countryCodes[i:i+numberItemsPerQuery]
    currentCountryCodes = ["{" + f'{{geocodeArea:{countryCode}}}' + "};" for countryCode in currentCountryCodes]

    currentCountryCodes = "\n".join(currentCountryCodes)

    print(currentCountryCodes)
    print("\n")

