import { useEffect } from 'react';
import { useChart } from '../../context/chartContext';

export const LineChart = ({ 
  data, 
  labels, 
  legend, 
  labelX, 
  labelY, 
  color="#ff6384", 
  index=0, 
  separateY=false, 
  separateX=false,
  showLine=false,
 }) => {
  // data should be an array of vector points
  // labels should be an array of the vector labels
  const { chart } = useChart();

  useEffect(() => {
    if (!chart || !data || !labels) return;

    // first reset the zoom
    chart.resetZoom();
    chart.options.plugins.tooltip.enabled = true;

    const newDataset = {
      label: legend,
      data: data,
      backgroundColor: color.replace(/[\d.]+\)$/g, '0.2)'),
      borderColor: color,
      showLine: showLine,
      xAxisID: separateX ? `x-${index}` : 'x',
      yAxisID: separateX ? `y-${index}` : 'y',
    };

    // Ensure datasets array exists
    if (!chart.data.datasets) {
      chart.data.datasets = [];
    }

    // Add dataset at the specified index
    chart.data.datasets[index] = newDataset;

    // Update the labels
    chart.data.labels = labels;

    // update the axis labels
    chart.options.scales.y.display = separateY?false:true;
    chart.options.scales.x.display = true;

    // Ensure scales object exists
    if (!chart.options.scales) {
      chart.options.scales = {};
    }

    // Centralized x-axis scale configuration
    const xAxisConfig = {
      type: 'time',
      labels: labels,
      display: true, // Apply separate X-axis if true
      grid: {
        display: false,
        drawOnChartArea: false,
      },
      ticks: {
        callback: function (value) {
          const startTime = chart.scales[separateX ? `x-${index}` : 'x'].min;
          const endTime = chart.scales[separateX ? `x-${index}` : 'x'].max;

          const timeSpan = endTime - startTime;

          // If the time span is large (zoomed out), show only the year
          if (timeSpan > 365 * 24 * 60 * 60 * 1000) {
            return new Date(value).getFullYear(); // Year only
          }
          // If the time span is smaller (zoomed in), show year and month
          return new Date(value).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
        },
        autoskip: true,
        maxTicksLimit: 15,
      },
      title: {
        text: labelX,
        display: !!labelX,
      },
    };

    // Assign the x-axis configuration based on the separateX flag
    chart.options.scales[separateX ? `x-${index}` : 'x'] = xAxisConfig;

    const yAxisConfig = {
      display: true,
      grid: {
        display: true,
        drawOnChartArea: true,
      },
      title: {
        text: labelY,
        display: !!labelY,
      }
    };

    // Assign the x-axis configuration based on the separateX flag
    chart.options.scales[separateX ? `y-${index}` : 'y'] = yAxisConfig;


    // update the chart
    chart.update();

  }, [chart, data, labels, legend, labelX, labelY, color, index]);

  return null;
};
