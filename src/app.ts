import { RxService } from './core/service/rx.service';
import { ErrorConfig } from './shared/config/error.config';
import './lib/patch/rx.fix';


import { RxWxApi } from './core/service/rx-wx.api';

import { SystemService } from './core/service/index';
import { ServerRoute } from './shared/config/index';
import { AutoWired, Inject, Type, ParamTypes } from "./lib/ioc/index"
import { LoggerService } from "./core/service/index"
import { UserService, HttpService } from "./core/service/index"
import "./rxjs.operator"

@AutoWired
class WxApp implements IApp {

    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    @Inject
    @Type(UserService)
    userService: UserService



    @Inject
    @Type(SystemService)
    systemService: SystemService;

    @Inject
    @Type(HttpService)
    http: HttpService;


    /**
     * 初始化
     *  1.设备信息
     *  2.用户初始化[登录到服务器获取token]
     */
    public onLaunch(): void {
        this.systemService.init();
        this.userService.init();
    }

};

App(new WxApp());