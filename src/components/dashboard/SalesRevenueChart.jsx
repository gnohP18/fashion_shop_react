import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { colorChart, displayChartMode } from "../../constants/common";
import { getSalesRevenue } from "../../services/dashboard";

const SalesRevenueChart = ({ mode = 0 }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const labels = [];
    const data1 = [];
    const data2 = [];

    getSalesRevenue({ mode }).then((res) => {
      res.forEach((element) => {
        labels.push(element.label);
        data1.push(element.totalAmount);
        data2.push(element.totalItem);
      });

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Doanh thu bán được",
            data: data1,
            fill: false,
            borderColor: colorChart[2].borderColor,
            tension: 0.4,
          },
          {
            label: "Sản phẩm bán được",
            data: data2,
            fill: false,
            borderColor: colorChart[1].borderColor,
            tension: 0.4,
          },
        ],
      };
      const options = {
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: colorChart[2].borderColor,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    });
  }, [mode]);

  return (
    <div className="w-full h-full flex-column shadow-2 align-items-center flex card">
      <h4 className="my-0 p-3 text-left w-full">{`Sản phẩm bán chạy trong ${displayChartMode[mode].name}`}</h4>
      <Chart
        className="w-full h-full"
        type="line"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default SalesRevenueChart;
