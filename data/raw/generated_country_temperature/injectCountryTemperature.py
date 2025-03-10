import csv
import json

def inject_temperature_from_csv_to_json(csv_file, json_file, output_file):
    # Load the JSON data
    with open(json_file, 'r') as json_file:
        data = json.load(json_file)

    # Read the CSV file
    with open(csv_file, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            country_code = row['country_code']
            temperature = float(row['temperature'])
            
            # Check if the country_code exists in the JSON under "country_db"
            if country_code in data.get('country_db', {}):
                country_data = data['country_db'][country_code]
                
                # Update temperature if it is null
                if country_data.get('temperature') is None:
                    country_data['temperature'] = temperature

    # Write the updated JSON back to a file
    with open(output_file, 'w') as output_file:
        json.dump(data, output_file, indent=4)

    print(f"Done: {output_file}")

# File paths
csv_file = 'generated_country_temperature.csv'   # new countries
json_file = '../../merged/json_db.json'             # origisn JSON
output_file = 'modified_json_db.json'            # write output

# Run the function
inject_temperature_from_csv_to_json(csv_file, json_file, output_file)