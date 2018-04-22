import { ModalService } from './modal.service';
import { OssAccess } from './../model/oss.model';
import { Observable } from 'rxjs/Observable';
import { CacheConfig } from './../../shared/config/cache.cofig';
import { MemCacheData, MemCacheExt, MemCache } from './../model/mem-cache.model';
import { WxOptionsExt } from './../model/wx-ext.model';
import { WxStorage, WxStorageExt, WxStorageData, CacheExt } from './../model/storage.model';

import './../../lib/patch/rx.fix';
import '../../rxjs.operator'

import { RxService } from './rx.service';
import { ErrorConfig } from './../../shared/config/error.config';
import { Subscriber } from 'rxjs/Subscriber';
import { Scheduler } from 'rxjs/Scheduler';
import { Util } from '../util/util';
/**
 * 用 Rx 封装微信的部分api
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-11
 * @modified:ychost<c.yang@tutufree.com>(2017-2-12)
 *              添加缓存超时配置
 *              添加内存缓存
 *              添加同步方法
 */
export class RxWxApi {

    constructor() {
        throw new Error("RxWxApi 不允许实例化")
    }
    /*----------------------------------基础api-----------------------------------------------*/
    static getSystemInfo(): Observable<wx.GetSystemInfoResult> {
        return RxWxApi.rxWxMethodCustom(wx.getSystemInfo, ErrorConfig.wxGetSystemInfoFailed);
    }

    /*----------------------------------文件相关-----------------------------------------------*/
    /**
     * 选择图片
     * 
     * @static
     * @returns {Observable<wx.ChooseImageResult>} 
     * 
     * @memberOf RxWxApi
     */
    static chooseImage(size: any, source: any): Observable<wx.ChooseImageResult> {
        let data = {
            count: 1,
            sizeType: size, // 可以指定是原图还是压缩图，默认二者都有
            sourceType: source // 可以指定来源是相册还是相机，默认二者都有
        }
        return RxWxApi.rxWxMethodNoError(wx.chooseImage, data);
    }

    /**
     * 消息提示框
     * 
     * @static
     * @returns Observable<wx.ShowActionSheetResult>
     */
    static showActionSheet(list: any, color: any): Observable<wx.ShowActionSheetResult> {
        let data = {
            itemList: list,
            itemColor: color,
        }
        return RxWxApi.rxWxMethodCustom(wx.showActionSheet, ErrorConfig.wxShowActionSheetFailed, data);
    }


    /**
     * 上传文件到Cos服务器
     * 
     * @static
     * @param {string} url 服务器地址
     * @param {string} filePath  文件路径
     * @param {string} uploadName 上传的文件名字
     * @param {any} header 请求头
     * @param {any} extData 额外的数据
     * @returns {Observable<wx.UploadFileResult>} 
     * 
     * @memberOf RxWxApi
     */
    static uploadFile(url: string, filePath: string, uploadName: string, header?: any, extData?: any): Observable<wx.UploadFileResult> {

        let data: any = {
            url: url + "/" + uploadName, //仅为示例，非真实的接口地址
            filePath: filePath,
            //必须的，不然会是0kb
            name: "filecontent",
        }
        if (!Util.isNullOrUndefined(header)) {
            let headerData = {
                header: header
            }
            Object.assign(data, headerData);
        }
        if (!Util.isNullOrUndefined(extData)) {
            let formData = {
                formData: extData
            }
            Object.assign(data, formData);
        }

        return RxWxApi.rxWxMethodCustom(wx.uploadFile, ErrorConfig.wxUploadFileFailed, data);
    }



    /*----------------------------------缓存相关-----------------------------------------------*/

    //内存缓存
    private static memCache: MemCache = new MemCache();

    /**
     * 设置缓存，内存+本地
     */
    static setCache(key: string, value: any, ext?: CacheExt): Observable<boolean> {
        return RxWxApi.setMemCache(key, value, ext).switchMap(isOk => {
            return RxWxApi.setStorage(key, value, ext);
        })

    }

    /**
     * 获取缓存，内存+本地
     * 优先内存，异步方法
     */
    static getCache<T>(key: string): Observable<T> {
        return RxWxApi.getMemCache(key).switchMap(data => {
            if (Util.isNullOrUndefined(data)) {
                return RxWxApi.getStorage<T>(key);
            } else {
                return Observable.from([data]);
            }

        })
    }

    /**
     * 更新缓存，同步本地和内存的缓存
     * 同步方法
     * todo 等待完成
     * @static
     * @returns {boolean}
     * 
     * @memberOf RxWxApi
     */
    private static updateCacheSync(): boolean {
        RxWxApi.updateMemCacheSync();

        return true;
    }

    /**
     * 删除缓存，内存+本地
     * 异步方法
     */
    static removeCache(key: string): Observable<boolean> {
        return RxWxApi.removeMemCache(key).switchMap(() => {
            return RxWxApi.removeStorage(key);
        });
    }

    /**
     *  清空缓存，内存+本地
     *  异步方法
     */
    static clearCache(): Observable<boolean> {
        return RxWxApi.clearMemCache().switchMap(() => {
            return RxWxApi.clearStorage();
        })
    }


