import { Util } from './../../core/util/util';
import { ServerRoute } from './../../shared/config/server.route';
import { Subscriber } from 'rxjs/Subscriber';
import { RxService } from './../../core/service/rx.service';
import { HttpService } from './../../core/service/http.service';
import { Article } from './article.model';
import { Observable } from 'rxjs/Observable';
import { AutoWired, Type, Inject } from "../../lib/ioc/index"
import { WxParse } from "../../lib/wxParse/wxParse.fix"

@AutoWired
export class ArticleService {

    @Inject
    @Type(HttpService)
    http: HttpService;


    /**
     * 获取文章
     * 
     * @param {string} url 文章链接
     * @returns {Observable<Article>}
     * 
     * @memberOf ArticleService
     */
    getArticle(url: string): Observable<string> {
        return this.http.fetchOrigin(url);
    }



    /**
     * 解析文章
     * 
     * @param {string} article 
     * @returns {Observable<boolean>} 
     * 
     * @memberOf ArticleService
     */
    parseArticle(article: string,page:IPage): Observable<void> {
        let oldArticle: any = article;
        let content: string = article;
        //兼容老版本的格式
        if (!Util.isNullOrEmpty(oldArticle[0].content)) {
            content = oldArticle[0].content;
        }

        return RxService.rxFunctionProxySync<void>(WxParse.wxParse, 'article', 'html', content, page);
    }
}