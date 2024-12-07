## Midway HTTP 代理组件

HTTP 代理组件

封装`http-proxy-middleware`的使用, 配置保持一致。

适用于 `@midwayjs/faas` 、`@midwayjs/web` 、`@midwayjs/koa` 和 `@midwayjs/express` 多种框架的 HTTP 代理组件，支持GET、POST、PUT、DELETE等多种请求方法，支持文件上传转发。

### Usage

1. 安装依赖

```bash
$ npm i midway-http-proxy-middleware --save
```

2. 在 configuration 中引入组件

configuration.ts
```ts
import * as midwayHttpProxyMiddleware from 'midway-http-proxy-middleware';
@Configuration({
  imports: [
    // ...other components
    midwayHttpProxyMiddleware
  ],
})
export class AutoConfiguration {}
```

### 配置

config.default.ts
```ts
export const httpProxyMiddleware = {
  enable: true,
  // 转发策略
  // Key: 策略名称(没有实际用途, 仅用于描述)
  // Value: 与http-proxy-middleware@^3的Options保持完全一致
  strategys: {
    usr: {
      target: 'http://127.0.0.1:8010',
      pathFilter: '/usr',
      pathRewrite: {
        '^/usr': ''
      },
      changeOrigin: true,
    },
    res: {
      target: 'http://127.0.0.1:8080',
      pathFilter: '/res',
      pathRewrite: {
        '^/res': ''
      },
      changeOrigin: true,
    },
  }
}
```