    /**
     * 设置内存缓存
     * 同步方法
     */
    static setMemCacheSync(key: string, value: any, ext?: CacheExt): boolean {
        if (Util.isNullOrUndefined(ext)) {
            ext = new MemCacheExt();
        }
        let data = new MemCacheData();
        data.ext = ext;
        data.value = value;
        RxWxApi.memCache[key] = data;
        return true;
    }
    /**
     * 设置内存缓存
     * 异步方法
     */
    static setMemCache(key: string, value: any, ext?: MemCacheExt): Observable<boolean> {
        return RxService.rxFunctionProxy<boolean>(RxWxApi.setMemCacheSync, key, value, ext);
    }

    /**
     * 获取内存缓存
     * 同步方法
     */
    static getMemCacheSync<T>(key: string): T {
        let cacheData = RxWxApi.memCache[key];
        if (cacheData == null || (cacheData.ext.expire != CacheConfig.infiniteTime && cacheData.ext.expire < new Date().getTime())) {
            RxWxApi.memCache[key] = cacheData = null;
            return null;
        } else {
            return cacheData.value;
        }
    }
    /**
     * 获取内存数据
     * 异步方法
     */
    static getMemCache<T>(key: string): Observable<T> {
        return RxService.rxFunctionProxy(RxWxApi.getMemCacheSync, key);
    }

    /**
     * 删除内存缓存
     * 同步方法
     */
    static removeMemCacheSync(key: string): boolean {
        RxWxApi.memCache[key] = null;
        return true;
    }

    /**
     * 删除内存缓存
     * 异步方法
     */
    static removeMemCache(key: string): Observable<boolean> {
        return RxService.rxFunctionProxy(RxWxApi.removeMemCacheSync, key);
    }

    /**
     * 清空内存缓存
     * 同步方法
     */
    static clearMemCacheSync(): boolean {
        RxWxApi.memCache = null;
        RxWxApi.memCache = new MemCache();
        return true;
    }

    /**
     * 清空内存缓存
     * 异步方法
     */
    static clearMemCache(): Observable<boolean> {
        return RxService.rxFunctionProxy(RxWxApi.clearMemCacheSync);
    }
    /**
     * 获取所有内存缓存的信息
     * 同步方法
     */
    static getMemCacheInfoSync(): MemCache {
        RxWxApi.updateMemCacheSync();
        return RxWxApi.memCache;
    }
    /**
     * 获取所有缓存的信息
     * 异步方法
     */
    static getMemCacheInfo(): Observable<MemCache> {
        return RxService.rxFunctionProxy(RxWxApi.getMemCacheInfoSync);
    }

    /**
     * 更新内存缓存，删除过期的数据
     * 同步方法
     */
    static updateMemCacheSync(): boolean {
        for (let key in RxWxApi.memCache) {
            let cacheData = RxWxApi.memCache[key];
            if (cacheData != null && cacheData.ext.expire != CacheConfig.infiniteTime && cacheData.ext.expire < new Date().getTime()) {
                RxWxApi.memCache[key] = cacheData = null;
            }
        }
        return true;
    }

    /**
     * 更新内存缓存，删除过期的数据
     * 异步方法
     */
    static updateMemCache(): Observable<boolean> {
        return RxService.rxFunctionProxy<boolean>(RxWxApi.updateMemCacheSync);
    }

    /**
     * 设置缓存
     * 异步方法
     */
    static setStorage(key: string, value: Object, ext?: CacheExt): Observable<boolean> {
        if (ext == undefined || null) {
            ext = new WxStorageExt();
        }
        //缓存数据
        let data = new WxStorageData();
        data.ext = ext;
        data.value = value;
        return RxWxApi.rxWxMethodDefault(wx.setStorage, ErrorConfig.wxSetStorageFailed, { key: key, data: data });
    }


    /**
     * 获取缓存
     * 异步方法
     */
    static getStorage<T>(key: string): Observable<T> {
        return RxWxApi.rxWxMethodNoError<WxStorage<T>>(wx.getStorage, { key: key }).switchMap(storage => {
            return RxService.makeObservable((subscriber: Subscriber<T>) => {
                if (Util.isNullOrUndefined(storage)) {
                    subscriber.next(null);
                } else {
                    let data = storage.data;
                    let ext: WxStorageExt = data.ext;
                    if (ext.expire == CacheConfig.infiniteTime || +ext.expire > new Date().getTime()) {
                        subscriber.next(data.value)
                    } else {
                        //删除缓存并返回null
                        RxWxApi.removeStorage(key).map(() => null).subscribe(subscriber);
                    }
                }
                subscriber.complete();
            })
        })
    }



    /**
     * 获取缓存信息
     * 异步方法
     */
    static getStorageInfo(): Observable<wx.GetStorageInfoResult> {
        return RxWxApi.rxWxMethodCustom<wx.GetStorageInfoResult>(wx.getStorageInfo, ErrorConfig.wxGetStorageInfoFailed);
    }

