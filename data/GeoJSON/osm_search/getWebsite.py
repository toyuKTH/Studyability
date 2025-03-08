import json
import requests
import time
import random
from urllib.parse import urlencode

HEADERS = {
    'User-Agent': 'UniversityWebsiteCollector/1.0 (contact@example.com)',
    'Referer': 'https://example.com'
}

def create_nominatim_url(osm_type, osm_id):
    base_url = "https://nominatim.openstreetmap.org/details"
    params = {
        'osmtype': osm_type,
        'osmid': osm_id,
        'format': 'json'
    }
    return f"{base_url}?{urlencode(params)}"

# Read input GeoJSON
with open('joined_uni_demo_v2.geojson', 'r') as f:
    geojson_data = json.load(f)

# Initialize counters
success_count = 0
fail_count = 0

# Process each feature
for index, feature in enumerate(geojson_data['features']):
    properties = feature['properties']
    osm_type = properties['osm_type'][0].upper()  # Uppercase the first letter
    osm_id = properties['osm_id']
    university_name = properties['university_name']  # Store university_name

    try:
        # Create Nominatim API URL
        url = create_nominatim_url(osm_type, osm_id)
        response = requests.get(url, headers=HEADERS)
        print(f"Response status: {response.status_code}")
        time.sleep(random.uniform(1.1, 1.5))  # Respect rate limit
        
        if response.status_code == 200:
            data = response.json()
            website = data.get('extratags', {}).get('website', '')
            # Add university_website to properties
            properties['university_website'] = website
            if website:
                print(f"SUCCESS - {university_name} - Website: {website}")
                success_count += 1
            else:
                print(f"FAILED - {university_name} - No website found")
                fail_count += 1
        else:
            print(f"FAILED - {university_name} - HTTP {response.status_code}")
            # If failed, add an empty website field
            properties['university_website'] = ""
            fail_count += 1

    except Exception as e:
        print(f"FAILED - {university_name} - Exception: {str(e)}")
        # If exception occurs, add an empty website field
        properties['university_website'] = ""
        fail_count += 1

    print(f"Processed {index+1}/{len(geojson_data['features'])}\n")

# Save updated GeoJSON to file
output_file = "output_universities.geojson"
with open(output_file, 'w') as f:
    json.dump(geojson_data, f, indent=4)

# Print recap
print(f"\nResults:")
print(f"Success: {success_count}")
print(f"Failed: {fail_count}")

print(f"\nResults saved to '{output_file}'")