/**
 * 校验器
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-24
 * @export
 * @class Validator
 */
export class Validator {
    /**
     * 身份证
     * 
     * @static
     * @param {string} idCard 
     * @returns {boolean} 
     * 
     * @memberOf Validator
     */
    static isIdCard(idCard: string): boolean {
        let idCardRegexp15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        let idCardRegexp18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (idCardRegexp18.test(idCard) || idCardRegexp15.test(idCard)) {
            return true;
        }
    }

    /**
     * 手机号
     * 
     * @static
     * @param {string} phoneNumber 
     * @returns {boolean} 
     * 
     * @memberOf Validator
     */
    static isPhoneNumber(phoneNumber: string): boolean {
        let isMob = /^1[34578]\d{9}$/;
        return isMob.test(phoneNumber);
    }

    /**
     * 车牌号
     * 
     * @static
     * @param {string} license 
     * @returns {boolean} 
     * 
     * @memberOf Validator
     */
    static isCarLicense(license: string): boolean {
        let carLicenseRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        return carLicenseRegExp.test(license)
    }
}