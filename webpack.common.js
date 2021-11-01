const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./src/js/index.jsx', './src/css/app.less'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(jpg|bmp|png|svg)$/i,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.(css|less)$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/public/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
}
