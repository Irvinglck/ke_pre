## 开发
```bash
    # 克隆代码
    git clone https://github.com/lss5270/vue-admin-spa.git
    # 安装依赖
    npm install
    #or 直接解压node_modules.7z到当前位置 （比较适合新手）。

    # 本地开发 开启服务
    npm run dev
    #or 直接双击start.bat（比较适合新手）
```
```[下载node_modules](http://pan.baidu.com/s/1eSL4I8y)
```

浏览器访问 http://localhost:2018

## 发布
```bash

    # 构建生产环境
    npm run build:prod
    #or 直接双击build.bat（比较适合新手）
```
## 模拟运行正式环境
```bash
    # nginx环境下运行
    1.准备nginx环境，自行到nginx官网（https://nginx.org/）下载，并解压
    2.双击build.bat后根目录生成一个dist包，把dist整个文件夹拷贝到nginx解压后的html下
    3.启动nginx服务：双击nginx.exe
    4.访问入口：http://localhost/dist/index.html
    ………

    8.关闭nginx服务：直接删进程

    # tomcat环境下运行
    参照nginx步骤即可
```

## 关于图标
```
    本项目使用了两套图标系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/icon
    2.http://fontawesome.io/icons/
    使用方法：
    a.在index.html中引入<link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
    b.在使用图标的地方放置图标<i class="fa fa-home" aria-hidden="true"></i>
```
## 关于UI系统
```
    由于bootstrap不支持mvvm已弃用，本项目使用了全新的elementUI系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/installation

```
## 关于.vue文件中背景图片路径，打包到生产环境路径404的问题修复
```
    具体修复方法，参照Issues中的 #6问题

```

