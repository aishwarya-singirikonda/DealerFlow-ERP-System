import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Payments() {

  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);

  const [formData, setFormData] = useState({
    order_id: "",
    dealer_id: "",
    amount: "",
    payment_method: "Cash"
  });

  useEffect(() => {
    fetchPayments();
    fetchOrders();
    fetchDealers();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchPayments = async () => {
    try {

      const response = await API.get(
        "/payments",
        getHeaders()
      );

      setPayments(response.data.payments);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {

      const response = await API.get(
        "/orders",
        getHeaders()
      );

      setOrders(response.data.orders);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchDealers = async () => {
    try {

      const response = await API.get(
        "/dealers",
        getHeaders()
      );

      setDealers(response.data.dealers);

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addPayment = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/payments",
        formData,
        getHeaders()
      );

      alert("Payment Added Successfully");

      setFormData({
        order_id: "",
        dealer_id: "",
        amount: "",
        payment_method: "Cash"
      });

      fetchPayments();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to add payment"
      );
    }
  };

  const markPaid = async (id) => {

    try {

      await API.put(
        `/payments/paid/${id}`,
        {},
        getHeaders()
      );

      alert("Payment Marked Paid");

      fetchPayments();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-8">
          Payments Management
        </h1>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Total Payments</h2>

            <p className="text-4xl font-bold">
              {payments.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Pending</h2>

            <p className="text-4xl font-bold text-yellow-600">
              {
                payments.filter(
                  p => p.payment_status === "Pending"
                ).length
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Paid</h2>

            <p className="text-4xl font-bold text-green-600">
              {
                payments.filter(
                  p => p.payment_status === "Paid"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Add Payment */}

        <form
          onSubmit={addPayment}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >

          <div className="grid grid-cols-4 gap-4">

            <select
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            >
              <option value="">
                Select Order
              </option>

              {orders.map(order => (

                <option
                  key={order.id}
                  value={order.id}
                >
                  Order #{order.id}
                </option>

              ))}
            </select>

            <select
              name="dealer_id"
              value={formData.dealer_id}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            >
              <option value="">
                Select Dealer
              </option>

              {dealers.map(dealer => (

                <option
                  key={dealer.id}
                  value={dealer.id}
                >
                  {dealer.dealer_name}
                </option>

              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>

          </div>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700"
          >
            Add Payment
          </button>

        </form>
                {/* Payments Table */}

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Dealer
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Method
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {payments.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    No payments available
                  </td>

                </tr>

              ) : (

                payments.map((payment) => (

                  <tr
                    key={payment.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-3">
                      {payment.dealer_name}
                    </td>

                    <td className="p-3 font-medium">
                      ₹{payment.amount}
                    </td>

                    <td className="p-3">
                      {payment.payment_method}
                    </td>

                    <td className="p-3">

                      {payment.payment_status === "Paid" ? (

                        <span className="text-green-600 font-bold">
                          Paid
                        </span>

                      ) : (

                        <span className="text-yellow-600 font-bold">
                          Pending
                        </span>

                      )}

                    </td>

                    <td className="p-3">
                      {new Date(
                        payment.payment_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">

                      {payment.payment_status === "Pending" ? (

                        <button
                          onClick={() =>
                            markPaid(payment.id)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Mark Paid
                        </button>

                      ) : (

                        <span className="text-green-700 font-bold">
                          ✓ Paid
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default Payments;