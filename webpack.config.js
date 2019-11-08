const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  context: resolve('src'),
  entry: './scripts/main.js',
  output: {
    path: resolve(`dist/${require('./src/config.json').info.name}`),
    filename: './scripts/main.js',
    publicPath: '/',
    globalObject: 'global',
  },
  resolve: {
    symlinks: true,
  },
  plugins: [
    new CopyPlugin([
      { from: resolve('readme.md'), to: 'README.md' },
      { from: 'main.js', to: 'main.js' },
      { from: 'config.json', to: 'config.json' },
      { from: 'strings', to: 'strings' },
      { from: 'assets', to: 'assets' },
    ]),
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'none',
}
