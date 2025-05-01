import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { getTopSeller } from "../../services/dashboard";
import { colorChart } from "../../constants/common";
import { formatDateYYYYMMDD } from "../../utils/common";

export const TopSellerChart = ({ numberOfProduct = 3 }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const today = new Date();
  const params = {
    numberOfProduct,
    FromDate: formatDateYYYYMMDD(
      new Date(today.getFullYear(), today.getMonth(), 1)
    ),
    ToDate: formatDateYYYYMMDD(today),
  };

  useEffect(() => {
    getTopSeller(params).then((res) => {
      let labels = [];
      let dataQuantity = [];
      res.forEach((product) => {
        labels.push(product.name);
        dataQuantity.push(product.totalQuantitySold);
      });
      const data = {
        labels,
        datasets: [
          {
            label: "Sản phẩm",
            data: dataQuantity,
            backgroundColor: colorChart
              .slice(0, 4)
              .map((c) => c.backgroundColor),
            borderColor: colorChart.slice(0, 4).map((c) => c.borderColor),
            borderWidth: 1,
          },
        ],
      };
      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
      setChartData(data);
      setChartOptions(options);
    });
  }, [numberOfProduct]);

  return (
    <div className="h-full shadow-2">
      <h4 className="my-0 p-3 text-left w-full">{`Top ${numberOfProduct} bán chạy trong tháng`}</h4>
      <Chart
        className="w-full h-full"
        type="bar"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default TopSellerChart;
