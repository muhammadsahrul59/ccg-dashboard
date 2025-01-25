import path from "path";
import { defineConfig } from "vite";

export default {
  root: path.resolve(__dirname),
  server: {
    port: 8080,
    hot: true,
  },
};
