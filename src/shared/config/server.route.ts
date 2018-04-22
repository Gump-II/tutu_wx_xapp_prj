import { environment } from './env.config';
/**
 * 服务器路由配置
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-10
 */

export class ServerRoute {
    static readonly local: string = "http://192.168.0.103:9006/";
    static readonly domain: string = environment.debug ? ServerRoute.local: "https://www.tutufree.com/";
    static readonly baseUrl: string = ServerRoute.domain + "v1_1/wms/http/";

    /**
     * 行程定制
     */
    static get customizationJourney(): string {
        return ServerRoute.baseUrl + "customization_journey";
    }

    /**
     * 司机注册地址
     */
    static get driverRegister(): string {
        return ServerRoute.baseUrl + "driver_register";
    }

    /**
     * 校验验证码
     */
    static get checkCaptcha(): string {
        return ServerRoute.baseUrl + "check_captcha";
    }

    /**
     * 验证码路由
     */
    static get getCaptcha(): string {
        return ServerRoute.baseUrl + "get_captcha";
    }

    /**
     * 微信登录
     * @param code:string 微信api返回的code
     */
    static get loginByWxCode(): string {
        return ServerRoute.baseUrl + "rep/xapp/user_verify";
    }
    /**
     * 旅途数据
     * @param _id:string;
     * @param num:number
     */
    static get travelData(): string {
        return ServerRoute.baseUrl + "journey/board";
    }

    /**
     * 行程详情
     * 
     * @readonly
     * @static
     * @type {string}
     * @memberOf ServerRoute
     */
    static get travelDetail(): string {
        return ServerRoute.baseUrl + "journey/detail";
    }

    /**
     * 获取oss接入参数
     * 
     * @readonly
     * @static
     * @type {string}
     * @memberOf ServerRoute
     */
    static get OssAccess(): string {
        return ServerRoute.baseUrl + "get_oss_signature";
    }

    static get TestArticle(): string {
        return "http://localhost/article/article2.json";
        // return "https://www.aiesst.com/test_article.json";
    }

}