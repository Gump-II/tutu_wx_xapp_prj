import { ServerRoute } from './../../shared/config/server.route';
import { TopTipWidget } from './../../shared/widget/top-tip.model';
import { LoggerService } from './../../core/service/logger.service';
import { ArticleService } from './article.service';
import { AutoWired, Type, Inject } from "../../lib/ioc/index";
import { WxParse } from "../../lib/wxParse/wxParse.fix"
/**
 * 文章显示页面，主要提供wxParse的显示接口
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-26
 * @class Article
 * @implements {IPage}
 */
@AutoWired
class Article implements IPage {
    @Inject
    @Type(ArticleService)
    articleService: ArticleService;

    @Inject
    @Type(LoggerService)
    logger: LoggerService;
    setData?: (data: any) => void;
    topTip: TopTipWidget = {
        showTopTips: false,
        topTipsMsg: "文章解析错误，即将返回!"
    }
    data: any = {
        topTip: this.topTip
    }

    onLoad(options: any): void {
        this.articleService.getArticle(options.articleUrl)
            .switchMap(content => this.articleService.parseArticle(content, this))
            .subscribe(this.onArticleSucc, this.onArticleError);
    }


    onArticleSucc(): void {

    }
    onArticleError(e): void {
        this.topTip.showTopTips = true;
        this.updateToptipView();
        setTimeout(() => {
            this.topTip.showTopTips = false;
            this.updateToptipView();
            wx.navigateBack({});
        }, 2000)
    }

    updateToptipView(): void {
        this.setData({
            topTip: this.topTip
        })
    }
}

Page(new Article())