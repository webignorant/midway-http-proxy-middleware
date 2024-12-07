import {
  Config,
  Configuration,
  Inject,
  MidwayApplicationManager,
} from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';
import { HttpProxyMiddleware } from './middleware';
import { HttpProxyConfig } from './interface';

@Configuration({
  namespace: 'http-proxy-middleware',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class HttpProxyConfiguration {
  @Inject()
  applicationManager: MidwayApplicationManager;

  @Config('httpProxyMiddleware')
  httpProxyConfig: Partial<HttpProxyConfig>;

  async onReady() {
    if (this.httpProxyConfig.enable) {
      this.applicationManager
        .getApplications(['koa', 'faas', 'express', 'egg'])
        .forEach(app => {
          app.useMiddleware(HttpProxyMiddleware);
        });
    }
  }
}
