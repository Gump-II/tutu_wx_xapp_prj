import { ModalService } from './../../../core/service/modal.service';
import { BasePresenter } from '../../../core/model/base-presenter.model';
import { DriverRegisterPage } from './register';
import { PageInit } from '../../../core/model/page.init';
import { AutoWired } from '../../../lib/ioc/typescript-ioc';
import { FormControl, FormValidator } from '../../../core/model/form.model';
import { Util } from '../../../core/util/util';
@AutoWired
export class DriverRegisterPresenter extends BasePresenter<DriverRegisterPage>{
    protected onPageInit(): void {
        this.initPage1FormControls();
        this.initPage2FormContorls();
        this.initPage3FormControls();
    }

    specialControl = {
        phoneNumberControl: this.page.page1FormControls[1],
        captchaControl: this.page.page1FormControls[2]
    }
    onServerFailed(): void {
        ModalService.showErrorModal("服务器繁忙，请稍后重试入");
    }
    onUnknownFailed(e): void {
        this.logger.error(e);
        ModalService.showErrorModal("请检查网络连接");
    }
    onDupRegisterFailed(): void {
        ModalService.showErrorModal("您已经注册过了，我们稍后将联系您");
    }
    onUploadImageFailed(imageName: string): void {
        ModalService.showErrorModal(imageName + "上传失败，请检查网络");
    }
    onUploadImageError(imageName: string, e: Error): void {
        ModalService.showErrorModal(imageName + "上传错误！！！" + e);
    }


    private initPage1FormControls(): void {
        this.page.page1FormControls = [
            {
                title: "手机验证",
                type: FormControl.splitTextType
            }, {
                title: "手机号",
                placeholder: "请输入手机号码",
                name: "phoneNumber",
                type: FormControl.inputType,
                maxlength: 11,
                inputValueType:FormControl.inputTypeNumber,
                value: "",
                validators: [FormValidator.checkPhoneNumber]
            }, {
                title: "验证码",
                placeholder: "请输入验证码",
                inputValueType:FormControl.inputTypeNumber,
                name: "capthca",
                type: FormControl.inputTypeWithButton,
                value: "",
                button: {
                    title: "获取验证码",
                    bindtapFuncName: "getCaptchaEvent",
                    disable: false
                },
                maxlength: 6
            }
        ]
    }

    private initPage2FormContorls(): void {
        this.page.page2FormControls = [
            {
                title: "师傅信息",
                type: FormControl.splitTextType
            }, {
                title: "姓名",
                name: "name",
                placeholder: "请输入姓名",
                type: FormControl.inputType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "身份证",
                name: "idCard",
                inputValueType:FormControl.inputTypeIdCard,
                placeholder: "请输入身份证",
                type: FormControl.inputType,
                validators: [FormValidator.checkIdCard]

            }, {
                title: "车辆信息",
                type: FormControl.splitTextType
            }, {
                title: "性别",
                name: "sex",
                value: "请选择",
                options: ["男", "女"],
                type: FormControl.selectorType
            }, {
                title: "驾驶证号",
                name: "driverLicense",
                placeholder: "请输入驾驶证",
                type: FormControl.inputType,
                validators: [FormValidator.checkNullOrEmpty]

            }, {
                title: "车牌号",
                name: "carlicenseNum",
                placeholder: "请输入车牌号",
                type: FormControl.inputType,
                validators: [FormValidator.checkCarLicense]

            }, {
                title: "运营证号",
                name: "businessNum",
                placeholder: "选填",
                type: FormControl.inputType

            }, {
                title: "车辆性质",
                name: "carProperty",
                value: "请选择",
                options: ["非营运车", "租赁车", "公司车", "会议车"],
                type: FormControl.selectorType
            }, {
                title: "车辆车型",
                name: "motorcycleType",
                value: "请选择",
                options: ["宝马", "奔驰", "本田", "标致", "大发", "大宇", "大众", "道奇", "丰田", "北京", "福特", "福田", "吉普", "江铃", "富奇", "悍马", "解放", "拉达", "大众", "铃木", "丰田", "陆虎", "福特", "马自达", "其它"],
                type: FormControl.selectorType
            }, {
                title: "车辆类型",
                name: "carType",
                value: "请选择",
                options: ["大", "中", "小"],
                type: FormControl.selectorType
            }, {
                title: "载客人数",
                name: "passengerNum",
                value: "请选择",
                options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "其它"],
                type: FormControl.selectorType
            }
        ]
    }

    private initPage3FormControls(): void {
        let bindtapInAddStateName = "chooseImageEvent";
        let bindtapInPreviewStateName = "chooseImageEvent";
        this.page.page3FormControls = [
            {
                title: "个人头像照",
                name: "photoPersonal",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                },
                value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "商业险正面照",
                name: "photoCommercialInsuranceFront",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                },
                value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "身份证正面照",
                name: "photoIdCardFront",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "身份证背面照",
                name: "photoIdCardRear",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "行驶证正面照",
                name: "photoDriveLicenseFront",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "行驶证背面照",
                name: "photoDriveLicenseRear",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "车辆正面照",
                name: "photoCarFront",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }, {
                title: "车辆侧面照",
                name: "photoCarRear",
                imageUpload: {
                    bindtapInAddState: bindtapInAddStateName,
                    bindtapInPreviewState: bindtapInPreviewStateName
                }, value: "",
                type: FormControl.imageUploadType,
                validators: [FormValidator.checkNullOrEmpty]
            }
        ]
    }
}