import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Products() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    brand: "",
    size: "",
    price: "",
    stock_quantity: ""
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setFormData({
      product_name: "",
      category: "",
      brand: "",
      size: "",
      price: "",
      stock_quantity: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await API.put(
          `/products/${editingId}`,
          formData,
          getHeaders()
        );

        alert("Product Updated Successfully");

      } else {

        await API.post(
          "/products",
          formData,
          getHeaders()
        );

        alert("Product Added Successfully");
      }

      clearForm();
      fetchProducts();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Operation Failed"
      );
    }
  };

  const handleEdit = (product) => {

    setEditingId(product.id);

    setFormData({
      product_name: product.product_name,
      category: product.category,
      brand: product.brand,
      size: product.size,
      price: product.price,
      stock_quantity: product.stock_quantity
    });
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/products/${id}`,
        getHeaders()
      );

      alert("Product Deleted Successfully");

      fetchProducts();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-6">
          Products Management
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >

          <div className="grid grid-cols-3 gap-4">

            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="size"
              placeholder="Size"
              value={formData.size}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="stock_quantity"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

          </div>

          <div className="mt-4 flex gap-4">

            <button
              type="submit"
              className={`text-white px-6 py-3 rounded ${
                editingId
                  ? "bg-blue-600"
                  : "bg-green-600"
              }`}
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 text-white px-6 py-3 rounded"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-3 text-left">
                  Name
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
                  Actions
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
                    {product.stock_quantity}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
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

export default Products;