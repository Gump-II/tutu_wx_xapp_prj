import { Validator } from './../../../core/util/validator.util';
import { RxService } from './../../../core/service/rx.service';
import { CacheConfig } from './../../../shared/config/cache.cofig';
import { RxWxApi } from './../../../core/service/rx-wx.api';
import { Util } from './../../../core/util/util';
import { ServerRoute } from './../../../shared/config/server.route';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../core/service/base.service';
import { OssAccess } from '../../../core/model/oss.model';
import { QCloudService } from '../../../core/service/qcloud.service';
import { AutoWired,Type,Inject } from '../../../lib/ioc/index';
@AutoWired
export class DriverRegisterService extends BaseService{
    private phoneNumber: string;
    private get qcloudAccess(): OssAccess {
        return RxWxApi.getMemCacheSync<OssAccess>(CacheConfig.qCouldAccess)
    }
    @Inject
    @Type(QCloudService)
    qcloudService: QCloudService;

    /**
     * 初始化qcloud，获取相应的图片上传证书
     */
    initQCloud(phoneNum: string): Observable<boolean> {
        if(!Validator.isPhoneNumber(phoneNum)){
            throw new  Error("初始化腾讯云,手机号有错");
        }
        this.phoneNumber = phoneNum;
        return this.fetchQcloudAccess();
    }

    fetchQcloudAccess(): Observable<boolean> {
        if (!Validator.isPhoneNumber(this.phoneNumber)) {         
            Observable.from([false]);
        }
        return this.qcloudService.getMultiEffectSignature(this.phoneNumber, "Driver").map(access => {
            this.logger.log("accesss", access);
            if (access != null) {
                RxWxApi.setMemCacheSync(CacheConfig.qCouldAccess, access, { expire: Util.secToMs(access.expire) });
                return true;
            }
            return false;
        })
    }
    /**
     * 上传司机图片到腾讯云
     * 
     * @param {string} filePath  文件路径
     * @param {string} uploadName 上传的服务器的文件名字
     * @returns {Observable<boolean>} 
     * 
     * @memberOf RegisterService
     */
    uploadToQcloud(filePath: string, uploadName: string): Observable<boolean> {
        if (Util.isNullOrUndefined(this.qcloudAccess)) {
            return Observable.from([false]);
        }
        if (!this.qcloudAccess.url.startsWith("https://") && !this.qcloudAccess.url.startsWith("http://")) {
            this.qcloudAccess.url = "https://" + this.qcloudAccess.url;
        }
        return this.qcloudService.uploadFileToQcloud(this.qcloudAccess.url, filePath, uploadName, this.qcloudAccess.signature, 0);
    }

    /**
     * 获取验证码
     * 
     * @param {string} phoneNum 
     * @returns {Observable<number>} 
     * 
     * @memberOf RegisterService
     */
    getRegisterCaptcha(phoneNum: string): Observable<number> {
        return this.http.get(ServerRoute.getCaptcha, { phoneNum: phoneNum }).map(RxService.httpSignalStateCode);
    }

    /**
     * 校验验证码
     * 
     * @param {string} phoneNum 
     * @param {string} capthca 
     * @returns {Observable<number>} 
     * 
     * @memberOf RegisterService
     */
    checkRegisterCaptcha(phoneNum: string, capthca: string): Observable<number> {
        return this.http.get(ServerRoute.checkCaptcha, { phoneNum: phoneNum, captcha: capthca }).map(RxService.httpSignalStateCode);
    }

    /**
     * 
     * 
     * @param {RegisterModel} registerModel 
     * 
     * @memberOf RegisterService
     */
    postRegisterInfo(registerModel: any) {
        return this.http.post(ServerRoute.driverRegister, registerModel).map(RxService.httpSignalStateCode);
    }
}   