import { Util } from './../util/util';
import { ErrorConfig } from './../../shared/config/error.config';
import { Article } from './../../pages/article/article.model';
import { Base64Util } from './../util/base64.util';
import { ServerUser } from './../model/server-user.model';
import { HttpResult } from './../model/http-result.model';
import { RxService } from './rx.service';
import { Observable } from 'rxjs/Observable';
import { AutoWired, Inject, Type, Singleton } from "../../lib/ioc/index"
import { LoggerService } from "./logger.service"
import { Subscriber } from "rxjs/Subscriber"
import { UserService } from "./user.service"
import { ModalService } from './modal.service';
/**
 * 与服务器数据交互服务，主要封装了RxJs
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-9
 */
@AutoWired
@Singleton
export class HttpService {
    @Inject
    @Type(LoggerService)
    private logger: LoggerService;

    private auth: string;



    /**
     * 向服务器请求数据
     */
    fetch<T>(url: string, method: string, data?: Object): Observable<HttpResult<T>> {
        return RxService.makeObservable((subscriber: Subscriber<HttpResult<T>>) => {
            wx.request({
                url: url,
                method: method,
                data: data,
                header: {
                    'Authorization': this.getAuth()
                },
                success: (res) => {
                    let serverData: HttpResult<T> = res.data;
                    subscriber.next(serverData);
                },
                fail: () => {
                    ModalService.showNetWorkFailedModal();
                    subscriber.error(ErrorConfig.fetchFailed);
                },
                complete: () => {
                    subscriber.complete();
                }
            })
        })
    }

    /**
     * post请求数据
     * 
     * @template T
     * @param {string} url   路由
     * @param {Object} [data] 数据
     * @returns {Observable<HttpResult<T>>}
     * 
     * @memberOf HttpService
     */
    post<T>(url: string, data?: Object): Observable<HttpResult<T>> {
        if (data == undefined) {
            data = "";
        }
        return this.fetch<T>(url, 'POST', data);
    }

    /**
     * get方式请求数据
     * 
     * @template T
     * @param {string} url   路由
     * @param {Object} [data] 数据
     * @returns {Observable<HttpResult<T>>}
     * 
     * @memberOf HttpService
     */
    get<T>(url: string, data?: Object): Observable<HttpResult<T>> {
        return this.fetch<T>(url, 'GET', data);
    }


    /**
     * 返回数据不是httpresult格式的
     * 
     * @param {string} url 
     * @returns {Observable<string>} 
     * 
     * @memberOf HttpService
     */
    fetchOrigin(url: string, method: string = "GET"): Observable<string> {
        return RxService.makeObservable((subscriber: Subscriber<string>) => {
            wx.request({
                url: url,
                method: method,
                success: (res: any) => {
                    if (+res.statusCode != 200) {
                        subscriber.error(ErrorConfig.fetchFailed)
                    }
                    subscriber.next(res.data);
                },
                fail: () => {
                    ModalService.showNetWorkFailedModal();
                    subscriber.error(ErrorConfig.fetchFailed);
                },
                complete: () => {
                    subscriber.complete();
                }
            })
        })
    }

    /**
     * 获取auth
     */
    private getAuth(): string {
        return this.auth;
    }

    /**
     * 设置返回的token，小程序无法使用btoa函数
     * 
     * @param {ServerUser} user
     * 
     * @memberOf HttpService
     */
    setAuth(user: ServerUser): void {
        if (!user.userName.startsWith("UserToken_")) {
            user.userName = "UserToken_" + user.userName;
        }
        this.auth = "Basic " + Base64Util.base64Encode(user.userName + ":" + user.userToken);
    }

    reset(): void {
        this.auth = "";
    }

    /**
 * 给请求数据加锁，限制重复提交
 * 
 * @static
 * @param {*} page 
 * @returns {boolean} 
 * 
 * @memberOf FormWidget
 */
    lockFetch(page: any, lockName: string = "__isSubmiting"): boolean {
        let lock: FetchLock = page[lockName];
        let shouldLock: boolean = false;
        if (Util.isNullOrUndefined(lock)) {
            lock = page[lockName] = new FetchLock();
            lock.isLocked = true;
        } else {
            shouldLock = lock.isLocked;
        }
        this.logger.log("shouldLock：" + lockName, shouldLock)
        return shouldLock;
    }




    /**
     * 解除限制，应该在网络返回的时候调用
     * 
     * @static
     * @param {*} page 
     * 
     * @memberOf FormWidget
     */
    unlockFetch(page: any, lockName: string = "__isSubmiting"): void {
        let lock: FetchLock = page[lockName];
        if (Util.isNullOrUndefined(lock)) {
            this.logger.error("未添加fetch锁" + lockName);
        } else {
            lock.isLocked = false;
            lock.clearLockHandler();
        }

    }

    /**
     * 超时解锁，应该用于限制用户重复刷新等等
     * 
     * @param {*} page 
     * @param {number} ms 
     * @param {string} [lockName="__isSubmiting"] 
     * 
     * @memberOf HttpService
     */
    unlockFetchByTime(page: any, ms: number, lockName: string = "__isSubmiting"): void {
        if (Util.isNullOrUndefined(page[lockName])) {
            this.logger.error("未添加fetch锁" + lockName);
        } else {
            let lock: FetchLock = page[lockName];
            lock.isLocked = true;
            if (!Util.isNullOrUndefined(lock.lockHandler)) {
                this.logger.error("锁" + lockName + "并没有到时间，请勿重新设置超时");
                lock.clearLockHandler();
            }
            lock.lockHandler = setTimeout(() => {
                lock.isLocked = false;
                lock.clearLockHandler();
            }, ms)

        }
    }
}

class FetchLock {
    isLocked: boolean = true;
    lockHandler: any;
    clearLockHandler(): void {
        try {
            clearTimeout(this.lockHandler);
        } catch (e) {
        }
        this.lockHandler = null;
    }
}
