/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: { webpackBuildWorker: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "barcode.orcascan.com",
        pathname: "**",
      },
    ],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      })
    );

    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "static/media/[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
