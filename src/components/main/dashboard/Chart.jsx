import { Chart as ChartJs, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

ChartJs.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

export default function Chart({ data, options }) {
  return <Line data={data} options={options} />;
}

Chart.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
};