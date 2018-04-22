import { RxService } from './../../core/service/rx.service';
import { ServerRoute } from './../../shared/config/server.route';
import { Inject, Type, AutoWired } from "../../lib/ioc/index";
import { HttpService } from './../../core/service/http.service';
import { LoggerService } from './../../core/service/logger.service';
import { Observable } from 'rxjs/Observable';


@AutoWired
export class OrderService {

    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    @Inject
    @Type(HttpService)
    http: HttpService;

    /**
     * 提交Order到服务器
     * 
     * @param {OrderModel} orderMode 
     * @returns {Observable<number>} 
     * 
     * @memberOf OrderService
     */
    postSimpleOrder(orderMode: any): Observable<number> {
        return this.http.post(ServerRoute.customizationJourney, orderMode).map(RxService.httpSignalStateCode);
    }
}