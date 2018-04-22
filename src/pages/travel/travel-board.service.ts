import { Observable } from 'rxjs/Observable';
import { ServerRoute } from './../../shared/config/server.route';
import { HttpService } from './../../core/service/http.service';
import { Subscriber } from 'rxjs/Subscriber';
import { RxService } from './../../core/service/rx.service';
import { AutoWired, Type, Inject } from "../../lib/ioc/index"
import { LoggerService } from "../../core/service/index"
import { TravelBoard } from "./travel-board.model"
import {HttpResult} from "../../core/model/index"
/**
 * 旅途面板服务
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-10
 */
@AutoWired
export class TravelServie {
    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    @Inject
    @Type(HttpService)
    http: HttpService;

    /**
   * 获取旅行数据
   * 
   * @param _id:行程ID
   */
    getTravelData(num: number, id?: string): Observable<TravelBoard> {

        let options = {};
        if (id != null || id != undefined) {
            options = { id: id, num: num };
        } else {
            options = { num: num };
        }

        return this.http.get<TravelBoard>(ServerRoute.travelData, options)
            .map(RxService.httpSignalDataMap);
    }

}