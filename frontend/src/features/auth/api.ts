import { request } from "@/shared/request";

export const useToken = async ({ username, password }: RequestOptions) => {
  try {
    const { data } = await getToken({ username, password });

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
  } catch {
    throw new Error("[auth]: POST error");
  }
};

export const getToken = ({ username, password }: RequestOptions) =>
  request<Token>({
    url: `api/token/`,
    method: "POST",
    data: {
      username,
      password
    }
  });

interface Token {
  refresh: string;
  access: string;
}

interface RequestOptions {
  username: string;
  password: string;
}
