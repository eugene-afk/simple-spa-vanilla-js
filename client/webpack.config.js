const path = require('path');

//declairing plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const fs = require('fs');

//setting environment
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

//setting filenames
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const assetFileName = () => isDev ? '[name][ext]' : '[name].[contenthash][ext]';

//basic optimizations
const optimization = () => {
    const cfgObj = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if(isProd){
        cfgObj.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }

    return cfgObj;
}

//creating HTMLWebpackPlugin for range of html files
const generateHtmlPlugins = (templateDir) => {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
    return templateFiles.map(item => {
      const parts = item.split('.')
      const name = parts[0]
      const extension = parts[1]
      return new HTMLWebpackPlugin({
        filename: `assets/templates/${name}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        minify: {
            collapseWhitespace: isProd
        }
      })

    })
  }
const htmlPlugins = generateHtmlPlugins('src/assets/templates');

//creating base plugins exemplars
const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
            
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        }),
        new ImageminWebpWebpackPlugin({
            config: [{
                test: /\.(jpe?g|png)/,
                options: {
                  quality:  75
                }
              }],
              overrideExtension: true,
              detailedLogs: false,
              silent: false,
              strict: true
        }),
        new copyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'src/assets/favicon.ico'), to: path.resolve(__dirname, 'dist')},
                {from: path.resolve(__dirname, 'src/assets/scripts'), to: path.resolve(__dirname, 'dist/assets/scripts')},
                {from: path.resolve(__dirname, 'src/assets/language'), to: path.resolve(__dirname, 'dist/assets/language')},
                {from: path.resolve(__dirname, 'src/assets/data'), to: path.resolve(__dirname, 'dist/assets/data')},
                //img_src folder for images that not included in htmls or css directly
                {from: path.resolve(__dirname, 'src/img_src'), to: path.resolve(__dirname, 'dist/img')},
                {from: path.resolve(__dirname, 'src/assets/templates'), to: path.resolve(__dirname, 'dist/assets/templates')},
                // {from: path.resolve(__dirname, 'dist/img'), to: path.resolve(__dirname, 'src/img')},
            ]
        }),
        
        //removing .png and .jpg files from build after converted to .webp
        new RemovePlugin({
            after: {
                test: [
                    {
                        folder: 'dist/img',
                        method: (absoluteItemPath) => {
                            return new RegExp(/\.png$/, 'm', 'm').test(absoluteItemPath);
                        }
                    },
                    {
                        folder: 'dist/img',
                        method: (absoluteItemPath) => {
                            return new RegExp(/\.jpg$/, 'm', 'm').test(absoluteItemPath);
                        },
                        recursive: true
                    }
                ]
            }
        })
    ]
    //to include html files range
    //.concat(htmlPlugins);

    //images optimizations
    if(isProd){
        basePlugins.push(
            new ImageMinimizerPlugin({
                minimizerOptions: {
                  plugins: [
                    ['gifsicle', { interlaced: true }],
                    // ['jpegtran', { progressive: true }],
                    // ['jpegoptim', { progressive: true, max: 80 }],
                    // ['optipng', { optimizationLevel: 5 }],
                    [
                      'svgo',
                      {
                        plugins: [
                          {
                            removeViewBox: false,
                          },
                        ],
                      },
                    ],
                  ],
                },
            }),
        );
    }

    return basePlugins;
};

module.exports = {
    
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output:{
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    devServer: {
        publicPath: '/',
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        compress: true,
        hot: true,
        //default port is 8080
        // port: 5167,
        noInfo: true,
        overlay: true,
        //proxy to work with dedicated server backend
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                secure: false,
                changeOrigin: true
            }
          }
    },
    experiments: {
        topLevelAwait: true,
      },
      //disables warnings
      performance: {
        hints: false
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map', //adds source path for files in browser dev tool
    //loaders
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
            test: /\.css$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      //makes reloading without refresh page
                      hmr: isDev
                    },
                  },
                  'css-loader'
                ],
              },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: (resourcePath, context) =>{
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            }
                        }
                    },
                    'css-loader', 
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:[
                    'babel-loader'
                ]
            },
            {
                test: /\.(?:png|jpg|gif|jpeg|svg|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `./img/${assetFileName('[ext]')}`
                  },
            },
            {
                test: /\.(?:ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `./fonts/${assetFileName('[ext]')}`
                  },
            }
        ]
    }
};