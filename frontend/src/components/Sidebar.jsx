import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-10">
        DealerFlow ERP
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-slate-700 p-3 rounded"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/dealers"
          className="hover:bg-slate-700 p-3 rounded"
        >
          👥 Dealers
        </Link>

        <Link
          to="/products"
          className="hover:bg-slate-700 p-3 rounded"
        >
          📦 Products
        </Link>

        <Link
          to="/orders"
          className="hover:bg-slate-700 p-3 rounded"
        >
          🧾 Orders
        </Link>

        <Link
          to="/payments"
          className="hover:bg-slate-700 p-3 rounded"
        >
          💳 Payments
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 p-3 rounded mt-10 hover:bg-red-700"
        >
          🚪 Logout
        </button>

      </nav>

    </div>
  );
}
<Link
  to="/users"
  className="hover:bg-slate-700 p-3 rounded"
>
  👥 Users
</Link>
export default Sidebar;