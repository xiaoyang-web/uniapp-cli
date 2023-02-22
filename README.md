## uniapp-cli

### 前言

开发新项目时，往往都需要一个可以开箱即用的基础脚手架，为了避免重新开始搭建而浪费时间，遂记录下从零开始搭建基础脚手架，将来重新搭建脚手架时也可以进行参考。

#### 技术栈

-   <input type="checkbox" checked> 使用 Vue3 + Typescript 进行开发 </input>
-   <input type="checkbox" checked> 构建工具使用 Vite </input>
-   <input type="checkbox" checked> 使用 Pinia 存储库存储全局状态 </input>
-   <input type="checkbox" checked> 使用 Scss 编写样式 </input>
-   <input type="checkbox" checked> 集成 Eslint + Prettier 来规范和格式化代码 </input>
-   <input type="checkbox" checked> 集成 Husky + Commitlint 来规范 git 提交信息 </input>
-   <input type="checkbox" checked> 开发与正式环境区分 </input>
-   <input type="checkbox" checked> 网络请求封装 </input>

#### 项目整体目录

```markdown
├── dist/                   // 打包文件的目录
├── env/                    // 环境配置目录
|   ├── .env.development    // 开发环境配置
|   ├── .env.production     // 生产环境配置
├── src/                    // 应用资源文件夹
|   ├── components/         // 自定义组件
|   ├── pages/              // 页面
|   ├── store/              // 全局状态文件夹
|   |   ├── index.ts        // store 配置文件
|   |   └── modules         // 模块文件夹
|   |       └── system.ts   // 对应业务模块
|   ├── styles/             // 样式文件
|   ├── App.vue             // 应用配置，用来配置App全局样式以及监听应用生命周期
|   ├── env.d.ts            // 类型声明文件
|   ├── main.ts             // Vue初始化入口文件
|   ├── manifest.json       // 配置应用名称、appid、logo、版本等打包信息
|   ├── pages.json          // 配置页面路由、导航条、选项卡等页面类信息 
|   └── uni.scss            // 这里是uni-app内置的常用样式变量
├── .commitlintrc.js        // commitlint配置文件
├── .eslintignore           // eslint忽略文件
├── .eslintrc.js            // eslint配置文件
├── .gitignore              // git忽略文件
├── .prettierrc             // prettier配置文件
├── index.html              // html模板
├── package.json            // 配置文件
├── README.md               // 项目介绍文档
├── tsconfig.json           // ts配置文件
├── vite.config.ts          // vite配置文件
└── yarn.lock               // 记录依赖包版本文件

```

### 生成基本框架

使用官方提供 `Vue3/Vite` 版本的模板来生成我们的基础项目。

```cmd
npx degit dcloudio/uni-preset-vue#vite-ts uniapp-cli
```

