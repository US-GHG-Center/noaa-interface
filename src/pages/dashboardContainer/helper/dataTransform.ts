import { 
  DatasetDetails, 
  Station,
  Collection,
  ChartDataItem,
  ChartDataset,
  FeatureItem,

} from '../../../dataModel';


export interface StationMap {
  [key: string]: Station;
}

export function dataTransformCollection(collectionsData: any[]): Record<string, Collection> {
  const collectionMap: Record<string, Collection> = {};

  if (!Array.isArray(collectionsData)) {
    console.error("Invalid API response format: Expected an array");
    return collectionMap;
  }

  collectionsData.forEach((collection: any) => {
    if (!collection.id || !collection.title) {
      console.warn("Missing id or title in collection:", collection);
      return;
    }

    const parts = collection.id.split('.')[1].split('_');
    if (parts.length === 8) {
      const [
        agency,
        product,
        measurement_inst,
        methodology,
        sitecode,
        country,
        gas,
        time_period
      ] = parts;

      if (agency === 'noaa') {
        collectionMap[collection.id] = {
          id: collection.id,
          title: collection.title,
          agency: agency,
          product: product,
          measurement_inst: measurement_inst,
          methodology: methodology,
          sitecode: sitecode,
          country: country,
          gas: gas,
          time_period: time_period,
          links: collection.links?.map((link: any) => ({
            href: link.href,
            rel: link.rel,
            type: link.type,
          })) || [],
        };
      }
    };
  });

  return collectionMap;
}

export function dataTransformationStation(featuresData: any[]): Record<string, Station> {
  const stationMap: Record<string, Station> = {};

  if (!Array.isArray(featuresData)) {
    console.error("Invalid API response format: Expected an array");
    return stationMap;
  }

  featuresData.forEach((feature: any) => {
    const siteCode = feature.properties.site_code;

    if (!siteCode) {
      console.warn("Missing site_code in feature:", feature);
      return;
    }

    if (!(siteCode in stationMap)) {
      stationMap[siteCode] = {
        geometry: {
          type: feature.geometry.type,
          coordinates: feature.geometry.coordinates,
        },
        properties: {
          ogc_fid: feature.properties.ogc_fid,
          site_code: feature.properties.site_code,
          site_country: feature.properties.site_country,
          site_elevation: feature.properties.site_elevation || "",
          site_elevation_unit: feature.properties.site_elevation_unit || "",
          site_name: feature.properties.site_name,
        },
      };
    }
  });

  return stationMap;
}

export function dataTransformationFeatureItems(featuresData: any[]): Record<string, FeatureItem> {
  const featureMap: Record<string, FeatureItem> = {};

  if (!Array.isArray(featuresData)) {
    console.error("Invalid API response format: Expected an array");
    return featureMap;
  }

  featuresData.forEach((feature: any) => {
    const featureId = feature.id.toString();

    if (!(featureId in featureMap)) {
      const featureItem: FeatureItem = {
        id: featureId,
        type: feature.type,
        geometry: {
          type: feature.geometry.type,
          coordinates: feature.geometry.coordinates,
        },
        properties: {
          datetime: feature.properties.datetime,
          ogc_fid: feature.properties.ogc_fid,
          site_country: feature.properties.site_country,
          site_elevation: feature.properties.site_elevation || "",
          site_elevation_unit: feature.properties.site_elevation_unit || "",
          site_name: feature.properties.site_name,
          value: feature.properties.value || "",
        },
        links: feature.links?.map((link: any) => ({
          title: link.title,
          href: link.href,
          rel: link.rel,
          type: link.type,
        })) || [],
      };

      featureMap[featureId] = featureItem;
    }
  });

  return featureMap;
}


// Function to map the Collection data to Station datasets
export function mapDatasetsToStations(collections: { [key: string]: Collection }, stations: { [key: string]: Station }): void {
  for (const collectionKey in collections) {
    const collection = collections[collectionKey];
    
    // Find corresponding station by sitecode
    const station = stations[collection.sitecode.toUpperCase()];
    if (station) {
      // Check if the URL already exists in the station's datasets
      const existingDataset = station.datasets?.find(dataset => dataset.url === collection.links[1].href);
      
      if (!existingDataset) {
        const dataset: DatasetDetails = {
          gas: collection.gas,
          gas_full_name: collection.gas,
          product: collection.product,
          measurement_inst: collection.measurement_inst,
          methodology: collection.methodology,
          time_period: collection.time_period,
          url: collection.links[1].href,
        };
        
        // Ensure datasets array exists and then push the new dataset
        station.datasets = station.datasets || [];
        station.datasets.push(dataset);
      }
    }
  }
}

export async function getStationChartDataset(
  url: string,
  label: string,
  color: string,
  type: "line" | "bar" = "line"
): Promise<ChartDataset> {
  try {
    const response = await fetch(url);
    const data: ChartDataItem[] = await response.json();

    return {
      type,
      label,
      data,
      color,
      borderWidth: 2,
      showLine: true,
    };
  } catch (error) {
    console.error("Error fetching station data:", error);
    return {
      type,
      label,
      data: [],
      color,
      borderWidth: 1,
      showLine: false,
    };
  }
}
