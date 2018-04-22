import { LoggerService } from './../../core/service/logger.service';
import { Type, AutoWired, Inject, Container } from "../../lib/ioc/index"

@AutoWired
class ActivityPage implements IPage {

    @Inject
    @Type(LoggerService)
    logger:LoggerService;
    data: any = {
        text: "活动中心"
    }
    article: string = '<div>我是HTML代码</div>';
    onLoad(): void {
        this.logger.log("hello");
    }
}

Page(new ActivityPage())