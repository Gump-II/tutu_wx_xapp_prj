import { BasePage } from './base-page.model';
import { Inject, Type } from "../../lib/ioc/index"
import { AutoWired } from '../../lib/ioc/typescript-ioc';
import { LoggerService } from '../service/logger.service';
@AutoWired
export abstract class BasePresenter<P>{
    page: P;

    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    constructor(page: P) {
        this.page = page;
        this.onPageInit();
    }

    protected abstract onPageInit(): void;
}