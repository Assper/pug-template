const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const getPugTemplates = (cb) => {
  const pages_dir = path.join(PATHS.src, 'templates/pug/pages')
  if (!fs.existsSync(pages_dir)) return []

  const pages = fs.readdirSync(pages_dir).filter(fileName => fileName.endsWith('.pug'))
  return pages.map((page) => cb({
    template: path.join(pages_dir, page),
    filename: page.replace(/\.pug$/, '.html')
  }))
}

const getHtmlTemplates = (cb) => {
  const pages_dir = path.join(PATHS.src, 'templates/html/pages')
  if (!fs.existsSync(pages_dir)) return []

  const pages = fs.readdirSync(pages_dir).filter(fileName => fileName.endsWith('.html'))
  return pages.map((page) => cb({
    template: path.join(pages_dir, page),
    filename: page
  }))
}

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/assets/**/*',
        to: PATHS.dist,
        transformPath: (target, absolute) => {
          const src = '/src'
          const index = absolute.indexOf(src)
          const dest = absolute.slice(index + src.length)
          return path.resolve(dest)
        },
        noErrorOnMissing: true
      }]
    }),
    ...getPugTemplates(options => new HtmlWebpackPlugin(options)),
    ...getHtmlTemplates(options => new HtmlWebpackPlugin(options))
  ],
}
