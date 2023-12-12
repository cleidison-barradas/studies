import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAuth } from "../store/auth";

interface AuthContextData {
  auth: IAuth;
  setAuth: (data: React.SetStateAction<IAuth>) => void;
}

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext({} as AuthContextData);
const { Provider } = AuthContext;

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.Main.on("user:change-credentials", () => {
      loadCredencials();
    });
    loadCredencials();
  }, []);

  function loadCredencials() {
    window.Main.loadCredentials().then((data: IAuth) => {
      if (data.acessToken.length > 0) {
        setAuth(data);
        return navigate("/home");
      }
      return navigate("/");
    });
  }

  return (
    <Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </Provider>
  );
};

export default AuthContext;
