import mockStationData from '../assets/dataset/stations';

export function getMockStationData(): Record<string, any> {
  return mockStationData;
}

export function getLegendFromCollectionItem() {
  
}

export function getChartColorFromIndex(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("Index must be a non-negative integer");
  }

  const colors = [
    'rgba(68, 1, 84, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(0, 128, 0, 1)',
    'rgba(0, 20, 252, 1)'
  ];

  return colors[index % colors.length];
}