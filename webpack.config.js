const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const JSBoxPlugin = require('jsbox-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  context: resolve('src'),
  entry: './scripts/main.js',
  output: {
    path: resolve(`dist/${require('./src/config.json').info.name}`),
    filename: './scripts/main.js',
    globalObject: 'global',
  },
  resolve: {
    symlinks: true,
  },
  plugins: [
    new CopyPlugin([
      { from: resolve('readme.md'), to: 'README.md' },
      { from: resolve('readme-en.md'), to: 'README_EN.md' },
      { from: 'main.js', to: 'main.js' },
      { from: 'config.json', to: 'config.json' },
      { from: 'strings', to: 'strings' },
      { from: 'assets', to: 'assets' },
    ]),
    new JSBoxPlugin({
      sync: !isProduction,
    }),
  ],
  mode: isProduction ? 'production' : 'none',
}
