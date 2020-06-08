module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: 'http://localhost:8000/',
  },
  chainWebpack: config => {
    config.module.rule('pug')
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  }
}
