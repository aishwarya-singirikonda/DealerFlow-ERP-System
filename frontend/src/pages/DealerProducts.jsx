import { useEffect, useState } from "react";
import API from "../services/api";
import DealerSidebar from "../components/DealerSidebar";

function DealerProducts() {

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
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

  const handleQuantityChange = (id, value) => {

    setQuantities({
      ...quantities,
      [id]: value
    });

  };

  const placeOrder = async (product) => {

    try {

      const quantity = Number(
        quantities[product.id]
      );

      if (!quantity || quantity <= 0) {

        alert("Enter valid quantity");

        return;

      }

      await API.post(
        "/orders",
        {
          items: [
            {
              product_id: product.id,
              quantity
            }
          ]
        },
        getHeaders()
      );

      alert("Order Placed Successfully");

      setQuantities({
        ...quantities,
        [product.id]: ""
      });

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
          Products
        </h1>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Category
                </th>

                <th className="p-3 text-left">
                  Brand
                </th>

                <th className="p-3 text-left">
                  Size
                </th>

                <th className="p-3 text-left">
                  Price
                </th>

                <th className="p-3 text-left">
                  Stock
                </th>

                <th className="p-3 text-left">
                  Quantity
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
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-3">
                    {product.product_name}
                  </td>

                  <td className="p-3">
                    {product.category}
                  </td>

                  <td className="p-3">
                    {product.brand}
                  </td>

                  <td className="p-3">
                    {product.size}
                  </td>

                  <td className="p-3">
                    ₹{product.price}
                  </td>

                  <td className="p-3">

                    {product.stock_quantity < 10 ? (

                      <span className="text-red-600 font-bold">
                        {product.stock_quantity}
                      </span>

                    ) : (

                      product.stock_quantity

                    )}

                  </td>

                  <td className="p-3">

                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-24"
                      placeholder="Qty"
                    />

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        placeOrder(product)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Place Order
                    </button>

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

export default DealerProducts;