import {AutoWired,Inject,Singleton,Scope,Scoped,Provider} from "../../lib/ioc/typescript-ioc"

export class MyScope extends Scope { 
  resolve(iocProvider:Provider, source:Function) {
    console.log('created by my custom scope.')
    return iocProvider.get();
  }
}

