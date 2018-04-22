import { Util } from './../util/util';
export class ModalService {
    static showErrorModal(content, successFuc?: Function, title: string = "出错了"): void {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: () => {
                console.log("success")
                if (Util.isFunction(successFuc)) {
                    successFuc();
                }
            }
        })
    }

    static showSuccModal(title: string, succMethod?: Function, ...params): void {
        wx.showToast({
            title: title,
            icon: "success",
            complete: () => {
                if (Util.isFunction(succMethod)) {
                    Reflect.apply(succMethod, this, params);
                }
            }
        })
    }

    static showLoadingToast(duration:number = 50000): void {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: duration,
            mask: true
        })
    }

    static showNetWorkFailedModal(succFunc?:Function):void{
        ModalService.showErrorModal("网络加载错误，请检查网络连接",succFunc)
    }

    static hideToast(): void {
        wx.hideToast();
    }
}