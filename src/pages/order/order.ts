import { BasePage } from './../../core/model/base-page.model';
import { InvalidFormControl } from './../../core/model/form.model';
import { ModalService } from './../../core/service/modal.service';
import { Validator } from './../../core/util/validator.util';
import { RxService } from './../../core/service/rx.service';
import { RxWxApi } from './../../core/service/rx-wx.api';
import { LoggerService } from './../../core/service/logger.service';
import { OssAccessOptions } from './../../core/model/oss.model';
import { OssService } from './../../core/service/oss.service';
import { Inject, Type, AutoWired } from "../../lib/ioc/index"
import { OrderService } from './order.service';
import { PageRoute } from "../../shared/config/index";
import { Util } from '../../core/util/util';
import { FormControlDep, FormControl, FormValidator } from '../../core/model/form.model';
import { FormServiceDep } from '../../core/service/form.service';
import { FormWidget } from '../../shared/widget/form.widget';
import { OrderPresenter } from "./order.presenter"
/**
 * @brief    该文件主要为页面的视图层
 * @author   gyt
 * @date     2017/2/22
 * @modified:ychost<c.yang@tutufree.com>(2017-3-2)
 * 				重构表单，换成FormWidget
 */
@AutoWired
export class OrderPage extends BasePage<OrderPresenter>{

	@Inject
	@Type(LoggerService)
	logger: LoggerService;

	@Inject
	@Type(OrderService)
	orderService: OrderService;


	data = {
		/*行程表单显示隐藏*/
		pageShow: true,
		/*表单提交确认框*/
		modalHidden: true,
		toastHidden: true,
		noticeStr: '',
	}



	/**
	 * 点击事件
	 * 
	 * @param {*} event 
	 * 
	 * @memberOf RegisterPage
	 */
	submitOrder(event: any): void {
		let invcs: InvalidFormControl[] = FormWidget.getInvalidFormControls(this.formControls);
		if (invcs.length > 0) {
			FormWidget.showInvalidModal(invcs[0].control.title);
			return;
		}


		if (FormWidget.lockFetch(this)) {
			return;
		}

		let order = FormWidget.controlsToModel(this.formControls);
		this.orderService.postSimpleOrder(order).subscribe((code: number) => {
			if (code == RxService.REP_SUCC_CODE) {
				wx.navigateTo({
					url: PageRoute.sharedMsgSuccess("感谢您的提交，我们稍后将与您联系", PageRoute.order)
				})
				this.onLoad({ reInit: true });
			} else {
				wx.showModal({
					title: "出错了",
					content: "服务器繁忙，请稍后重试",
					showCancel: false,
				})
			}
			FormWidget.unlockFetch(this);
		})



	}

	updateFormData(formData): void {
		this.setData({
			formData1: formData
		})
	}
	onLoad(options: any): void {
		let reInit = options.reInit ? options.reInit : false;
		//第二次重置视图
		if (reInit) {
			this.presenter.onReInit();
			//首次初始化
		} else {
			this.presenter = new OrderPresenter(this);
			FormWidget.renderX(this.formControls, this, "formData1", "controlChanges1", this.updateFormData);
		}

	}

	callContact(event): void {
		let phoneNumber = event.target.dataset.phonenumber;
		wx.makePhoneCall({
			phoneNumber: phoneNumber
		})
	}
	formControls: Array<FormControl>;

}
Page(new OrderPage())
