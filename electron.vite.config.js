import { defineConfig, defineViteConfig, swcPlugin } from "electron-vite";

export default defineConfig({
  main: {
    // ...
    plugins: [swcPlugin()],
    build: {},
  },
  preload: {
    // ...
    build: {},
  },
  renderer: defineViteConfig(({ command, mode }) => {
    // conditional config use defineViteConfig
    // ...
    if (command === "build") {
    }

    return {};
  }),
});
