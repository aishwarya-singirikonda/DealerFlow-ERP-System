import { useEffect, useState } from "react";
import DealerSidebar from "../components/DealerSidebar";
import API from "../services/api";

function DealerProfile() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchProfile = async () => {

    try {

      const response = await API.get(
        "/auth/profile",
        getHeaders()
      );

      setFormData({
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        phone: response.data.user.phone || "",
        address: response.data.user.address || ""
      });

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

  const updateProfile = async (e) => {

    e.preventDefault();

    try {

      await API.put(
        "/auth/profile",
        formData,
        getHeaders()
      );

      alert("Profile Updated Successfully");

      fetchProfile();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    }

  };

  return (

    <div className="flex">

      <DealerSidebar />

      <div className="flex-1 min-h-screen bg-slate-100 p-8">

        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <form
          onSubmit={updateProfile}
          className="bg-white p-8 rounded-xl shadow w-full max-w-3xl"
        >

          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-semibold">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

            </div>

          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded mt-8 hover:bg-blue-700"
          >
            Update Profile
          </button>

        </form>

      </div>

    </div>

  );

}

export default DealerProfile;
