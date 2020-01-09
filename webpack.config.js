const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV !== 'production'
const out = path.join(__dirname, isDev ? 'dist' : 'build')

const plugins = [
  new CompressionPlugin({
    filename: `${out}/js/bundle.gz[query]`,
    algorithm: 'gzip',
    test: /\.jsx?$/,
    threshold: 10240,
    minRatio: 0,
    deleteOriginalAssets: true
  }),
  new CopyPlugin([{
    from: 'src/assets/**/*',
    to: `${out}/[2]/[name].[ext]`,
    test: /.*(\/|\\)(.+)(\/|\\).+\..+$/
  }])
]

if (process.env.NODE_ENV === 'analyze') plugins.push(new BundleAnalyzerPlugin())

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: path.join(__dirname, 'src/scripts/index.js'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    path: out,
    filename: 'js/bundle.js'
  },
  optimization: {
    minimize: !isDev,
    minimizer: [new TerserPlugin({ sourceMap: isDev })]
  },
  devtool: isDev && 'inline-source-map',
  plugins,
  devServer: {
    contentBase: out,
    compress: true,
    hot: true,
    port: 3000
  }
}
