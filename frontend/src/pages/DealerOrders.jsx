import { useEffect, useState } from "react";
import DealerSidebar from "../components/DealerSidebar";
import API from "../services/api";

function DealerOrders() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchProducts = async () => {

    try {

      const response = await API.get(
        "/products",
        getHeaders()
      );

      setProducts(response.data.products);

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

  const addToCart = (product) => {

    const existingItem = cart.find(
      item => item.id === product.id
    );

    if (existingItem) {

      setCart(
        cart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);

    }

  };

  const removeFromCart = (id) => {

    setCart(
      cart.filter(
        item => item.id !== id
      )
    );

  };

  const totalAmount = cart.reduce(

    (sum, item) =>

      sum +
      Number(item.price) *
      Number(item.quantity),

    0

  );

  const placeOrder = async () => {

    try {

      if (cart.length === 0) {

        alert("Cart is empty");

        return;

      }

      await API.post(
        "/orders",
        {
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        },
        getHeaders()
      );

      alert("Order Placed Successfully");

      setCart([]);

      fetchOrders();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to place order"
      );

    }

  };

  return (

    <div className="flex">

      <DealerSidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {/* Products */}

        <div className="bg-white rounded-xl shadow p-4 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Available Products
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Price
                </th>

                <th className="p-3 text-left">
                  Stock
                </th>

                <th className="p-3 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {product.product_name}
                  </td>

                  <td className="p-3">
                    ₹{product.price}
                  </td>

                  <td className="p-3">
                    {product.stock_quantity}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add To Cart
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
        
        {/* Cart */}

        <div className="bg-white rounded-xl shadow p-4 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Cart
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Qty
                </th>

                <th className="p-3 text-left">
                  Price
                </th>

                <th className="p-3 text-left">
                  Remove
                </th>

              </tr>

            </thead>

            <tbody>

              {cart.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {item.product_name}
                  </td>

                  <td className="p-3">
                    {item.quantity}
                  </td>

                  <td className="p-3">
                    ₹{item.quantity * item.price}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="mt-6 flex justify-between items-center">

            <h2 className="text-2xl font-bold">

              Total :

              <span className="text-green-600 ml-3">
                ₹{totalAmount}
              </span>

            </h2>

            <button
              onClick={placeOrder}
              className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700"
            >
              Place Order
            </button>

          </div>

        </div>

        {/* Previous Orders */}

        <div className="bg-white rounded-xl shadow p-4">

          <h2 className="text-2xl font-bold mb-4">
            Previous Orders
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Order ID
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

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b"
                >

                  <td className="p-3">
                    #{order.id}
                  </td>

                  <td className="p-3">
                    ₹{order.total_amount}
                  </td>

                  <td className="p-3">

                    <span
                      className={`font-bold ${
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
                    </span>

                  </td>

                  <td className="p-3">

                    {
                      new Date(
                        order.created_at
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

export default DealerOrders;
