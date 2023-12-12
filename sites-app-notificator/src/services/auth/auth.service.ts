import { authApi } from "../api";
import { ISessionRequest } from "./auth.request";
import { ISessionResponse } from "./auth.response";

export async function sessionUser(data: ISessionRequest) {
  return authApi
    .post<ISessionResponse>("/v1/session", data)
    .then((response) => response.data);
}

export async function renewToken(token: string) {
  return authApi
    .get<ISessionResponse>(`/v1/session/renew/${token}`)
    .then((response) => response.data);
}
