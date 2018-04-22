## 工程说明

* **@Log**

  * 2016-2-16

    1. 引入wxParse解析html，修复些许bug

       > 提取的html文件要修改其data-src为src，不然img无法显示图片

    2. 添加article页面作为文章解析页面

  * 2016-2-26

    1. 添加gulp命令参数 --logger

       > ​	gulp prod[debug] --logger true[false] 用于开启[关闭] 控制台日志
       >
       > ​	默认为true

* appId: 

  * aiesst:      wxb66b36375e621a94
  * tutufree:  wxacbf9cbc7fec3fd9

[TOC]

### 目录结构

* dist                      编译生成目录
* node_modules  npm直接安装的三方库
* src                       源代码
  * assets          图片等资源文件
  * core             核心文件，全局通用的服务，模型，工具等
  * lib                自己修改的库文件
  * pages          页面布局
  * shared        共享文件夹，比如配置，控件等等
  * typings         .d.ts文件

### 使用介绍

* 初始化

  * ```npm install -g gulp```

  * ```  npm install```

  * ```gulp debug```

    * > 注：gulp debug 的时候 environment.debug 为true
      >
      > ​        gulp prod   的时候 environment.debug 为false
      >
      > ​        gulp clean 会删除dist目录

* 调试

  * 微信调试工具打开dist目录即可，**注意：填写appId**
  * 修改源代码后调试工具会自动刷新，不要关闭 gulp debug
  * 修改完源代码一定要CTRL+S或者CTRAL+SHIFT+S

* 备注

  * ~~开发工具选egret wing ，预览用微信的调试工具~~
  * 开发工具改用 Vscode

### 服务介绍

* 依赖注入

  * 选取的轮子[typescript-ioc](https://github.com/thiagobustamante/typescript-ioc)，经过自己的修改

  * 由于小程序的限制，所以试用上需要注意如下几点

    * ```@Inject``` 之后必须跟上 ```@Type(classType)```

    * 构造函数中使用```@Type(classType)```无效，所以暂时不支持构造函数注入

    * 一般采取属性注入的方式如：

      > ```typescript
      > import { AutoWired, Inject, Type, Singleton } from "../../lib/ioc/index"
      >
      > @Inject
      > @Type(LoggerService)
      > private logger: LoggerService;
      > ```

    * 其余需要注意的就是生命周期，一般来说只会用到全局的生命周期如：

      > ```typescript
      >
      > @AutoWired
      > @Singleton
      > export class HttpService {
      >     @Inject
      >     @Type(LoggerService)
      >     private logger: LoggerService;
      > }
      >  
      > ```

* RxJs

  * 项目引入了RxJs来进行响应式编程，使用和官网一致，不用担心路径问题，gulp中已作处理
  * 已经封装了 HttpService 包含基本的get post 在core/service/http.service.ts中
  * 尽量习惯使用RxJs，少用回掉

* weui-wxss

  * 项目引进了微信官方的weiui作为全局的ui样式
  * 使用方法，下载weui-wxss的demo，然后查看需要样式的源码即可，[传送门](https://github.com/weui/weui-wxss/)

* wxParse

  * 这是个html标签解析方案，因为要加载公众号文章但是小程序不支持外部链接跳转，所以就提取公众号文章的html丢给小程序解析
    1. 提取出来的html文件要替换data-src为src
  * 修复了一些bug
    * .fix.*为修复bug的文件

### 编码规范

* 总体风格参考[angular2的风格指南](https://angular.cn/docs/ts/latest/guide/style-guide.html)

* 附加说明

  * 最好写```export class SomeClass ```，少写 ```export {SomeClass}```

    * 因为编译器没法对后者进行自动补全
    * 自动补全插件，autoImport 搜索即可安装

  * 若某个有导出的class则需要在该文件夹下面新建一个index.ts，负责导出文件夹下面所有的class如core/service/index.ts：

    > export * from "./logger.service"
    > export * from "./system.service"
    > export * from "./user.service"

  * 命名风格     feature.type.ts 其中如果feature含有多个单词，请用 -  隔开

    如：

    > logger.service.ts
    >
    > http-result.model.ts
    >
    > server.route.ts

  * 尽量使用依赖注入，少可能地出现 new 

  * 业务逻辑都放在service里面，page中只能含有刷新视图的逻辑，在page中注入业务逻辑然后订阅来实现交互

### 备注

* 不要开启微信调试工具的代码压缩，已经在gulp中开启了uglify 所以不需要再压缩了，若开启微信调试工具的压缩会出bug
* 由于小程序只有1M大小的限制，所以尽可能少调用本地图片资源等

### 插件

* [同步设置--Setting-Sync](https://link.zhihu.com/?target=https%3A//marketplace.visualstudio.com/items%3FitemName%3DShan.code-settings-sync)

  * > 上传 shift+alt+u
    >
    > 下载 shift+alt+d
    >
    > 设置的时候github账户类型为gist就行

* [注释插件--Document This](https://link.zhihu.com/?target=https%3A//marketplace.visualstudio.com/items%3FitemName%3Djoelday.docthis)

  * >/** 自动生成

* [Json => 接口--Json2Ts](https://marketplace.visualstudio.com/items?itemName=GregorBiswanger.json2ts)

  * >ctrl + alt + v

* [背景--Background](https://link.zhihu.com/?target=https%3A//marketplace.visualstudio.com/items%3FitemName%3Dshalldie.background)

* 关联小程序--vscode wxml

  * 额外设置

  > ```json
  > "files.associations": 
  >     {
  >       "*.wxml": "html",
  >       "*.wxss": "css"
  >    }	
  > ```

* 自动导入模块--AutoImport

  ​
