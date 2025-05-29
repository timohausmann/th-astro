/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [
        require("@csstools/postcss-global-data")({
            files: ["./src/css/breakpoints.css"],
        }),
        require("postcss-preset-env")({
            features: {
                "custom-media-queries": true,
            },
        }),
        require("postcss-pxtorem"),
        require("autoprefixer"),
    ],
};

module.exports = config;
