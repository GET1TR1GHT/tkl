# tkl
# 项目开发指南

## 安装依赖

此项目前端开发环境需要 node.4.x 以上的Node.js版本支持，建议使用 version-6.8 或更高版本来构建项目。

下载好源码之后需安装项目依赖才能运行整个项目，安装方式如下。

安装Node.js Modules
```ssh
$ npm install
```

安装Bower Modules
```ssh
$ bower install
```

## 运行项目

安装依赖完成后，需运行项目，并进行开发。主要的项目运行Task调用如下：

启动整站服务：
```ssh
$ gulp serve
```

清除开发构建缓存
```ssh
$ gulp clean
```

构建发布版项目
```ssh
$ gulp build
```

先清除构建缓存，再构建发布版项目

```npm
$ gulp
```

> 需要注意的是，在开发过程中，如果没有特定需要，请不要单独运行gulpfile中的某个独立task。

## 开发注意事项

### CSS管理

项目采用 SCSS 进行项目CSS源码文件管理，为了方便后期的维护升级，我们将CSS源码按照不同的页面以及页面中不同的板块进行分文件管理，并以页面名称命名文件夹，以页面板块名称命名每一个页面板块SCSS文件。

样例目录结构

```
--app
  |--styles
     |--pages
        |--service-details
            |--index.scss
            |--comp-pro-intro.scss
            |--comp-cost-explain.scss
```
每个页面的SCSS文件有一个index.scss文件统一输出，其他的模块样式SCSS文件则必须在这个页面的index.scss文件中被引用。就像这样

service-details - index.scss
```
@import "comp-pro-intro";
@import "comp-aptitude-licence";
@import "comp-organization-intro";
@import "comp-cost-explain";
```

项目中styles根目录的plugin文件是用于存放当前项目的所有样式配置文件的，它们均已plug-开头。

```
plug-common.scss //全局公共工具样式
plug-function.scss //scss公用函数调用
plug-mixin.scss //scss公用mixin方法调用
plug-varibale.scss //项目主题配置申明方案

```

## javascript 管理

对于JS的目录结构管理，暂时与SCSS的目录结构管理类似。


