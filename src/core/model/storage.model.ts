import { CacheConfig } from './../../shared/config/cache.cofig';
/**
 * 缓存数据类型，最外层的data是微信定义的
 * data:{
 *   ext: {}
 *   value: T
 * }
 */
export interface WxStorage<T> {
    data: WxStorageData<T>;
}

/**
 * 缓存通用接口，连接本地和内存
 */
export interface CacheExt {
    expire: number;
}

/**
 * 缓存扩展，添加过期时间，加密等等
 */
export class WxStorageExt implements CacheExt {
    expire: number = CacheConfig.infiniteTime;
}

/**
 * 缓存数据类型
 */
export class WxStorageData<T>{
    ext: WxStorageExt;
    value: T;
}