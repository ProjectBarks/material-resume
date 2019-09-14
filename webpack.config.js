const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminWebpWebpackPlugin= require('imagemin-webp-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const src = (...p) => path.join(__dirname, 'src', ...p);
const build = (...p) => path.join(__dirname, 'build', ...p);

const isProduction = true;

const pug = {
    test: /\.pug$/,
    use: [
        'html-loader',
        {
            loader: 'pug-html-loader',
            options: {
                data: src('templates', 'content', 'bbarker.json')
            }
        }
    ]
};

const images = {
    test: /\.(jpe?g|png)$/i,
    use: [
        {
            loader: 'file-loader',
            options: { name: 'images/[name].[ext]' }
        }, {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {

                }
            }
        }
    ]
}

const scss = {
    test: /\.(sass|scss)$/,
    use: [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        {
            loader: 'css-loader',
            options: { minimize: isProduction }
        },
        'sass-loader'
    ]
};

const fonts = {
    test: /\.(woff2?|ttf|otf|eot|svg)$/,
    loader: 'file-loader',
    options: {
        name: 'fonts/[name].[ext]'
    }
};

const config = {
    entry: src('js', 'index.js'),
    output: { path: path.resolve(__dirname, 'build') },
    resolveLoader: {
        alias: {
            'pug-html-loader': path.join(__dirname, './webpack-pug-html-loader.js')
        }
    },
    devServer: {
        watchContentBase: true
    },
    module: { rules: [ pug, images, scss, fonts ] },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: src('templates', 'index.pug'),
            inject: true
        }),
        new PurgecssPlugin({
            paths: glob.sync(src('**', '*'), { nodir: true }),
            whitelist: [ 'animate-out', 'animate', 'mini' ]
        }), 
        /*new ImageminWebpWebpackPlugin({
            config: [{
                test: /\.(jpe?g|png)$/,
                options: { method: 6 }
            }],
            detailedLogs: true
        }),*/
        new CopyWebpackPlugin([
            {
                from: src('assets', 'downloads'),
                to: build('downloads')
            },
            {
                from: src('CNAME'),
                to: build()
            }
        ]),
        new WebpackPwaManifest({
            filename: 'manifest.json',
            name: 'Brandon Barker Resume',
            short_name: 'BB Resume',
            theme_color: '#2196f3',
            background_color: '#008eff',
            display: 'browser',
            orientation: 'portrait',
            scope: '/', 
            start_url: '/',
            icons: [
                {
                    src: src('assets', 'favicon.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join('images', 'icons')
                }
            ]
        }),
        new FaviconsWebpackPlugin({
            logo: src('assets', 'favicon.png'),
            prefix: 'images/favicons/'
        })
    ]
};

module.exports = config;