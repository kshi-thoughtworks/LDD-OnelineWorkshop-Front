module.exports = {
  presets: [
    [ '@babel/preset-env', { modules: false } ],
    'vue',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'babel-plugin-transform-vue-jsx',
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      presets: [],
    }
  }
}