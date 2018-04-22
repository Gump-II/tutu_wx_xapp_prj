import { Util } from './../util/util';
import { environment } from './../../shared/config/env.config';
import { WxStorage, WxStorageExt } from './../model/storage.model';
import { RxWxApi } from './rx-wx.api';
import { CacheConfig } from './../../shared/config/cache.cofig';
import { ServerUser } from './../model/server-user.model';
import { RxService } from './rx.service';
import { ServerRoute } from './../../shared/config/server.route';
import { HttpService } from './http.service';
import { AutoWired, Singleton, Inject, Type, ParamTypes } from "../../lib/ioc/index"
import { Observable } from "rxjs/Observable"
import { Subscriber } from "rxjs/Subscriber"
import { ErrorConfig } from "../../shared/config/index"
import { LoggerService } from "../../core/service/logger.service"
import { ModalService } from './modal.service';
/**
 * 用户相关服务，微信登陆，用户数据等等
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-9
 */
@AutoWired
@Singleton
@ParamTypes(LoggerService)
export class UserService {

    @Inject
    @Type(HttpService)
    http: HttpService;

    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    // constructor(private logger:LoggerService){

    // }

    /**
     * 获取服务器用户信息
     * 
     * @returns {Observable<ServerUser>}
     * 
     * @memberOf UserService
     */
    getServerUserInfo(): Observable<ServerUser> {

        return this.getServerUserInfoFromCache().switchMap(user => {
            //从服务器更新用户信息
            if (Util.isNullOrUndefined(user)) {
                return this.getServerUserFromServer().do(updatedUser => {
                    RxWxApi.setCache(CacheConfig.userServer, updatedUser, { expire: ServerUser.secToMs(updatedUser.expire) }).subscribe(isOk => {
                        this.logger.log("缓存来自服务器的用户信息", isOk);
                    })
                });
                //返回缓存的用户信息
            } else {
                return Observable.from([user]);
            }
        })
    }


    /**
     * 获取用户信息，用于访问服务器资源等等
     */
    private getServerUserFromServer(): Observable<ServerUser> {
        //调试专用
        if (environment.debug) {
            return RxService.makeObservable((subscriber: Subscriber<ServerUser>) => {
                subscriber.next(ServerUser.debugData);
            });
        }

        //正常
        return RxWxApi.login().switchMap((result: wx.LoginResult) => {
            return this.http.get<ServerUser>(ServerRoute.loginByWxCode, { code: result.code })
        }).map(RxService.httpSignalDataMap);
    }


    /**
     * 从缓存中获取用户信息
     */
    private getServerUserInfoFromCache(): Observable<ServerUser> {
        return RxWxApi.getCache(CacheConfig.userServer);
    }

    init(): Observable<boolean> {
        return this.getServerUserInfo().map(user => {
            this.http.setAuth(user);
            return !Util.isNullOrUndefined(user);
        })
    }

    /**
     * 清空用户缓存
     * 
     * @returns {Observable<boolean>} 
     * 
     * @memberOf UserService
     */
    reset(): Observable<boolean> {
        return RxWxApi.removeCache(CacheConfig.userServer).map(isOk => {
            this.http.reset();
            return isOk;
        });
    }

}

