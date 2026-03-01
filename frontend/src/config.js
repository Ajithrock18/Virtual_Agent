// Use environment variable for backend URL in production, fallback to localhost for development
const isDev = import.meta.env.DEV;
const defaultBackend = isDev ? "http://localhost:8001" : "";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBackend;
