/**
 * 缓存配置，主要配置 key
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-10
 */
export class CacheConfig{
    //永久缓存
    static readonly infiniteTime:number = -1;
    static readonly userServer:string = "_user_server";
    static readonly userWx:string = "_user_wx";
    static readonly qCouldAccess = "_qcloud_access";
    static readonly systemInfo = "_system_info";
}