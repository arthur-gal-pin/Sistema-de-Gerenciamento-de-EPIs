import axios from "axios";
import api_jsonfake from './api.js'; 

const TOKEN = "asl";

const api = axios.create({
  baseURL: "http://localhost:3360",
  timeout: 5000,
});

api.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

export default api;
