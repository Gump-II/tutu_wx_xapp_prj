import { environment } from './../../shared/config/env.config';
/**
 * 用户模型
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-10
 */
export class ServerUser {
    userName: string;
    userToken: string;
    nickName: string;
    expire: string;

    constructor(userName: string, userToken: string) {
        this.userName = userName;
        this.userToken = userToken;
    }

    private static debugUser = new ServerUser("UserToken_hello", "world");

    /**
     * 秒====>微秒
     */
    static secToMs(expire: string): number {
        return +(expire + "000");
    }

    /**
     * 调试用的用户
     * 
     * @readonly
     * @static
     * @type {ServerUser}
     * @memberOf ServerUser
     */
    static get debugData(): ServerUser {
        return environment.debug ? ServerUser.debugUser : null;
    }

}