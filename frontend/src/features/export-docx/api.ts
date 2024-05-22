import { request } from "@/shared/request";

export const exportDocx = () =>
  request({
    url: `api/tests/export`,
    method: "GET",
    responseType: 'blob'
  });
