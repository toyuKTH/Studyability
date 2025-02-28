export async function fetchGeoJSON(url?: string) {
  try {
    const response = await fetch(
      url || `./data/GeoJSON/osm_search/cleaned_demo_v4.geojson`
    );
    const geoJSON = await response.json();

    return geoJSON;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return null;
  }
}
