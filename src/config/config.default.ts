import { HttpProxyConfig } from '..';

export const httpProxyMiddleware: HttpProxyConfig = {
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
};
