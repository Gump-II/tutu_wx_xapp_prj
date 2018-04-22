import { PageRoute } from './../../../shared/config/page.route';
import { Observable } from 'rxjs/Observable';
import { ErrorConfig } from './../../../shared/config/error.config';
import { ModalService } from './../../../core/service/modal.service';
import { RxService } from './../../../core/service/rx.service';
import { DriverRegisterService } from './register.service';
import { FormValidator, FormControl } from './../../../core/model/form.model';
import { Util } from './../../../core/util/util';
import { FormWidget } from './../../../shared/widget/form.widget';
import { BasePage } from './../../../core/model/base-page.model';
import { DriverRegisterPresenter } from "./register.presenter"
import { AutoWired } from '../../../lib/ioc/typescript-ioc';
import { Type, Inject } from '../../../lib/ioc/index';
import { RxWxApi } from '../../../core/service/rx-wx.api';

/**
 * 师傅注册页面
 *
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-3-2 
 * @export
 * @class DriverRegisterPage
 * @extends {BasePage<DriverRegisterPresenter>}
 */
@AutoWired
export class DriverRegisterPage extends BasePage<DriverRegisterPresenter>{

    @Inject
    @Type(DriverRegisterService)
    registerService: DriverRegisterService;

    pagesTitle: string[] = ["注册第1/3步", "注册第2/3步", "注册第3/3步"];
    data = {
        currentPage: 1
    }

    /**
     * 渲染表单
     * 
     * @memberOf DriverRegisterPage
     */
    onLoad(): void {
        this.presenter = new DriverRegisterPresenter(this);
        FormWidget.renderX(this.page1FormControls, this, "formData1", "controlChanges1", this.updatePage1FormData);
        FormWidget.renderX(this.page2FormControls, this, "formData2", "controlChanges2", this.updatePage2FormData);
        FormWidget.renderX(this.page3FormControls, this, "formData3", "controlChanges3", this.updatePage3FormData);
    }

    /**
     * 重置页面，恢复初始化
     * 
     * @memberOf DriverRegisterPage
     */
    reset(): void {
        FormWidget.resetFormControls(this.page1FormControls);
        FormWidget.resetFormControls(this.page2FormControls);
        FormWidget.resetFormControls(this.page3FormControls);
        this.updatePage1FormData(this.page1FormControls);
        this.updatePage2FormData(this.page2FormControls);
        this.updatePage3FormData(this.page3FormControls);
        this.showPage(1);
        this.unsubscribe();
    }
    //各个页面的表单控件
    page2FormControls: FormControl[];
    page1FormControls: FormControl[];
    page3FormControls: FormControl[];
    //验证码倒计时句柄
    captchaInterval: any;
    /**
     * 获取验证码点击事件
     * 
     * @param {*} event 
     * @returns {void} 
     * 
     * @memberOf DriverRegisterPage
     */
    getCaptchaEvent(event: any): void {
        let phoneInvs = FormWidget.getInvalidators(this.presenter.specialControl.phoneNumberControl);
        //手机号有误
        if (phoneInvs.length > 0) {
            FormWidget.showInvalidModal(this.presenter.specialControl.phoneNumberControl.title);
            return;
        }
        //禁用获取验证码按钮
        this.updateCaptchaBtnEnable(false);

        let phoneNumber = this.presenter.specialControl.phoneNumberControl.value;
        this.registerService.getRegisterCaptcha(phoneNumber).subscribe((code) => {
            this.logger.log("code", code);
            //成功
            if (code == RxService.REP_SUCC_CODE) {
                this.captchaInterval = RxService.interval(1000, 120).subscribe(time => {
                    this.updateCaptchaBtnCountdown(120 - time);
                }, this.logger.error, () => {
                    this.updateCaptchaBtnRestore();
                });

                //用户重复注册
            } else if (code == RxService.REP_USER_ALREADY_EXISTED_CODE) {
                this.presenter.onDupRegisterFailed();
                this.updateCaptchaBtnRestore();
                //服务器问题
            } else {
                this.presenter.onServerFailed();
                this.updateCaptchaBtnRestore();
            }
        }, this.presenter.onUnknownFailed);

    }



