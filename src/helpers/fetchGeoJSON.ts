import { GeoJSONFeature } from "mapbox-gl";
import { IStudiabilityFeatureProperties } from "../components/WorldMap";
import { ICountryDB, IUniversity } from "../state/slices/dataSlice";

export async function fetchGeoJSON(url?: string) {
  try {
    const response = await fetch(
      url || `${import.meta.env.BASE_URL}data/GeoJSON/osm_search/joined_uni_demo_v2b.geojson`
    );
    const geoJSON = await response.json();

    return geoJSON;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return null;
  }
}

export const fetchMapData = async (filteredData: IUniversity[]) => {
  try {
    const data = await fetchGeoJSON(
      `./data/GeoJSON/osm_search/joined_uni_demo_v2b.geojson`
    );

    const filteredGeoJSON = data.features.filter((feature: GeoJSONFeature) => {
      const properties = feature.properties as IStudiabilityFeatureProperties;
      return filteredData.some(
        (uni) => uni.name === properties.university_name
      );
    });

    return filteredGeoJSON;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return null;
  }
};

export const getUniGeoJSON = async (university: IUniversity) => {
  try {
    const data = await fetchGeoJSON();

    const geoJSON = data.features.find((feature: GeoJSONFeature) => {
      const properties = feature.properties as IStudiabilityFeatureProperties;
      return properties.university_name === university.name;
    });

    return geoJSON;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return null;
  }
};
