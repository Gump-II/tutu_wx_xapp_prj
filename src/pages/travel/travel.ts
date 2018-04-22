import { Util } from './../../core/util/util';
import { TravelPresenter } from './travel.presenter';
import { LoadMoreWidget } from './../../shared/widget/load-more.widget';
import { UserService } from './../../core/service/user.service';
import { WxStorage } from './../../core/model/storage.model';
import { RxService } from './../../core/service/rx.service';
import { RxWxApi } from './../../core/service/rx-wx.api';
import { PageRoute } from "../../shared/config/index"
import { Inject, Type, AutoWired } from "../../lib/ioc/index"
import { LoggerService } from "../../core/service/logger.service"
import { TravelServie } from './travel-board.service';
import { TravelBoard } from './travel-board.model';
import { environment } from '../../shared/config/env.config';
import { ModalService } from '../../core/service/modal.service';
import { SystemService } from '../../core/service/system.service';
import { BasePage } from '../../core/model/base-page.model';
import { FormWidget } from '../../shared/widget/form.widget';


/**
 *  该文件主要为行程页面的视图层
 * @author:  zhz
 * @date  :  2017/2/3
 * @modified: ychost<c.yang@tutufree.com>(2017-2-11)
 *              添加服务
 * 
 */
@AutoWired
export class TravelPage extends BasePage<TravelPresenter> {


    @Inject
    @Type(TravelServie)
    travelService: TravelServie;

    @Inject
    @Type(UserService)
    userService: UserService;


    travelData: TravelBoard;
    // 控制加载页
    readonly limitNumber: number = 5;

    // 用于描述页面的相关数据
    data = {
        reqProtect: false,
        hasMore: false,
        loading: true,
        travelData: this.travelData,
    }

    onLoad(): void {
        this.presenter = new TravelPresenter(this);
        this.systemService.setPageWinInfo(this);
        this.pageInit();
    }

    /**
     * 页面初始化
     * 
     * @private
     * 
     * @memberOf TravelPage
     */
    private pageInit(): void {
        ModalService.showLoadingToast();

        //更新面板
        this.userService.init().subscribe(isOk => {
            if (isOk) {
                this.refreshPage();
            } else {
                this.onLoadDataFailed();
            }
        }, (error) => {
            this.logger.error(error);
            ModalService.hideToast();
            ModalService.showErrorModal("请保持网络连接且授权此小程序", () => {
                this.pageInit();
            })
        })

    }



    updateTravelDataView(updateTravelData: TravelBoard): void {

        if (Util.isNullOrUndefined(this.travelData)) {
            this.travelData = updateTravelData;
        } else {
            if (Util.isNullOrUndefined(this.travelData.callBoard)) {
                this.travelData.callBoard = updateTravelData.callBoard;
            } else if (!Util.equals(this.travelData.callBoard, updateTravelData.callBoard)) {
                this.travelData.callBoard = updateTravelData.callBoard;
            }
            if (Util.isNullOrUndefined(this.travelData.journeys)) {
                this.travelData.journeys = updateTravelData.journeys;
            } else if (this.travelData.journeys[0]._id != updateTravelData.journeys[0]._id) {
                this.travelData.journeys = updateTravelData.journeys;
            }
        }
        this.setData({
            travelData: this.travelData
        })
    }


    /**
     * 停止刷新视图显示
     *
     * @memberOf TravelPage
     */
    stopRefreshView(): void {
        ModalService.hideToast();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    }
    /**
     * 更新页面
     * 
     * 
     * @memberOf TravelPage
     */
    refreshPage(): void {
        this.travelService.getTravelData(this.limitNumber)
            .subscribe(this.updateTravelDataView, this.onLoadDataFailed, this.stopRefreshView)
    }

    timemerHandler: any;

    onPullDownRefresh(): void {
        wx.showNavigationBarLoading();
        this.refreshPage();
    }


    /**
     * 加载更多的行程，无数据则设置五分钟时间锁
     * 
     * @returns {void} 
     * 
     * @memberOf TravelPage
     */
    onReachBottom(): void {
        const lockName = "__loadMore_lock"
        if (this.http.lockFetch(this, lockName)) {
            return;
        }
        LoadMoreWidget.showLoading(this);
        // 获取当前最后一个id号
        let lastId = this.travelData.journeys[this.travelData.journeys.length - 1]._id;
        this.travelService.getTravelData(this.limitNumber, lastId).subscribe(travelData => {
            // 如果请求到数据不为空
            if (travelData.journeys.length != 0) {
                // 追加数组到当前数组
                this.travelData.journeys = this.travelData.journeys.concat(travelData.journeys);
                this.updateTravelDataView(this.travelData);
                this.http.unlockFetch(this, lockName);

            } else {
                LoadMoreWidget.showNoData(this);
                //没有数据设置是时间锁5分钟禁止刷新
                this.http.unlockFetchByTime(this, 5000 * 60, lockName);
            }
        }, (error) => {
            this.logger.error(error);
            this.http.unlockFetch(this, lockName);
        });
    }

    /**
     * 导航到详细行程
     * 
     * @param {*} event
     * 
     * @memberOf TravelPage
     */
    navToDetail(event: any): void {
        let id: string = <string>event.currentTarget.id;
        this.logger.log("点击的行程id", id)
        let targetUrl: string = PageRoute.travelDetail + "?" + "id=" + id;
        wx.navigateTo({ url: targetUrl });
    }

    /**
     * 加载数据出错时候，重新加载
     * 
     * @param {*} [error] 
     * 
     * @memberOf TravelPage
     */
    onLoadDataFailed(error?: any): void {
        this.logger.error("加载数据出错", error);
        ModalService.hideToast();
        ModalService.showErrorModal("加载数据出错，点击确定重新加载", () => {
            //重置用户数据
            this.userService.reset().subscribe((isOk) => {
                this.logger.log("重置用户数据据结果", isOk);
                this.pageInit();
            })

        });
    }

}

Page(new TravelPage());