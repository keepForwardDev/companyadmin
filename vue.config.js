const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}
const indexpath = 'E:\\TaskWorkSpace\\companyproject\\src\\main\\resources\\templates\\admin\\index.html'
const outputpath = 'E:\\TaskWorkSpace\\companyproject\\src\\main\\resources\\static\\pc\\admin'
const assetsPath = ''
// 项目部署基础 vue cli 3.0
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/pc/admin'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  outputDir: outputpath, // vue-cli-service build 默认清理该文件夹    构建时传入 --no-clean 可关闭该行为)
  indexPath: indexpath,
  assetsDir: assetsPath, // 静态文件路径
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,// 构建时开启多进程处理 babel 编译
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    open: true,
    host: 'localhost',
    port: 9527,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    before: app => {

    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'views': '@/views',
        '@': resolve('src')
      }
    }
  }
}
