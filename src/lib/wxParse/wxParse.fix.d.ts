/**
 * html(markdown解析器)声明，手工屏蔽了console.log
 *
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-16
 */
export namespace WxParse {

    /**
         * WxParse.wxParse(bindName , type, data, target,imagePadding)
         * 1.bindName绑定的数据名(必填)
         * 2.type可以为html或者md(必填)
         * 3.data为传入的具体数据(必填)
         * 4.target为Page对象,一般为this(必填)
         * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
       */
    export function wxParse(bindName: string, type: string, data: string, target:IPage, imagePadding?): void|boolean;


}