import axios from "axios";

let apiManager = null;

export const initializeApiManager = (apiKey) => {
  if (!apiManager) {
    console.log("Initializing ApiManager");
    // Create an Axios instance with base configuration
    apiManager = axios.create({
      baseURL: "https://api.edge.recruitly.io/api",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Set the Authorization header dynamically
    apiManager.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${apiKey}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle global response errors
    apiManager.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }
  return apiManager;
};

// Export the instance to use after initialization
export const getApiManager = () => {
  if (!apiManager) {
    throw new Error(
      "API Manager is not initialized. Call `initializeApiManager` first."
    );
  }
  return apiManager;
};
