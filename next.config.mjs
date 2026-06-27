import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber"],
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(
          __dirname,
          "node_modules/react/jsx-runtime"
        ),
        "react/jsx-dev-runtime": path.resolve(
          __dirname,
          "node_modules/react/jsx-dev-runtime"
        ),
      };
    }

    if (dev) {
      config.snapshot = {
        ...(config.snapshot ?? {}),
        managedPaths: [path.resolve(__dirname, "node_modules")],
      };
    }

    return config;
  },
};

export default nextConfig;
