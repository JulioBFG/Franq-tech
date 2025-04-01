import axios from "axios";

const api = axios.create({
  baseURL: "https://api.hgbrasil.com/finance",
  method: "get",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
  },
});

export default api;
