/**
 * 请勿更改该文件，gulp会使用该文件来精简RxJs
 * 目前只导入了map与switchMap，使用的时候import 'rxjs.operator' 即可
 * 格式 import 'rxjs/add/operator/xxx';
 * 注意import后面一个空格，最后面的分号
 * 
 * @author: ychost<c.yang@aiesst.com>
 * @date  : 2017-2-10
 */

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