    /**
     * 要校验数据
     * 
     * @param {*} event 
     * 
     * @memberOf DriverRegisterPage
     */
    switchPageEvent(event: any): void {
        let pageIndex: number = +event.currentTarget.dataset.pageindex;
        this.switchPage(pageIndex);
    }

    /**
     * 不校验数据
     * 
     * @param {*} event 
     * 
     * @memberOf DriverRegisterPage
     */
    showPageEvent(event: any): void {
        let pageIndex: number = Util.getViewData(event, "pageindex");
        this.showPage(pageIndex)
    }

    /**
     * 检查控件数据是否有效，无效则提示并返回FALSE
     * 
     * @param {FormControl[]} formControls 
     * @returns {boolean} 
     * 
     * @memberOf DriverRegisterPage
     */
    checkInvalidControls(formControls: FormControl[]): boolean {
        let invalidControls = FormWidget.getInvalidFormControls(formControls);
        if (invalidControls.length > 0) {
            FormWidget.showInvalidModal(invalidControls[0].control.title);
            return false;
        }
        return true;
    }

    /**
     * 检查第一页数据是否有效
     * 
     * @returns {Observable<boolean>} 
     * 
     * @memberOf DriverRegisterPage
     */
    checkPage1(): Observable<boolean> {
        return this.registerService.checkRegisterCaptcha(this.presenter.specialControl.phoneNumberControl.value,
            this.presenter.specialControl.captchaControl.value).switchMap(code => {
                //验证成功
                if (code == RxService.REP_SUCC_CODE) {
                    return this.registerService.initQCloud(this.presenter.specialControl.phoneNumberControl.value)
                } else {
                    FormWidget.showInvalidModal(this.presenter.specialControl.captchaControl.title);
                    return Observable.from([false]);
                }
            })
    }

    /**
     * 数据校验成功则切换页面，否则只弹出提示框，递增切换的逻辑
     * 即切换到第二页的时候会检验第一页的逻辑
     * @param {number} index 页码
     * @returns {void} 
     * 
     * @memberOf DriverRegisterPage
     */
    switchPage(index: number): void {
        switch (index) {
            //前往页面2，初始化腾讯云
            case 2:
                if (!this.checkInvalidControls(this.page1FormControls)) {
                    return;
                } else {
                    this.checkPage1().subscribe(isOk => { if (isOk) { this.showPage(index) }; }, this.presenter.onUnknownFailed);
                }
                break;
            //前往页面3 
            case 3:
                if (this.checkInvalidControls(this.page2FormControls)) {
                    this.showPage(index);
                }
                break;
            default:
                this.showPage(index);
                break;
        }
    }

    /**
     * 显示某页面
     * 
     * @param {number} index 页面序号 1-3
     * 
     * @memberOf DriverRegisterPage
     */
    showPage(index: number): void {
        if (index < 1 || index > this.pagesTitle.length) {
            throw new Error("请检查页面是否超过了" + this.pagesTitle + "的范围");
        }
        this.setData({
            currentPage: index
        })
        wx.setNavigationBarTitle({ title: this.pagesTitle[index - 1] });
    }

