const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config()


const mode = process.env.NODE_ENV;


const dist = 'dist';
const clientFolder = 'client';
const serverFolder = 'server';
const prefixPath = './';

const common = {
  mode,

  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
      }
    ]
  },

};

const client = {
  entry: path.resolve(prefixPath, 'src/client/index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(prefixPath, dist, clientFolder),
    publicPath: '/',
  },

  name: 'client',

  plugins: [
    new CleanWebpackPlugin([path.resolve(prefixPath, dist, clientFolder)]),
    // new HtmlWebpackPlugin({
    //   template: 'index.pug',
    //   lang: process.env.APP_LANG,
    //   title: process.env.APP_NAME,
    //   themeColor: process.env.THEME_COLOR,
    // }),
  ]
};

const server = {
  entry: path.resolve(prefixPath, 'src/server/index.tsx'),
  output: {
    filename: 'index.js',
    path: path.resolve(prefixPath, dist, serverFolder),
  },

  name: 'server',
  target: 'node',

  plugins: [
    new CleanWebpackPlugin([path.resolve(prefixPath, dist, serverFolder)]),
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

  return [clientConfig, serverConfig]
};