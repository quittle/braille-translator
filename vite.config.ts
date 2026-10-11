import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [commonjs(), svgr(), react()],
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        // Turn Sass deprecation warnings into hard build errors.
        fatalDeprecations: [
          "global-builtin",
          "color-functions",
          "slash-div",
          "import",
        ],
      },
    },
  },
});
