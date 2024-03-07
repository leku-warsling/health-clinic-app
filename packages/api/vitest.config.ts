import path from "path";

export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@db": path.resolve(__dirname, "./src/db"),
      "@util": path.resolve(__dirname, "./src/util"),
      "@constants": path.resolve(__dirname, "./src/constants"),
    },
  },
};