或者直接从 [gitee](https://gitee.com/dcloud/uni-preset-vue/repository/archive/vite-ts.zip) 上下载。

### 做一些简单的配置

对生成的基础框架添加一些自定义的配置。

1. 规范目录结构
2. 配置别名简化路径写法
3. 配置代理解决开发环境跨域的问题
4. 打包调整生成规范的文件

修改 vite.config.ts 文件

```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    resolve: {
        // 配置别名
        alias: [
          {
            find: '@',
            replacement: resolve(__dirname, 'src')
          }
        ]
    },
    css: {
        // css预处理器
        preprocessorOptions: {
            scss: {
                // 因为uni.scss可以全局使用，这里根据自己的需求调整
                additionalData: '@import "./src/styles/global.scss";'
            }
        }
    },
    // 开发服务器配置
    server: {
        host: '0.0.0.0',
        port: 8080,
        // 请求代理
        proxy: {
            '/api': {
                target: 'https://xxx.com/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        // 禁用 gzip 压缩大小报告，以提升构建性能
        reportCompressedSize: false,
        /** 配置h5打包js,css,img分别在不同文件夹start */
        assetsDir: 'static/img/',
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
            }
        }
        /** 配置h5打包js,css,img分别在不同文件夹end */
    }
})
```

在 `tsconfig.json` 中添加配置，使编辑器可以识别我们的别名。

```tson
{
    "baseUrl": "./",
    "paths": {
        "@/*": ["src/*"]
    }
}
```

最后使用 `yarn` 安装依赖，然后运行到 H5 看看是否成功。

```cmd
# 安装依赖
yarn

# 运行
yarn dev:h5
```

### 配置 pinia

首先安装 pinia，然后需要新建一个 `src/store` 文件夹来管理应用的状态。

```cmd
yarn add pinia
```

```
└── src/
    ├── store/
        ├── index.ts  // store 配置文件
        ├── modules
            ├── counter.ts // 这里写一个示例
```

首先在配置文件中来实例化 store

`src/store/index.ts`

```ts
import { createPinia } from 'pinia';

const store = createPinia();

export default store;
```

在 `main.ts` 文件中挂载 pinia

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from './store';

export function createApp() {
    const app = createSSRApp(App);
    app.use(store);
    return {
        app
    }
}
```

最后使用 pinia

```ts
import { useCounterStore } from './store/modules/counter';

const counterStore = useCounterStore();
console.log(counterStore.count);
```

### 集成 eslint

安装 `eslint`

```
yarn add eslint -D
```

生成 `eslint` 配置文件

```
npx eslint --init
```

-   How would you like to use ESLint? （你想如何使用 ESLint?）

```我们这里选择 To check syntax, find problems, and enforce code style（检查语法、发现问题并强制执行代码风格）```

-   What type of modules does your project use?（你的项目使用哪种类型的模块?）

```我们这里选择 JavaScript modules (import/export)```

-   Which framework does your project use? （你的项目使用哪种框架?）
    
```我们这里选择 Vue.js```

-   Does your project use TypeScript?（你的项目是否使用 TypeScript？）

```我们这里选择 Yes```

-   Where does your code run?（你的代码在哪里运行?）

```我们这里选择 Browser 和 Node（按空格键进行选择，选完按回车键确定）```

-   How would you like to define a style for your project?（你想怎样为你的项目定义风格？）

```我们这里选择 Use a popular style guide（使用一种流行的风格指南）```

-   Which style guide do you want to follow?（你想遵循哪一种风格指南?）

```我们这里选择 Standard```

-   What format do you want your config file to be in?（你希望你的配置文件是什么格式?）

```我们这里选择 JavaScript```

-   Would you like to install them now?（你想现在安装它们吗?）

```我们这里选择 Yes，选择对应包管理工具安装。```

修改`.eslintrc.js`文件

```
// 增加uni的声明
globals: {
    /** 避免uni报错 */
    uni: true,
    UniApp: true
},
```

增加 eslint 忽略文件 `.eslintignore`

```
index.html
*.d.ts
```

### 集成 prettier

我们使用 prettier 来搭配 eslint 和 stylelint 使用。

安装依赖

```sh
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

根目录下添加 prettier 的配置文件 `.prettierrc.js`

```javascript
module.exports = {
  trailingComma: 'none',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  endOfLine: 'auto'
}
```

修改 `.eslintrc.js` 来解决与 eslint 的冲突

```
extends: [
    // ...
    'plugin:prettier/recommended' // 一定要放在最后一项
]
```

### 配置 husky

```sh
# 安装依赖
yarn add husky -D

# 启用git钩子
npx husky install

# 在package.json中创建脚本
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### 配置 commitlint 规范提交信息

```sh
# 安装依赖
yarn add @commitlint/config-conventional @commitlint/cli -D
```

根目录下添加 commitlint 的配置文件 `.commitlintrc.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'feat', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        'merge' // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
      ]
    ]
  }
};
```

配置husky，添加钩子

```sh
npx husky add .husky/commit-msg 'npx --no-install commitlint -e $HUSKY_GIT_PARAMS'
```

### lint-staged 配置

```sh
# 安装依赖
yarn add lint-staged -D
```

配置package.json

```
"lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": "eslint --fix"
}
```

配置husky，添加钩子

```sh
npx husky add .husky/pre-commit 'npx lint-staged'
```

完成以上步骤，就可以愉快的敲代码了。

### 环境区分

实现功能：

-   可以直接区分开发环境和生产环境
-   自定义环境变量增加 typescript 提示

在根目录下新建 env 文件夹用来存放环境变量配置文件，同时修改 vite 配置（环境变量的根目录）。

> 因为 vite 默认是将项目根目录作为环境变量配置的目录，所以我们需要修改下 vite 的配置指向 env 文件夹

修改 `vite.config.js`

```ts
export default defineConfig({
    envDir: resolve(__dirname, 'env')
})
```

同时新增 env 文件夹

```
├── env/
    ├── .env.development        // 开发环境
    ├── .env.production         // 生产环境
    ├── index.d.ts              // 声明文件
```

需要检查下 `tsconfig.json` 文件是否包含了 `env/index.d.ts`，如果没有需要我们添加一下。

```
"include": ["env/index.d.ts"]
```

编辑 `env/index.d.ts` 文件增加自定义变量的声明

```ts
/** 扩展环境变量import.meta.env */
interface ImportMetaEnv {
    /** 这里增加自定义的声明 */
    VITE_REQUEST_BASE_URL: string
}
```

### 封装 `uni-request` 请求

实现功能：

-   统一配置接口地址
-   统一设置超时时间/报文格式/报文加密
-   统一身份认证
-   统一处理登录超时/接口异常提示
-   统一返回接口格式

详细代码请自行查看 `src/utils/request/index.ts` 。


