import axios from "axios";

const API = axios.create({
  baseURL: "https://6a15440e91ff9a63de07c286.mockapi.io/api/v1",
});

export default API;