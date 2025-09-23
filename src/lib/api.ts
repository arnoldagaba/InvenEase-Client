import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
	baseURL: VITE_API_URL,
	withCredentials: true,
});

export default apiClient;
