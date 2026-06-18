import axios from "axios";

const API = axios.create({
  baseURL: "https://dealerflow-erp-system.onrender.com/api",
});

export default API;