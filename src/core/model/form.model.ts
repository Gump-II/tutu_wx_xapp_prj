import { Util } from './../util/util';
import { Validator } from '../util/validator.util';
/**
 * 表单模型，请参考 pages/order
 * @example 
 *  wxml:
 *       <input type="text" value="{{control.value}}" data-object="{{control}}" placeholder="{{control.placeholder}}" bindinput="bindChanges"></input>
 *  ts:
 *  	bindChanges(event: any): void {
		let viewControl: OrderFormContrl = event.target.dataset.object;
		let control = this.formControls.filter(control => control.name == viewControl.name).pop();
		if (!Util.isNullOrUndefined(control)) {
			let value = event.detail.value;
			control.value = value;
			//更新选择视图
			if (control.type == FormControl.optionsType) {
				this.setData({
					formControls: this.formControls
				})
			}
		}

	}

    submit():void{
        let orderModel: OrderModel = new OrderModel();
		orderModel = FormService.mapControlToModel(this.formControls, orderModel)
        http.post(url,orderModel)
    }
    @deprecated     请使用 AbstractFormControl
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-25
 * @export
 * @class Form
 */
export abstract class FormControlDep {
    //该项名字用于wxml 比如：(姓名：)
    title?: string;
    //是否为必填项目 
    isRequired?: boolean = false;
    //提示占位符号 比如：(请输入姓名)
    placeholder?: string;
    //该项的值这个是用户实际输入得知
    value?: string;
    //该项的名字，用于提示用 比如：(姓名)
    name?: string;
    //类型，不如input　textarea等等
    type?: string = FormControlDep.inputType;
    //携带的事件
    do?: Function;
    //映射到实际提交表单的属性，比如：Util.getPropertyName(() =>  OrderModel.prototype.phoneNum)
    mapProperty?: string;
    //最大长度
    maxlength?: number;
    static readonly inputType: string = 'input';
    static readonly textAreaType: string = 'textarea';
    static readonly optionsType: string = 'options';
}

export class FormControl {
    //该项名字用于wxml 比如：(姓名：)
    title: string;
    //提示占位符号用于wxml 比如：(请输入姓名)
    placeholder?: string;
    //该项的值这个是用户实际输入得知
    value?: any;
    //选项专用
    options?: string[];

    //验证算法
    validators?: [(control: FormControl) => string | FormControl];
    //模型名称，与服务器匹配
    name?: string;
    //类型，不如input　textarea等等
    type?: string = FormControl.inputType;
    //携带的事件
    do?: Function;
    //最大长度
    maxlength?: number;
    //序号
    index?: number;
    //带按钮和inputTypeWithButton一起使用
    button?: ButtonControl;
    //图片上传框type为imageUploadType
    imageUpload?: ImageUploadControl;
    //input框框类型
    inputValueType?: string;

    //inputValueType的取值
    static readonly inputTypeText = "text";
    static readonly inputTypeNumber = "number";
    static readonly inputTypeIdCard = "idcard";
    static readonly inputTypeDigit = "digit";

    static readonly inputType: string = '<% FORM_INPUT %>';
    static readonly textAreaType: string = '<% FORM_TEXTAREA %>';
    static readonly optionsType: string = '<% FORM_OPTIONS %>';
    static readonly dateType: string = '<% FORM_OPTIONS_DATE %>';
    static readonly splitTextType: string = '<% FORM_SPLIT_TEXT %>';
    static readonly selectorType: string = '<% FORM_OPTIONS_SLECTOR %>';
    //必须包含button属性
    static readonly inputTypeWithButton: string = '<% FORM_INPUT_BUTTON %>';
    //图片上传
    static readonly imageUploadType: string = '<% FORM_IMAGES_UPLOAD %>';
}

/**
 * 按钮控件和input一起使用，比如获取验证码
 * 
 * @export
 * @class ButtonControl
 */
export class ButtonControl {
    title?: string;
    disable?: boolean;
    //page里面的function名字
    bindtapFuncName?: string;
}

export class ImageUploadControl {
    bindtapInAddState?: string;
    isPreviewed?: boolean;
    previewImagePath?: string;
    bindtapInPreviewState?: string;
}

/**
 * 校验失败返回的控件
 * 
 * @export
 * @class InvalidFormControl
 */
export class InvalidFormControl {
    control: FormControl;
    validators: ((control: FormControl) => string | FormControl)[] = [];
}

export class FormValidator {
    /**
     * 校验字符串是否为空
     * 
     * @static
     * @param {FormControl} control 
     * @returns {boolean} 
     * 
     * @memberOf FormValidator
     */
    static checkNullOrEmpty(control: FormControl): string | FormControl {
        return FormValidator.checkTureToFalse(control, Util.isNullOrEmpty);

    }

    /**
     * 身份证
     * 
     * @static
     * @param {FormControl} control 
     * @returns {(string | FormControl)} 
     * 
     * @memberOf FormValidator
     */
    static checkIdCard(control: FormControl): string | FormControl {
        return FormValidator.checkTureToTrue(control, Validator.isIdCard)
    }

    static checkCarLicense(control: FormControl): string | FormControl {
        return FormValidator.checkTureToTrue(control, Validator.isCarLicense);
    }

    /**
     * 校验字符串格式是否满足日期格式
     * 
     * @static
     * @param {FormControl} control 
     * @returns {boolean} 
     * 
     * @memberOf FormValidator
     */
    static checkDate(control: FormControl): string | FormControl {
        return FormValidator.checkTureToTrue(control, Util.isDate);
    }

    static checkPhoneNumber(control: FormControl): string | FormControl {
        return FormValidator.checkTureToTrue(control, Validator.isPhoneNumber);
    }


    /**
     * 正常逻辑
     * 
     * @static
     * @param {FormControl} control 
     * @param {(str: string) => boolean} valite 
     * @returns {string} 
     * 
     * @memberOf FormValidator
     */
    static checkTureToTrue(control: FormControl, validate: (str: string) => boolean): string | FormControl {
        if (!Util.isNullOrUndefined(control.validators) && validate(control.value)) {
            return FormValidator.trueValidateSymbol;
        }
        return control;
    }

    /**
     * 反逻辑检验，比如Util.isNullOrEmpty就需要反逻辑
     * 
     * @static
     * @param {FormControl} control 
     * @param {(str: string) => boolean} valite 
     * @returns {string} 
     * 
     * @memberOf FormValidator
     */
    static checkTureToFalse(control: FormControl, valite: (str: string) => boolean): string | FormControl {
        if (!Util.isNullOrUndefined(control.validators) && !valite(control.value)) {
            return FormValidator.trueValidateSymbol;
        }
        return control;
    }
    static readonly trueValidateSymbol: string = "____true____";

}