
var webpack = require('webpack');
var path = require('path');

module.exports = {
    /* webpack-dev-server를 콘솔이 아닌 자바스크립트로 실행 할 땐,
    HotReloadingModule 를 사용하기 위해선 dev-server 클라이언트와
    핫 모듈을 따로 entry 에 넣어주어야 합니다. */

    entry: [
        './src/index.js',
        'webpack-dev-server/client?http://0.0.0.0:4000', // 개발서버의 포트가 이 부분에 입력되어야 제대로 작동합니다
        'webpack/hot/only-dev-server',
        './src/style.css'
    ],

    output: {
        // path: __dirname + '/public/',
        path: '/', // public 말고 /에 두게 되면, 파일을 메모리에 저장하고 사용!
        filename: 'bundle.js'
    },

    // 개발 서버용 세팅
    devServer: {
        hot: true,
        filename: 'bundle.js',
        publicPath: '/',
        historyApiFallback: true,
        contentBase: './public',
        /* 모든 요청을 프록시로 돌려서 express의 응답을 받아오며,
        bundle 파일의 경우엔 우선권을 가져서 devserver 의 스크립트를 사용하게 됩니다 */
        proxy: {
            "**": "http://localhost:3000"
        },
        // inline: true,
        // host: '0.0.0.0',
        // port: 4000,
        // contentBase: __dirname + '/public/',

        stats: {
            // 콘솔 로그를 최소화 합니다
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }

    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/
            },
            { // CSS 로더 적용
                test: /\.css$/,
                loader: 'style!css-loader'
            }
        ]
    },

    // Resolve 설정을 주면, ../나 ./로 접근을 하지 않아도 된다!
    resolve: {
        root: path.resolve('./src')
    }

};
