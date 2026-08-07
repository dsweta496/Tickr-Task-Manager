import axios from "axios";

export const taskBaseUrl = axios.create({
    baseURL: "http://localhost:8000/tasks"
});

export const labelBaseUrl = axios.create({
    baseURL: "http://localhost:8000/labels"
});
