/**
 * 页面初始化代理，负责页面的数据初始化
 * @example pageinit.register(this)
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-23
 * @export
 * @abstract
 * @class PageInit
 * @template T 
 */
export abstract class PageInit<T extends IPage>{
    context: T;
    register(context: T) {
        this.context = context;
        this.init();
    }
    abstract init(): void;
}