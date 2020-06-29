const path = require('path')
const projectDir = path.resolve(__dirname, '../')
const distDir = path.resolve(__dirname, '../dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProduction = process.env.NODE_ENV === 'production'
const cssStyles = [
  { loader: isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader' },
  { loader: 'css-loader' },
  { loader: 'postcss-loader' }
]
const scssStyles = cssStyles.slice()
scssStyles.push({ loader: 'sass-loader' })

module.exports = {
  mode: 'development',
  context: projectDir,
  entry: {
    main: './src/main.js'
  },
  output: {
    path: distDir,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.vue', '.js', '.ts', '.tsx']
  },
  optimization: {
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules.*\.js$/,
          name: 'vendor',
          chunks: 'all'
        },
        styles: {
          test: /\.(scss|css)/,
          name: 'styles',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          { loader: 'vue-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.ts|\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'awesome-typescript-loader',
            options : {
              reportFiles: [
                  'src/**/*.{ts,tsx}'
              ],
              appendTsSuffixTo: [/\.vue$/]
            },
          }
        ]
      },
      {
        test: /\.scss$/,
        use: scssStyles
      },
      {
        test: /\.css$/,
        use: cssStyles
      },
      {
        test: /\.pug$/,
        use: 'pug-html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title : 'LDD workshop',
      template: './public/index.html',
      filename: 'index.html'
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
}