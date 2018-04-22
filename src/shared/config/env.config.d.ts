/**
 * 程序环境变量声明，由于需要使用gulp来确定 debug的值，
 * 所以这里保留了env.Config.js,以及重新声明了env.config.d.ts
 * 
 * @author:ychost@<c.yang@aiesst.com>
 * @date  :2017-2-9
 */
 interface Environment {
    debug: boolean,
    logger:boolean
}

export const environment:Environment;