import { 
  Station,
  StationMeta,
  CollectionItem,
} from '../../../dataModel';

export interface StationMap {
  [key: string]: Station;
}

// Transform station features into Station objects
export function dataTransformationStation(stationData: any[]): Record<string, Station> {
  const stationMap: Record<string, Station> = {};

  if (!Array.isArray(stationData)) {
    console.error("Invalid API response format: Expected an array");
    return stationMap;
  }

  stationData.forEach((station: any) => {
    const siteCode = station.properties.site_code;

    if (!siteCode) {
      console.warn("Missing site_code in feature:", station);
      return;
    }

    if (!(siteCode in stationMap)) {
      stationMap[siteCode] = {
        id: siteCode,
        geometry: {
          type: station.geometry.type,
          coordinates: [[station.geometry.coordinates]],
        },
        meta: {
          ogc_fid: station.properties.ogc_fid,
          site_code: siteCode,
          site_country: station.properties.site_country,
          site_elevation: station.properties.site_elevation || "",
          site_elevation_unit: station.properties.site_elevation_unit || "",
          site_name: station.properties.site_name,
        },
        collection_items: [], // Will be filled later
      };
    }
  });

  return stationMap;
}

// Transform collections into CollectionItem objects and attach to respective stations
export function dataTransformCollection(collectionsData: any[], stations: Record<string, Station>, agency_filter: String): void {
  if (!Array.isArray(collectionsData)) {
    console.error("Invalid API response format: Expected an array");
    return;
  }

  collectionsData.forEach((collection: any) => {
    if (!collection.id) {
      console.warn("Missing id in collection:", collection);
      return;
    }

    const parts = collection.id.split('.')[1].split('_');
    if (parts.length === 9) {
      const [
        prefix,
        agency,
        product,
        measurement_inst,
        methodology,
        sitecode,
        country,
        gas,
        time_period
      ] = parts;

      const siteCodeUpper = sitecode.toUpperCase();
      const station = stations[siteCodeUpper];

      if (station && agency === agency_filter) {
        const collectionItem: CollectionItem = {
          id: collection.id,
          gas: gas,
          gas_full_name: gas,
          product: product,
          measurement_inst: measurement_inst,
          methodology: methodology,
          time_period: time_period,
          link: collection.links?.[1]
        };

        station.collection_items?.push(collectionItem);
      }
    }
  });
}
