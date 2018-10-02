// webpack.config.js
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const src = (...p) => path.join(__dirname, 'src', ...p);

const pug = {
    test: /\.pug$/,
    use: [
        'html-loader',
        {
            loader: 'pug-html-loader',
            options: {
                data: (() => JSON.parse(fs.readFileSync(src('templates', 'content', 'bbarker.json'))))()
            }
        }
    ]
};

const images = {
    test: /\.(jpe?g|png)$/i,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: 'images/[name].[ext]',
            }
        }, {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                // the webp option will enable WEBP
                webp: {
                    method: 6,
                    quality: 75
                }
            }
        }
    ]
}

const scss = {
    test: /\.(sass|scss)$/,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
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
        })
    ]
};

module.exports = config;