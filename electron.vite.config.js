import { defineConfig, defineViteConfig, swcPlugin } from "electron-vite";

export default defineConfig({
  main: {
    // ...
    plugins: [swcPlugin()],
  },
  preload: {
    // ...
    build: {
      
    }
  },
  renderer: defineViteConfig(({ command, mode }) => {
    // conditional config use defineViteConfig
    // ...
    if (command === "build") {
    }

    return {};
  }),
});
