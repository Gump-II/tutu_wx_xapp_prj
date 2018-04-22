import { HttpService } from './http.service';
import { AutoWired,Type,Inject } from '../../lib/ioc/index';
import { LoggerService } from './logger.service';
@AutoWired
export abstract  class BaseService{
    @Inject
    @Type(HttpService)
    http:HttpService

    @Inject
    @Type(LoggerService)
    logger:LoggerService
}