import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://economize-023-api-521a6e433d2a.herokuapp.com",
  //baseURL: "http://localhost:8080",
});

export default axiosInstance;
