import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RevenueChart from "../components/RevenueChart";
import API from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    pendingPayments: 0
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const ordersResponse = await API.get(
        "/orders",
        headers
      );

      const paymentsResponse = await API.get(
        "/payments",
        headers
      );

      const ordersData = ordersResponse.data.orders || [];

      const paymentsData =
        paymentsResponse.data.payments || [];

      setOrders(ordersData);

      setStats({

        totalOrders: ordersData.length,

        pendingOrders:
          ordersData.filter(
            order => order.status === "Pending"
          ).length,

        deliveredOrders:
          ordersData.filter(
            order => order.status === "Delivered"
          ).length,

        pendingPayments:
          paymentsData.filter(
            payment =>
              payment.payment_status === "Pending"
          ).length

      });

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8">

          Loading Dashboard...

        </div>

      </div>

    );

  }

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Total Orders
            </h2>

            <p className="text-4xl font-bold mt-3">
              {stats.totalOrders}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Pending Orders
            </h2>

            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {stats.pendingOrders}
            </p>

          </div>
                    <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Delivered Orders
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.deliveredOrders}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Pending Payments
            </h2>

            <p className="text-4xl font-bold text-red-600 mt-3">
              {stats.pendingPayments}
            </p>

          </div>

        </div>

        {/* Revenue Chart */}

        <RevenueChart
          orders={orders}
        />

      </div>

    </div>

  );

}

export default Dashboard;