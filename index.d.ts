import { HttpProxyConfig } from './dist/index';
export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    httpProxyMiddleware?: Partial<HttpProxyConfig>;
  }
}
