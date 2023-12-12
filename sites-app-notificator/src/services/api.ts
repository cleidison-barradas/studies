import { create, ApisauceInstance } from "apisauce";
import { server } from "../../config.json";

const authApi = create({
  baseURL: server.url,
});

export function setAuthToken(api: ApisauceInstance, token: string) {
  api.setHeader("Authorization", `Bearer ${token}`);
}

export { authApi };
