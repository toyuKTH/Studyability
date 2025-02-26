export async function fetchGeoJSON(url: string) {
  try {
    const response = await fetch(url);
    const geoJSON = await response.json();

    return geoJSON;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return null;
  }
}
