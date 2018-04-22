import { ModalService } from './modal.service';
import { OssAccess } from './../model/oss.model';
import { RxWxApi } from './rx-wx.api';
import { Observable } from 'rxjs/Observable';
import { ServerRoute } from './../../shared/config/server.route';
import { QCloudOptions } from './../model/qcloud.model';
import { RxService } from './rx.service';
import { HttpService } from './http.service';
import { AutoWired, Inject, Type, Container, Singleton, Provided, Provider } from "../../lib/ioc/index"

/**
 * 腾讯有服务，用于上传文件
 * 
 * @export
 * @class QCloudService
 * 
 */
@AutoWired
@Singleton
export class QCloudService {

    @Inject
    @Type(HttpService)
    http: HttpService;

    /**
     * 获取长期有效签名
     * 
     * @param {string} phoneNumber  电话号码
     * @param {string} type         类型，Driver || Journey
     * @returns {Observable<string>} 
     * 
     * @memberOf QCloudService
     */
    getMultiEffectSignature(phoneNumber: string, type: string): Observable<OssAccess> {
        let options: QCloudOptions = new QCloudOptions(phoneNumber, type);
        return this.http.get(ServerRoute.OssAccess, options).map(RxService.httpSignalDataMap);
    }

    /**
     * 上传文件到腾讯云
     * 
     * @param {string} qcloudUrl 腾讯云地址
     * @param {string} filePath 文件的本地路径
     * @param {string} uploadName 上传的名字
     * @param {string} auth  验证签名
     * @param {number} insertOnly 0 覆盖  1 遇见重名抛异常
     * @returns {Observable<boolean>} 
     * 
     * @memberOf QCloudService
     */
    uploadFileToQcloud(qcloudUrl: string, filePath: string, uploadName: string, auth: string, insertOnly: number = 0): Observable<boolean> {
        return RxWxApi.uploadFile(qcloudUrl, filePath, uploadName, { Authorization: auth }, { op: "upload", insertOnly: insertOnly }).map(res => {
            if (res.data != null) {
                return true;
            }
            return false;
        })
    }
}


