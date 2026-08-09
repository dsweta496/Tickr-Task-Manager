import axios from "axios";

export const taskBaseUrl = axios.create({
    baseURL: "http://localhost:8000/tasks"
});

export const labelBaseUrl = axios.create({
    baseURL: "http://localhost:8000/labels"
});

export const authBaseUrl = axios.create({
    baseURL: "http://localhost:8000/user"
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