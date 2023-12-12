import {
  app,
  Tray,
  Menu,
  dialog,
  nativeImage,
  Notification,
  BrowserWindow,
  ipcMain,
  shell,
} from "electron";

import { autoUpdater } from "electron-github-autoupdater";
import isDev from "../src/Utils/isDevelopment";
import { repository } from "../config.json";
import * as path from "path";
import AutoLaunch from "easy-auto-launch";

import { auth, IAuth } from "../src/store/auth";
import { renewToken } from "../src/services/auth/auth.service";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null;
let mainWindow: BrowserWindow | null;
let AppAutoLaunch: AutoLaunch | null;

if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

function getIcon() {
  const assetsPath = !isDev() ? process.resourcesPath : app.getAppPath();
  const iconPath = !isDev()
    ? path.join(assetsPath, "assets", "logo.png")
    : path.join(assetsPath, "src", "assets", "logo.png");

  return nativeImage.createFromPath(iconPath);
}

function openApp(browserWindow: BrowserWindow) {
  browserWindow.show();
  browserWindow.focus();
}

function hideApp(browserWindow: BrowserWindow) {
  browserWindow.hide();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: getIcon(),
    minWidth: 1000,
    minHeight: 600,
    show: true,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev()) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("minimize", () => {
    mainWindow instanceof BrowserWindow && mainWindow.hide();
  });
}

function createMenu() {
  tray = new Tray(getIcon());

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Encerrar sessão",
      type: "normal",
      click: () => clearCredentials(),
    },
    { label: "Sair", type: "normal", role: "quit" },
  ]);

  tray.setContextMenu(contextMenu);

  AppAutoLaunch = new AutoLaunch({
    name: "Mypharma Notificador",
    path: app.getPath("userData"),
  });

  AppAutoLaunch.enable();

  AppAutoLaunch.isEnabled()
    .then(function (isEnabled: boolean) {
      if (isEnabled) {
        return;
      }
      AppAutoLaunch?.enable();
    })
    .catch(function (error) {
      Notifier(error, "Erro ao iniciar");
    });
}

function updateApp() {
  if (!isDev() && process.platform !== "linux") {
    const updater = autoUpdater(repository);
    updater.on("update-downloaded", (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: "info",
        buttons: ["Atualizar agora", "Agora não"],
        title: "Nova Atualizacão disponível",
        message: process.platform === "win32" ? releaseNotes : releaseName,
        detail: "Uma nova versão foi publicada atualize seu notificador !",
      };
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) updater.quitAndInstall();
      });
      updater.on("error", (message) => {
        Notifier("ocorreu um problema ao realizar as atualizacões", message);
      });
    });
    setInterval(async () => {
      await updater.checkForUpdates();
    }, 30000);
  }
}
function validateAccount() {
  loadCredentials().then((data) => {
    if (data.refreshToken.length > 0) {
      renewToken(data.refreshToken)
        .then((session) => {
          if (session?.user) {
            const { acessToken, refreshToken } = session;

            setCredentials({ acessToken, refreshToken }).then((data) => {
              return data;
            });
          }
        })
        .catch((err) => {
          Notifier(err, "Erro ao renovar token");
        });
    }
  });
}

async function loadCredentials() {
  return new Promise<IAuth>((resolve) => {
    const acessToken = auth.get("acessToken") as string;
    const refreshToken = auth.get("refreshToken") as string;

    resolve({
      acessToken,
      refreshToken,
    });
  });
}

async function setCredentials(data: IAuth) {
  return new Promise((resolve) => {
    auth.set("acessToken", data.acessToken);
    auth.set("refreshToken", data.refreshToken);

    mainWindow?.webContents.send("user:change-credentials");
    resolve(data);
  });
}

function clearCredentials() {
  auth.set("acessToken", "");
  auth.set("refreshToken", "");

  if (mainWindow instanceof BrowserWindow) {
    mainWindow.webContents.send("user:change-credentials");
    mainWindow.webContents.send("user:finished-session");
    openApp(mainWindow);
  }
}

function registerListners() {
  ipcMain.on("socket:connection-sucess", (_, user: any) => {
    if (user) {
      if (mainWindow instanceof BrowserWindow) {
        // hideApp(mainWindow);
      }
    }
  });

  ipcMain.handle("user:hide-app", () => {
    if (mainWindow instanceof BrowserWindow)
      hideApp(mainWindow);
  });

  ipcMain.on("socket:new-order", async (_, data: any) => {
    if (mainWindow instanceof BrowserWindow) {
      mainWindow.webContents.send("user:asynchronous-message", data)
      hideApp(mainWindow);
      openApp(mainWindow);
    }
  });

  ipcMain.on("app:open-admin", async (_, url: string) => {
    if (mainWindow instanceof BrowserWindow) {
      await shell.openExternal(url);
      hideApp(mainWindow);
    }
  });

  ipcMain.handle("user:load-credentials", loadCredentials);

  ipcMain.handle("user:set-credentials", async (_, data: IAuth) => {
    await setCredentials(data);
  });
}

function Notifier(body: string, title: string) {
  const notification = new Notification({
    icon: getIcon(),
    title,
    body,
  });

  notification.show();
}

app
  .on("ready", () => {
    createWindow();
    updateApp();
    registerListners();
    validateAccount();
  })
  .whenReady()
  .then(createMenu);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
