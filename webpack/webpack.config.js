const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: '../dist/index.js',
    libraryTarget: 'umd',
    library: 'Biotope'
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
