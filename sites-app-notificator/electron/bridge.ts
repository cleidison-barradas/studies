import { contextBridge, ipcRenderer } from "electron";
import { IAuth } from "../src/interfaces/auth";

export const api = {
  socketConnected: (user: any) => {
    ipcRenderer.send("socket:connection-sucess", user);
  },
  order: (data: any) => {
    ipcRenderer.send("socket:new-order", data);
  },

  openAdmin: (url: string) => {
    ipcRenderer.send("app:open-admin", url);
  },

  loadCredentials: async () => await ipcRenderer.invoke("user:load-credentials"),

  hideApp: async () => await ipcRenderer.invoke("user:hide-app"),

  setCredentials: async (data: IAuth) => {
    await ipcRenderer.invoke("user:set-credentials", data)
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
};

contextBridge.exposeInMainWorld("Main", api);
