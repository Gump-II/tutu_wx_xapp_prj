import { OrderPage } from './order';
import { BasePresenter } from '../../core/model/base-presenter.model';
import { FormValidator, FormControl } from '../../core/model/form.model';
import { Util } from '../../core/util/util';

/**
 * 行程定制页面初始化
 * 
 * @author：ychost<c.yang@tutufree.com>
 * @date  : 2017-3-2
 * @export
 * @class OrderPresenter
 * @extends {BasePresenter<OrderPage>}
 */
export class OrderPresenter extends BasePresenter<OrderPage>{
    protected onPageInit(): void {
        this.initFormContorls();
    }

    initFormContorls(): void {
        this.page.formControls = [
            {
                title: "您可以在这里预定您的行程，我们将竭诚为您服务",
                type: FormControl.splitTextType
            },
            {
                title: "姓名",
                name: "nikeName",
                value: "",
                placeholder: "请输入姓名",
                type: FormControl.inputType,
            },
            {
                title: "电话",
                name: "phoneNum",
                value: "",
                placeholder: "请输入手机号",
                maxlength: 11,
                inputValueType:FormControl.inputTypeNumber,
                type: FormControl.inputType,
                validators: [FormValidator.checkPhoneNumber]

            },
            {
                title: "出发地",
                name: "starting",
                value: "",
                placeholder: "请输入出发地",
                type: FormControl.inputType,

            },
            {
                title: "目的地",
                name: "destination",
                value: "",
                placeholder: "请输入目的地",
                type: FormControl.inputType,

            },
            {
                name: "date",
                title: "出行日期",
                value: "请选择出行日期",
                placeholder: "请选择出行日期",
                type: FormControl.dateType,


            }, {
                title: "请添加相关备注",
                type: FormControl.splitTextType
            },
            {
                title: "备注",
                name: "remark",
                value: "",
                placeholder: "请输入备注，可输入100字",
                maxlength: 100,
                type: FormControl.textAreaType,
            }
        ]
    }

    onReInit(): void {
        this.page.formControls.forEach(c => {
            if (!Util.isNullOrUndefined(c.name)) {
                if (c.type.startsWith(FormControl.optionsType)) {
                    c.value = "请选择";
                } else {
                    c.value = "";
                }
            }
        })
        this.page.updateFormData(this.page.formControls);
    }
}