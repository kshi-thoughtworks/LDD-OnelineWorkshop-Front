process.env.NODE_ENV = 'production'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./base.config.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(baseWebpack, {
  mode: 'production',
  output: {
    publicPath: '/static/'
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'NODE_ENV': '"production"'
    }),
    /**
     * 将css提取到文件，文件数量要看splitChunks的配置
     */
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    /**
     * 压缩css，就算是production, 样式也是没压缩的,只是合并
     */
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public/*.png'),
          to: path.resolve(__dirname, '../dist'),
          transformPath(targetPath, absolutePath) {
            return targetPath.replace('public/', '')
          },
        }
      ]
    })
  ]
})