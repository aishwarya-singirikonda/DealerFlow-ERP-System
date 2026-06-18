import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    dealer_name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    fetchDealers();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

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

  const clearForm = () => {
    setFormData({
      dealer_name: "",
      owner_name: "",
      phone: "",
      email: "",
      address: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await API.put(
          `/dealers/${editingId}`,
          formData,
          getHeaders()
        );

        alert("Dealer Updated Successfully");

      } else {

        await API.post(
          "/dealers",
          formData,
          getHeaders()
        );

        alert("Dealer Added Successfully");
      }

      clearForm();
      fetchDealers();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Operation Failed"
      );
    }
  };

  const handleEdit = (dealer) => {

    setEditingId(dealer.id);

    setFormData({
      dealer_name: dealer.dealer_name,
      owner_name: dealer.owner_name,
      phone: dealer.phone,
      email: dealer.email,
      address: dealer.address
    });
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dealer?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/dealers/${id}`,
        getHeaders()
      );

      alert("Dealer Deleted Successfully");

      fetchDealers();

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
          Dealers Management
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >

          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              name="dealer_name"
              placeholder="Dealer Name"
              value={formData.dealer_name}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="owner_name"
              placeholder="Owner Name"
              value={formData.owner_name}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded w-full mt-4"
            required
          />

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
                ? "Update Dealer"
                : "Add Dealer"}
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
                  Dealer
                </th>

                <th className="p-3 text-left">
                  Owner
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {dealers.map((dealer) => (

                <tr
                  key={dealer.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {dealer.dealer_name}
                  </td>

                  <td className="p-3">
                    {dealer.owner_name}
                  </td>

                  <td className="p-3">
                    {dealer.phone}
                  </td>

                  <td className="p-3">
                    {dealer.email}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(dealer)
                      }
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(dealer.id)
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

export default Dealers;