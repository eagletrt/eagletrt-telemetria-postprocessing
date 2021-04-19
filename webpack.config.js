const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const DtsBundleWebpack = require('dts-bundle-webpack');


const libConfig = {
    target: 'node',
    mode: 'production',
    // devtool: 'source-map',
    entry: {
        index: path.join(__dirname, 'source', 'lib', 'index.ts')
    },

    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                          compiler: 'ttypescript'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new DtsBundleWebpack({
            name: '@eagletrt/eagletrt-telemetria-postprocessing',
            main: 'dist/lib/index.d.ts',
            out: '../../bundled/lib/index.d.ts'
        }),
        new webpack.EnvironmentPlugin(['IS_WEBPACK'])
    ],
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'bundled', 'lib'),
        filename: 'index.js',
        library: '@eagletrt/eagletrt-telemetria-postprocessing',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
    }
};

const binConfig = {
    target: 'node',
    mode: 'production',
    // devtool: 'source-map',
    entry: {
        index: path.join(__dirname, 'source', 'bin', 'index.ts'),
    },

    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                          compiler: 'ttypescript'
                        }
                    },
                    {
                        loader: 'shebang-loader'
                    }
                ]
            }
        ]
    },
    externals: [{
        '@lib': {
            amd: '../lib/index.js',
            root: '@eagletrt/eagletrt-telemetria-postprocessing',
            commonjs: '../lib/index.js',
            commonjs2: '../lib/index.js'
        }
    }, nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'bundled', 'bin'),
        filename: 'index.js',
        library: '@eagletrt/eagletrt-telemetria-postprocessing',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
    }
};

module.exports = [
    libConfig,
    binConfig
];