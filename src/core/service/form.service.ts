import { FormControlDep } from '../model/form.model';
import { Util } from '../util/util';
import { ModalService } from './modal.service';
/**
 * 表单服务，主要用于映射表单的view属性与提交的model属性
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-26 
 * @export
 * @class FormService
 */
export class FormServiceDep {
    /**
     * 视图control与model直接的属性映射，会修改传入的model
     * 
     * @static
     * @template M model的类型
     * @param {Array<FormControl>} formControls 视图表单control
     * @param {M} model 
     * @returns {M} 
     * 
     * @memberOf FormService
     */
    static mapControlToModel<M>(formControls: Array<FormControlDep>, model: M): M {
        Object.getOwnPropertyNames(model).map(p => {
            let control = formControls.filter(c => c.mapProperty == p).pop();
            if (Util.isNullOrUndefined(control)) {
                throw new Error("mapProperty不对: ==>" + p.toString());
            } else {
                model[p] = control.value;
            }
        })
        return model;
    }

    /**
     * 自动显示必填字段
     * 
     * @static
     * @param {Array<FormControl>} formControls 
     * @returns {void} 
     * 
     * @memberOf FormService
     */
    static autoWarnRequiredFiled(formControls: Array<FormControlDep>): boolean {
        let invalidControl = formControls.filter(control => control.isRequired && Util.isNullOrEmpty(control.value)).pop();
        if (!Util.isNullOrUndefined(invalidControl)) {
            ModalService.showErrorModal("请输入" + invalidControl.name);
            return false;
        }
        return true;
    }
}


