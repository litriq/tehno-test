import { request } from "@/shared/request";

export const completeTest = ({ score, testId }: RequestOptions) =>
  request({
    url: `api/tests/${testId}/complete/`,
    method: "POST",
    data: {
      score
    }
  });

interface RequestOptions {
  testId: number;
  score: number;
}
