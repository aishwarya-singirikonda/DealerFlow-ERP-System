import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function OrderDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchOrder = async () => {

    try {

      const response = await API.get(
        `/orders/${id}`,
        getHeaders()
      );

      setOrder(response.data.order);

    } catch (error) {

      console.error(error);

    }

  };

  if (!order) {

    return (
      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8">

          <h1 className="text-3xl font-bold">
            Loading...
          </h1>

        </div>

      </div>
    );

  }

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100 p-8">

        <div className="flex justify-between mb-8">

          <h1 className="text-4xl font-bold">
            Order #{order.id}
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 text-white px-6 py-3 rounded"
          >
            Back
          </button>

        </div>

        {/* Order Info */}

        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Dealer Name
            </h2>

            <p className="text-2xl font-bold mt-2">
              {order.dealer_name}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Owner Name
            </h2>

            <p className="text-2xl font-bold mt-2">
              {order.owner_name}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Phone
            </h2>

            <p className="text-2xl font-bold mt-2">
              {order.phone}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Address
            </h2>

            <p className="text-2xl font-bold mt-2">
              {order.address}
            </p>

          </div>

        </div>
        {/* Products Table */}

        <div className="bg-white rounded-xl shadow p-4 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Products
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Quantity
                </th>

                <th className="p-3 text-left">
                  Price
                </th>

                <th className="p-3 text-left">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {order.items.map((item, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="p-3">
                    {item.product_name}
                  </td>

                  <td className="p-3">
                    {item.quantity}
                  </td>

                  <td className="p-3">
                    ₹{item.price}
                  </td>

                  <td className="p-3 font-bold">
                    ₹{item.quantity * item.price}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* Summary */}

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Total Amount
            </h2>

            <p className="text-3xl text-green-600 font-bold mt-3">
              ₹{order.total_amount}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Status
            </h2>

            <p
              className={`text-3xl font-bold mt-3 ${
                order.status === "Pending"
                  ? "text-yellow-600"
                  : order.status === "Approved"
                  ? "text-green-600"
                  : order.status === "Delivered"
                  ? "text-blue-600"
                  : order.status === "Completed"
                  ? "text-purple-600"
                  : "text-red-600"
              }`}
            >
              {order.status}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Created Date
            </h2>

            <p className="text-2xl font-bold mt-3">
              {
                new Date(
                  order.created_at
                ).toLocaleDateString()
              }
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default OrderDetails;