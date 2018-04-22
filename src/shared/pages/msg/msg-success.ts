import { Util } from './../../../core/util/util';
import { AutoWired } from '../../../lib/ioc/typescript-ioc';
/**
 * 操作成功提示页面
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @datee :2017-2-28 
 * @export
 * @class MsgSuccessPage
 * @implements {IPage}
 */
@AutoWired
export class MsgSuccessPage implements IPage {
    setData?: (data: any) => void;

    alertMsg = "操作成功"
    contentMsg = "";
    rediretctToUrl = "";
    data = {
        contentMsg: this.contentMsg
    }
    pageBack(): void {
        console.log("url",this.rediretctToUrl)
        if (Util.isNullOrEmpty(this.rediretctToUrl)) {
            wx.navigateBack({

            })
        } else {
            wx.redirectTo({
                url: this.rediretctToUrl,
                fail: () => {
                    wx.switchTab({
                        url: this.rediretctToUrl
                    })
                }
            })
        }
    }

    onLoad(options: any): void {
        this.contentMsg = options.content;
        this.rediretctToUrl = options.redirectTo;
        this.setData({
            contentMsg:this.contentMsg
        })
    }

    onMsgError(): void {
        wx.navigateBack({
        });
    }
}


Page(new MsgSuccessPage())