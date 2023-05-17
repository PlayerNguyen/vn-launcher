import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";

export module toolbox {
  let _globalToolboxWindow: BrowserWindow | undefined;

  export function createToolboxWindow(): BrowserWindow {
    if (_globalToolboxWindow === undefined) {
      // Create the browser window
      const toolboxWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "../preload/index.js"),
        },
        show: false,
      });

      // Load the remote URL for development or the local html file for production
      console.log(process.env["ELECTRON_RENDERER_URL"]);

      if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
        toolboxWindow.loadURL(
          process.env["ELECTRON_RENDERER_URL"] + "/toolbox.html"
        );
      } else {
        toolboxWindow.loadFile(
          path.join(__dirname, "../renderer/toolbox.html")
        );
      }

      toolboxWindow.on("ready-to-show", () => {
        toolboxWindow.show();
      });

      _globalToolboxWindow = toolboxWindow;
    }

    return _globalToolboxWindow;
  }

  export function setupToolbox() {
    ipcMain.on("toolbox:open", (_) => {
      const toolboxWindow = toolbox.createToolboxWindow();
      if (toolboxWindow) console.log(`Opening tool box`);
    });
  }
}
