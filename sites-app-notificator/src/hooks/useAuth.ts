import { ISessionRequest } from "../services/auth/auth.request";
import { sessionUser } from "../services/auth/auth.service";

export const useAuth = () => {
  const Login = async (data: ISessionRequest) => {
    const { acessToken, refreshToken } = await sessionUser(data);

    return {
      acessToken,
      refreshToken,
    };
  };

  return { Login };
};
