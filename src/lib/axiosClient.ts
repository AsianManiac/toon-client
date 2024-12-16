import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Set the Bearer auth token.
const setBearerToken = (token?: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export { axios, setBearerToken };
