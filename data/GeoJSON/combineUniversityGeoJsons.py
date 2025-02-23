import os
import json
import pandas as pd
from fuzzywuzzy import fuzz

# Parse all the json files and combine them into one
# but only keep the universities that match the ones in the university_db

pathRawData = './data/GeoJSON/UniGeoJsonDataMultiPolygon'
outputPath = './data/UniCleanedGeojson/cleaned_universities_points.geojson'
rawFiles = sorted(os.listdir(pathRawData))

# shape of the final json
finalJson = {
    "type": "FeatureCollection",
    "generator": "overpass-turbo",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
    "timestamp": "2025-02-22T20:40:02Z",
    "features": []
}

df = pd.read_csv('./data/merged/university_level.csv')

universityNames = df['university'].unique().tolist()

print("Number of universities in the university_db: ", len(universityNames), "\n")

print("Fuzzy name matching ratio threshold: ") 
fuzzyThreshold = int(input())

def checkIfUniNamesMatch(feature):
    for name in featureNameColumns:
        if name in feature['properties'] and feature['properties'][name] in universityNames:
            return True
        
        if name in feature['properties']:
            for uni in universityNames:
                uniFromFeature = feature['properties'][name]
                if fuzz.ratio(uni, uniFromFeature) >= fuzzyThreshold:
                    return True
    return False

def getUniversityName(feature):
    for name in featureNameColumns:
        if name in feature['properties'] and feature['properties'][name] in universityNames:
            # return uni name from the universityNames list
            return universityNames[universityNames.index(feature['properties'][name])]
        
        if name in feature['properties']:
            for uni in universityNames:
                uniFromFeature = feature['properties'][name]
                if fuzz.ratio(uni, uniFromFeature) >= fuzzyThreshold:
                    return universityNames[universityNames.index(uni)]
    return None

for file in rawFiles:
    print("Processing file: ", file)
    geoJsonDf = pd.read_json(f'{pathRawData}/{file}')

    featureDf = pd.json_normalize(geoJsonDf['features'])

    featureNameColumns = [col.split(".")[1] for col in featureDf.columns if 'name' in col]

    filteredDf = geoJsonDf[geoJsonDf['features'].map(lambda d: checkIfUniNamesMatch(d))]

    print("Number of universities found: ", len(filteredDf))

    filteredFeaturesList = filteredDf['features'].tolist()

    for i in range(len(filteredFeaturesList)):
        currentFeature = filteredFeaturesList[i]
        if checkIfUniNamesMatch(currentFeature):
            uniName = getUniversityName(currentFeature)
            countryCode = df[df['university'] == uniName]['country_code'].unique().tolist()
            uniRank = df[df['university'] == uniName]['2025_rank'].unique().tolist()
            uniRank = uniRank[0].split('-')[0] if len(uniRank) > 0 else None

            filteredFeaturesList[i]['properties']['st_university'] = uniName
            filteredFeaturesList[i]['properties']['st_country_code'] = countryCode[0]
            filteredFeaturesList[i]['properties']['st_rank'] = uniRank

    finalJson['features'] += filteredFeaturesList


# ask user if they want to write the final json to a file
print("Do you want to write the final json to a file? (y/n)")
userInput = input()

if userInput != 'y':
    print("Exiting without writing to file,", len(finalJson['features']), " universities")
    exit()

with open(outputPath, 'w') as f:
    json.dump(finalJson, f)

print("Wrote the final json to: ", outputPath, " with ", len(finalJson['features']), " universities")

