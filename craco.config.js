// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoLessPlugin = require('craco-less')
module.exports = {
  webpack: {
    alias: {
      '@': resolve('src'),
      '@assets/*': resolve('src/assets/*'),
      '@utils': resolve('src/utils'),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
    },
  ],
  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://10.124.161.28:8085',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
