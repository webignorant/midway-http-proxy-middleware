import { Options as ContextOptions } from 'http-proxy-middleware';

export interface HttpProxyStrategy extends ContextOptions {
  // [key: string]: any;
  // match?: RegExp;
  // host?: string;
  // target?: string;
  // proxyTimeout?: number;
  // ignoreHeaders?: {
  //   [key: string]: boolean;
  // },
  // pathRewrite?: Record<string, string>,
  // changeOrigin?: boolean,
  // {
  //   [rewriteRule: string]: string;
  // },
}

export interface HttpProxyConfig extends HttpProxyStrategy {
  enable?: boolean;
  // default?: HttpProxyPlusStrategy;
  strategys?: {
    [strategyName: string]: HttpProxyStrategy;
  }
}
