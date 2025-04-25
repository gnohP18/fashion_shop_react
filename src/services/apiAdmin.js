import axios from "axios";
import * as StatusCode from "./../constants/statusCode";
import { STORAGE_AUTH_ACCESS_KEY } from "../constants/authentication";
import { setAccessToken } from "../utils/auth";

// Singleton class để quản lý API client

class ApiClient {
  static inst = null;

  constructor() {
    if (ApiClient.inst) {
      return ApiClient.inst;
    }

    this.client = axios.create(this.makeClient());
    this.setupInterceptors();

    ApiClient.inst = this;
  }

  makeClient() {
    return {
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }

  async getHeaders() {
    const token = localStorage.getItem(STORAGE_AUTH_ACCESS_KEY);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token;
    }

    return headers;
  }

  setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      config.headers = await this.getHeaders();
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          console.error("Network error");
          return Promise.reject(error);
        }

        const { status, data } = error.response;

        if (status === StatusCode.INTERNAL_SERVER_ERROR) {
          console.error(`Server error: ${status}`);
          return Promise.reject([data.message]);
        } else if (status === StatusCode.NOT_FOUND) {
          console.error(`Not found: ${status}`);
        } else if (status === StatusCode.UNAUTHENTICATED) {
          console.error(`UnAuthenticated: ${status}`);

          const errorData = { errors: data.message };
          setAccessToken('');
          window.location.href = '/login';
          return Promise.reject(errorData);
        } else if (
          [
            StatusCode.UNPROCESSABLE_CONTENT,
            StatusCode.BAD_REQUEST,
            StatusCode.FORBIDDEN,
          ].includes(status)
        ) {
          console.error(`Client error: ${status}`);
          console.log(data.errors);
          return Promise.reject(data.errors);
        }

        return Promise.reject(error);
      }
    );
  }

  get(url, params = {}) {
    return this.client.get(url, { params }).then((res) => res.data);
  }

  post(url, data = {}) {
    return this.client.post(url, data).then((res) => res.data);
  }

  put(url, data = {}) {
    return this.client.put(url, data).then((res) => res.data);
  }

  patch(url, data = {}) {
    return this.client.patch(url, data).then((res) => res.data);
  }

  delete(url, data = {}) {
    return this.client.delete(url, { data }).then((res) => res.data);
  }
}

const apiClient = new ApiClient();
export default apiClient;
