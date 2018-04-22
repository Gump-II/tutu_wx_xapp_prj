
import { ServerRoute } from './../../shared/config/server.route';
import { HttpService } from './../../core/service/http.service';
import { TravelDetail } from './travel-detail.model';
import { RxService } from './../../core/service/rx.service';
import { Observable } from 'rxjs/Observable';
import { AutoWired, Type, Inject } from "../../lib/ioc/index"
import { LoggerService } from "../../core/service/index"
/**
 * 行程详情服务
 * 
 * @export
 * @class TravelDetailService
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-15
 */
@AutoWired
export class TravelDetailService {
    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    @Inject
    @Type(HttpService)
    http: HttpService;

    /**
     * 通过id获取行程详情
     * 
     * @param {string} id  行程的id
     * @returns {Observable<TravelDetail>}
     * 
     * @memberOf TravelDetailService
     */
    getTravelDetail(id: string): Observable<TravelDetail> {
        return this.http.get(ServerRoute.travelDetail, { id: id }).map(RxService.httpSignalDataMap);
    }

}