    onShow(): void {
        console.log("page", this.data.currentPage)
    }
    /**
     * 选择图片事件
     * 
     * @param {*} event 
     * 
     * @memberOf DriverRegisterPage
     */
    chooseImageEvent(event: any): void {
        let tempControl: FormControl = Util.getViewObjectData(event);
        let imageControl = this.page3FormControls.filter(c => Util.equals(tempControl, c)).pop();
        let sourceList = ["album", "camera"]
        RxWxApi.showActionSheet(['从相册中选择', '拍照'], "#009999").switchMap(res => RxWxApi.chooseImage(['compressed'], [sourceList[res.tapIndex]]))
            .switchMap(image => {
                let uploadName = imageControl.name + "." + image.tempFilePaths[0].split(".").pop();
                imageControl.imageUpload.previewImagePath = image.tempFilePaths[0];
                imageControl.imageUpload.isPreviewed = false;
                imageControl.value = uploadName;
                return this.registerService.uploadToQcloud(image.tempFilePaths[0], uploadName);
            }).subscribe(isOk => {
                if (isOk) {
                    imageControl.imageUpload.isPreviewed = true;
                } else {
                    this.presenter.onUploadImageFailed(imageControl.title);
                }
                this.updatePage3FormData(this.page3FormControls);

            }, error => {
                //用户取消
                if (error == ErrorConfig.wxShowActionSheetFailed) {
                    //上传遇到异常
                } else {
                    this.presenter.onUploadImageError(imageControl.title, error);
                }
            });
    }

    callContactEvent(event): void {
        let phoneNumber = event.target.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        })
    }

    /**
     * 完成注册
     * 
     * @param {*} event 
     * 
     * @memberOf DriverRegisterPage
     */
    completeRegisterEvent(event: any): void {
        if (!this.checkInvalidControls(this.page1FormControls) ||
            !this.checkInvalidControls(this.page2FormControls) ||
            !this.checkInvalidControls(this.page3FormControls)) {
            return;
        }
        let page1Model = FormWidget.controlsToModel(this.page1FormControls);
        let page2Model = FormWidget.controlsToModel(this.page2FormControls);
        let page3Model = FormWidget.controlsToModel(this.page3FormControls);
        let registerModel = Object.assign(page1Model, page2Model, page3Model);

        this.registerService.postRegisterInfo(registerModel).subscribe((code: number) => {
            if (code == RxService.REP_SUCC_CODE) {
                //跳转成功页面
                let succUrl = PageRoute.sharedMsgSuccessCustom("感谢您的注册，我们将稍后联系您", "../../../pages/driver/register/register");
                succUrl = "../" + succUrl
                wx.navigateTo({
                    url: succUrl
                });
                //重置
                this.reset();
            } else {
                this.presenter.onServerFailed();
            }
        })

    }

    /**
     * 快速注册
     * 17090883505
     * @param {*} eveny 
     * @returns {void} 
     * 
     * @memberOf DriverRegisterPage
     */
    quickRegister(eveny: any): void {
        if (!this.checkInvalidControls(this.page1FormControls)) {
            return;
        }
        this.checkPage1().subscribe(isOk => {
            if (isOk) {

                let quickModel = FormWidget.controlsToModel(this.page1FormControls);
            }
        }, this.presenter.onUnknownFailed)
    }


    /**
     * 取消订阅，
     * 1.消除倒计时 
     * @memberOf DriverRegisterPage
     */
    unsubscribe(): void {
        try {
            this.captchaInterval.unsubscribe();
            this.updateCaptchaBtnRestore();
        } catch (e) { }
    }


    //验证码按钮相关设置
    updateCaptchaBtnEnable(isEnable: boolean): void {
        this.presenter.specialControl.captchaControl.button.disable = !isEnable;
        this.updatePage1FormData(this.page1FormControls);
    }
    updateCaptchaBtnCountdown(time: number) {
        this.presenter.specialControl.captchaControl.button.title = time + " s";
        this.updatePage1FormData(this.page1FormControls);
    }
    updateCaptchaBtnRestore(): void {
        this.presenter.specialControl.captchaControl.button.title = "获取验证码";
        this.updatePage1FormData(this.page1FormControls);
        this.updateCaptchaBtnEnable(true);
    }

    //更新页面
    updatePage1FormData(formData) {
        this.setData({
            formData1: formData
        })
    }

    updatePage2FormData(formData) {
        this.setData({
            formData2: formData
        })

    }
    updatePage3FormData(formData) {
        this.setData({
            formData3: formData
        })
    }

    onUnload(): void {
        this.unsubscribe();
    }

}

Page(new DriverRegisterPage());