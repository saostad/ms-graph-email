import axios, { AxiosRequestConfig } from "axios";

type CallApiInput = { endpoint: string; accessToken: string };

type CallApiOutput = {
  "@odata.context": string;
  "@odata.nextLink": string;
  value: Record<string, any>[];
};

export async function callApi({
  endpoint,
  accessToken,
}: CallApiInput): Promise<CallApiOutput> {
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  console.log("request made to web API at: " + new Date().toString());

  const response = await axios.get(endpoint, options);
  return response.data;
}
