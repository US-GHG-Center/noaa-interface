import { ChartProvider } from '../../context/chartContext';
import './index.css';

const MainChart = ({ children }) => {
  return (
    <ChartProvider>
      {/* Other components that need access to the chart */}
      {children}
    </ChartProvider>
  );
};

export default MainChart;
