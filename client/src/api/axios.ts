import redaxios from "redaxios";
import { SERVER_URL } from "./_utils";

export const axios = redaxios.create({
  baseURL: SERVER_URL,
});
