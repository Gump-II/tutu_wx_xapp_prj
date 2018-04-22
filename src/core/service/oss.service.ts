import { RxService } from './rx.service';
import { ServerRoute } from './../../shared/config/server.route';
import { Observable } from 'rxjs/Observable';
import { OssAccessOptions, OssAccess } from './../model/oss.model';
import { HttpService } from './http.service';
import { LoggerService } from './logger.service';
import { AutoWired, Inject, Type, Container, Singleton, Provided, Provider } from "../../lib/ioc/index"

/**
 * 与oss相关的服务，比如图片上传等等
 * 由于腾讯禁用了阿里云所以方法失效
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-21
 * @export
 * @class OssService
 */
@AutoWired
@Singleton
export class OssService {
    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    @Inject
    @Type(HttpService)
    http: HttpService;

    /**
     * 获取接入oss的参数
     * 
     * @param {OssAccessOptions} options
     * @returns {Observable<OssAcess>}
     * 
     * @memberOf OssService
     */
    getOssAccess(options: OssAccessOptions): Observable<OssAccess> {
        return this.http.get(ServerRoute.OssAccess, options).map(RxService.httpSignalDataMap);
    }


}