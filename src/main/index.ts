import { app, BrowserWindow } from "electron";
import path from "path";
import { toolbox } from "./toolbox/toolbox";

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
    show: false,
  });

  // Load the remote URL for development or the local html file for production
  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  toolbox.setupToolbox();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  /**
   * Before quit
   */
});
