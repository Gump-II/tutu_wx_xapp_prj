import { environment } from './../../shared/config/index';
import { AutoWired, Container, Singleton, Provided, Provider } from "../../lib/ioc/index"

/**
 * 日志服务，用于抉择debug和prod模式的 log
 * 
 * @author: ychost
 * @date  : 2017-2-7
 */
const loggerServiceProvider: Provider = {
    get: () => {
        if (environment.logger) {
            return new OpenLoggerService();
        } else {
            return new CloseLoggerService();
        }
    }
};

@AutoWired
@Provided(loggerServiceProvider)
@Singleton
export class LoggerService {
    log = (message?: any, ...optionalParams: any[]) => {
    }
    warn = (message?: any, ...optionalParams: any[]) => {

    };

    error = (message?: any, ...optionalParams: any[]) => {

    }
}

/**
 * 调试用的日志服务
 */
class OpenLoggerService extends LoggerService {

    log = console.log;
    warn = console.warn;
    error = console.error;
}

/**
 * 发布用的日志服务
 */
class CloseLoggerService extends LoggerService {
 
}