    /**
     * 获取缓存信息
     * 同步方法
     * @static
     * @returns {wx.GetStorageInfoResult}
     * 
     * @memberOf RxWxApi
     */
    static getStorageInfoSync(): wx.GetStorageInfoResult {
        return wx.getStorageInfoSync();
    }

    /**
     * 移除缓存
     */
    static removeStorage<T>(key: string): Observable<boolean> {
        return RxWxApi.rxWxMethodDefault(wx.removeStorage, ErrorConfig.wxRemoteStorageFailed, { key: key });
    }

    /**
     * 清空本地缓存
     * 同步方法
     */
    static clearStorageSync(): boolean {
        try {
            wx.clearStorageSync();
        } catch (e) {
            console.log("清空缓存失败", e)
            return false
        }
        return true;
    }

    /**
     * 清空本地缓存
     * 异步方法
     */
    static clearStorage(): Observable<boolean> {
        return RxService.rxFunctionProxy(RxWxApi.clearStorageSync);
    }


    /*----------------------------------账户相关-----------------------------------------------*/

    /**
     * 登陆
     */
    static login(): Observable<wx.LoginResult> {
        return RxWxApi.rxWxMethodCustom(wx.login, ErrorConfig.wxLoginFailed);
    }

    /**
     * 检查登陆是否过期
     */
    static checkSession(): Observable<boolean> {
        return RxWxApi.rxWxMethodDefault(wx.checkSession, ErrorConfig.wxSessionIsDated);
    }



    /**
     * 包装微信的api,success含有数据
     */
    static rxWxMethodCustom<T>(wxMethod: (options: WxRequestOptions) => void, failError: Error = ErrorConfig.defaultFailedError, data?: any): Observable<T> {
        return RxService.makeObservable((subscriber: Subscriber<T>) => {
            let options = RxWxApi.rxWxOptionsCustom(subscriber, failError);
            //加入额外的数据
            if (!Util.isNullOrUndefined(data)) {
                Object.assign(options, data)
            }
            wxMethod(options);
        })
    }

    /**
     * 包装微信的api，success不含有数据
     */
    static rxWxMethodDefault(wxMethod: (options: wx.BaseOptions) => void, failError: Error = ErrorConfig.defaultFailedError, data?: any): Observable<boolean> {
        return RxService.makeObservable((subscriber: Subscriber<boolean>) => {
            let options = RxWxApi.rxWxOptionsDefault(subscriber, failError);
            //加入额外的数据
            if (data != null || data != undefined) {
                Object.assign(options, data)
            }
            wxMethod(options);
        })
    }

    /**
     * 不抛错的微信api,fail的时候为null
     * 
     * @static
     * @param {(options: wx.BaseOptions) => void} wxMethod
     * @param {*} [data]
     * @returns {Observable<T>}
     * 
     * @memberOf RxWxApi
     */
    static rxWxMethodNoError<T>(wxMethod: (options: WxRequestOptions) => void, data?: any): Observable<T> {
        return RxService.makeObservable((subscriber: Subscriber<T>) => {
            let options = RxWxApi.rxWxOptionsWithNoError(subscriber);
            //加入额外的数据
            if (data != null || data != undefined) {
                Object.assign(options, data)
            }
            wxMethod(options);
        })
    }


    /**
     * 封装微信的options，success 有返回数据
     */
    static rxWxOptionsCustom<T>(subscriber: Subscriber<T>, failError: Error = ErrorConfig.defaultFailedError): wx.BaseOptions {
        let options: WxRequestOptions = new WxRequestOptions();
        options.success = (data: T) => {
            subscriber.next(data)
        };
        options.fail = (data?) => {
            console.log("微信api错误消息", data);
            subscriber.error(failError)
        };
        options.complete = () => {
            subscriber.complete();
        }
        return options;
    }

    /**
     * 封装微信的options，success 没有返回数据
     * 一旦success则next(true)
     */
    static rxWxOptionsDefault(subscriber: Subscriber<boolean>, failError: Error = ErrorConfig.defaultFailedError): wx.BaseOptions {
        let options: WxRequestOptions = new WxRequestOptions();
        options.success = () => {
            subscriber.next(true)
        };
        options.fail = () => {
            subscriber.error(failError)
        };
        options.complete = () => {
            subscriber.complete();
        }
        return options;
    }

    /**
     * 不抛错的Options
     * 
     * @static
     * @template T
     * @param {Subscriber<T>} subscriber
     * @returns {wx.BaseOptions}
     * 
     * @memberOf RxWxApi
     */
    static rxWxOptionsWithNoError<T>(subscriber: Subscriber<T>): wx.BaseOptions {
        let options: WxRequestOptions = new WxRequestOptions();
        options.success = (data: T) => {
            subscriber.next(data)
        };
        options.fail = () => {
            subscriber.next(null);
        };
        options.complete = () => {
            subscriber.complete();
        }
        return options;
    }

}


/**
 * 微信请求参数
 */
class WxRequestOptions implements wx.BaseOptions {

    /**
     * 接口调用成功的回调函数
     */
    success?: (data?) => void;

    /**
     * 接口调用失败的回调函数
     */
    fail?: (data?) => void;

    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?: () => void;
}

