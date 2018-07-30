# ES6 테스트 프로젝트

## About

##### ON2UP 내부 프로젝트를 위한 래퍼런스 코드입니다.

**React 기본 작업 환경**
- babel 을 통한 ES6 변환
- webpack-dev-server 사용
- react-hot-loader 를 통한 Hot Module Reload 사용

React CodeLab 에서 작업환경 설정을 할 때 사용 된 코드 입니다.

## 설치하기

```sh
npm install -g webpack webpack-dev-server
npm install
```

## 실행하기

```sh
npm run start			//for normal mode
npm run developer		//for dev. mode

npm run build			//build bundle
npm run clear			//remove bundle
```

서버는 포트 3000 (dev. 4000) 으로 실행됩니다.
변경은 webpack.config.js 에서 할 수 있습니다.
