import { TextPage } from './../text/text';
import { TravelDetailInit } from './travel-detail.init';
import { Util } from './../../core/util/util';
import { PageRoute } from './../../shared/config/page.route';
import { environment } from './../../shared/config/env.config';
import { TravelDetail, TravelDetailMenu } from './travel-detail.model';
import { TravelDetailService } from './travel-detal.service';
import { AutoWired, Type, Inject } from "../../lib/ioc/index"
import { LoggerService } from "../../core/service/index"
/**
 * @brief    该文件主要为页面的视图层
 * @author   zhz
 * @date     2017/2/3
 */
@AutoWired
export class TravelDetailPage implements IPage {

    /**
    * 将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
    */
    setData?: (data: any) => void;
    //行程的id
    travelId;
    //行程详情 
    travelDetail: TravelDetail;
    //
    menuList: Array<TravelDetailMenu>;

    @Inject
    @Type(LoggerService)
    loger: LoggerService;

    @Inject
    @Type(TravelDetailService)
    travelDetailService: TravelDetailService;

    @Inject
    @Type(TravelDetailInit)
    initProxy: TravelDetailInit;

    // 用于描述页面的相关数据
    data: any = {

        /// 页面内容
        content: "色达7日游",
        // 价格
        price: 800,
        menuList: this.menuList,
        travelDetail: this.travelDetail,
        routes: [],
    }

    onLoad(options: any): void {
        if (!Util.isNullOrUndefined(options.id)) {
            this.travelId = options.id;
        } else if (environment.debug) {
            this.travelId = "58ad4cc337067f5805bced50";
            this.loger.log("虚拟行程详情的id", this.travelId);
        }
        this.updateTravelDetail(this.travelId);
        this.initProxy.register(this);
    }

    /**
     * 更新数据页面
     * 
     * @param {string} travelId 行程id
     * @memberOf TravelDetailPage
     */
    updateTravelDetail(travelId: string): void {
        this.travelDetailService.getTravelDetail(travelId).subscribe(detail => {
            // 先进行赋值
            this.travelDetail = detail;
            // // 功能扩展添加
            // // 获取索引列表
            // let indexTabel = detail.sitesDescribe[0].indexTable;
            // // 获取资源列表
            // let sourceTable = detail.sitesDescribe[0].sites;
            // // 用于存储路线
            // let routes: string[] = [];
            // // 地点列表
            // let sites: any[] = [];
            // // 遍历构造路线结构
            // for(let i = 0; i < indexTabel.length; i++) {
            //     // 切分地点，将地点按照指定格式切分
            //     sites[i] = (i == 0) ? (sourceTable.slice(0, indexTabel[i])) : (sourceTable.slice(indexTabel[i - 1] - 1, indexTabel[i]));
            //     routes.push(sites[i].map(site => {
            //         return site.name;
            //     }).join("-"))
            // }
            this.setData({
                travelDetail: this.travelDetail,
                // routes: routes
            })
            this.loger.log("行程详情", this.travelDetail);
        }, error => {
            this.loger.log("获取行程详情出错", error);
        })
    }

    /**
     * 更新菜单数据
     * 
     * 
     * @memberOf TravelDetailPage
     */
    updateMenuList(): void {
        this.setData({
            menuList: this.menuList
        })
    }

    /**
     * 处理菜单的点击事件
     */
    menuBindTapDeal(event: any): void {
        let menuId = event.currentTarget.id;
        let menu = this.menuList[menuId];
        //回调菜单绑定的事件
        if (Util.isFunction(menu.do)) {
            menu.do(menu);
        }
    }

    /**
     * 导航到风土人情的文章
     * 
     * @param {*} event 
     * 
     * @memberOf TravelDetailPage
     */
    navToTravelArticle(event: any): void {
        let url = PageRoute.article(event.currentTarget.dataset.url);
        this.loger.log("文章链接", url);
        wx.navigateTo({ url: url });
    }
    //保险详情
    travelInsuranceToggle(menu: TravelDetailMenu): void {
        menu.open = !menu.open;
        this.updateMenuList();
     
    }
    //合同详情
    travelContractToggle(menu: TravelDetailMenu): void {
        menu.open = !menu.open;
        this.updateMenuList();
     
    }
    //行程简介
    travelBrefToggle(menu: TravelDetailMenu): void {
        menu.open = !menu.open;
        this.updateMenuList();
    }
    //风土人情
    travelIntroToggle(menu: TravelDetailMenu): void {
        menu.open = !menu.open;
        this.updateMenuList();
    }
    //费用详情
    travalCostToggle(menu: TravelDetailMenu): void {
        menu.open = !menu.open;
        this.updateMenuList();
    }

    navToService(event:any):void{
        wx.navigateTo({
            url:PageRoute.service
        })
    }
}

Page(new TravelDetailPage());