import { InvalidFormControl, FormValidator } from './../../core/model/form.model';
import { Util } from './../../core/util/util';
import { FormControl } from '../../core/model/form.model';
/**
 * 表单控件渲染器，参考driver/register 和 order
 * 
 * @example
 *  ts:
 *      FormWidget.renderX(this.page1FormControls, this, "formData1", "controlChanges1", this.updatePage1FormData);
 *      FormWidget.renderX(this.page2FormControls, this, "formData2", "controlChanges2", this.updatePage2FormData);
 *
 *      注意里面的formData1，controlChanges1都要与wxml对应
 *
 *  wxml:
 *     <import src="../../../shared/widget/form.widget.wxml" />
 *     <template is="form" data="{{formData:formData1,controlChanges:'controlChanges1',type:'text'}}" />
 * 
 *      注意：每个表单的formData后面的值都不一样，建议按照formData1，formData2递增排列，
 *            controlChanges也不一样，建议按照controlChanges1，controlChanges2递增排列
 *            type为渲染的格式，目前就两种 text和image
 * 
 *  wxss:
 *           @import "../../shared/widget/form.widget.wxss";
 *
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-28
 * @export
 * @class FormWidget
 */
export class FormWidget {

    /**
     * 表单改变事件
     * 
     * @private
     * @static
     * @param {Array<FormControl>} formControls 
     * @param {*} formData 
     * @param {*} page 
     * @param {Function} updateView 
     * @param {(control: FormControl) => void} [onControlChanged] 
     * @returns {Function} 
     * 
     * @memberOf FormWidget
     */
    private static buildFormChanges(formControls: Array<FormControl>, formData: any, page: any, updateView: Function, onControlChanged?: (control: FormControl) => void): Function {
        return (event: any) => {
            let viewControl: FormControl = event.target.dataset.object;
            let control = formControls.filter(control => control.title == viewControl.title).pop();
            if (!Util.isNullOrUndefined(control)) {
                let value = event.detail.value;
                //选项的时候选中的是序号，所以要映射
                if (control.type == FormControl.selectorType) {
                    value = control.options[+value];
                }
                control.value = value;
                if (control.type.startsWith(FormControl.optionsType)) {
                    updateView(formData);
                }

                if (Util.isFunction(onControlChanged)) {
                    Reflect.apply(onControlChanged, page, [control]);
                }
            }
        }
    }

    /**
     * 渲染表单
     * 
     * @static
     * @param {Array<FormControl>} formControls 控件集合
     * @param {*} page 页面指针
     * @param {string} formDataStr 和wxml的formData:formData1 的字符串一样，则为formData1
     * @param {string} bindChanges  和wxml的controlChanges:controlChanges1 的字符串一样，则为controlChanges1
     * @param {(formDataStr?: FormControl[]) => void} updateView  更新视图方法，(formData)=>{this.setData({formData1:foramData})}
     * @param {(control: FormControl) => void} [onControlChanged] 
     * 
     * @memberOf FormWidget
     */
    static renderX(formControls: Array<FormControl>, page: any, formDataStr: string, bindChanges: string, updateView: (formDataStr?: FormControl[]) => void, onControlChanged?: (control: FormControl) => void) {

        let formData = page.data[formDataStr];
        if (Util.isNullOrUndefined(formData)) {
            formData = formControls;
        } else {
            throw new Error("该表单" + formDataStr + "已经渲染了，请勿重复渲染")
        }
        for (let p in page.data) {
            if (page.data[p] instanceof Array && Util.equals(page.data[p], formControls)) {
                throw new Error("表单" + p + "已经将其渲染了，请勿重复渲染")
            }
        }
        updateView(formData);

        if (!Util.isNullOrUndefined(page[bindChanges])) {
            throw new Error("事件 " + bindChanges + " 已经被绑定在其它表单上面，请勿重复使用")
        } else {
            page[bindChanges] = FormWidget.buildFormChanges(formControls, formData, page, updateView, onControlChanged);
        }

    }




