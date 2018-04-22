
/**
 * 腾讯云请求参数
 * 
 * @export
 * @class QCloudOptions
 */
export class QCloudOptions {
    //手机号
    id:string;

    //服务器类型
    //阿里云 || 腾讯云
    serviceType: string = QCloudOptions.serviceTypeQCloud;
    //文件类型
    //司机 || 行程
    ossSignType: string;

    constructor(id:string,type: string) {
        this.ossSignType = type;
        this.id = id;
    }

    static serviceTypeAliOss: string = "AliOss";
    static serviceTypeQCloud: string = "Qcloud";

    static ossSignTypeJourney: string = "Journey";
    static ossSignTypeDriver: string = "Driver";
}