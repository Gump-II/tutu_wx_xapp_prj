import { Subscriber } from './../../../node_modules/rxjs/src/Subscriber';
import './../../lib/patch/rx.fix';

import { HttpCode } from './../../shared/config/http-code.config';
import { HttpResult } from './../model/http-result.model';
import { Observable } from 'rxjs/Observable';
import { AutoWired, Container, Singleton, Provided, Provider } from "../../lib/ioc/index"

/**
 * 响应式服务封装
 * fixme timeout 无效
 * 
 * @author: ychost<c.yang@aiesst.com>
 * @date  : 2017-2-10
 */
export class RxService {

    // 成功码
    static readonly REP_SUCC_CODE: number = 0;
    // 用户已经存在
    static readonly REP_USER_ALREADY_EXISTED_CODE = 4;

    //默认超时时间20000 毫秒
    static readonly defaultTimeout = 20000;

    /**
     * 创建一个Observable，并设置默认超时
     * @param observer
     * @returns {any}
     */
    static makeObservable<T>(subscriber: Function): Observable<T> {
        return Observable.create(subscriber);
    }

    /**
     * 对服务器返回的数据进行转换，将错误进行统一拦截
     * todo 不知道为什么不能用 LoggerService
     * @param res  服务器响应数据
     * @returns {Array<T>}  有效的数据
     */
    static httpMultiDataMap<T>(res): Array<T> {
        let serverData: HttpResult<T> = res;

        let result: HttpResult<T> = res.data;
        let data: Array<T> = result.data;
        let msg: string = result.resultMsg;
        let code: number = result.resultCode;
        if (code != HttpCode.ok) {
            throw new Error("服务器返回错误代码：[" + code + "]====错误消息：[" + msg + "]");
        }
        return data;
    }

    static httpResultMap<T>(res): HttpResult<T> {
        return res;
    }


    /**
     * 服务器返回有效数据只有一个的情况，不知道为什么在里面不能调用
     * TODO this.httpMultiDataMap 会报错，所以暂时复制过来了
     * @param res
     * @returns {T}
     */
    static httpSignalDataMap<T>(res: HttpResult<T>): T {
        let result: HttpResult<T> = res;
        let data: Array<T> = result.data;
        let msg: string = result.resultMsg;
        let code: number = result.resultCode;
        if (code != HttpCode.ok) {
            throw new Error("服务器返回错误代码：[" + code + "]====错误消息：[" + msg + "]");
        }
        return data[0];
    }

    /**
     * 用于映射服务器返回的状态码
     */
    static httpSignalStateCode<T>(res: HttpResult<T>): number {
        return res.resultCode;
    }


    /**
   * 普通函数代理
   */
    static functionProxy<T>(method: (...params) => T, ...params): T {
        return Reflect.apply(method, null, params);
    }

    /**
     * rx同步代理函数解决方案
     */
    static rxFunctionProxySync<T>(method: (...params) => T, ...params): Observable<T> {
        return RxService.makeObservable((subscriber: Subscriber<T>) => {
            subscriber.next(Reflect.apply(method, null, params));
            subscriber.complete();
        });
    }

    /**
     * rx异步代理函数解决方案
     */
    static rxFunctionProxy<T>(method: (...params) => T, ...params): Observable<T> {

        return RxService.makeObservable((subscriber: Subscriber<T>) => {
            setTimeout(() => {
                subscriber.next(Reflect.apply(method, null, params));
                subscriber.complete();
            }, 0);
        });
    }

    /**
     * 由于RxJs的interval在小程序上面没办法取消
     * 故自己实现了一个简单版本的
     * @static
     * @param {number} ms 周期(毫秒) 
     * @param {number} times 次数
     * @returns {Observable<number>} 
     * 
     * @memberOf RxService
     */

    static interval(ms: number, times: number): Observable<number> {
        return RxService.makeObservable((subscriber: Subscriber<number>) => {
            let index = 0;
            let tremor = setInterval(() => {
                subscriber.next(++index);
                if (index >= times) {
                    clearInterval(tremor);
                    subscriber.complete();
                }
            }, ms)

        })
    }

    /**
     * 简单版本的timeout和上面一样使用
     * 
     * @static
     * @param {number} ms 等待时间(毫秒)
     * @returns {Observable<number>} 
     * 
     * @memberOf RxService
     */
    static timeout(ms: number): Observable<number> {
        return RxService.makeObservable((subscriber: Subscriber<number>) => {
            setTimeout(() => {
                subscriber.next(ms);
                subscriber.complete();
            }, ms);
        })
    }


}

