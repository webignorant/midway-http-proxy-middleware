## Midway HTTP Proxy Component

Encapsulate the use of 'http proxy middleware' and maintain consistent configuration.

Applicable to `@midwayjs/faas` 、`@midwayjs/web` 、`@midwayjs/koa` 、 `@midwayjs/express` multiple frameworks, support all HTTP proxy，for example GET、POST、PUT、DELETE request methods, support file upload and forwarding.

### Usage

1. Install dependencies

```bash
$ npm i midway-http-proxy-middleware --save
```

2. Introduce components in `configuration`,

configuration.ts
```ts
import * as proxy from 'midway-http-proxy-middleware';
@Configuration({
  imports: [
    // ...other components
    proxy
  ],
})
export class AutoConfiguration {}
```

### Configure components

config.default.ts
```ts
export const httpProxyMiddleware = {
  enable: true,
  strategys: {
    // example: If call 127.0.0.1:7001/api/ex, then proxy to http://127.0.0.1:8080, and rewrite /api as empty string.
    // value: Completely equivalent http-proxy-middleware options
    // ex: {
    //   target: 'http://127.0.0.1:8080',
    //   pathFilter: '/ex',
    //   pathRewrite: {
    //     '^/api': ''
    //   },
    //   changeOrigin: true,
    // }
  }
}
```
