import mockStationData from '../assets/dataset/stations';
import { Station, CollectionItem } from '../dataModel/station';
import { GreenhouseGas, InstrumentType, greenhouseGases, measurementInstruments, timePeriodMapping } from '../constants';

export function getMockStationData(): Record<string, any> {
  return mockStationData;
}


export function getChartColor(collectionItem: CollectionItem): string {
  const colors = [
    'rgba(68, 1, 84, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(0, 128, 0, 1)',
    'rgba(0, 20, 252, 1)',
    'rgba(255, 165, 0, 1)',
    'rgba(0, 255, 255, 1)',
    'rgba(255, 192, 203, 1)',
    'rgba(128, 0, 128, 1)',
    'rgba(34, 139, 34, 1)',
    'rgba(0, 0, 128, 1)',
    'rgba(128, 128, 0, 1)',
    'rgba(255, 69, 0, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(0, 100, 0, 1)',
    'rgba(139, 0, 0, 1)',
  ];
  
  const colorMapping: Record<string, string> = {};
  const gases = ['co2', 'ch4'];
  const timePeriods = ['daily', 'hourly', 'weekly', 'monthly', 'yearly', 'event'];
  const instruments = ['insitu', 'pfp', 'flask'];
  
  let index = 0;
  for (const gas of gases) {
    for (const timePeriod of timePeriods) {
      for (const instrument of instruments) {
        const key = `${gas}-${timePeriod}-${instrument}`;
        colorMapping[key] = colors[index % colors.length];
        index++;
      }
    }
  }

  const uniqueKey = `${collectionItem.gas}-${collectionItem.time_period}-${collectionItem.measurement_inst}`;
  return colorMapping[uniqueKey] || 'rgba(0, 0, 0, 0.1)';
}


export function getChartLegend(collectionItem: CollectionItem): string {
  const gasKey = collectionItem.gas as GreenhouseGas;
  const gasInfo = greenhouseGases[gasKey] || { short: collectionItem.gas.toUpperCase() };

  const instrumentKey = collectionItem.measurement_inst.toLowerCase() as InstrumentType;
  const instrumentInfo = measurementInstruments[instrumentKey] || { fullName: collectionItem.measurement_inst };

  const timePeriod = collectionItem.time_period && collectionItem.time_period !== 'event' 
    ? `${timePeriodMapping[collectionItem.time_period] || collectionItem.time_period} `
  : '';

  return `Observed ${gasInfo.short} Concentration (${timePeriod}${instrumentInfo.fullName})`;
}


export function getYAxisLabel(collectionItem: CollectionItem): string {
  const gasKey = collectionItem.gas as GreenhouseGas;

  if (Object.values(GreenhouseGas).includes(gasKey)) {
    const { fullName, unit, short } = greenhouseGases[gasKey];
    return `${fullName} (${short}) Concentration (${unit})`;
  }

  return `${collectionItem.gas.toUpperCase()} Concentration (ppm)`;
}

export function getDataAccessURL(station: Station): string {
  const siteName = encodeURIComponent(station.id);
  const gasKey = station.collection_items?.[0]?.gas as GreenhouseGas | undefined;
  
  let parameterName = gasKey && greenhouseGases[gasKey] 
    ? encodeURIComponent(greenhouseGases[gasKey].fullName) 
    : '';

  parameterName = parameterName.replace(/%20/g, '%2B');

  return `https://gml.noaa.gov/data/data.php?site=${siteName}&category=Greenhouse%2BGases&parameter_name=${parameterName}`;
}
