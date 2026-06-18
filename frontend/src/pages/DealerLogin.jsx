import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function DealerLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        alert("Login failed");
        return;
      }

      // Save session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // IMPORTANT: ROLE ROUTING ONLY (NO BLOCKING ALERTS)
      if (user.role === "dealer") {
        navigate("/dealer/dashboard");
      } 
      else if (user.role === "admin") {
        alert("This is Admin account. Please use main login.");
        navigate("/");
      } 
      else {
        alert("Unauthorized role");
        navigate("/");
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Dealer Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );

}

export default DealerLogin;