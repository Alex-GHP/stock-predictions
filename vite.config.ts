import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, loadEnv } from "vite"


export default defineConfig({
  define: {
    'process.env.OPENAI_API_KEY': `"${process.env.OPENAI_API_KEY}"`
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
