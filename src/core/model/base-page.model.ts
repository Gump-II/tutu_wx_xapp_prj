import { HttpService } from './../service/http.service';
import { SystemService } from './../service/system.service';
import { LoggerService } from './../service/logger.service';
import { BasePresenter } from './base-presenter.model';
import { Inject, Type } from "../../lib/ioc/index"
import { AutoWired } from '../../lib/ioc/typescript-ioc';
@AutoWired
export class BasePage<P> implements IPage {
    presenter: P;

    @Inject
    @Type(LoggerService)
    logger: LoggerService

    setData: (data: any) => void;

    @Inject
    @Type(SystemService)
    systemService:SystemService;

    @Inject
    @Type(HttpService)
    http:HttpService;
}