    /**
     * 转换表单控件为提交模型
     * 
     * @static
     * @param {Array<FormControl>} formControls 表单控件
     * @returns {*} 表单模型
     * 
     * @memberOf FormWidget
     */
    static controlsToModel(formControls: Array<FormControl>): any {
        let model = {};
        formControls.forEach(control => {
            if (!Util.isNullOrUndefined(control.name)) {
                let value = control.value;
                //排除日期选择的默认值
                if (control.type == FormControl.dateType) {
                    if (!Util.isDate(value)) {
                        value = "";
                    }
                }
                model[control.name] = value;
            }
        })
        return model;
    }

    /**
     * 显示默认的校验失败的模态框
     * 
     * @static
     * @param {FormControl} formControl 
     * 
     * @memberOf FormWidget
     */
    static showInvalidModal(title: string): void {

        wx.showModal({
            title: "出错了",
            content: title + "输入有误，请重新输入",
            showCancel: false,
        })
    }

    /**
     * 获取校验失败的控件集合
     * 
     * @static
     * @param {Array<FormControl>} formControls 
     * @returns {InvalidFormControl[]} 
     * 
     * @memberOf FormWidget
     */
    static getInvalidFormControls(formControls: Array<FormControl>): InvalidFormControl[] {
        let invalidData = formControls.filter(c => !Util.isNullOrUndefined(c.validators)).map(c => {
            let invalid: any = {};
            invalid.validator = [];
            invalid.control = c;
            //找出校验失败的控件
            return c.validators.map(validator => {
                let control = validator(c)
                if (control != FormValidator.trueValidateSymbol) {
                    invalid.validator = validator;
                    return invalid;
                }
            }).filter(invalid => !Util.isNullOrUndefined(invalid));
        }).filter(invalids => invalids.length > 0);
        //对校验失败的数据格式化
        let invalidFormControls: Array<InvalidFormControl> = invalidData.map(invs => {
            let control = invs[0].control;
            let result: InvalidFormControl = new InvalidFormControl();
            result.control = control;
            invs.forEach(inv => {
                result.validators.push(inv.validator);
            })
            return result;
        })

        return invalidFormControls;
    }

    static getInvalidators(formControl: FormControl): Function[] {
        let invalidators: Function[] = [];
        let invs = formControl.validators.filter(v => !Util.isNullOrUndefined(v)).forEach(v => {
            if (v(formControl) != FormValidator.trueValidateSymbol) {

                invalidators.push(v);
            }
        });
        return invalidators;
    }

    /**
     * 给请求数据加锁，限制重复提交
     * 
     * @static
     * @param {*} page 
     * @returns {boolean} 
     * 
     * @memberOf FormWidget
     */
    static lockFetch(page: any): boolean {
        let locked: boolean = false;
        if (Util.isNullOrUndefined(page.__isSubmiting)) {
            locked = false;
            page.__isSubmiting = true;
        } else {
            if (page.__isSubmiting) {
                locked = true;
            } else {
                page.__isSubmiting = true;
                locked = false;
            }
        }
        console.log("locked", locked)
        return locked;
    }

    /**
     * 解除限制，应该在网络返回的时候调用
     * 
     * @static
     * @param {*} page 
     * 
     * @memberOf FormWidget
     */
    static unlockFetch(page: any): void {
        page.__isSubmiting = false;
    }

    static resetFormControls(formControls: FormControl[]): void {
        formControls.forEach(control => {
            if (!Util.isNullOrEmpty(control.name)) {
                control.value = "";
                if (control.type.startsWith(FormControl.optionsType)) {
                    control.value = "请选择";
                }
                if (control.type == FormControl.imageUploadType) {
                    control.imageUpload.previewImagePath = "";
                    control.imageUpload.isPreviewed = false;
                }

            }
        })
    }
}