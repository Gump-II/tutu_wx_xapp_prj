/**
 * 接入OSS服务器必须的参数
 * 从自己的服务器获取
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-17
 * @export
 * @class OssAcess
 */
export class OssAccess {
    accessKeyId: string;
    dir: string;
    url: string;
    policy: string;
    signature: string;
    expire: string;
}

/**
 * 获取OssAcess所需要的参数
 * 
 * @export
 * @class OssParams
 */
export class OssAccessOptions {
    //手机号
    id: string;
    //类型，只能取typeDriver等常量
    type: string;
    static typeDriver: string = "Driver";
    static typeJourney: string = "Journey";
}

/**
 * oss上传时form表单额外的数据
 * 
 * @export
 * @class OssUploadExt
 */
export class OssUploadExt {
    policy: string
    OSSAccessKeyId: string
    success_action_status: string = "200"
    signature: string
    key:string
    /**
     * 通过接入参数和文件夹名字初始化
     * @param {OssAccess} access  接入oss的参数
     * @param {string} folderName  上传放入的文件夹名字，一般为手机号码
     * 
     * @memberOf OssUploadExt
     */
    constructor(access:OssAccess,fileName){
        this.policy = access.policy;
        this.OSSAccessKeyId = access.accessKeyId;
        this.signature = access.signature;
        this.key = access.dir + "/" +fileName;

    }
    
}

