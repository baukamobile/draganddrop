// // vite.config.js
// import * as path from "path";
// import { defineConfig } from "file:///Users/001/Desktop/vueapp/draganddrop/node_modules/vite/dist/node/index.js";
// import vue from "file:///Users/001/Desktop/vueapp/draganddrop/node_modules/@vitejs/plugin-vue/dist/index.mjs";
// import vueJSX from "file:///Users/001/Desktop/vueapp/draganddrop/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
// var __vite_injected_original_dirname = "/Users/001/Desktop/vueapp/draganddrop";
// var vite_config_default = defineConfig({
//   plugins: [vue(), vueJSX()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__vite_injected_original_dirname, "src")
//       // Теперь path работает
//     }
//   },
//   optimizeDeps: {
//     exclude: [".out"]
//   },
//   base: "/"
//   // base: '/static/',
//   // build: {
//   //     outDir: "dist",
//   //   }
// });
// export {
//   vite_config_default as default
// };
// //# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvMDAxL0Rlc2t0b3AvdnVlYXBwL2RyYWdhbmRkcm9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvMDAxL0Rlc2t0b3AvdnVlYXBwL2RyYWdhbmRkcm9wL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy8wMDEvRGVza3RvcC92dWVhcHAvZHJhZ2FuZGRyb3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnOyAvLyBcdTA0MTdcdTA0MzBcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NEZcdTA0MzVcdTA0M0MgaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSlNYIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW3Z1ZSgpLCB2dWVKU1goKV0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLCAvLyBcdTA0MjJcdTA0MzVcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0NEMgcGF0aCBcdTA0NDBcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDJcdTA0MzBcdTA0MzVcdTA0NDJcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBleGNsdWRlOiBbJy5vdXQnXSxcclxuICAgIH0sXHJcbiAgICBiYXNlOiAnLycsXHJcbiAgICAvLyBiYXNlOiAnL3N0YXRpYy8nLFxyXG4gICAgLy8gYnVpbGQ6IHtcclxuICAgIC8vICAgICBvdXREaXI6IFwiZGlzdFwiLFxyXG4gICAgLy8gICB9XHJcbn0pO1xyXG4vL2Rhc2RhIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUyxZQUFZLFVBQVU7QUFDdlQsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUhuQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQ3pCLFFBQVE7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0o7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQVUsYUFBUSxrQ0FBVyxLQUFLO0FBQUE7QUFBQSxJQUN0QztBQUFBLEVBQ0o7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxNQUFNO0FBQUEsRUFDcEI7QUFBQSxFQUNBLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtWLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
