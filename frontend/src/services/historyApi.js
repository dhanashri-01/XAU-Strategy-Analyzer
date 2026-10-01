import api from "./api";

export const getHistory = () => api.get("/history");