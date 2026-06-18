import { Link, useNavigate } from "react-router-dom";

function DealerSidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/dealer/login");

  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-10">
        Dealer Portal
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dealer/dashboard"
          className="hover:bg-slate-700 p-3 rounded"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/dealer/products"
          className="hover:bg-slate-700 p-3 rounded"
        >
          📦 Products
        </Link>

        <Link
          to="/dealer/orders"
          className="hover:bg-slate-700 p-3 rounded"
        >
          🧾 My Orders
        </Link>

        <Link
          to="/dealer/payments"
          className="hover:bg-slate-700 p-3 rounded"
        >
          💳 Payments
        </Link>

        <Link
          to="/dealer/profile"
          className="hover:bg-slate-700 p-3 rounded"
        >
          👤 Profile
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

export default DealerSidebar;