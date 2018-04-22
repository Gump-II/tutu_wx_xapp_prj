/**
 * 由于小程序的限制，所以在使用RxJs之前请打补丁
 * 尽可能使用 RxService，注意些修复setInterval clearTimeout等等
 * 
 * @author: ychost<c.yang@aiesst.com>
 * @date  : 2017-2-10
 */
class FixRxJs {
    static patch() {

        global.global = global;
        global.Object = Object;
        global.clearTimeout = clearTimeout
        global.setInterval = setInterval
        global.clearInterval =clearInterval
        global.setTimeout = setTimeout
        return global;

    }
}

global = FixRxJs.patch();

