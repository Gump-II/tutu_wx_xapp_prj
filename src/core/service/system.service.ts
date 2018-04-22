import { Observable } from 'rxjs/Observable';
import { CacheConfig } from './../../shared/config/cache.cofig';
import { Util } from './../util/util';
import { AutoWired, Singleton, Inject, Type } from "../../lib/ioc/index"
import { LoggerService } from "./logger.service"
import { RxWxApi } from './rx-wx.api';
import { RxService } from './rx.service';

/**
 * 设备系统信息，屏幕像素等等
 * 可以直接给页面提供winHeight和winWidth的data字段
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-9
 */
@AutoWired
@Singleton
export class SystemService {
    @Inject
    @Type(LoggerService)
    private logger: LoggerService
    info: wx.GetSystemInfoResult;

    init(): void {
        RxWxApi.getCache<wx.GetSystemInfoResult>(CacheConfig.systemInfo)
            .switchMap(info => {
                if (Util.isNullOrUndefined(info)) {
                    return RxWxApi.getSystemInfo();
                } else {
                    return Observable.from([info]);
                }
            }).switchMap(info => {
                if (Util.isNullOrUndefined(info)) {
                    return Observable.from([wx.getSystemInfoSync()]);
                } else {
                    return RxWxApi.setCache(CacheConfig.systemInfo, info).map(isOk => {
                        if (!isOk) {
                            throw new Error("缓存设备信息失败");
                        }
                        return info;
                    })
                }
            }).subscribe(info => {
                this.info = info;
            }, this.logger.error)
    }


    /**
     * 获取缓存的信息
     */
    getInfo(): wx.GetSystemInfoResult {
        if (Util.isNullOrUndefined(this.info)) {
            this.info = wx.getSystemInfoSync();
        }
        return this.info;
    }

    /**
     * 直接设置设备信息到页面，winHeight和winWidth
     * 
     * @static
     * @param {IPage} page 
     * 
     * @memberOf SystemService
     */
    setPageWinInfo(page: IPage): void {
        let winWidth = Util.makeValueNotNull(page.data.winWidth);
        let winHeight = Util.makeValueNotNull(page.data.winHeight);
        winWidth = this.getInfo().windowWidth;
        winHeight = this.getInfo().windowHeight;
        page.setData({
            winHeight: winHeight,
            winWidth: winWidth
        })
    }
}