const path = require('path')

module.exports = {
  mode: 'development',
  entry: './public/js/index.js',
  output: {
    filename: '../public/build/index.js',
    path: path.resolve(__dirname)
  },
  devServer: {
    contentBase: './public'
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
