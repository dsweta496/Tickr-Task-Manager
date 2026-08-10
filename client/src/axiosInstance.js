import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

export const taskBaseUrl = axios.create({
    baseURL: `${API_URL}/tasks`
});

export const labelBaseUrl = axios.create({
    baseURL: `${API_URL}/labels`
});

export const authBaseUrl = axios.create({
    baseURL: `${API_URL}/user`
});

const addToken = (config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

taskBaseUrl.interceptors.request.use(addToken);
labelBaseUrl.interceptors.request.use(addToken);