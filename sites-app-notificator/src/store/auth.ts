import Store, { Schema } from "electron-store";

export interface IAuth {
  acessToken: string;
  refreshToken: string;
}

const schema: Schema<IAuth> = {
  acessToken: {
    type: "string",
    default: "",
  },
  refreshToken: {
    type: "string",
    default: "",
  },
};

const auth = new Store({ schema, watch: true });

export { auth };
