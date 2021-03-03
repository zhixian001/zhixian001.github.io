const path = require('path');
const BASE_PATH = path.join(__dirname);
module.exports = {
  // webpack folder’s entry js — excluded from jekll’s build process.
  entry: "./webpack/entry.js",
  output: {
    // we’re going to put the generated file in the assets folder so jekyll will grab it.
    // if using GitHub Pages, use the following:
    path: path.join(BASE_PATH, "assets/javascripts"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{
          loader: "babel-loader", // "babel-loader" is also a legal name to reference
          options: {
            presets: [
              "@babel/preset-react"
            ]
          }
        }]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', 'css']
  }
};