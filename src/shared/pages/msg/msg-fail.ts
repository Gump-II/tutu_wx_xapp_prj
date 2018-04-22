import { AutoWired } from '../../../lib/ioc/typescript-ioc';
@AutoWired
export class MsgFailPage implements IPage{

}

Page(new MsgFailPage());