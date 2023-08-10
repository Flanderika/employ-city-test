const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");

const filePath = {
  src: {
    script: "./src/js/index.js",
    style: "./src/scss/style.scss",
    icons: "./src/assets/icons/*.svg",
    images: "./src/assets/images/*.{png,jpg,jpeg,webp}",
  },
  dist: "dist",
};

function checkDirectory(filePath) {
  return glob.sync(filePath).length > 0;
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const iconsExist = checkDirectory(filePath.src.icons);
  const imagesExist = checkDirectory(filePath.src.images);
  
  const config = {
    entry: [filePath.src.script, filePath.src.style],
    output: {
      publicPath: argv.mode === "production" ? "/employ-city-test/" : "/",
      path: path.resolve(__dirname, filePath.dist),
      filename: "js/bundle.js",
    },
    devServer: {
      static: path.resolve(__dirname, "dist"),
      compress: true,
      port: 9000,
    },
    mode: "production",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles/main.css",
      }),
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name][ext]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    performance: {
      hints: false,
    },
  };

  if (iconsExist) {
    config.plugins.push(
      new SVGSpritemapPlugin(filePath.src.icons, {
        output: {
          filename: "assets/icons/sprite.svg",
          svg4everybody: true,
        },
        sprite: {
          prefix: "icon-",
        },
      })
    );
  }

  if (isProduction && imagesExist) {
    config.optimization.minimizer.push(
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: false }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
      new ImageminWebpWebpackPlugin()
    );
  }

  if (imagesExist) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/assets/images/"),
            to: path.resolve(__dirname, "dist/assets/images/"),
          },
        ],
      })
    );
  }

  return config;
};
