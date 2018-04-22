import { Reflect } from "./Reflect"
/**
 * 由于小程序在实用 reflect-metadata 的时候无法动态获取到 type 等
 * 所以要手动指定数据的 type 等等
 * 
 * @author: ychost<c.yang@aiesst.com>
 * @time  : 2017-2-7
 */

/**
 * 装饰数据类型
 */
export function Type(type) {
    return Reflect.metadata("design:type", type);
}

/**
 * 装饰方法参数类型
 */
export function ParamTypes(...types) {
    return Reflect.metadata("design:paramtypes", types);
}

/**
 * 装饰方法返回参数类型
 */
export function ReturnType(type) {
    return Reflect.metadata("design:returntype", type);
}



