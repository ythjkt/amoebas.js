const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '../dist/index.js',
    path: path.resolve(__dirname),
    library: 'amoeba.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      // perform js babelization on all .js files
      {
        test: /src\/\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
