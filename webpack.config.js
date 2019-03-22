const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const config = require('./src/config');
require('dotenv').config()


const mode = process.env.NODE_ENV;
const withSSR = process.env.SSR === 'on';
const appName = process.env.APP_NAME || config.APP_NAME;
const lang = process.env.LANG || config.LANG;
const themeColor = process.env.THEME_COLOR || config.THEME_COLOR;

const dist = 'dist';

const common = {
  mode,

  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // }
};

const client = {
  entry: path.join(__dirname, 'src/client/index.tsx'),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, dist, 'public'),
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin([dist]),
    new HtmlWebpackPlugin({
      template: "index.pug",
      lang,
      title: appName,
      themeColor
    }),
  ]
};

const server = {
  entry: path.join(__dirname, '/src/server/index.tsx'),
  output: {
    filename: "index.js",
    path: path.join(__dirname, dist)
  },

  target: 'node',

  plugins: [
    new CleanWebpackPlugin([dist]),
  ],

  externals: [nodeExternals()],
};

module.exports = () => {
  const serverConfig = {
    ...common,
    ...server,
  };
  const clientConfig = {
    ...common,
    ...client,
  };

  if (withSSR) {
    return [serverConfig, clientConfig]
  }

  // return serverConfig
  // return clientConfig
};