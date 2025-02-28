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
        'addressdetails': 1,
        'limit': 1,
        'polygon_geojson': 1
    }
    return f"{base_url}?{requests.compat.urlencode(params)}"

# Read input CSV
df = pd.read_csv("uni_iteration_2.csv")

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
            if len(geojson_data.get('features', [])) > 0:
                feature = geojson_data['features'][0]
                feature_type = feature['properties'].get('type')
                print(f"Found feature of type: {feature_type}")
                
                # Modify the feature properties
                feature['properties'].update({
                    "university_id": entry['university_id'],
                    "university_name": entry['university_name']
                })
                
                if feature_type == 'university':
                    successful_geojson['features'].append(feature)
                else:
                    wrong_type_geojson['features'].append(feature)
            else:
                failed_universities.append({**entry, "error": "No features found "})
                print(f"No features found for {entry['university_name']}")
        else:
            failed_universities.append({**entry, "error": f"HTTP {response.status_code}", "response": response.text})

    except Exception as e:
        failed_universities.append({**entry, "error": str(e)})
        time.sleep(1)  # Maintain rate limit even on failure

    # Progress indicator
    print(f"Processed {index+1}/{len(df)}: {row['university_name']}")

# Save results
with open("successful_geojson_2.geojson", "w") as f:
    json.dump(successful_geojson, f, indent=4)

with open("wrong_type_2.geojson", "w") as f:
    json.dump(wrong_type_geojson, f, indent=4)

with open("failed_universities_2.json", "w") as f:
    json.dump(failed_universities, f, indent=4)

print(f"\nResults:")
print(f"Success: {len(successful_geojson['features'])}")
print(f"Wrong type: {len(wrong_type_geojson['features'])}")
print(f"Failed: {len(failed_universities)}")