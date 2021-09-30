// 配置文档地址
// https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE

const CopyWebpackPlugin = require('copy-webpack-plugin')
// const appInfo = require('./package.json')
const path = require('path')

const pages = {}

const chromeName = ['popup', 'background', 'options', 'content', 'index']

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/pages/${name}/main.js`,
    template: 'public/index.html',
    filename: `${name}.html`,
    title: '读书人'
  }
})

module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      CopyWebpackPlugin([
        {
          from: path.resolve('manifest.json'),
          to: `${path.resolve('dist')}/manifest.json`
        }
      ])
    ]
  }
}
