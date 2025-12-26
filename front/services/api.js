import axios from "axios";

export default axios.create({
  baseURL: "https://pesapal-j70o.onrender.com/api"
  // baseURL: "http://localhost:5000/api"
});
