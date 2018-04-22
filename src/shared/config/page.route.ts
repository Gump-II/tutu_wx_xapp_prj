
/**
 * 页面路由
 *
 * @export
 * @class PageRoute
 */
export class PageRoute {

    static readonly TRAVEL_PREVIEW_ROUTE_URL: string = "../travel/travel";

    static readonly travelDetail: string = "../travel-detail/travel-detail";

    static readonly register: string = "../register/register";

    static readonly service: string = "../phone-number/phone-number"

    static readonly order: string = "../order/order";

    static readonly driverRegister: string = "../driver/register/register";

    /**
     * 普通文本显示页面
     * 
     * @static
     * @param {string} textContent  文本内容
     * @returns {string} 
     * 
     * @memberOf PageRoute
     */
    static text(textContent: string): string {
        return "../text/text?textContent=" + textContent;
    }

    static article(articleUrl: string): string {
        return "../article/article?articleUrl=" + articleUrl;
    }

    static readonly HOME: string = "../pages/index/index";

    static sharedMsgSuccess(content: string, redirectTo: string): string {
        let routePath = redirectTo.split("/").pop();
        let path: string = "../../../pages/" + routePath + "/" + routePath;
        return "../../shared/pages/msg/msg-success?content=" + content + "&&redirectTo=" + path;
    }

    static sharedMsgSuccessCustom(content: string, redirectTo: string): string {
        return "../../shared/pages/msg/msg-success?content=" + content + "&&redirectTo=" + redirectTo;
    }
}

