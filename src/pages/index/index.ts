import { UserService } from './../../core/service/user.service';
import { AutoWired, Inject, Type, ParamTypes } from "../../lib/ioc/index"
import { PageRoute } from "../../shared/config/index"
import { LoggerService } from "../../core/service/logger.service"
import { RxService } from '../../core/service/rx.service';

/**
 * index页面数据定义，该接口用于约束调用，但
 * 是无法约束初始化时的值，所以需要初始化参数
 * 应以该接口为标准，以便编译器发现错误。
 */
interface IndexPageData {
    id: string;
    name: string;
    imgUrl: string;
    jumpUrl: string;
}

/**
 * 用于index页面逻辑支持
 * 
 * @author:zhz
 * @date  :2017-2-3
 * @modified:ychost<c.yang@tutufree.com>(2017-2-12)
 *              添加用户逻辑     
 */
@AutoWired
class IndexPage implements IPage {

    // 用于描述页面的相关数据
    data: any = {
        list:
        [
            {

                name: "途徒自由行",
                imgUrl: "https://www.tutufree.com/assets/img/home.jpg",
                jumpUrl: PageRoute.TRAVEL_PREVIEW_ROUTE_URL
            },
            {

                name: "途徒师傅招募",
                imgUrl: "https://www.tutufree.com/assets/img/driver.jpg",
                jumpUrl: PageRoute.register
            },
            {
                name: "途徒行程定制",
                imgUrl: "https://www.tutufree.com/assets/img/route.jpg",
                jumpUrl: PageRoute.order
            }
        ]
    }

    @Inject
    @Type(LoggerService)
    logger: LoggerService;


    @Inject
    @Type(UserService)
    userService: UserService;




    /**
     * 用于处理相应的点击事件
     * @param event 响应事件对象
     */
    public targetToggle(event: any): void {
        // 获取id名字
        var id: string = <string>event.currentTarget.id;
        this.logger.log("id",id);
        var list: IndexPageData[] = this.data.list;
        this.logger.log("list",list[id].jumpUrl)
        // 导航到指定页面
        wx.navigateTo({ url: list[id].jumpUrl });
    }

    public onLoad(): void {
        wx.showNavigationBarLoading()
        
        // RxService.interval(1000, 5).subscribe(time => {
        //     this.logger.log("time", time);
        // }, this.logger.error, () => this.logger.log("complete"))
    }

    public onReady(): void {
        wx.hideNavigationBarLoading()

    }

    public onShow(): void {

    }

}

Page(new IndexPage());