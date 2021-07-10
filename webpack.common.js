const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: {
        // Global JS
        global: './src/global.js',
        // Page-specific JS
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        // Use absolute paths for assets
        publicPath: '/',
    },
    module: {
        rules: [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images/',
                        context: 'src/assets',
                    }
                }]
            },

            // Media
            {
                test: /\.(mp3|mp4|wav)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/medias/',
                        context: 'src/assets',
                    }
                }]
            },

            // Models
            {
                test: /\.(glb|gltf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/models/',
                        context: 'src/assets',
                    }
                }]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        // Clean dist/ on each build
        new CleanWebpackPlugin(['dist']),
        // Add HtmlWebpackPlugin entries to build individual HTML pages
        new HtmlWebpackPlugin({
            tite: 'Production',
            // Input path
            template: 'src/index.html',
            // Output (within dist/)
            filename: 'index.html',
            // Inject compiled JS into <head> (as per A-Frame docs)
            inject: 'head',
            // Specify which JS files, by key in `entry`, should be injected into the page
            chunks: ['global', 'index'],
        }),
    ],
    // Settings for webpack-dev-server
    devServer: {
        clientLogLevel: 'info',
        open: true,
    },
};