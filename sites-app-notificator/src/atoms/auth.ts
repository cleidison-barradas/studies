import { atom } from "recoil";
import { auth, IAuth } from "../store/auth";

export const currentAuthState = atom<IAuth | undefined>({
  key: "auth",
  default: undefined,
});

export const authState = atom<IAuth | undefined>({
  key: "auth",
  default: auth.get("auth") as IAuth,
});
