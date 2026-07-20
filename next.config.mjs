import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber"],
  // The Landing Experience at "/" owns all onboarding now. The legacy
  // /onboarding/* pages are retired — redirect any request to them (old
  // bookmarks, stale links, cached URLs) to "/" at the edge, before the page or
  // any client code runs. Deterministic, unlike the client-side reconcile.
  async redirects() {
    return [
      {
        source: "/onboarding/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
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
