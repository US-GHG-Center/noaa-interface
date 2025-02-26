export type DateTime = string;

export interface ChartDataItem {
  date: DateTime;
  value: number;
}

export interface ChartDataset {
  type: 'line' | 'bar';
  label: string;
  data: ChartDataItem[];
  color: string;
  borderWidth: number;
  showLine: boolean;
}
