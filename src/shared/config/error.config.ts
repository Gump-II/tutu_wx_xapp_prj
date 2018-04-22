/**
 * 错误消息配置
 * 
 * @author:ychost
 * @date  :2017-2-9
 */
export class ErrorConfig{

    static readonly wxSessionIsDated:Error = new Error("微信登陆已过期")
    static readonly defaultFailedError:Error = new Error("请求发生错误");
    static readonly fetchFailed :Error = new Error("请求服务器失败");
    static readonly wxLoginFailed:Error = new Error("微信登陆失败");
    static readonly wxSetStorageFailed:Error = new Error("设置缓存失败");
    static readonly wxGetStorageFailed:Error = new Error("获取缓存失败");
    static readonly wxGetStorageInfoFailed:Error = new Error("获取缓存信息失败");
    static readonly wxRemoteStorageFailed:Error = new Error("移除缓存失败");
    static readonly wxUploadFileFailed:Error = new Error("上传文件失败")
    static readonly wxShowActionSheetFailed:Error = new Error("actionSheet出错");
    static readonly wxGetSystemInfoFailed:Error = new Error("获取设备信息失败");

}