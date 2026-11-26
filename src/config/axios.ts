import axios from "axios";

const configuredBaseURL = process.env.REACT_APP_API_BASE_URL?.trim().replace(/\/+$/, "") || "";

// API endpoint constants already start with /api. Strip an accidental /api
// suffix from the host setting so requests can never become /api/api/....
export const baseURL = configuredBaseURL.replace(/\/api$/i, "");

const Axios = axios.create({
  baseURL: baseURL,
});

export default Axios;
