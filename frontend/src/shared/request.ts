import axios, { type AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "http://37.9.7.152:8000/";

export const request = async <T = any, D = any>({
  url = "/",
  method = "GET",
  data,
  ...config
}: AxiosRequestConfig<D>) => {
  return axios<T>({
    url,
    method,
    data,
    ...config,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`
    }
  });
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.config.data && JSON.parse(error.config.data).refresh) {
      resetTokenData();
      window.location.href = "/";
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data, status } = await axios.post("/api/token/refresh/", {
          refresh: localStorage.getItem("refresh_token")
        });

        if (status === 200) {
          localStorage.setItem("access_token", data.access);

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.access}`;

          originalRequest.headers["Authorization"] =
            axios.defaults.headers.common["Authorization"];

          return axios(originalRequest);
        }
      } catch {
        throw new Error("[auth]: POST error");
      }
    }

    return Promise.reject(error);
  }
);

const resetTokenData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
