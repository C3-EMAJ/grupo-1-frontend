import axios from "axios";

const BASE_URL = "http://localhost:5000/emaj-api/";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;

const TOKEN = currentUser?.accessToken;

export const apiRequest = axios.create({
  baseURL: BASE_URL,
});

apiRequest.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.accessToken;

  if (TOKEN) {
    config.headers.token = `EMAJ ${TOKEN}`;
  }

  return config;
});

export default apiRequest;