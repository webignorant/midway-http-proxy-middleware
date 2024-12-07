import {
  Config,
  Logger,
  Middleware,
  IMiddleware,
  IMidwayLogger,
  IMidwayApplication,
} from '@midwayjs/core';
import { HttpProxyConfig, HttpProxyStrategy } from './interface';
import koaConnect = require('koa-connect');
import { createProxyMiddleware, Options as HttpProxyOptions } from 'http-proxy-middleware';
import { matchPathFilter } from 'http-proxy-middleware/dist/path-filter';

@Middleware()
export class HttpProxyMiddleware implements IMiddleware<any, any> {
  static getName() {
    return 'midway-http-proxy-middleware';
  }

  @Config('httpProxyMiddleware')
  httpProxyMiddlewareConfig: HttpProxyConfig;

  @Logger()
  logger: IMidwayLogger;

  resolve(app: IMidwayApplication) {
    if (app.getNamespace() === 'express') {
      return async (req: any, res: any, next: any) => {
        return this.execProxy(req, req, res, next, false);
      };
    } else {
      const isServerless = app.getNamespace() === 'faas';
      return async (ctx, next) => {
        const req = ctx.request?.req || ctx.request;
        return this.execProxy(ctx, req, ctx, next, isServerless);
      };
    }
  }

  async execProxy(ctx, req, _res, next, _isServerless) {
    // Prioritize finding suitable strategies
    // Avoid create multiple middleware[http-proxy-middleware], repeatedly checked matchPathFilter by middleware
    // Same as early execution middleware[http-proxy-middleware] shouldProxy logic
    const strategyInfo = this.getStrategyByUrl(ctx.url, req);
    if (!strategyInfo) {
      return next();
    }

    const proxyOptions: HttpProxyOptions = {
      ...strategyInfo,
      on: {
        proxyReq(proxyReq) { // , req, res
          const requestBody = ctx.request.body;
          const rawBody = ctx.request.rawBody;
          if (requestBody && rawBody) {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(rawBody));
            proxyReq.write(rawBody);
            proxyReq.end();
          }
          return proxyReq;
        },
        // proxyRes(proxyRes, req, res) {
        //   /* handle proxyRes */
        // },
        // error: (err, req, res) => {
        //   /* handle error */
        // },
      },
    };

    // Use koaConnect, enable the Koa framework to support the use of express middleware
    await koaConnect(createProxyMiddleware(proxyOptions))(ctx, next);
  }

  getStrategyByUrl(url, req): undefined | HttpProxyStrategy {
    if (!this.httpProxyMiddlewareConfig) {
      return;
    }

    const proxyStrategys = this.httpProxyMiddlewareConfig.strategys;
    let theProxyStrategy;

    for (const strategyKey of Object.keys(proxyStrategys)) {
      const proxyStrategy = proxyStrategys[strategyKey];

      let needMatch = true;

      // use middleware[http-proxy-middleware] ability provided,
      // call the matchPathFilter logic
      // if req.url match, then return theProxyStrategy
      // else not match, then return undefined
      try {
        const matchPath = matchPathFilter(proxyStrategy.pathFilter, url, req);
        if (!matchPath) {
          needMatch = false;
        }
      } catch (error) {
        this.logger.debug('continue this proxyStrategy', error?.message || '');
        needMatch = false;
      }

      if (!needMatch) {
        continue;
      }

      theProxyStrategy = proxyStrategy;
      break;
    }

    return theProxyStrategy;
  }
}
