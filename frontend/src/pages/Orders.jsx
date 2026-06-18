import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);

  const [dealerId, setDealerId] = useState("");

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
    fetchDealers();
    fetchProducts();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders", getHeaders());
      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDealers = async () => {
    try {
      const response = await API.get("/dealers", getHeaders());
      setDealers(response.data.dealers);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products", getHeaders());
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
      },
    ]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;

    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const totalAmount = useMemo(() => {
    let total = 0;

    items.forEach((item) => {
      const product = products.find(
        (p) => p.id === Number(item.product_id)
      );

      if (product) {
        total += Number(product.price) * Number(item.quantity);
      }
    });

    return total;
  }, [items, products]);

  const createOrder = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/orders",
        {
          dealer_id: Number(dealerId),
          items: items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
        },
        getHeaders()
      );

      alert("Order Created Successfully");

      setDealerId("");

      setItems([
        {
          product_id: "",
          quantity: 1,
        },
      ]);

      fetchOrders();

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Failed to create order"
      );

    }
  };

  const approveOrder = async (id) => {
    try {

      await API.put(
        `/orders/approve/${id}`,
        {},
        getHeaders()
      );

      fetchOrders();

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Failed"
      );

    }
  };

  const updateStatus = async (id, status) => {
    try {

      await API.put(
        `/orders/${id}/status`,
        {
          status,
        },
        getHeaders()
      );

      fetchOrders();

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Failed"
      );

    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const approvedOrders = orders.filter(
    (o) => o.status === "Approved"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-8">
          Orders Management
        </h1>

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Total Orders</h2>
            <p className="text-4xl font-bold">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Pending</h2>
            <p className="text-4xl text-yellow-600 font-bold">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Approved</h2>
            <p className="text-4xl text-green-600 font-bold">
              {approvedOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Delivered</h2>
            <p className="text-4xl text-blue-600 font-bold">
              {deliveredOrders}
            </p>
          </div>

        </div>

        <form
          onSubmit={createOrder}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >

          <select
            value={dealerId}
            onChange={(e) =>
              setDealerId(e.target.value)
            }
            className="border p-3 rounded w-full mb-4"
            required
          >
            <option value="">
              Select Dealer
            </option>

            {dealers.map((dealer) => (
              <option
                key={dealer.id}
                value={dealer.id}
              >
                {dealer.dealer_name}
              </option>
            ))}
          </select>

          {items.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-4 gap-4 mb-4"
            >

              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "product_id",
                    e.target.value
                  )
                }
                className="border p-3 rounded"
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.product_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
                className="border p-3 rounded"
              />

              <button
                type="button"
                onClick={() => removeRow(index)}
                className="bg-red-600 text-white rounded"
              >
                Remove
              </button>

            </div>

          ))}

          <button
            type="button"
            onClick={addRow}
            className="bg-green-600 text-white px-5 py-3 rounded mr-4"
          >
            + Add Product
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Create Order
          </button>

          <div className="mt-6 text-2xl font-bold">
            Total Amount : ₹{totalAmount}
          </div>

        </form>
                <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Search Dealer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded w-80"
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="All">
              All
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

        </div>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-3 text-left">
                  Dealer
                </th>

                <th className="p-3 text-left">
                  Amount
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

              {orders
                .filter((order) => {

                  const matchesSearch =
                    order.dealer_name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      );

                  const matchesStatus =
                    filterStatus === "All" ||
                    order.status === filterStatus;

                  return (
                    matchesSearch &&
                    matchesStatus
                  );

                })
                .map((order) => (

                  <tr
                    key={order.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {order.dealer_name}
                    </td>

                    <td className="p-3 font-medium">
                      ₹{order.total_amount}
                    </td>

                    <td className="p-3">

                      <span
                        className={`font-bold px-3 py-1 rounded
                        ${
                          order.status === "Pending"
                            ? "text-yellow-700"
                            : order.status === "Approved"
                            ? "text-green-700"
                            : order.status === "Delivered"
                            ? "text-blue-700"
                            : "text-purple-700"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="p-3">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">

                      {order.status ===
                        "Pending" && (

                        <button
                          onClick={() =>
                            approveOrder(
                              order.id
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Approve
                        </button>

                      )}

                      {order.status ===
                        "Approved" && (

                        <button
                          onClick={() =>
                            updateStatus(
                              order.id,
                              "Delivered"
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Deliver
                        </button>

                      )}

                      {order.status ===
                        "Delivered" && (

                        <button
                          onClick={() =>
                            updateStatus(
                              order.id,
                              "Completed"
                            )
                          }
                          className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                          Complete
                        </button>

                      )}

                      {order.status ===
                        "Completed" && (

                        <span className="text-green-700 font-bold">
                          ✓ Completed
                        </span>

                      )}

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

export default Orders;