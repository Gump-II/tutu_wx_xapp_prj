
/**
 * 工具类
 * 
 * @export
 * @class Util
 */
export class Util {
    static formatNumber(n: number): string {
        const formatString = n.toString();
        return formatString[1] ? formatString : '0' + formatString;
    }

    static formatTime(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        return [year, month, day].map(Util.formatNumber).join('/') + ' ' + [hour, minute, second].map(Util.formatNumber).join(':');
    }
    /**
     * 混入，derivedClass implements baseClass1,baseClass2
     * 达到多继承的效果
     */
    static applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            })
        });
    }

    /**
     * 检验是否为日期
     * 
     * @static
     * @param {any} str 日期字符串
     * @returns {boolean} 
     * 
     * @memberOf Util
     */
    static isDate(str): boolean {
        let date = new Date(str);
        return date.toString().indexOf("Invalid Date") == -1;

    }

    /**
     * 判断变量是否为空或者未定义
     * 
     * @static
     * @param {any} data 
     * @returns 
     * 
     * @memberOf Util
     */
    static isNullOrUndefined(data): boolean {
        try {
            if (typeof data == "undefined" || data == null || data == undefined) {
                return true;
            }
        } catch (e) {
            return false;
        }

        return false;
    }

    /**
     * 使数据为非空
     * 
     * @static
     * @param {*} data 
     * @returns {*} 
     * 
     * @memberOf Util
     */
    static makeValueNotNull(data: any): any {
        if (Util.isNullOrUndefined(data)) {
            data = {};
        }
        return data;
    }

    static getViewObjectData(event) {
        return Util.getViewData(event, "object");
    }

    static getViewData(event: any, name: string) {
        return event.currentTarget.dataset[name];
    }

    /**
     * 检索两个对象是否相等
     * 
     * @static
     * @param {any} x 
     * @param {any} y 
     * @returns 
     * 
     * @memberOf Util
     */
    static equals(x, y) {
        let in1 = x instanceof Object;
        let in2 = y instanceof Object;
        if (!in1 || !in2) {
            return x === y;
        }
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
        }
        for (let p in x) {
            let a = x[p] instanceof Object;
            let b = y[p] instanceof Object;
            if (a && b) {
                return Util.equals(x[p], y[p]);
            }
            else if (x[p] !== y[p]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 获取函数的名字
     * 
     * @static
     * @param {Function} func 
     * @returns {string} 
     * 
     * @memberOf Util
     */
    static getFunctionName(propertyFunction: any): string {
        let propertyArr = /\.([^\.;]+);?\s*\}$/.exec(propertyFunction.toString());
        return propertyArr[1].substring(0, propertyArr[1].length - 1);
    }
    /**
     * 字符串为空，或者为空格
     * 
     * @static
     * @param {any} str 
     * @returns {boolean} 
     * 
     * @memberOf Util
     */
    static isNullOrEmpty(str): boolean {
        if (Util.isNullOrUndefined(str)) return true;
        if (str == "") return true;
        let regu = "^[ ]+$";
        let re = new RegExp(regu);
        return re.test(str);

    }

    /**
     * 秒===》毫秒
     * 
     * @static
     * @param {string} sec 
     * @returns {number} 
     * 
     * @memberOf Util
     */
    static secToMs(sec: string): number {
        return +(sec + "000");
    }

    /**
     * 判断是否为函数
     * 
     * @static
     * @param {any} data 
     * @returns {boolean} 
     * 
     * @memberOf Util
     */
    static isFunction(data): boolean {
        if (Util.isNullOrUndefined(data)) {
            return false;
        }
        return (typeof (data) == "function");
    }

    /**
     * 获取属性的名字
     * @example
     *  Util.getPropertyName(()=>person.pName) will return pNlame
     * @param {any} propertyFunction 
     * @returns 
     * 
     * @memberOf Util
     */
    static getPropertyName(propertyFunction) {
        let propertyArr = /\.([^\.;]+);?\s*\}$/.exec(propertyFunction.toString());
        return propertyArr[1];
    }



}