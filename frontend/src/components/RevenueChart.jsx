import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function RevenueChart({ orders }) {

  const monthlyRevenue = {};

  orders.forEach((order) => {

    const month = new Date(
      order.created_at
    ).toLocaleString(
      "default",
      {
        month: "short"
      }
    );

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }

    monthlyRevenue[month] +=
      Number(order.total_amount);

  });

  const chartData = Object.keys(
    monthlyRevenue
  ).map((month) => ({
    month,
    revenue: monthlyRevenue[month]
  }));

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">
        Monthly Revenue
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />
                    <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default RevenueChart;