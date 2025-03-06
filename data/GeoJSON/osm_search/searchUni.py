import pandas as pd
import requests
import json
import time
import random
from urllib.parse import quote

HEADERS = {
    'User-Agent': 'UniversityGeoDataCollector/1.0 (contact@example.com)',
    'Referer': 'https://example.com'
}

def create_nominatim_url(name):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': name,
        'format': 'geojson',
        'addressdetails': 1
    }
    return f"{base_url}?{requests.compat.urlencode(params)}"

# Read input CSV
df = pd.read_csv("uni_iteration_6.csv")

successful_geojson = {"type": "FeatureCollection", "features": []}
wrong_type_geojson = {"type": "FeatureCollection", "features": []}
failed_universities = []

for index, row in df.iterrows():
    entry = {
        "university_id": row['university_id'],
        "university_name": row['university_name'],
        "query": row['query']
    }
    
    try:
        # Create proper Nominatim URL
        search_query = f"{row['query']}"
        url = create_nominatim_url(search_query)

        response = requests.get(url, headers=HEADERS)
        print(f"{response}")
        time.sleep(random.uniform(1.1, 1.5))  # Respect rate limit
        
        if response.status_code == 200:
            geojson_data = response.json()
            features = geojson_data.get('features', [])
            print(f"Length: {len(features)}")
            if len(features) > 0:
                university_feature = None
                for feature in features:
                    feature_type = feature['properties'].get('type')
                    print(f"Found feature of type: {feature_type}")
                    
                    if feature_type == 'university':
                        university_feature = feature
                        break

                    if feature_type == 'college':
                        university_feature = feature
                        break

                    if feature_type == 'school':
                        university_feature = feature
                        break

                    if feature_type == 'educational_institution':
                        university_feature = feature
                        break

                    if feature_type == 'education':
                        university_feature = feature
                        break

                # If no university type is found, use the first feature
                if university_feature is None:
                    university_feature = features[0]
                
                # Modify the feature properties
                university_feature['properties'].update({
                    "university_id": entry['university_id'],
                    "university_name": entry['university_name']
                })

                accepted_types = ['university', 'college','school','educational_institution','education']
                
                if university_feature['properties'].get('type') in accepted_types:
                    successful_geojson['features'].append(university_feature)
                    print(f"SUCCESS - {university_feature['properties'].get('name')} - '{university_feature['properties'].get('type')}'")
                else:
                    wrong_type_geojson['features'].append(university_feature)
                    print(f"WRONG - {university_feature['properties'].get('name')} - '{university_feature['properties'].get('type')}'")
            else:
                failed_universities.append({**entry, "error": "No features found"})
                print(f"FAILED - {entry['university_name']}")
        else:
            failed_universities.append({**entry, "error": f"HTTP {response.status_code}", "response": response.text})

    except Exception as e:
        failed_universities.append({**entry, "error": str(e)})
        time.sleep(1)  # Maintain rate limit even on failure

    # Progress indicator
    print(f"Processed {index+1}/{len(df)}: {row['university_name']}\n")

# Save results
with open("successful_geojson_v3.geojson", "w") as f:
    json.dump(successful_geojson, f, indent=4)

with open("wrong_type_v3.geojson", "w") as f:
    json.dump(wrong_type_geojson, f, indent=4)

with open("failed_universities_v3.json", "w") as f:
    json.dump(failed_universities, f, indent=4)

print(f"\nResults:")
print(f"Success: {len(successful_geojson['features'])}")
print(f"Wrong type: {len(wrong_type_geojson['features'])}")
print(f"Failed: {len(failed_universities)}")