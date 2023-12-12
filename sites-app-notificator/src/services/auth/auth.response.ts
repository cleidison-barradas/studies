import { IUser } from "../../interfaces/user";

export interface ISessionResponse {
  user: IUser;
  acessToken: string;
  refreshToken: string;
}
