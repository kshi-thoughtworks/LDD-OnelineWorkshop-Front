process.env.NODE_ENV = 'devlopment'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./base.config.js')

module.exports = merge(baseWebpack, {
  devtool: 'cheap-module-source-map',
  plugins: [
    /**
     * 开启模块的热替换，HMR，和devServer的hot: true 一起使用才行
     */
    new webpack.HotModuleReplacementPlugin(),
    /**
     * 模块热替换开启时，显示更新module的相对路径
     */
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    publicPath: '/',
    host: 'localhost',
    historyApiFallback: true,
    port: 8080,
    open: true,
    hot: true,
    overlay: true,
    proxy: [
      {
        context: [
          '/workshop'
        ],
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    ]
  }
})