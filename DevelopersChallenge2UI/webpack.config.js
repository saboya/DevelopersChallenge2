const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, argv) => {
  const obj = {
    target: 'web',
    stats: {
      all: false,
      assets: true,
      env: true,
      errors: true,
      errorDetails: true,
    },
    entry: {
      app: ['./src/App.tsx'],
      vendor: ['react', 'react-dom'],
    },
    devServer: {
      host: '0.0.0.0',
      historyApiFallback: true,
      stats: {
        all: false,
        assets: true,
        env: true,
        entrypoints: true,
        excludeAssets: /.d.ts$/,
        errors: true,
        errorDetails: true,
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[hash].js',
      publicPath: '/',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: env === 'development',
            },
          },
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1,
                sourceMap: env === 'development',
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|otf|woff|woff2)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[hash].[ext]',
          },
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
            name: 'img/[hash].[ext]',
          },
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                disable: true,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({}),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        'NIBO_API_HOST': '//localhost',
        'NIBO_API_PORT': ':5000',
      }),
      new MiniCssExtractPlugin({
        filename: 'css/base.[hash].css',
      }),
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'template', 'index.html') }),
    ],
  }

  if (env === 'development') {
    obj.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (env === 'production') {
    obj.optimization.minimizer.push(new TerserPlugin({
      cache: true,
      parallel: true,
    }))
  }

  return obj
}
