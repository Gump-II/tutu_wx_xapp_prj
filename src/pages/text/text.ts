import { LoggerService } from './../../core/service/logger.service';
import { AutoWired, Inject, Type } from '../../lib/ioc/index';
import { PageRoute } from '../../shared/config/page.route';
@AutoWired
export class TextPage implements IPage {
    setData?: (data: any) => void;


    @Inject
    @Type(LoggerService)
    logger: LoggerService;

    textContent: string;
    data = {
        textContent: this.textContent
    }

    onLoad(options: any): void {
        this.logger.log("options by text",options);
        this.textContent = options.textContent;
        this.updateTextView();
    }


    updateTextView(): void {
        this.setData({
            textContent: this.textContent

        })
    }

}

Page(new TextPage())