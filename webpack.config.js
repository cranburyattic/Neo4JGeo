const path = require('path');

module.exports = {
  entry : './public/js/code.js',
  output : {
    filename :'bundle.js',
    path : path.resolve(__dirname, 'public/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader : 'file-loader',
            options : {
              outputPath: 'images',
            }
          }
        ]
      }
    ]
  }
}