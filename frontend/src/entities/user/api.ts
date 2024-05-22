import { request } from "@/shared/request";
import { type User } from "./model";

export const getUser = () =>
  request<User>({
    url: `api/user/`,
    method: "get"
  });
