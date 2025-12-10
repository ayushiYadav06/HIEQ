import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // your backend URL
  withCredentials: true, // only if using cookies
});

export default api;
 