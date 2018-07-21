
// Resolve 설정을 주면, ../나 ./로 접근을 하지 않아도 된다!
var path = require('path');


module.exports = {

    //entry: './src/index.js',
    // 엔트리에 스타일 파일 추가
    entry: [
        './src/index.js',
        './src/style.css'
    ],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

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
