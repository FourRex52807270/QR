// PointChart.tsx
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCrypto } from "../hooks/useCrypto"; // 👈 import hook

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const PointChart = () => {
  const { history } = useCrypto(); // 👈 get daily entries

  const labels = history.map(entry => entry.date);
  const values = history.map(entry => entry.value);

  const data = {
    labels,
    datasets: [
      {
        label: "TRC",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Last 30 days TRC Value in $"
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      {history.length > 0 ? <Line data={data} options={options} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default PointChart;
