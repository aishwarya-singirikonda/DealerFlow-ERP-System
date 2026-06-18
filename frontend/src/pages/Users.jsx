import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchUsers = async () => {

    try {

      const response = await API.get(
        "/users",
        getHeaders()
      );

      setUsers(response.data.users);

    } catch (error) {

      console.error(error);

    }

  };

  const updateRole = async (id, role) => {

    try {

      await API.put(
        `/users/${id}/role`,
        {
          role
        },
        getHeaders()
      );

      alert("Role Updated");

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert("Failed");

    }

  };

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/users/${id}`,
        getHeaders()
      );

      alert("User Deleted");

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert("Failed");

    }

  };

  const filteredUsers = users.filter(
    user =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

        <h1 className="text-4xl font-bold mb-8">
          User Management
        </h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded w-80 mb-8"
        />

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-100">

                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Role
                </th>

                <th className="p-3 text-left">
                  Change Role
                </th>

                <th className="p-3 text-left">
                  Delete
                </th>

              </tr>

            </thead>

            <tbody>
              {filteredUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">

                    <span
                      className={`font-bold ${
                        user.role === "admin"
                          ? "text-red-600"
                          : user.role === "staff"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="p-3">

                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(
                          user.id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded"
                    >

                      <option value="admin">
                        Admin
                      </option>

                      <option value="staff">
                        Staff
                      </option>

                      <option value="dealer">
                        Dealer
                      </option>

                    </select>

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteUser(user.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default Users;
