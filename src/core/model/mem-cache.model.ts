import { CacheConfig } from './../../shared/config/cache.cofig';
import { CacheExt } from './storage.model'
/**
 * 内存缓存模型
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-13
 */

export class MemCache {
    [key: string]: MemCacheData;
}

export class MemCacheData {
    value: any;
    ext: MemCacheExt;
}

/**
 * 内存缓存额外数据
 */
export class MemCacheExt implements CacheExt {
    expire: number = CacheConfig.infiniteTime;
}