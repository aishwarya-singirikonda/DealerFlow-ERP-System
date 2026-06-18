import { useEffect, useState } from "react";
import DealerSidebar from "../components/DealerSidebar";
import API from "../services/api";

function DealerPayments() {

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchPayments();
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

      setPayments(
        response.data.payments || []
      );

    } catch (error) {

      console.error(error);

    }

  };

  const filteredPayments = payments.filter(
    payment => {

      const matchesSearch =
        payment.payment_method
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        String(payment.id)
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        payment.payment_status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    }
  );

  const totalPayments =
    payments.length;

  const pendingPayments =
    payments.filter(
      p => p.payment_status === "Pending"
    ).length;

  const paidPayments =
    payments.filter(
      p => p.payment_status === "Paid"
    ).length;

  return (

    <div className="flex">

      <DealerSidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-8">
          Payment History
        </h1>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Total Payments
            </h2>

            <p className="text-4xl font-bold mt-3">
              {totalPayments}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Pending Payments
            </h2>

            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {pendingPayments}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500">
              Paid Payments
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {paidPayments}
            </p>

          </div>

        </div>

        {/* Search & Filter */}

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Search payment..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded w-80"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border p-3 rounded"
          >

            <option>
              All
            </option>

            <option>
              Pending
            </option>

            <option>
              Paid
            </option>

          </select>

        </div>
        {/* Payments Table */}

        <div className="bg-white rounded-xl shadow p-4">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Payment ID
                </th>

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

              </tr>

            </thead>

            <tbody>

              {filteredPayments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-3">
                    #{payment.id}
                  </td>

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

                    <span
                      className={`font-bold ${
                        payment.payment_status === "Paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {payment.payment_status}
                    </span>

                  </td>

                  <td className="p-3">

                    {
                      new Date(
                        payment.payment_date
                      ).toLocaleDateString()
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default DealerPayments;
