/**
 * @type {import('next').NextConfig}
 */
const withPWA = require("next-pwa");

module.exports =
  process.env.NODE_ENV === "development"
    ? {
        devIndicators: {
          autoPrerender: false,
        },
      }
    : withPWA({ dest: "public" });
