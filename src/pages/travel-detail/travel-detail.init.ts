import { PageRoute } from './../../shared/config/page.route';
import { ImageConfig } from './../../shared/config/image.config';
import { TravelDetailPage } from './travel-detail';
import { PageInit } from "../../core/model/index"
import { AutoWired } from "../../lib/ioc/index"
import { TravelDetailMenu } from './travel-detail.model';
/**
 * 行程详情页面初始化
 *
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-23 
 * @export
 * @class TravelDetailInit
 * @extends {PageInit<TravelDetailPage>}
 */
@AutoWired
export class TravelDetailInit extends PageInit<TravelDetailPage>{

    init(): void {
        this.initMenuList();
    }
    initMenuList(): void {
        this.context.menuList = [
            {
                text: "行程简介",
                briefLogo: ImageConfig.pageImageRoot + "travel_brief.png",
                open: false,
                do: this.context.travelBrefToggle
            },
            {

                text: "费用详情",
                briefLogo: ImageConfig.pageImageRoot + "travel_cost.png",
                open: false,
                do:this.context.travalCostToggle
            },
            {

                text: "风土人情",
                briefLogo: ImageConfig.pageImageRoot + "scenery.png",
                open: false,
                do: this.context.travelIntroToggle
            },
            {

                text: "合同详情",
                briefLogo: ImageConfig.pageImageRoot + "contract.png",
                open: false,
                do: this.context.travelContractToggle
            },
            {

                text: "保险详情",
                briefLogo: ImageConfig.pageImageRoot + "insurance.png",
                open: false,
                do: this.context.travelInsuranceToggle

            }
        ];

      
        this.context.updateMenuList();
    }

 
}