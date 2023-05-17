import { ipcRenderer } from "electron";
import { contextBridge } from "electron";

export interface LauncherAPI {
  toolbox: {
    open: () => void;
  };
}

declare global {
  interface Window {
    api: LauncherAPI;
  }
}

const launcherAPIInstance: LauncherAPI = {
  toolbox: {
    open() {
      return ipcRenderer.send(`toolbox:open`);
    },
  },
};

contextBridge.exposeInMainWorld("api", launcherAPIInstance);
