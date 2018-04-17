/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/** Begin polyfill */
	if (!String.prototype.includes) {
	    String.prototype.includes = function(search, start) {
	        'use strict';
	        if (typeof start !== 'number') {
	            start = 0;
	        }

	        if (start + search.length > this.length) {
	            return false;
	        } else {
	            return this.indexOf(search, start) !== -1;
	        }
	    };
	}
	/** End polyfill */



	// Begin test code.
	// 清除第一次访问记录
	window.clearFirstAccessRecord = function () {
	    delete localStorage.isOthers;	// 第一次访问为其他场景标志位：如商场。用于显示商场场景的新手引导
	    delete localStorage.isPark;		// 第一次访问为停车场场景标志位。用于显示停车场场景的新手引导
	    delete localStorage.isFirst;	// 第一次访问标志位。用于显示新手引导、缓存数据等处理逻辑

	    delete localStorage.preAccessDate;	// 前一次访问的日期，用于判断浮层广告一天只显示一次
	};

	// 清除签到相关缓存
	window.clearSignCache = function () {
	    delete localStorage.isExchangedGift;
	    delete localStorage.signedPointIds;
	    log.v('[clearSignCache] complete');
	};

	// 开始模拟扫描beacon初始化
	window.startSimulateInit = function(){
	    gTools.initOver = true;
	};
	// End test code.


	var STAT = {
	    ACTION: {
	        ONLINE_PAYMENT: '在线缴费',
	        REC_STORES_RECOMMEND: '推荐店铺',
	        REC_STORES_PRE_PAY: '预付卡店铺',
	        REC_STORES_VIP_DISCOUNT: '会员优惠店铺',
	        NAV_START: '开始导航',
	        NAV_STOP: '停止导航',
	        NAV_CANCEL: '取消导航',
	        SEARCH: '搜索',
	        SEARCH_CAR_NUM: '搜车牌',
	        VIEW_POI_DETAIL: '查看poi详情',
	        SHORTCUT_MENU: '快捷菜单',
	        GIFT_EXCHANGE: '兑换礼品',
	        GAME_RULES: '活动规则',
	        GIFT_EXCHANGE_SUCC: '兑换礼品成功',
	        SIGN_IN: '签到'
	    },
	    ACT_CODE: {
	        CLICK_MENU: {
	            REC_STORES_RECOMMEND: 1,          // 推荐店铺
	            REC_STORES_VIP_DISCOUNT: 2, // 会员优惠店铺
	            REC_STORES_PRE_PAY: 3,      // 预付卡店铺
	            ONLINE_PAYMENT: 4           // 停车场-在线缴费
	        }
	    }
	};
	/**
	 * Begin 封装百度统计的代码
	 * @author weibin
	 * 注意之前一定要确保已经完成百度统计代码段的初始化
	 * */
	//var bdStat = {
	window.bdStat = {
	    /**
	     * 事件追踪统计
	     * @author weibin
	     * @param {string} action 事件名称(用户行为)
	     * @param {string|object} [tag] 可选 事件标签(用户标签)
	     * @param {string} [type] 可选 事件类型(场景分类)
	     */
	    trackEvent: function (action, tag, type) {
	        if (!action) {
	            alert('必须传入action参数');
	            return;
	        }

	        type = type || gTools.buildingComment;
	        action += '|' + type;

	        typeof tag === 'object' && (tag = JSON.stringify(tag));
	        tag = action + (tag ? '|' + tag : '') + '|appid=' + gTools.appId + '|openid=' + gTools.openid + '|buildingId=' + gTools.buildingId + '|locateFloor=' + gTools.floorid + '|showingFloor=' + gTools.showingFloor + '|url=' + location.href;

	        _hmt.push(['_trackEvent', type, action, tag]);
	    }
	};
	/** End 封装百度统计的代码 */

	// 分类分组下拉菜单的区分字段对象
	var DROPDOWN_MENU = {
	    TYPE: {
	        CUSTOMIZE: 0,   // 自定义业态分类
	        FACILITY: 1,    // 公共设施
	        FIND_CAR: 2     // 停车/找车相关
	    }
	};



	//算法引入
	var Algorithm = __webpack_require__(2);
	var Beacon = __webpack_require__(3);
	var List = __webpack_require__(4);

	var $ = jQuery = __webpack_require__(5);

	// var layer = require("./layer");

	//统计数据接口
	//var Report = require("./report.es6");
	var Report = __webpack_require__(7);
	var conf = __webpack_require__(11);
	var OPENID = conf.OPENID,
	    APPID = conf.APPID,
	    ENTERTYPE = conf.ENTERTYPE,
	    ACTION = conf.ACTION,
	    MODEL = conf.MODEL,
	    BUILDINGID = conf.BUILDINGID,
	    FLOORID = conf.FLOORID,
	    DEBUG = conf.DEBUG,
	    AJAXURL = conf.AJAXURL,
	    ORIGIN = conf.AJAXURL,
	    BLUETEACH = conf.BLUETEACH,
	    UX = conf.UX,
	    UY = conf.UY,
	    FLOORIDOFL1 = conf.FLOORIDOFL1,
	    FLOORIDOFL2 = conf.FLOORIDOFL2,
	    FLOORIDOFM = conf.FLOORIDOFM,
	    FLOORIDOFB2 = conf.FLOORIDOFB2,
	    FLOORIDOFB3 = conf.FLOORIDOFB3,
	    UNIGNOREBEACONS = conf.UNIGNOREBEACONS,
	    YUZHIOFL1WHENINL2 = conf.YUZHIOFL1WHENINL2,
	    UAREA = conf.UAREA;

	    //BEACONLIST	=	conf.BEACONLIST,
	    //X	=	conf.X,
	    //Y	=	conf.Y;

	var beaconObj = {"init": false};

	//地图必须组件
	__webpack_require__(13);	    //缩放
	__webpack_require__(14);	//导航

	//妹子ui的js库
	__webpack_require__(15);

	//样式
	//require("./styles3.less");

	//部分扩展函数
	var fn1 = __webpack_require__(12), parseToNum = fn1.parseToNum;
	var fn = __webpack_require__(19);

	// 标签化 配置文件
	var config_lab = __webpack_require__(20),
	    LABELSCONFIG = config_lab.LABELSCONFIG;

	// 。。。。。。脑子进水的产物
	var Tools = __webpack_require__(21);

	//TODO gps相关 暂未用到
	//----
	window.Gps2Svg = __webpack_require__(23);
	var MathTools = __webpack_require__(24), math = new MathTools();
	//var gpsToBaiduGps = fn.gpsToBaiduGps;
	gps = new Gps2Svg([[121.497488, 31.193795], [121.498727, 31.193996], [121.50069, 31.185285], [121.499212, 31.185049]]);//百度坐标
	// -----


	var getSortFun = fn.getSortFun,	//排序
	    generateWxShareUrl = fn.generateWxShareUrl;	//生成分享链接

	window.svgToPage = fn.svgToPage;	//svg点坐标转换到页面上的pageX/pageY
	window.pageToSvg = fn.pageToSvg;	//page点坐标转换到svg上的x/y

	if (!String.prototype.includes) {
	    String.prototype.includes = function (str) {
	        return this.indexOf(str) > -1;
	    };
	}

	//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	/*
	 * tap
	 * */
	$.fn.tap = function (fn) {
	    var collection = this,
	        isTouch = "ontouchend" in document.createElement("div"),
	        tstart = isTouch ? "touchstart" : "mousedown",
	        tmove = isTouch ? "touchmove" : "mousemove",
	        tend = isTouch ? "touchend" : "mouseup",
	        tcancel = isTouch ? "touchcancel" : "mouseout";

	    collection.each(function () {
	        var i = {};
	        i.target = this;
	        // $(i.target).on(tstart,function(e){
	        //     var p = "touches" in e ? e.touches[0] : (isTouch ? window.event.touches[0] : window.event);
	        //     i.startX = p.clientX;
	        //     i.startY = p.clientY;
	        //     i.endX = p.clientX;
	        //     i.endY = p.clientY;
	        //     i.startTime = + new Date();
	        // });
	        // $(i.target).on(tmove,function(e){
	        //     var p = "touches" in e ? e.touches[0] : (isTouch ? window.event.touches[0] : window.event);
	        //     i.endX = p.clientX;
	        //     i.endY = p.clientY;
	        // });
	        // $(i.target).on(tend,function(e){
	        //     if((+ new Date())-i.startTime<300){
	        //         if(Math.abs(i.endX-i.startX)+Math.abs(i.endY-i.startY)<20){
	        //             e = e || window.event;
	        //             e.preventDefault();
	        //             fn.call(i.target,e);
	        //         }
	        //     }
	        //     i.startTime = undefined;
	        //     i.startX = undefined;
	        //     i.startY = undefined;
	        //     i.endX = undefined;
	        //     i.endY = undefined;
	        // });

	        $(i.target).on("tap", function (e) {
	            e = e || window.event;
	            e.preventDefault();
	            fn.call(i.target, e);
	        });
	    });

	    return collection;
	}

	/*
	 * 浏览器版本判断
	 * */
	;(function ($) {
	    //创建一个detect函数，参数为ua
	    function detect(ua) {

	        //this为Zepto，给它绑两个属性：一个os，一个browser
	        var os = this.os = {},
	            browser = this.browser = {},

	            webkit = ua.match(/WebKit\/([\d.]+)/),

	            android = ua.match(/(Android)\s+([\d.]+)/),

	            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

	            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

	            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),

	            weixin = ua.indexOf("MicroMessenger") > -1,

	            touchpad = webos && ua.match(/TouchPad/),

	            kindle = ua.match(/Kindle\/([\d.]+)/),

	            silk = ua.match(/Silk\/([\d._]+)/),

	            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),

	            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),

	            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),

	            playbook = ua.match(/PlayBook/),

	            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),

	        //比如火狐19,这边firefox是一个数组：["Firefox/19.0","19.0"];
	            firefox = ua.match(/Firefox\/([\d.]+)/);

	        // Todo: clean this up with a better OS/browser seperation:
	        // - discern (more) between multiple browsers on android
	        // - decide if kindle fire in silk mode is android or not
	        // - Firefox on Android doesn't specify the Android version
	        // - possibly devide in os, device and browser hashes

	        if (browser.webkit = !!webkit) browser.version = webkit[1];

	        if (android) os.android = true, os.version = android[2];

	        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');

	        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');

	        if (webos) os.webos = true, os.version = webos[2];

	        if (touchpad) os.touchpad = true;

	        if (blackberry) os.blackberry = true, os.version = blackberry[2];

	        if (bb10) os.bb10 = true, os.version = bb10[2];

	        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];

	        if (playbook) browser.playbook = true;

	        if (kindle) os.kindle = true, os.version = kindle[1];

	        if (silk) browser.silk = true, browser.version = silk[1];

	        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;

	        if (weixin) os.weixin = true;

	        //如果chrome有值的话，给browser装两个属性firefix和version
	        if (chrome) browser.chrome = true, browser.version = chrome[1];

	        //如果firefox有值的话，给browser装两个属性firefix和version
	        if (firefox) browser.firefox = true, browser.version = firefox[1];

	        //os必有一个属性tablet来标示是否是平板
	        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)));

	        //os必有一个属性phone来标示是否是手机，但是有问题：如果是pc的火狐，返回的居然也是true（当然它本身针对移动端的，呵呵，忽略忽略）
	        os.phone = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 || chrome || firefox))
	    }

	    //调用detect方法，把navigator.userAgent当参数传入
	    detect.call($, navigator.userAgent);

	    // make available to unit tests
	    //给Zepto绑上一个key为__detect对应的是detect这个function
	    $.__detect = detect
	})(jQuery);


	function inArray(val, arr) {
	    return $.inArray(val, arr) > -1;
	}

	// 时间格式化
	Date.prototype.format = function (format) {
	    /*
	     * format="yyyy-MM-dd hh:mm:ss";
	     */
	    format = format || 'yyyy-MM-dd hh:mm:ss';
	    var o = {
	        "M+": this.getMonth() + 1,
	        "d+": this.getDate(),
	        "h+": this.getHours(),
	        "m+": this.getMinutes(),
	        "s+": this.getSeconds(),
	        "q+": Math.floor((this.getMonth() + 3) / 3),
	        "S": this.getMilliseconds()
	    };

	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }

	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    }

	    return format;
	};


	window.gTools = new Tools({appid:conf.APPID, openid:conf.OPENID});
	window.report = new Report({appid:conf.APPID, openid:conf.OPENID, enterType: gTools.enterType});   // report模块依赖gTools对象,所以在此之前必须实例化一个gTools对象,并绑定到window对象上
	//report.appId = gTools.appId;
	//report.openId = gTools.openid;
	//report.enterType = gTools.enterType;




	// Begin 太古里改版暴露给外面的接口和变量等
	window.newNavigateTimer;
	window.newNavigateOpt = {text: "", title: ""};


	gTools.startNav = function (data, refine) {
	    removeNavPath();
	    //$("#search").val(""); // 改版后不需要

	    if (refine) {   // 新版导航
	        gTools.destination = {
	            floorId: data.floorId,
	            pointId: data.mapArea,
	            buildingName: gTools.buildingName,
	            isNavigatingFloor: 0,
	            // 追加用于上报导航统计
	            x: data.x,
	            y: data.y,
	            poiId: data.id,
	            mapArea: data.mapArea,
	            brand: data.brand
	        };
	    } else {    // 旧版导航
	        gTools.destination = {
	            floorId: data.floor,
	            pointId: data.maparea,
	            buildingName: gTools.buildingName,
	            isNavigatingFloor: 0,
	            // 追加用于上报导航统计
	            x: data.x,
	            y: data.y,
	            poiId: data.poiId,
	            mapArea: data.maparea,
	            brand: data.brand
	        };
	    }


	    newNavigateOpt.text = "欢迎小主下次光临哦！";
	    newNavigateOpt.title = "恭喜您抵达目的地";
	    // 追加用于上报导航统计
	    newNavigateOpt.brand = data.brand;

	    gTools.hideHalfModal();     // 隐藏半弹框
	    gTools.showLoading("亲，正在为您导航");
	    setTimeout(newNavigate, 100);
	};
	// End 太古里改版暴露给外面的接口和变量等



	/**
	 * 输出log信息到界面
	 * @param {string|object} text log内容
	 * @param {string} [type] log类型
	 * @constructor
	 */
	window.L = function (text, type) {
	    // 1.如果未开启debug模式,则不输出日志; 2.如果停止日志输出,也不输出日志
	    if (!sxDebug || gTools.stopLog) {
	        return;
	    }

	    text = text || 'empty';
	    if (typeof text !== 'string') {
	        text = JSON.stringify(text);
	    }

	    var cl = type === "err" ? "am-text-danger" : "";

	    if (!window.now) {
	        window.now = Date.now();
	    }
	    var difTime = Date.now() - window.now;   // 单位是毫秒
	    //var difTime = Math.round(Date.now() - window.now) / 1000;   // 将毫秒转化成秒

	    //// 缓存日志: 是否有必要进行日志缓存,甚至在未开启debug模式下也缓存日志?
	    //if (!gTools.logArr) {
	    //    gTools.logArr = ['<p class="' + cl + '">' + difTime + ':' + text + '</p>'];
	    //} else {
	    //    gTools.logArr.unshift('<p class="' + cl + '">' + difTime + ':' + text + '</p>');
	    //}
	    //// 最多只保留最近的500条记录,将500条之前的记录删除
	    //gTools.logArr.length > 500 && (gTools.logArr.splice(500));

	    //// 1.如果未开启debug模式,则不输出日志; 2.如果停止日志输出,也不输出日志
	    //if (!sxDebug || gTools.stopLog) {
	    //    return;
	    //}

	    //// 如果未开启debug模式,则不输出日志
	    //if (!sxDebug) {
	    //    return;
	    //}


	    // 如果尚未在界面上添加日志容器,则添加一个日志容器. 页面已经预先定义好了此容器,所以不需要重复设置了
	    //if (!gTools.hadInitDebugLogView) {
	    //    $("#body").append("<div id='debugLog'></div>");
	    //    gTools.hadInitDebugLogView = true;
	    //}
	    //$("#debugLog").prepend(gTools.logArr[0]);     // 如果对日志进行了缓存,则可以直接从缓存中取日志,速度会更快
	    $("#debugLog").prepend('<p class="' + cl + '">' + difTime + ':' + text + '</p>');
	};

	// Begin test code
	window.oneLog = {
	    v: function (msg) {
	        typeof msg === 'object' && (msg = JSON.stringify(msg));

	        L(msg);
	        log.v(msg);
	    },
	    d: function (msg) {
	        typeof msg === 'object' && (msg = JSON.stringify(msg));

	        L(msg);
	        log.d(msg);
	    },
	    i: function (msg) {
	        typeof msg === 'object' && (msg = JSON.stringify(msg));

	        L(msg);
	        log.i(msg);
	    },
	    w: function (msg) {
	        typeof msg === 'object' && (msg = JSON.stringify(msg));

	        L(msg);
	        log.w(msg);
	    },
	    e: function (msg) {
	        typeof msg === 'object' && (msg = JSON.stringify(msg));

	        L(msg);
	        log.e(msg);
	    }
	};
	// End test code


	// google分析
	// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	//         (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	//     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
	// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	//
	// //ga('create', 'UA-67415820-1', 'auto');
	// ga('create', 'UA-67415820-1', {
	//     'cookieDomain': 'none'
	// });
	// ga('send', 'pageview');

	// tianjin
	var recStores = "";
	var recommendStore = {
	    prePayCard: {
	        code: STAT.ACT_CODE.CLICK_MENU.REC_STORES_PRE_PAY,
	        type: 'prePayCard',
	        list: [],
	        containerId: 'js_pre_pay_card_store_list',
	        containerWrpId: 'js_pre_pay_card_store_list_wrp'
	    },
	    vipDiscount: {
	        code: STAT.ACT_CODE.CLICK_MENU.REC_STORES_VIP_DISCOUNT,
	        type: 'vipDiscount',
	        list: [],
	        containerId: 'js_vip_discount_store_list',
	        containerWrpId: 'js_vip_discount_store_list_wrp'
	    },
	    recommend: {
	        code: STAT.ACT_CODE.CLICK_MENU.REC_STORES_RECOMMEND,
	        type: 'recommend',
	        list: [],
	        containerId: 'js_recommend_store_list',
	        containerWrpId: 'js_recommend_store_list_wrp'
	    },

	    field: {
	        code: 'code',
	        type: 'type',
	        list: 'list',
	        containerId: 'containerId',
	        containerWrpId: 'containerWrpId'
	    },

	    haveRightPartData: false,
	    haveLeftPartData: false,
	    // 用于临时指向当前展开的推荐店铺列表对象
	    currentShow: null
	};
	window.recommendStore = recommendStore; // 供其他模块文件进行调用

	var map = $("#myMaps"),
	    file;

	//定位算法用到的变量……其实定位算法可以精简的= =，它的写法有问题
	var algorithm = new Algorithm();
	var beaconList;
	var floorList;
	var beacondataList;
	var linkdataList;
	var floors;
	var floorid;
	var beacons;

	// var floorNo;
	var logo;//定位图标= =
	var rotateangle = 0, oldAngle = 0;//手机角度
	// var inter=0;
	// var LastX=0,LastY=0;

	var Parkpoint;//停车找车
	var Lookpoint;
	// var shake=0;


	// tianjin
	var startPoint;
	var endPoint;
	var ff;

	var defaultOrientation;
	var R = 0;

	//位置坐标
	window.X = 0;
	window.Y = 0;

	var positionCurrent = {
	    lat: null,
	    lng: null,
	    hng: null
	};

	var lasthng = 0;

	var currentstep = 0;
	// 以上基本都不是我定义的by sx

	var hiddenLinks = {};//隐藏类型的广告
	window.hiddenLinks = hiddenLinks;

	// Begin params for sign in.
	var globalSignFloors,
	    globalSignedPointIds = localStorage.hasOwnProperty('signedPointIds') ? JSON.parse(localStorage.signedPointIds) : [],
	    globalSignPointCnt = 0,
	    globalIgnoredSignPoints = {},// 被忽略的签到点,5分钟内不再重复弹出签到框

	    GLOBAL_FEILE_GIFT_EXCHANGE_CODE = '123321';
	// End params for sign in.

	// Begin new global variable.
	var globalNearbyRange,
	    globalNavRange;
	// End new global variable.

	var propellList = {};   // 推送广告
	//debug模式
	var sxDebug = DEBUG;

	//窗口宽高
	window.winW = $(window).width();
	window.winH = $(window).height();
	//window.mapH = winH - 56;      // 旧版导航的头部高度为56,新版的为40,新版的多了一个底部高度为49
	window.mapH = winH - 40 - 49;
	console.log('=====> Window height:', window.winH ,'Map height:', window.mapH);
	window.DEVICE = {
	    IPHONE5: winH < 510
	};

	window.IS_USE_OLD_MAP = 0;

	var Matrix_x = 0, Matrix_y = 0;//matrix【4】、【5】的值，拖拽时缓存数据 废弃
	{
	    if (localStorage.hasOwnProperty("skin")) {
	        localStorage.isFirst = 1;
	    }
	    localStorage.skin = localStorage.skin || 'white';
	    $("body").addClass(localStorage.skin);

	    // hash值发生改变的回调处理
	    window.onhashchange = function () {
	        var hashVar = location.hash;
	        gTools.hashChange(hashVar);
	        L(hashVar);
	    };

	    //卡券接口 同样初始化Tools  但重新设定接口url --以去掉
	    // var carposApi = new Tools();
	    // carposApi.url = "http://carpos.wizarcan.com/";
	    var debugTime = new Date();

	    $(document).ajaxSend(function (event, jqxhr, settings) {
	            //L("ajax start：" + settings.url  +"----data:"+settings.data)
	            $("body").addClass("ajaxing");
	            //alert(settings.url)
	        })
	        .ajaxError(function () {
	            //L("ajax failed");
	            gTools.hideLoading();
	        })
	        .ajaxComplete(function () {
	            //gTools.hideLoading();
	            $("body").removeClass("ajaxing");
	        })
	        .on("click", '[data-naction]', function (event) {//nav action
	            var _this = this, $this = $(_this), data = $this.data(), naction = data.naction;

	            log.i('[data-naction]', naction);

	            // 收起下拉菜单
	            //if ($("#header").find(".am-in").length) {
	            //    $("#header").find(".am-menu-toggle").trigger("click");
	            //}
	            hideDropdownMenu();
	            //console.timeEnd('search-blur');

	            switch (naction) {
	                case "changeMap":
	                    changeMap();
	                    break;
	                case "attention":
	                    attention();
	                    break;
	                case "findPay":         // 找停车缴费机
	                    //setPublicFacilitiesPin("Pay");
	                    //break;
	                case "findSubway":      // 找地铁
	                    //setPublicFacilitiesPin("Subway");
	                    //break;
	                case "findElevator":    // 电梯
	                    //_hmt.push(['_trackEvent', "/idp/naviCat/findElevator", 'findElevator:' + gTools.buildingName]);
	                    //setPublicFacilitiesPin("Elevator");
	                    //break;
	                //case "findToilet":      // 盥洗室
	                case "findBathroom":      // 盥洗室 由 findToilet => findBathroom
	                    //_hmt.push(['_trackEvent', "/idp/naviCat/findToilet", 'findToilet:' + gTools.buildingName]);
	                    //setPublicFacilitiesPin("Bathroom");
	                    //break;
	                case "findExit":        // 出口
	                    //_hmt.push(['_trackEvent', "/idp/naviCat/findExit", 'findExit:' + gTools.buildingName]);
	                    //setPublicFacilitiesPin("Exit");
	                    //break;
	                case "findZig":         // 扶梯/直梯
	                    //_hmt.push(['_trackEvent', "/idp/naviCat/findZig", 'findZig:' + gTools.buildingName]);
	                    //setPublicFacilitiesPin("Zig");
	                    //break;
	                case "findServer":      // 找客服中心
	                case "findSunvalley":   // 找阳光谷
	                case "findFishtank":    // 找海景鱼缸
	                case "findChildroom":   // 找母婴室
	                case "findATM":         // 找ATM取款机
	                case "findMembercenter":    // 找会员中心
	                    _hmt.push(['_trackEvent', "/idp/naviCat/" + naction, naction + ':' + gTools.buildingName]);
	                    setPublicFacilitiesPin(naction.split("find").join(""));
	                    break;
	                case "findLabelsById":  // 自定义业态分类poi菜单
	                    location.hash = 'labels';
	                    //gTools.poiTypeListModal2(data.id || data.category, gTools.showingFloor); // data.id 和 data.category 指的都是业态分类id
	                    gTools.poiTypeListModal3(data.id, gTools.showingFloor); // data.id指的是业态分类id
	                    break;
	                case "findPoiByType":
	                    var type = $(this).data("type");
	                    _hmt.push(['_trackEvent', '导航', '找店铺', "类型：" + type + "--然并卵o(╯□╰)o"]);
	                    gTools.getTypeListByBuildingId(gTools.buildingId, type)
	                        .done(function () {

	                        })
	                        .fail(function () {

	                        });
	                    break;
	                case "showSkinList":
	                    break;
	                case "share":
	                    $("#if_share").empty().append('<a href="javascript:;" data-maction="hiddenShare" style="display:block"><img src="//oex38ct5y.qnssl.com/img/share.png"></a>').addClass("active");
	                    gTools.startInitShare = true;
	                    initShareEvt();
	                    break;
	                case "search-car":
	                    //_hmt.push(['_trackEvent', 'car', '找车', 'o(╯□╰)o'])
	                    _hmt.push(['_trackEvent', "/idp/naviCat/searchCar", 'searchCar:' + gTools.buildingName]);
	                    //report.saveVisit(gTools.floorid,1);
	                    if (localStorage.getParkedInfo && JSON.parse(localStorage.getParkedInfo).parkPoint) {
	                        var tmp = JSON.parse(localStorage.getParkedInfo);
	                        if (tmp.parkPoint) {
	                            gTools.destination = {
	                                floorId: "F" + tmp.floorId,
	                                pointId: tmp.parkPoint,
	                                buildingName: gTools.buildingName,
	                                isNavigatingFloor: 0
	                            };
	                            gTools.showLoading("亲，正在为您导航");
	                            newNavigateOpt.text = "欢迎小主下次光临哦！";
	                            newNavigateOpt.title = "恭喜小主找到爱车";
	                            setTimeout(newNavigate, 100);
	                            report.savePark(gTools.floorid, tmp.parkPoint, 1);
	                            //Looking(tmp.parkPoint,"猫寻助手欢迎小主下次光临哦！","恭喜小主找到爱车");
	                        } else {
	                            gTools.alert("您的车并不在该停车场~");
	                        }
	                    } else {
	                        gTools.alert("您还没有停车~");
	                    }
	                    break;
	                case "if-record-car":
	                    //_hmt.push(['_trackEvent', 'car', '停车', "o(╯□╰)o"])
	                    _hmt.push(['_trackEvent', "/idp/naviCat/parkCar", 'parkCar:' + gTools.buildingName]);
	                    //report.saveVisit(gTools.floorid,2);
	                    if (!gTools.blueTeachIsOpen) {
	                        //gTools.alert("请先开启蓝牙");
	                        gTools.judgeBlueTeeth();
	                        gTools.hideLoading();
	                        return;
	                    }
	                    if (X == 0 && Y == 0 && gTools.model == 1) {
	                        gTools.alert("未能定位您的位置，无法记录车位");
	                        return;
	                    }
	                    var type = gTools.floorList[gTools.floorIndex[gTools.floorid]].type;
	                    if (type != 2 && type != 3) {
	                        gTools.alert("亲，检测到当前您不在停车场，无法为您记录车位哦！");
	                        return;
	                    }
	                    if (localStorage.getParkedInfo && JSON.parse(localStorage.getParkedInfo).parkPoint) {
	                        var tmp = JSON.parse(localStorage.getParkedInfo);
	                        if (tmp.parkPoint) {
	                            $("#my-confirm").modal();
	                        } else {
	                            parkRecord();
	                        }
	                    } else {
	                        parkRecord();
	                    }
	                    break;
	                //case 'onlinePayment':	// 目前属于太古里场景私有方法. 在线停车缴费功能存在问题,不能获取太古里公众号的openid,所以先去除该功能
	                //    // 上报点击
	                //    reportClickEvent(STAT.ACT_CODE.CLICK_MENU.ONLINE_PAYMENT, function () {
	                //        location.href = 'http://tgl.rfpark.cn/taikooli/myplate.html?appid=' + gTools.appId + '&openid=' + gTools.openid + '&accessToken=&from=' + 'wzmap';
	                //    });
	                //    break;
	                case 'links':
	                    _hmt.push(['_trackEvent', "/idp/naviCat/ticketList", 'ticketList:' + gTools.buildingName]);
	                    //location.hash = 'links';
	                    break;
			        // 广州飞乐灯展签到用：显示基础设施的相对位置
	                case 'showInfrastructureRelativePosition':
	                    showInfrastructureRelativePosition($this.data('category'));
	                    break;
	                default:
	                    log.w('[data-naction] Not matched...', naction);
	                    break;
	            }
	        })
	        .on("click", "[data-maction]", function (event) {
	            event.stopPropagation();
	            event.preventDefault();

	            var _this = this, $this = $(_this), data = $this.data(), maction = data.maction;

	            log.i('[data-maction]', maction);

	            if ($this.hasClass("hover")) {
	                $this.removeClass("hover");
	            } else {
	                setTimeout(function () {
	                    $('.hoverBox').has(_this).find('[data-maction]').filter(function () {
	                        return this != _this;
	                    }).removeClass("hover");
	                }, 500);
	                $this.addClass("hover");
	            }

	            switch (maction) {
	                case "dropdown":    // 业态店铺列表界面选择某个楼层功能
	                    $(this).parent().toggleClass("am-active");
	                    break;
	                case "chooseSelect":
	                    dropDownSelectAct(this);
	                    break;
	                case "showNav":
	                    //$this.next().toggleClass("am-in");
	                    toggleDropdownMenuStatus();
	                    break;
	                //case 'gotoHiddenLinks':
	                //    var url = $this.data("url");
	                //    location.href = url;
	                //    break;
	                case "hiddenShare":
	                    $("#if_share").removeClass("active");
	                    break;
	                case "set-poi-pin": // 查看业态店铺列表界面上某一店铺的详情
	                    //actSetPin($this);
	                    gTools.showLoading();
	                    location.href = '#';    // 返回地图界面
	                    map.find("#" + data.floor).find("#Rooms").find("a#" +data.maparea).trigger("tap", [data.category]);
	                    break;
	                case "set-pin":
	                    actSetPin($this);
	                    break;
	                case "changeSkin":
	                    var skin = $this.data("skin");
	                    $("body").removeClass(localStorage.skin).addClass(skin);
	                    localStorage.skin = skin;
	                    report.saveSkin($this.data("skinname"));
	                    break;
	                // 点击基础设施图标
	                case "public":
	                    showPoiDetail([data]);
	                    break;
	                case "remove-pin":
	                    removePin();
	                    break;
	                case 'zoom':
	                    break;
	                case 'return':
	                    history.go(-1);
	                    break;
	                case 'receive-links':
	                    $this.addClass("am-disabled");
	                    var url = $this.attr('href');
	                    url += "/" + gTools.openid;
	                    var f = $this.data('floor') + '';   // 转化成字符串
	                    if (f) {
	                        gTools.destination = {
	                            floorId: "F" + f.split("F").join(""),
	                            pointId: $this.data('point'),
	                            buildingName: gTools.buildingName,
	                            isNavigatingFloor: 0
	                        }
	                    }
	                    gTools.showLoading();
	                    $.get(url).done(function (res) {
	                            gTools.hideLoading();
	                            L(res);
	                            if (typeof res != 'object') {
	                                res = JSON.parse(res);
	                            }
	                            if ($this.data('floor')) {
	                                if (res.info == 'user_have_all') {
	                                    $('#take-me').find('.am-modal-bd').html('您已领过该卡券，您可以在个人中心里查看和使用！').end().modal();
	                                } else if (res.info == 'not_have_accord') {
	                                    gTools.alert(res.msg);
	                                } else {
	                                    $('#take-me').find('.am-modal-bd').text(res.msg).end().modal();
	                                }
	                                //$('#take-me').find('.am-modal-bd').text(res.msg).modal();
	                                //gTools.alert(res.msg);
	                            } else {
	                                if (res.info == 'user_have_all') {
	                                    gTools.alert("您已领过该卡券，您可以在个人中心里查看和使用！");
	                                } else if (res.msg.indexOf('success') > -1) {
	                                    gTools.alert("卡券已存入您的个人帐号，您可以在个人中心里查看和使用！");
	                                } else {
	                                    gTools.alert(res.msg);
	                                }
	                            }
	                            $this.removeClass("am-disabled");
	                            $this.data("type") === "hide" ? $("#hidden_links").addClass("am-hide") : "";
	                        })
	                        .fail(function () {
	                            //console.log(arguments);
	                            gTools.alert("网络错误！");
	                            gTools.hideLoading();
	                        })
	                        .complete(function () {
	                            //console.log(arguments)
	                        });
	                    //TODO 妈蛋好他妈的乱这命名
	                    //report.saveCoupon(gTools.couponList[$this.data('floor')][$this.data("point")].links.id, $this.data('floor'));
	                    //report.saveLink(gTools.couponList[$this.data('floor')][$this.data("point")].links.id,$this.data('floor'));
	                    break;
	                case "links-detail":
	                    location.hash = 'linksInfo';
	                    var info = $this.data("info");
	                    gTools.showLinksDetail(info);
	                    break;
	                case 'show-debug':
	                    $("#debugLog,#debugScript").toggleClass("am-hide");
	                    break;
	                case 'run-debug-js':
	                    var jsTxt = $this.prev().val();
	                    L({debugCode: jsTxt, debugRst: eval(jsTxt)});
	                    break;
	                case "location":
	                    if (!gTools.blueTeachIsOpen) {
	                        startSearchBeacons().done(function () {
	                            gTools.notAtTheSceneTime = new Date();
	                            clearTimeout(locationCurrTimer);
	                            locationCurr();
	                            gTools.follow = !gTools.follow;
	                        });
	                        return;
	                    }

	                    gTools.notAtTheSceneTime = new Date();
	                    clearTimeout(locationCurrTimer);
	                    locationCurr();
	                    gTools.follow = !gTools.follow;
	                    $this.toggleClass("active", !!gTools.follow);
	                    break;
	                case 'take-me':
	                    location.hash = '';
	                    newNavigateOpt.text = "";
	                    newNavigateOpt.title = "";
	                    gTools.showLoading("亲，正在为您导航");
	                    setTimeout(newNavigate, 100);
	                    break;
	                case "navigate":
	                    ////removePin();	// 避免蓝牙未打开的情况下就直接移除了钉子
	                    //removeNavPath();
	                    //$("#search").val("");
	                    //
	                    //gTools.destination = {
	                    //    floorId: data.floor,
	                    //    pointId: data.maparea,
	                    //    buildingName: gTools.buildingName,
	                    //    isNavigatingFloor: 0,
	                    //    // 追加用于上报导航统计
	                    //    x: data.x,
	                    //    y: data.y,
	                    //    poiId: data.poiId,
	                    //    mapArea: data.maparea,
	                    //    brand: data.brand
	                    //};
	                    //
	                    //newNavigateOpt.text = "欢迎小主下次光临哦！";
	                    //newNavigateOpt.title = "恭喜您抵达目的地";
	                    //// 追加用于上报导航统计
	                    //newNavigateOpt.brand = data.brand;
	                    //
	                    //gTools.hideHalfModal();     // 隐藏半弹框
	                    //gTools.showLoading("亲，正在为您导航");
	                    //setTimeout(newNavigate, 100);

	                    // 上述逻辑,全部封装到下面这个方法中
	                    gTools.startNav(data);
	                    break;
	                // 从这里出发
	                case 'fromHere':
	                    fromHere(data.floor, data.mapArea);
	                    break;
	                // 到这里去
	                case 'toHere':
	                    toHere(data.floor, data.mapArea);
	                    break;
	                // 切换起点: 将起点切换回当前位置
	                case 'switchNavStartPoint':
	                    switchNavStartPoint();
	                    break;
	                // 开始导航
	                case 'startNavigate':
	                    startNavigate(autoGetNavStartPoint(), getNavEndPoint());
	                    break;
	                case "record-car":
	                    //_hmt.push(['_trackEvent', "/idp/naviCat/"+gTools.buildingName, 'parkCar'  ]);
	                    if (!gTools.blueTeachIsOpen) {
	                        startSearchBeacons.done(actRecordCar);
	                    } else {
	                        actRecordCar();
	                    }
	                    break;
	                case "show-history":
	                    gTools.alert("目前暂不支持该功能");
	                    return;
	                    gTools.showHistory();
	                    break;
	                case "bth-opened":
	                    _hmt.push(['_trackEvent', '蓝牙', '打开蓝牙', "o(╯□╰)o"]);
	                    //L("我已打开蓝牙");
	                    wx.startSearchBeacons({
	                        "ticket": "",
	                        "complete": wxFn
	                    });
	                    gTools.hideHalfModal();
	                    break;
	                case "switchfloor":
	                    var floor = $this.data("floor");
	                    _hmt.push(['_trackEvent', '楼层', '楼层切换', "建筑" + gTools.buildingComment + "--楼层：" + gTools.showingFloor + "->" + "F" + floor]);

	                    if (gTools.showingFloor == 'F' + floor) {	// 所选的楼层是当前显示的楼层
	                        if (gTools.floorEvt.openstatus) {
	                            gTools.floorEvt.btn.trigger("click");
	                        }
	                        //log.w('不需要切换楼层,只需收起楼层列表即可.');
	                        return;
	                    }

	                    // 所选的楼层不是当前显示楼层，而是其他楼层
	                    var $poiTextBox = $('#body').find('#text');
	                    $poiTextBox.empty();    // 清空所有poi文字图标

	                    //closeHalfModal();       // 隐藏半弹框,直接隐藏会有问题,因为从列表查看其他楼层时,如果发生楼层切换,切换后详情弹框会被隐藏掉

	                    $(this).addClass("active").siblings().removeClass("active");
	                    gTools.floorEvt.btn.text($(this).text());
	                    if (gTools.floorEvt.openstatus) {
	                        gTools.floorEvt.btn.trigger("click");   // 设置楼层按钮
	                    }
	                    gTools.follow = false;
	                    if (gTools.showingFloor != "F" + floor) {
	                        gTools.showingFloor = "F" + floor;
	                        //gTools.createSideNav()
	                        $('#myMaps').wayfinding('currentMap', "F" + floor); // 切换楼层地图
	                    }
	                    break;
	                case "close-half-modal":
	                    closeHalfModal();
	                    break;
	                case "locate-poi":
	                    _hmt.push(['_trackEvent', '定位', '定位到当前商铺', "o(╯□╰)o"]);
	                    var xx = $this.data("x"),
	                        yy = $this.data("y"),
	                        ff = $this.data("floor");
	                    clearTimeout(locationCurrTimer);
	                    locationCurr(xx, yy, ff);
	                    break;
	                case "close_pop":
	                    $(".popup").remove();
	                    break;
	                // 反馈处理逻辑(Feedback Logic)
	                case "post_btn":        // 显示反馈一级选项弹框
	                    gTools.pop_post();
	                    break;
	                case "closebtn_post":   // 关闭反馈一级选项弹框
	                    $(".post_main").remove();
	                    break;
	                case "closebtn_post_loc":   // 关闭反馈二级选项弹框
	                    closeFeedbackSecondOptionDialog();
	                    break;
	                case "goback_btn":          // 返回到反馈一级选项界面
	                    closeFeedbackSecondOptionDialog();
	                    gTools.pop_post();
	                    break;
	                // 定位错误(Locate Error)
	                case "locate_error":    // 显示反馈二级选项弹框——定位错误
	                    showFeedbackSecondOptionDialog(0);
	                    break;
	                case "locate_fail":
	                    $("#locate_fail_1").toggleClass('changeBg');
	                    break;
	                case "locate_error0":
	                    $("#locate_error_1").toggleClass('changeBg');
	                    break;
	                case "others_loc":
	                    $("#others_loc_1").toggleClass('changeBg');
	                    break;
	                case "submit_btn0":
	                    reportFeedback(setFeedbackContent(0, 'locate_fail_1', 'locate_error_1', 'others_loc_1'));
	                    break;
	                // 路径不合理(Route Error)
	                case "route_error":     // 显示反馈二级选项弹框——路径不合理
	                    showFeedbackSecondOptionDialog(1);
	                    break;
	                case "route_error0":
	                    $("#route_error0_1").toggleClass('changeBg');
	                    break;
	                case "detour":
	                    $("#detour_1").toggleClass('changeBg');
	                    break;
	                case "others_route":
	                    $("#others_route_1").toggleClass('changeBg');
	                    break;
	                case "submit_btn1":
	                    reportFeedback(setFeedbackContent(1, 'route_error0_1', 'detour_1', 'others_route_1'));
	                    break;
	                // 店铺错误(Store Error)
	                case "store_error":     // 显示反馈二级选项弹框——店铺错误
	                    showFeedbackSecondOptionDialog(2);
	                    break;
	                case "name_error":
	                    $("#name_error_1").toggleClass('changeBg');
	                    break;
	                case "brand_change":
	                    $("#brand_change_1").toggleClass('changeBg');
	                    break;
	                case "others_st":
	                    $("#others_st_1").toggleClass('changeBg');
	                    break;
	                case "submit_btn2":
	                    reportFeedback(setFeedbackContent(2, 'name_error_1', 'brand_change_1', 'others_st_1'));
	                    break;
	                // 其他错误(Other Error)
	                case "other_error":     // 显示反馈二级选项弹框——其他错误
	                    showFeedbackSecondOptionDialog(3);
	                    break;
	                case "submit_btn3":
	                    reportFeedback($(".detail_des").val());
	                    break;
	                case "closebtn_tips":
	                    $(".success_tips").remove();
	                    break;
	                case "closeRec":    // 关闭推荐店铺列表
	                    $(".storeLists").remove();
	                    break;
	                default :
	                    log.w('[data-maction] Not matched...', maction);
	                    break;
	            }
	        });

	    // 通过document对象,注册事件代理
	    $(document)
	        // 校验电话号码
	        .on("blur", ".phoneNumber", function () {
	            log.i('[document blur on phoneNumber]');
	            var $phoneNumInput = $(this), phoneNum = $phoneNumInput.val();

	            // 电话号码不存在,不做处理
	            if (!phoneNum) {
	                return;
	            }
	            // 电话号码合法,不做处理
	            if ((/^1[3|4|5|7|8]\d{9}$/.test(phoneNum)) || (/^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/.test(phoneNum))) {
	                return;
	            }

	            // 电话号码不合法
	            $(".phoneNumber").val("");
	            // $(".phoneNumber").css("border","1px solid red")
	            gTools.alert("电话号码格式有误，请重新填写！");
	            //return false;
	        })
	        // 数据分析
	        .on("click", '[data-anls]', function (e) {
	            log.i('[*** document click on data-anls ***]');

	            var data = $(this).data(), newData = [], $this = $(this);
	            if (data.anls === 'url') {
	                newData.push("_trackPageview");
	                if (data.anlsUrl) {
	                    newData.push(data.anlsUrl);
	                } else {
	                    return false
	                }
	            } else if (data.anls === 'event') {
	                newData.push('_trackEvent');
	                newData.push(data.anlsCategory);
	                newData.push(data.anlsAction);
	                newData.push(data.anlsLabel);
	                newData.push(data.anlsValue);
	            }
	            if (!newData.length) {
	                return false;
	            }
	            console.info(newData);
	            _hmt.push(newData);
	        });

	    // 搜索框的事件处理
	    $('#search')
	        .on("keyup", function (e) {
	            log.i('[document keyup on #search]');
	            e = e || window.event;
	            if (e.keyCode == 13) {
	                this.blur();
	            }
	        })
	        .on("focus", function () {
	            log.i('[document focus on #search]');
	            if (gTools.IS_NOT_HANDLE_SEARCH_FOCUS) {
	                $("#myMaps").addClass("keyboard");
	                hideCurrentShowRecommendStoreList();    // 隐藏当前显示的推荐列表
	                closeHalfModal();   // 关闭半弹框
	                // 在停车场里,点击输入框,默认不展开下拉菜单
	                if (!gTools.isParking()) {
	                    showDropdownMenu(); // 显示下拉菜单
	                }
	                gTools.IS_NOT_HANDLE_SEARCH_FOCUS = false;
	                log.v('搜索框聚焦处理完成');
	            }
	        })
	        .on("blur", function () {
	            log.i('[document blur on #search]');

	            gTools.IS_NOT_HANDLE_SEARCH_FOCUS = true;
	            $("#myMaps").removeClass("keyboard");
	            //toggleDropdownMenuStatus();
	            // 收起下拉菜单
	            //console.time('search-blur');
	            setTimeout(function () {
	                log.v('收起下拉菜单');
	                hideDropdownMenu();
	            }, 50);

	            var searchVal = $(this).val();
	            if (!searchVal) {
	                return;
	            }

	            if (searchVal == 'sxdebug') {
	                sxDebug = true;
	                gTools.sxdebug(sxDebug);
	                //gTools.sxShowEverLog();   // 显示历史缓存的日志,并且不再输出新的日志
	                return;
	            }
	            _hmt.push(['_trackEvent', "/idp/naviCat/searchPoi", 'searchPoi:' + gTools.buildingName, "searchPoi:" + gTools.buildingNam + "|" + searchVal]);
	            gTools.showLoading();
	            //如果是搜索车牌
	            // if(checkIfSearchCarLicense(searchVal)){
	            //
	            // 	return
	            // }

	            gTools.brandSearch(searchVal, gTools.buildingId).done(function (res) {
	                typeof res === 'string' ? res = JSON.parse(res) : "";
	                gTools.hideLoading();
	                if (!res.brandList.length) {
	                    map.wayfinding("clearPoiPoint");
	                    gTools.alert("亲，没有搜索到 <span style='color:red;'>" + searchVal + "</span> 的相关信息");
	                    return;
	                }
	                //todo hack 在安卓下面  当输入法收起的时候 会有卡顿的现象 导致偶尔出现下面的结果弹窗无法显示的情况，故而延时1s
	                if ($.os.android) {
	                    setTimeout(function () {
	                        if (res.brandList.length === 1) {
	                            showPoiDetail(res.brandList);
	                        } else {
	                            gTools.showPoiInfo(res.brandList);
	                        }
	                    }, 1000);
	                } else {
	                    if (res.brandList.length === 1) {
	                        showPoiDetail(res.brandList);
	                    } else {
	                        gTools.showPoiInfo(res.brandList);
	                    }
	                }

	                map.wayfinding("clearPoiPoint");
	                $.each(res.brandList, function (i, v) {
	                    map.wayfinding("setPoiPoint", v.mapArea);
	                });

	                // 定位到第一个元素的位置
	                //$("#halfModalContent").find('[data-maction="locate-poi"]').trigger("click");
	                $("#halfModalContent").find('[data-maction="locate-poi"]').first().trigger("click");
	            }).fail(function () {
	                gTools.hideLoading();
	            });

	            report.saveSearch(searchVal);
	            console.log('Send search finished.');
	        });

	    //// 点击地图时需要做的额外处理,如隐藏下拉菜单等. #太古里地图改版后,不在需要#
	    //$('#myMaps').on('click', function () {
	    //    log.v('点击地图');
	    //    hideDropdownMenu();
	    //});

	    /**
	     * 校验是否要搜索车牌
	     * @author sx
	     * @param {string} val 搜索的内容
	     * @returns {boolean}
	     */
	    var checkIfSearchCarLicense = function (val) {
	        var f = /^[京|津|冀|鲁|晋|蒙|辽|吉|黑|沪|苏|浙|皖|闽|赣|豫|鄂|湘|粤|桂|渝|川|贵|云|藏|陕|甘|青|琼|新|港|澳|台|宁][a-zA-Z]\w{5}$/;
	        return f.test(val);
	    };

	    /**
	     * 停车操作
	     */
	    var actRecordCar = function () {
	        var type = gTools.floorList[gTools.floorIndex[gTools.floorid]].type;
	        if (type != 2 && type != 3) {
	            gTools.alert("亲，检测到当前您不在停车场，无法为您记录车位哦！");
	            return
	        }
	        parkRecord();
	    };

	    var locationCurrTimer;
	    /**
	     * 定位到指定位置
	     * @param tx 位置X坐标 默认当前X坐标
	     * @param ty 同上
	     * @param floorid 位置所在楼层。默认当前所在楼层，不是显示楼层
	     */
	    var locationCurr = function (tx, ty, floorid) {
	        tx = typeof tx !== "undefined" ? tx : X;
	        ty = typeof ty !== "undefined" ? ty : Y;
	        floorid = floorid ? floorid : gTools.floorid;
	        //L("定位ing")
	        if (tx == X & ty == Y && !gTools.initOver) {
	            return;
	        }

	        if (tx == 0 && ty == 0) {
	            clearTimeout(locationCurrTimer);
	            locationCurrTimer = setTimeout(function () {
	                locationCurr();
	            }, 1000);
	            return;
	        }
	        if (gTools.isRouting) { // 导航过程中不进行页面跟随
	            return;
	        }
	        if (floorid != gTools.showingFloor) {
	            gTools.floorEvt.listScroll.find('[data-floor="' + floorid.slice(1) + '"]').trigger("click");
	            //$('#myMaps').wayfinding('currentMap', floorid);
	        }

	        setTimeout(function () {
	            var w = winW,
	                h = mapH,
	                svg_obj = $("#myMaps >div").filter(":visible")[0], //todo  这里有个问题  当是svg的时候 panzoom取值有问题
	                matrix = $(svg_obj).panzoom("getMatrix") ? $(svg_obj).panzoom("getMatrix") : [1, 0, 0, 1, 0, 0],
	                svgInfo = $(svg_obj).children("svg")[0].getAttribute("viewBox").split(" "),
	                svgW = svgInfo[2],
	                svgH = svgInfo[3],
	                ratio = +matrix[0],
	                mx = matrix[4],
	                my = matrix[5];
	            // p = {x:tx,y:ty};//svgToPage(tx * ratio,ty * ratio);
	            //if(!p){return;}
	            // var tmpX = Number(matrix[4])+(w/2- p.x),
	            //     tmpY =  Number(matrix[5])+(h/2 - p.y);
	            var tmpX = -tx * ratio + svgW / 2,
	                tmpY = -ty * ratio + svgH / 2;
	            //var oldMx = Matrix_x, oldMy = Matrix_y;

	            //L(p);
	            //L("X="+X + "-----Y="+Y + "-----setMatrix" + JSON.stringify( [ ratio, 0, 0, ratio, tmpX, tmpY ]));
	            //console.log(tmpX,tmpY);return
	            //console.log(tmpX,tmpY,p);

	            //Matrix_x = tmpX,Matrix_y = tmpY;
	            $(svg_obj).panzoom("setMatrix", [ratio, 0, 0, ratio, tmpX, tmpY]);
	            gTools.transPoiText();
	        }, 10);
	    };

	    //var listenBTHTime;
	    // 微信开启蓝牙回调
	    var wxFn = function (res) {
	        L({startSearchBeaconsRst: res});

	        if (gTools.model == 1) {
	        } else {
	            gTools.showLoading('正在查询您的位置信息', "", "init-location");
	        }
	        //alert(JSON.stringify(res));
	        //clearTimeout(listenBTHTime);
	        res = JSON.stringify(res);
	        gTools.blueTeachIsOpen = 0;
	        if (res.includes('ok') || res.includes("already")) {
	            gTools.blueTeachIsOpen = 1;
	            gTools.poiIsHide = 1;
	            //如果 根据url进入 则无需等待beacon获取后的地图加载
	            //否则需要等待地图信息完成
	            if (gTools.buildingId) {
	                gTools.initOver = 1;
	            }
	            // if($("#myMaps").children().length){
	            //   actionFromUrl();
	            // }
	        } else if (res.includes("bluetooth power off")) {
	            if (!gTools.model) {
	                //gTools.alert("请先开启蓝牙");
	                gTools.judgeBlueTeeth();
	                gTools.hideLoading()
	            }
	            if (gTools.model == 1) {
	                if (gTools.action == "find" || gTools.action == "park" || gTools.action == 'toshare') {
	                    gTools.judgeBlueTeeth();
	                    gTools.hideLoading();
	                }
	            }
	            wx.stopSearchBeacons();
	            L("蓝牙off");
	            return
	        } else if (res.includes('location service disable')) {
	            L("定位off");
	            wx.stopSearchBeacons();
	            gTools.hideLoading();
	            gTools.alert("请打开gps定位");
	            return;
	        } else if (res.includes('system unsupported')) {
	            gTools.hideLoading();
	            gTools.alert("系统不支持");
	            wx.stopSearchBeacons();
	            L("系统不支持");
	            return;
	        }
	        // todo 条件 判断蓝牙
	        gTools.blueTeachIsOpen = 1;
	        gTools.isAjaxing = 0;

	        // 下面这个方法未使用到(废弃?)
	        //var fn = function (res) {
	        //    //clearTimeout(listenBTHTime);
	        //    if (JSON.stringify(arguments).indexOf("fail") > 0) {
	        //        gTools.blueTeachIsOpen = 0;
	        //    } else {
	        //        gTools.blueTeachIsOpen = 1;
	        //    }
	        //    if (!gTools.blueTeachIsOpen && !gTools.model) {
	        //        gTools.judgeBlueTeeth();
	        //        gTools.hideLoading();
	        //        //return;
	        //    } else {
	        //        //如果已经加载地图 则不显示loading 否则显示loading
	        //        gTools.beaconList ? gTools.hideLoading() : gTools.showLoading();
	        //        gTools.hideHalfModal();
	        //    }
	        //};
	        //wx.on("onBeaconMonitoring",fn);

	        wx.onSearchBeacons({
	            complete: beaconsInRangeHandler
	        });
	        //wx.on('onBeaconsInRange', beaconsInRangeHandler);
	        log.w('[wxFn] 开启扫描beacon');
	    };

	    $(function () {
	        if (!$("#text").length) {
	            $("#body").append("<div id='text'></div>")
	        }
	        $("body").append('<div id="hidden_links" class="am-hide"></div>');
	        map = $("#myMaps");
	        map.height(mapH);
	        _hmt.push(['_trackPageview', '/idp/naviCat']);

	        L({winW: winW, winH: winH});
	        // 程序入口
	        gTools.judgeSystem().done(function () {
	            gTools.initViews();

	            gTools.sxdebug(sxDebug);    // 必须等按钮容器初始化完成才可以调用

	            gTools.showLoading('正在加载场景信息...<br/>请打开手机蓝牙进行定位');
	            gTools.ifJudgeIfNearChest = true;//开启隐藏广告查询
	            gTools.model = MODEL;
	            gTools.buildingId = BUILDINGID;
	            gTools.floorid = FLOORID ? "F" + FLOORID : 0;
	            gTools.showingFloor = gTools.floorid;
	            gTools.blueTeachIsOpen = BLUETEACH;
	            gTools.ux = UX;
	            gTools.uy = UY;
	            //X = conf.X;
	            //Y = conf.Y;
	            //gTools.uPoint = conf.POINT;
	            //gTools.model = gTools.model == 0 ? false : gTools.model;
	            //gTools.action == "fromShare" ? gTools.enterType = 2 : "";

	            globalNearbyRange = conf.NEARBY_RANGE;             // 通过URL参数指定是否靠近某个位置的范围值
	            globalNavRange = conf.NAV_RANGE;
	            // 通过指定url参数,清空签到数据
	            if (conf.IS_CLEAR_SIGN_CACHE) {
	                window.clearSignCache();
	            }
	            log.v('nearbyRange:', globalNearbyRange, 'navRange:', globalNavRange, 'isClearSignCache:', conf.IS_CLEAR_SIGN_CACHE);

	            gTools._setFlag();  // 设置标志位,最好作为私有方法,在gTools文件模块内进行调用

	            if (gTools.model && gTools.model == 1 && gTools.buildingId) {
	                //report.saveVisit(gTools.floorid, 0);  // 页面访问量放在这里,未指定楼层id的情况时,楼层id会为0
	                gTools.isAjaxing = 1;

	                gTools.getBuildingInfo().done(function (res2) {
	                    var buildingInfo;
	                    typeof res2 === 'string' && (res2 = JSON.parse(res2));

	                    gTools.counter = gTools.counter ? gTools.counter + 1 : 1;
	                    gTools.isAjaxing = 0;
	                    buildingInfo = res2.buildingInfo;

	                    if (!buildingInfo && !res2.floorList.length) {
	                        gTools.hideLoading();
	                        gTools.alert('未能获取到有效的场景数据！');
	                        log.w('[getBuildingInfo] not get scene data.');
	                        return;
	                    }

	                    document.title = buildingInfo.comment;    // 重新设置页面标题
	                    gTools.showLoading('欢迎光临' + '<span style="color: tomato">' + buildingInfo.comment + '</span>' + '<br/>请打开手机蓝牙进行定位');

	                    // 添加指南针
	                    if (gTools.buildingId == 50) {
	                        $("body").append("<img src='//oex38ct5y.qnssl.com/feedback/compass2-01.png' class='compass'>");
	                    }

	                    // 添加水印(logo)
	                    var url = "img/logo.png", style = '';
	                    if (gTools.buildingId == 46 || gTools.buildingId == 50) {
	                        style = 'max-height:25px;max-width:68%;bottom:15px;';
	                        url = "//oex38ct5y.qnssl.com/img/juyi.png?_=1";
	                    } else if (gTools.buildingId == 48) {   // 针对贵阳logo硬编码
	                        style = 'height: auto;max-width: 25%;bottom: 20px;';
	                        url = "//oex38ct5y.qnssl.com/img/logo.png";
	                    } else if (buildingInfo.watermarkAddress) {
	                        url = buildingInfo.watermarkAddress;
	                    }
	                    $("#body").after('<div style="position:relative;"><img id="logo" src="' + gTools.setImgLink(url) + '" style="' + style + '" ></div>');


	                    if (buildingInfo && res2.floorList.length) {
	                        gTools.buildingInfo = buildingInfo;
	                        gTools.dataStoreAddress = buildingInfo.dataStoreAddress;
	                        gTools.buildingName = buildingInfo.name;
	                        gTools.buildingComment = buildingInfo.comment;

	                        gTools.buildingId = buildingInfo.id;
	                        report.buildingId = gTools.buildingId;
	                        gTools.ratio = buildingInfo.mapScale || gTools.ratio;
	                        gTools.cursorScale = buildingInfo.cursorScale || 1;
	                        gTools.initialRatio = gTools.ratio;
	                        getParkedInfo();
	                        // 处理 根据sort值设置当前楼层
	                        gTools.floorList = $.extend(true, [], res2.floorList);
	                        if (!FLOORID) {
	                            gTools.floorid = "F" + res2.floorList.sort(getSortFun("desc", "sort"))[0].id;
	                            gTools.showingFloor = gTools.floorid
	                        }
	                        report.saveVisit(gTools.floorid, 0);    // 统计页面访问量
	                        if (!!buildingInfo.parkUrl) {
	                            gTools.isCamera = true;
	                        }

	                        initWelcomePage(gTools.buildingId, function () {
	                            gTools.floatLayerId && gTools.hideLoading();   // 显示欢迎页的时候,关闭loading弹框
	                            //showGuideTips();
	                        });
	                        //gTools.node = buildingInfo.isUseNodejs === 1;

	                        // gTools.navigationAddress = buildingInfo.navigationAddress;
	                        floorid = gTools.floorid;
	                        // gTools.adUser = buildingInfo.adUser;
	                        gTools.beaconList = res2.beaconList;
	                        floors = gTools.floorList;
	                        //gTools.createFloorNav();
	                        // floorNo=floors.length;

	                        // 缓存地图链接 todo *注意: 微信内不允许跨域加载svg
	                        var arr = [];
	                        $.each(floors, function (i, v) {
	                            !!v.svgAddress && arr.push({path: gTools.origin + v.svgAddress, id: "F" + v.id});
	                        });

	                        createMap(arr, function () {
	                            log.i('创建地图之后的后续处理...2');
	                            //hideFastNav();
	                            createDropdownMenus();
	                            setShortcutMenuForTaikooLiParking();

	                            if (res2.linkList && res2.linkList.length) {    // 后台设置了外链
	                                log.w('[getBuildingInfo createMap callback] Set outer links.');
	                                gTools.linkList = {};
	                                globalSignFloors = {};  // 初始化签到点位对象

	                                // Begin test code.
	                                window.globalSignFloors = globalSignFloors;
	                                // End test code.

	                                // 按楼层对外链或签到点进行分组
	                                $.each(res2.linkList, function (i, v) {
	                                    if (v.floorId) {
	                                        v.floorId = "F" + v.floorId;

	                                        if (v.type === 7) { // 外链为签到点位
	                                            if (!globalSignFloors[v.floorId]) {
	                                                globalSignFloors[v.floorId] = [];
	                                            }
	                                            globalSignFloors[v.floorId].push(v);
	                                            globalSignPointCnt++;
	                                        } else {            // 1~6都归属为外链
	                                            if (!gTools.linkList[v.floorId]) {
	                                                gTools.linkList[v.floorId] = [];
	                                            }
	                                            gTools.linkList[v.floorId].push(v);
	                                        }
	                                    }
	                                });
	                            } else {
	                                // Just test log.
	                                log.w('[createMap callback] Not set outer links.');
	                            }

	                            showLinks();        // 初始化隐藏外链
	                            showSignPoints(globalSignFloors);


	                            //log.v('Will call getPoi...2');
	                            //setTimeout(getPoi, 100);

	                            var $body = $('body');
	                            // hack在微信等webView中无法修改document.title的情况
	                            var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function () {
	                                setTimeout(function () {
	                                    $iframe.off('load').remove()
	                                }, 0)
	                            }).appendTo($body);

	                            // 设置推荐列表
	                            //initLeftTopRecommendStores(function () {
	                                initRightTopRecommendStores();
	                            //});

	                            // 设置寻宝功能
	                            setXunBao(buildingInfo);
	                        });
	                    } else {
	                        gTools.hideLoading();
	                        gTools.alert("获取场景信息失败！");
	                    }
	                });
	            } else {
	                gTools.notAtTheSceneTime = new Date();
	                gTools.poiIsHide = 1;
	            }

	            // 获取微信签名
	            gTools.getSignature().done(function (res) {
	                //L("获取微信签名 成功")
	                if (typeof res === 'string') res = JSON.parse(res);

	                //gTools.sxdebug(sxDebug);
	                wx.config({
	                    beta: true,
	                    //debug: true,
	                    appId: "wx54d8b65ca288f8f3",    // 实际获取签名用的appid: wx54d8b65ca288f8f3 => 万猫智慧城
	                    timestamp: res.timestamp,
	                    nonceStr: res.nonceStr,
	                    signature: res.signature,
	                    jsApiList: [
	                        'checkJsApi',
	                        'startMonitoringBeacons',
	                        'stopMonitoringBeacons',
	                        'onBeaconsInRange',
	                        "onMenuShareAppMessage",
	                        "onMenuShareTimeline",
	                        "startSearchBeacons",
	                        "onSearchBeacons",
	                        "stopSearchBeacons",
	                        "showMenuItems",
	                        "hideMenuItems",
	                        "getLocation"
	                    ]
	                });

	                wx.ready(function () {
	                    gTools.showShare = false;
	                    //$('[data-naction="share"]').hide();
	                    //wx.hideMenuItems({
	                    //    menuList: [
	                    //        "menuItem:share:appMessage",
	                    //        "menuItem:share:timeline"
	                    //    ]
	                    //});

	                    L({configWxReady: arguments || 'null', msg: '配置微信JSSDK成功'});

	                    initShareEvt(); // 配置默认分享内容

	                    wx.startSearchBeacons({
	                        "ticket": "",
	                        complete: wxFn
	                    });
	                });

	                wx.error(function (res) {
	                    if (res.errMsg.includes('config:ok')) {
	                        return;
	                    }

	                    gTools.alert(res);
	                });
	            })
	        }).fail(function () {
	            console.warn('judge system invalid...');
	            report.saveVisit(gTools.floorid, 0);
	        })
	    });

	    gTools.cacheBeaconList = []; // 缓存搜索到的beacon信息
	    var startSearchBeacons = function () {
	        var dtd = $.Deferred();

	        if (gTools.blueTeachIsOpen) {
	            dtd.resolve();
	        } else {
	            wx.startSearchBeacons({
	                "ticket": "",
	                "complete": function (res) {
	                    wxFn(res);
	                    if (gTools.blueTeachIsOpen) {
	                        dtd.resolve()
	                    } else {
	                        gTools.alert_1();
	                        gTools.hideLoading();
	                        dtd.reject();
	                    }
	                }
	            });
	        }

	        return dtd.promise();
	    };

	    // 切换室内地图和百度地图 基本废弃
	    var changeMap = function (map) {
	        if (map === "baidu" || map === 'bd' || map === "bdMap") {
	            $("body").toggleClass("bdmap", true);
	            return;
	        }
	        $("body").toggleClass("bdmap");
	    };

	    /**
	     * 创建微信分享链接
	     * @returns {string}
	     */
	    var createShareUrl = function (isLocated) {
	        // 定义分享链接需要的参数对象
	        var paramObj = $.extend({}, fn1.urlParams);

	        // 分享时需要去除的参数
	        delete paramObj.appid, delete paramObj.appId;       // 删除appid
	        delete paramObj.openid, delete paramObj.openId;     // 删除openid

	        // 分享时需要更新的参数
	        //gTools.buildingId && (paramObj.buildingId = gTools.buildingId);
	        gTools.floorid && (paramObj.floorId = +gTools.floorid.slice(1));
	        paramObj.enterType = 2;

	        // 定位成功时,分享时需要配置的参数
	        if (isLocated) {
	            paramObj.action = 'fromShare';
	            X && (paramObj.ux = X.toFixed(3));
	            Y && (paramObj.uy = Y.toFixed(3));
	        }

	        // 以下参数用于模拟调试
	        //paramObj.model = 1;         // 模式
	        //paramObj.x = 200;           // 用于模拟初始X
	        //paramObj.y = 200;           // 用于模拟初始Y
	        //paramObj.blueTeach = 1;     // 用于模拟开启蓝牙
	        //paramObj.debug = 1;         // 用于模拟开启debug模式

	        //log.v('URL param obj', JSON.stringify(paramObj));

	        var url = location.href.split("?")[0] + "?" + $.param(paramObj);

	        //log.v('Before concat url:', url);
	        return generateWxShareUrl(url);
	    };

	    // 获取分享对象
	    var nearestStore, nearestStoreMapArea;
	    function getShareObj() {
	        // 尚未定位成功
	        if (X === 0 && Y === 0) {
	            return {
	                title: '我在' + gTools.buildingComment + '，快来找我吧！',    // 分享标题
	                desc: '快来现场体验更多乐趣吧！',   // 描述
	                link: createShareUrl(false), // 分享链接
	                imgUrl: 'http://oex38ct5y.qnssl.com/img/shareIcon.png?imageMogr2/thumbnail/120x120!'    // 分享图标
	            };
	        }

	        // 已经定位成功
	        nearestStoreMapArea = getNear(X, Y, gTools.showingFloor);
	        nearestStore = nearestStoreMapArea && gTools.poiList[gTools.showingFloor] && gTools.poiList[gTools.showingFloor][nearestStoreMapArea];

	        return {
	            title: '我在' + (nearestStore ? nearestStore.brand + '附近' : gTools.floorList[gTools.floorIndex[gTools.showingFloor]].name + '层') + '，快来找我吧！',    // 分享标题
	            desc: '点开地图就能看到我的位置啦！',   // 描述
	            link: createShareUrl(true), // 分享链接
	            imgUrl: 'http://oex38ct5y.qnssl.com/img/shareIcon.png?imageMogr2/thumbnail/120x120!'    // 分享图标
	        };
	    }

	    // 创建家博会场景分享链接
	    function createShareUrlForHomeExpo() {
	        var param = {
	            action: 'fromShare'
	        };

	        return 'http://gudev.wizarcan.com/mMNOcoo2?' + $.param(param);
	    }

	    // 获取家博会场景分享对象
	    function getShareObjForHomeExpo() {
	        return {
	            title: '北京华夏家博会电子地图，全场品牌一网打尽！', // 分享标题
	            desc: "现场有很多展位和优惠活动，还可参与现金抽奖哦^_^",  // 描述
	            link: createShareUrlForHomeExpo(),  // 分享链接
	            imgUrl: location.protocol + '//oex38ct5y.qnssl.com/img/hxjbh/icon_share.jpg'    // 分享图标
	        }
	    }

	    /**
	     * 初始化微信分享配置
	     */
	    var initShareEvt = function () {
	        //if(!gTools.startInitShare){return}
	        // 如果场景id和楼层id不存在,则不进行分享配置
	        if (!gTools.buildingId || !gTools.floorid) {
	            var msg = '[initShareEvt] failed: buildingId=' + gTools.buildingId + ' floorid=' + gTools.floorid;
	            oneLog.w(msg);

	            return;
	        }

	        var shareObj = getShareObj();
	        //console.log('config share object:', JSON.stringify(shareObj));

	        // 分享到朋友圈
	        wx.onMenuShareTimeline({
	            title: shareObj.title, // 分享标题
	            link: shareObj.link, // 分享链接
	            imgUrl: shareObj.imgUrl, // 分享图标
	            trigger: function () {
	                // 因为同时开启扫描beacon后,android手机上无法执行分享后的相关回调函数. 所以提前上报
	                !$.os.ios && report.saveLocation(getNear(X, Y), X, Y, gTools.floorid);
	                L("***触发分享到朋友圈***");
	            },
	            success: function () {
	                // 用户确认分享后执行的回调函数
	                // 上报分享统计 - 因为安卓手机提前上报了,所以此处只对ios进行上报
	                $.os.ios && report.saveLocation(getNear(X, Y), X, Y, gTools.floorid);
	                L("***分享到朋友圈成功***");
	            }
	            //,
	            //cancel: function () {
	            //    // 用户取消分享后执行的回调函数
	            //    L("onMenuShareTimeline cancel");
	            //}
	        });

	        // 分享给好友
	        wx.onMenuShareAppMessage({
	            title: shareObj.title, // 分享标题
	            desc: shareObj.desc, // 分享描述
	            link: shareObj.link, // 分享链接
	            imgUrl: shareObj.imgUrl, // 分享图标
	            type: 'link', // 分享类型,music、video或link，不填默认为link
	            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	            trigger: function () {
	                // 因为同时开启扫描beacon后,android手机上无法执行分享后的相关回调函数. 所以提前上报
	                !$.os.ios && report.saveLocation(getNear(X, Y), X, Y, gTools.floorid);
	                L("***触发分享给好友***");
	            },
	            success: function () {
	                // 用户确认分享后执行的回调函数
	                // 上报分享统计 - 因为安卓手机提前上报了,所以此处只对ios进行上报
	                $.os.ios && report.saveLocation(getNear(X, Y), X, Y, gTools.floorid);
	                L("***分享给好友成功***");
	            }
	            //,
	            //cancel: function () {
	            //    // 用户取消分享后执行的回调函数
	            //    L("onMenuShareAppMessage cancel")
	            //}
	        });
	    };

	    //todo  旧版本注释掉
	    // 设置上报beacon 后跳根据report信息分析丢失的beacon
	    var reportBeaconList = {},
	        reportedBeaconList = {};
	    var serial = 0;
	    setInterval(function () {
	        if (!gTools.buildingId || X == 0 || Y == 0) {
	            return;
	        }
	        var textArr = [], text = "";
	        $.each(reportBeaconList, function (i, v) {
	            if (reportedBeaconList[i]) {
	                delete reportBeaconList[i];
	                return true;
	            }
	            textArr.push('0025' + v.major + v.minor);
	            reportedBeaconList[i] = true;
	        });

	        gTools.savePosition(getNear(X, Y), X, Y);
	        //post上传ing 吧啦吧啦
	        reportBeaconList = {};
	        if (!textArr.length) {
	            return;
	        }
	        text = textArr.join(":");
	        $.post(gTools.origin + "/scan/report.shtml", {
	            beaconSn: text,
	            floorId: gTools.floorid.split("F").join("")
	        }, function () {
	            // todo
	        })
	    }, 10000);


	    /**
	     * 监听beacon回调
	     * @param tmpargvs
	     */
	    window.yuzhi = -80;
	    window.sxtype = 0;
	    var beaconsInRangeHandler = function (tmpargvs) {
	        // 如果开启了debug模式,则上报扫描到的beacon
	        if (sxDebug) {
	            //log.w(JSON.stringify({searchRst: tmpargvs}));
	            //L({searchedBeaconsCnt: tmpargvs.beacons.length, searchRst: tmpargvs});
	            //L('[beaconsInRangeHandler] 搜索到了' + tmpargvs.beacons.length + '个Beacon');

	            //if (true) {
	            if (!gTools.isLocalhost) {
	                report.saveDataToServer(tmpargvs);

	                // 这个上报接口目前还存在跨域问题,总是上报失败,所以先注销掉
	                //report.saveDataToServerForYZY({
	                //    floorid: +gTools.showingFloor.substr(1),
	                //    beaconscan: tmpargvs
	                //});
	            }
	        }

	        if (gTools.isAjaxing || !beaconObj.init) {
	            oneLog.w({isAjaxing: gTools.isAjaxing, initBeacon: beaconObj.init});
	            return;
	        }

	        gTools.notAtTheSceneTime = new Date();
	        //clearTimeout(listenBTHTime);
	        gTools.blueTeachIsOpen = 1;
	        var argvs = {beacons: []};
	        //一次过滤，得到满足扫描条件的beacon
	        $.each(tmpargvs.beacons, function (i, v) {
	            // todo 上报缓存扫到的beacon 0.4版本 注释掉
	            reportBeaconList[v.major + v.minor] = v;
	            // 过滤掉无效的beacon
	            if (v.rssi == 0 || v.rssi < -92) {
	                return true;
	            }
	            v.rssi = +v.rssi; // +yuzhi 转化成整型
	            argvs.beacons.push(v);
	        });
	        // 没有有效的beacon,不做后续处理
	        if (!argvs.beacons.length) {
	            return;
	        }
	        if (gTools.counter && gTools.counter > 5 && !gTools.beaconList) {
	            gTools.hideLoading();
	            oneLog.w('[beaconsInRangeHandler] notAtTheScene, counter = ' + gTools.counter);
	            //gTools.notAtTheScene();
	            return;
	        }

	        // 按照rssi值进行降序排序
	        argvs.beacons.sort(getSortFun('desc', 'rssi'));
	        //log.w('[beaconsInRangeHandler] Sorted beacons');
	        //var argv = argvs.beacons[0];
	        //  var argv_5 = argvs.beacons.slice(0,8),
	        // var argv_8_2 = argvs.beacons.slice(0,8),
	        var argv_1 = argvs.beacons.slice(0, 1);
	        var rssiStrongestFloor = '';


	        //取前8，获取其中L2层数据量是否为众数（？） ； 或者是判断L2层数据量在argvs里是否超过总扫描数的40%之类
	        var _argv_8 = argvs.beacons.slice(0, 8), argv_8 = [], argv_8_2 = [], tmpBeacon;
	        //var numOfL2 = 0; //, floorIdOfL2 = 140, floorIdOfL1 = 68

	        // 当用户在L2时，单独进行一次beacon过滤
	        //log.w('[beaconsInRangeHandler] gTools.floorid=' + gTools.floorid + ' L2=140 _argv_8' + JSON.stringify(_argv_8));
	        if (gTools.floorid === "F" + FLOORIDOFL2) {
	            var floorIdOfL1 = +FLOORIDOFL1;
	            log.w('[beaconsInRangeHandler] handle for L2 floor');

	            //log.w('[beaconsInRangeHandler] handle for L2 floor. beaconObj ' + JSON.stringify(beaconObj));
	            _argv_8.forEach(function (v) {
	                tmpBeacon = beaconObj['' + v.major + v.minor];  // 必须转化成字符串再拼接
	                //log.w('[beaconsInRangeHandler] handle for L2 floor. tmpBeacon = ', JSON.stringify(tmpBeacon));
	                if (tmpBeacon && tmpBeacon.floorId === floorIdOfL1) {
	                    // 如果扫描到的beacon是L1的, beacon必须不在忽略列表里（就是电梯口的列表里）才能被计算在内
	                    if (UNIGNOREBEACONS[FLOORIDOFL1]["" + v.minor]) {
	                        argv_8.push(v);
	                        argv_8_2.push(v);
	                    }
	                } else {
	                    // 扫到的是M层等其他层，乘电梯下去的，按正常的来
	                    argv_8.push(v);
	                    argv_8_2.push(v);
	                }
	            });
	        } else {
	            log.w('[beaconsInRangeHandler] handle for other floor, whice not belong to L2');
	            argv_8 = _argv_8;
	            argv_8_2 = argvs.beacons.slice(0, 8);   // 不能直接指向_argv_8,因为这样会指向同一个引用,修改时会造成影响
	        }
	        //log.w('[beaconsInRangeHandler] 完成beacon过滤');


	        if (gTools.beaconList) {
	            //log.w('[beaconsInRangeHandler] argv_1 ', JSON.stringify(argv_1));
	            if (gTools.checkFloor && gTools.beaconList && argv_1 && argv_1[0].rssi > -80) {
	                if (gTools.checkFloor > 2) {
	                    gTools.checkFloor = 0;
	                    return;
	                }

	                try {
	                    gTools.checkFloor++;
	                    var tmpCurrFloor = gTools.floorid;
	                    gTools.whichFloor = {};
	                    gTools.whichFloor[tmpCurrFloor] = 0;
	                    //L(argv_5)
	                    $.each(argv_8, function (i2, v2) {
	                        $.each(gTools.cacheBeaconList, function (i, v) {
	                            if (v2.major == v.major && v2.minor == v.minor) {
	                                gTools.whichFloor["F" + v.floorId] = gTools.whichFloor["F" + v.floorId] ? gTools.whichFloor["F" + v.floorId] + 1 : 1;
	                                //argv_5.splice(i2,1);
	                                $.map(argv_8_2, function (a) {
	                                    return (v2.major == v.major && v2.minor == v.minor) ? null : a;
	                                });
	                            }
	                            if (argv_1[0].major == v.major && argv_1[0].minor == v.minor) {
	                                rssiStrongestFloor = "F" + v.floorId;
	                            }
	                        });
	                    });

	                    //L(2)
	                    $.each(argv_8_2, function (i2, v2) {
	                        $.each(gTools.beaconList, function (i, v) {
	                            if (v2.major == v.major && v2.minor == v.minor) {
	                                gTools.whichFloor["F" + v.floorId] = gTools.whichFloor["F" + v.floorId] ? gTools.whichFloor["F" + v.floorId] + 1 : 1;
	                                gTools.cacheBeaconList.push(v);
	                                if (gTools.cacheBeaconList.length > 50) {
	                                    gTools.cacheBeaconList.shift();
	                                }
	                            }
	                            if (argv_1[0].major == v.major && argv_1[0].minor == v.minor) {
	                                rssiStrongestFloor = "F" + v.floorId;
	                            }
	                        });
	                    });
	                } catch (e) {
	                    //L(e.name + ": " + e.message);
	                }

	                $.each(gTools.whichFloor, function (i, v) {
	                    if (gTools.whichFloor[tmpCurrFloor] < v) {
	                        tmpCurrFloor = i;
	                    }
	                });
	                if (!gTools.whichFloorQueue) {
	                    gTools.whichFloorQueue = [];
	                }
	                gTools.whichFloorQueue.push(tmpCurrFloor);

	                if (gTools.whichFloorQueue.length >= 2) {
	                    gTools.whichFloorQueue = gTools.whichFloorQueue.slice(-2);
	                    if (gTools.whichFloorQueue[0] == gTools.whichFloorQueue[1] && gTools.whichFloorQueue[0] != gTools.floorid) {
	                        $("#" + gTools.floorid).find("#poi").hide();
	                        gTools.poiIsHide = 1;
	                        gTools.floorid = tmpCurrFloor;
	                        $('[data-floor="' + gTools.floorid.split("F").join("") + '"]').trigger("click");
	                        gTools.changeFloor = 1;
	                        //todo 原本是分段导航  当发生楼层切换时再做一次导航  这里取消
	                        //setTimeout(newNavigate,100);
	                    }
	                }
	            }

	            show(argvs);
	            //return;
	        }


	        //array.sort(getSortFun('desc', 'rssi'));
	        //L("1:"+ gTools.beaconList && !gTools.allowGetInfo );
	        /*if(gTools.beaconList){
	         if(gTools.checkFloor && gTools.beaconList){
	         gTools.checkFloor = !gTools.checkFloor;

	         $.each(gTools.beaconList,function(i,v){
	         if(argv.major== v.major   && argv.minor == v.minor && gTools.floorid != "F"+v.floorId){
	         $("#"+gTools.floorid).find("#poi").hide();
	         gTools.poiIsHide = 1;
	         gTools.floorid = "F"+v.floorId;
	         $('[data-floor="'+gTools.floorid.split("F").join("") +'"]').trigger("click");
	         gTools.changeFloor = 1;
	         newNavigate();
	         return false;
	         }
	         })
	         }
	         show(argvs);
	         return
	         }*/

	        // var argv2 = [];
	        // $.each(argvs.beacons,function(i,v){
	        //     argv2.push({major: v.major, minor: v.minor});
	        // })
	        // //argv = {major:10004,minor:}
	        // L("getBuildingInfoByBeaconArray start")
	        // if(!argv2.length){
	        //     L("信号过滤，beacon被过滤完了，数组长度为空");
	        //     return;
	        // }
	        //
	        // gTools.isAjaxing = 1;
	        //
	        // gTools.getBuildingInfoByBeaconArray(argv2.slice(0,8))
	        //     //gTools.getBuildingInfoByBeacon(argv.major,argv.minor)
	        //     .done(function(res2){
	        //         L("getBuildingInfoByBeaconArray over")
	        //         res2 = JSON.parse(res2);
	        //         gTools.counter = gTools.counter?gTools.counter+1:1;
	        //         gTools.isAjaxing = 0;
	        //         //L("onBeaconsInRange  over" + JSON.stringify(argvs));
	        //         //L("扫描beacon列表" + JSON.stringify(argvs));
	        //         if(res2.msg){
	        //             //L(res2.msg +":" + JSON.stringify(argv));
	        //             return;
	        //         }
	        //         L("getBuildingInfoByBeacon over：" /*+ JSON.stringify(res2)*/);
	        //
	        //         if(res2.buildingInfo && gTools.buildingId != res2.buildingInfo.id){
	        //             gTools.buildingInfo = res2.buildingInfo;
	        // 						res2.buildingInfo.isUseNodejs = 2;
	        //             gTools.dataStoreAddress = res2.buildingInfo.isUseNodejs === 0 ? false :res2.buildingInfo.dataStoreAddress
	        //             gTools.initOver = 1;
	        //             /*localStorage.mapname = res2.mapname;
	        //              localStorage[localStorage.mapname] = res2;*/
	        //             gTools.buildingName = res2.buildingInfo.name;
	        //             gTools.buildingComment = res2.buildingInfo.comment;
	        //             gTools.showLoading('检测到您在 <span style="color: red">'+gTools.buildingComment+'</span> 正在加载地图 ...')
	        //             gTools.buildingId = res2.buildingInfo.id;
	        //             report.buildingId = gTools.buildingId;
	        //             gTools.ratio = res2.buildingInfo.mapScale || gTools.ratio;
	        //             gTools.cursorScale = res2.buildingInfo.cursorScale || 1;
	        //             gTools.initialRatio = gTools.ratio;
	        //             report.saveVisit(gTools.floorid,0);
	        //             getParkedInfo();
	        //
	        //             if(!!res2.buildingInfo.parkUrl){
	        //                 gTools.isCamera = true;
	        //             }
	        //             //isUseNodejs = 0 前端计算（地图本身自带主辅路）
	        //             //isUseNodejs = 1 调用后端接口计算
	        //             //isUseNodejs = 2 调用json计算
	        //             gTools.node = res2.buildingInfo.isUseNodejs === 1;
	        //             gTools.navigationAddress = res2.buildingInfo.navigationAddress;
	        //             // 处理 根据sort值设置当前楼层
	        //             gTools.floorList = $.extend(true,[],res2.floorList);
	        //             gTools.floorid = "F"+res2.floorList.sort(getSortFun("desc","sort"))[0].id
	        //             gTools.showingFloor =  gTools.floorid
	        //
	        //             floorid=gTools.floorid;
	        //             gTools.adUser = res2.buildingInfo.adUser;
	        //
	        //             gTools.beaconList = res2.beaconList;
	        //             floors=gTools.floorList;
	        //             //gTools.createFloorNav();
	        //             // floorNo=floors.length;
	        //             var arr = [];
	        //             //console.log(floors)
	        //             $.each(floors,function(i,v){
	        //                 !!v.svgAddress && arr.push({path:gTools.origin+'/'+v.svgAddress,id:"F"+v.id});
	        //             });
	        //             createMap(arr);
	        //             hideFastNav()
	        //             gTools.couponList = {};
	        //             $.each(res2.couponList, function (i,v) {
	        //                 if(v.floorId){
	        //                     v.floorId = "F"+v.floorId;
	        //                     if(! gTools.couponList[v.floorId]){
	        //                         gTools.couponList[v.floorId] = [];
	        //                     }
	        //                     gTools.couponList[v.floorId].push(v);
	        //                 }
	        //             })
	        //
	        //
	        //
	        //             setTimeout(getCarpos,100);	// setTimeout(getPoi, 100);
	        //             var $body = $('body')
	        //             document.title = gTools.buildingComment;
	        //             // hack在微信等webview中无法修改document.title的情况
	        //             var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
	        //                 setTimeout(function() {
	        //                     $iframe.off('load').remove()
	        //                 }, 0)
	        //             }).appendTo($body)
	        //
	        //             show(argvs);
	        //
	        //         }
	        //     }).fail(function(){
	        //         //gTools.hideLoading();
	        //         gTools.isAjaxing = 0;
	        //         L(argv2.slice(0,8),"err")
	        //
	        //     })
	    };
	    window.beaconsInRangeHandler = beaconsInRangeHandler;

	    //var tmpSvgElem;
	    /**
	     * 根据beacon信息定位游标位置
	     * @param jsondata (object)
	     */
	    function show(jsondata) {
	        //L(JSON.stringify(jsondata))
	        //L("func show is using");
	        var beaconsfromweixin = jsondata.beacons;

	        var floor = file.select('#' + gTools.floorid);
	        if (!floor) {
	            L("!floor");
	            return;
	        }
	        var position = {X: 0, Y: 0};
	        //if(tmpSvgElem){
	        //
	        //}else{
	        //    tmpSvgElem = Snap("#jz").circle(0,0,0)
	        //}
	        if (gTools.changeFloor) {
	            //切换楼层时清除原先定位信息（如从B2到B1再到B2。则清掉原本B2定位数据）
	            X = 0;
	            Y = 0;
	            gTools.changeFloor = 0;
	            if (gTools.BeaconIndex) {
	                algorithm.clearRssiChain(beaconList.list[gTools.BeaconIndex[gTools.floorid]]);
	            }
	            //L("changeFloor  Z=0 Y = 0")
	        } else {
	            //L("beaconList" + JSON.stringify(beaconList))
	            //L("last====="+beaconList.list[gTools.floorIndex[gTools.floorid]])
	            if (gTools.floorIndex) {
	                //L("gTools.floorListGroupByFloor");
	                console.time("a");
	                var tmpBeaconList = beaconList.list[gTools.BeaconIndex[gTools.floorid]];
	                if (!tmpBeaconList) {
	                    log.v('当前楼层还没有部署过Beacon.');
	                    return;
	                }
	                position = algorithm.getPosition(X, Y, tmpBeaconList, beaconsfromweixin);   // 这个方法也会把不属于场景中的beacon给过滤掉
	                console.timeEnd("a");
	            }
	            //var position=algorithm.getPositionWithFilter(X,Y,floorid,beaconList,beaconsfromweixin);
	            //L("position:"+JSON.stringify(position))
	            //L("beaconsfromweixin:"+JSON.stringify(beaconsfromweixin))
	            //L("not changeFloor " + JSON.stringify(position))
	            X = position.X;
	            Y = position.Y;
	        }
	        //L("before judge")
	        var fid = gTools.floorid;
	        if (fid == undefined) {
	            return;
	        }
	        var judgeResult = map.wayfinding('jugeLocation', {x: X, y: Y, floor: fid});
	        // L("X=" +X + "Y="+Y);
	        // L("nX=" +judgeResult.nearPoint.x + "nY=" + judgeResult.nearPoint.y);
	        // L("distance=" + judgeResult.distance);
	        //逗比需求：只有在停车场提示左转右转……呵呵哒。
	        if (gTools.floorList && gTools.floorIndex && gTools.floorList[gTools.floorIndex[gTools.floorid]].type == 2) {
	            if (judgeResult.turnning > 0) {
	                //左转
	                gTools.halfModal('<div><p class="smallsize">您当前在 <span style="font-size:1.1em">' + gTools.floorList[gTools.floorIndex[gTools.floorid]].name + '</span> 层</p><p class="isNavigating largesize">请沿着路线方向行走，然后左转</p></div>', {noEmpty: 1});
	            } else if (judgeResult.turnning < 0) {
	                //右转
	                gTools.halfModal('<div><p class="smallsize">您当前在 <span style="font-size:1.1em">' + gTools.floorList[gTools.floorIndex[gTools.floorid]].name + '</span> 层</p><p class="isNavigating largesize">请沿着路线方向行走，然后右转</p></div>', {noEmpty: 1});
	            }
	        }
	        // console.log(judgeResult)
	        //rotateangle = Math.random()*360;

	        // 此处判断距离在6米范围内是何用途?
	        var tx = X, ty = Y;
	        if (judgeResult.distance * 0.55 <= 6.0) {
	            tx = judgeResult.nearPoint.x;
	            ty = judgeResult.nearPoint.y;
	        } else {
	            // todo nothing.
	        }

	        setCursorPosition({X: tx, Y: ty});
	        //judgeIfNearChest(gTools.poiList[gTools.showingFloor]);
	    }

	    // Begin test code.
	    window.setXY = function (x, y) {
	        X = x, Y = y;
	        if (!gTools.floorid) {
	            return;
	        }
	        setCursorPosition({X: x, Y: y});
	    };
	    // End test code.

	    gTools.wx_init_location = 0;
	    // 基于XY坐标去设置游标位置并显示
	    window.setCursorPosition = function (position, duration) {
	        duration = duration || 400;
	        var tx = +position.X, ty = +position.Y;
	        var floor = file.select('#' + gTools.floorid);
	        if (!floor) {
	            L("无法显示游标: 未获取到定位楼层");
	            return;
	        }
	        logo = floor.select('#jz');
	        var circle = logo.select("#poi");

	        // 校验rotateAngle是否合法
	        if (rotateangle === undefined || rotateangle === Number.POSITIVE_INFINITY || rotateangle === Number.NEGATIVE_INFINITY) {
	            rotateangle = 0;
	        }

	        // 设置游标方向
	        rotateangle = isNaN(rotateangle) ? 0 : rotateangle;     // 根据楼层朝向设置游标方向
	        //旋转角度超过180度时，取负的补角角度
	        if (Math.abs(oldAngle - rotateangle) > 180) {
	            oldAngle = rotateangle - 360;
	        } else {
	            oldAngle = rotateangle;
	        }
	        var angle = oldAngle + conf.CURSOR_ROTATE_ANGLE_OFFSET; // 增加了旋转角度矫正: angle = oldAngle => oldAngle + conf.CURSOR_ROTATE_ANGLE_OFFSET
	        if ($.os.android) {
	            angle = -angle;//安卓手机上  左右方向反向。进行一次负值变化。
	        }

	        gTools._cursorScale = gTools._cursorScale || 1;

	        if (tx === 0 || ty === 0 || isNaN(tx) || isNaN(ty)) {
	            L('[setCursorPosition] 设置游标失败: 坐标无效(' + tx + ',' + ty + ')');
	            return;
	        }

	        // 坐标保留小数点后3位即可
	        //tx = +tx.toFixed(3);
	        //ty = +ty.toFixed(3);
	        tx = Math.round(tx);
	        ty = Math.round(ty);
	        //log.v('After to fixed svg coords (', tx, ',', ty, ')');

	        //if (X != 0 && Y != 0 && gTools.poiIsHide == 1) { // 楼层切换时
	        if (gTools.poiIsHide == 1) { // 游标处于隐藏状态,需要先显示
	            //tmpSvgElem.transform().localMatrix
	            L('[setCursorPosition] 第一次设置游标位置(' + tx + ',' + ty + ') angle=' + angle + ' scale=' + gTools._cursorScale);
	            circle.animate({
	                transform: "t" + tx + "," + ty + "r" + angle + ',s' + gTools._cursorScale
	            }, 10);
	            setTimeout(function () {
	                $("#" + gTools.floorid).find("#poi").show();
	                locationCurr(tx, ty, gTools.floorid);           // 第一次显示游标时,定位到中心点
	            }, 400);
	            gTools.poiIsHide = 0;
	            //log.v('[setCursorPosition] Show locate poi for first time.');
	            return;
	        }

	        L('[setCursorPosition] 更新游标位置(' + tx + ',' + ty + ') angle=' + angle + ' scale=' + gTools._cursorScale);
	        //log.v('[setCursorPosition] Not need show locate poi for repeat scaned beacons and changed floor and so on, Just translate for it.');

	        circle.animate({
	            transform: "t" + tx + "," + ty + "r" + angle + ',s' + gTools._cursorScale
	        }, duration);

	        //if (gTools.wx_init_location == 0 && $("#modal-loading").text().includes("位置信息")) {
	        //    delete gTools.wx_init_location;
	        //    gTools.hideLoading();
	        //}
	    };

	    function InitBeacon() {
	        beacons = beacondataList.list;
	        beaconList = new List();
	        for (var y = 0; y < beacons.length; y++) {
	            var thisfloor = new List();

	            for (var i = 0; i < beacons[y].length; i++) {

	                var beacon = new Beacon();

	                beacon.setX(beacons[y][i].x);
	                beacon.setY(beacons[y][i].y);
	                beacon.setMajor(beacons[y][i].major);
	                beacon.setMinor(beacons[y][i].minor);
	                beacon.setFloorid(beacons[y][i].floorId);
	                thisfloor.add(beacon);
	            }
	            beaconList.add(thisfloor);

	        }
	        //L("InitBeacon over")
	        if (gTools.action) {
	            actionFromUrl();
	            notNavActionFromUrl();
	        }
	    }

	    /**
	     * 不导航的actionUrl判断 ——不需要等待initover结束
	     */
	    var notNavActionFromUrl = function () {
	        if (!gTools.action) {
	            log.v('[notNavActionFromUrl] Not point the action, so not exec.');
	            return;
	        }

	        if (!FLOORID) {
	            gTools.alert('缺少楼层编号，无法执行' + gTools.action + '操作！');
	            return;
	        }

	        var uFloor = 'F' +  FLOORID;

	        switch (gTools.action) {
	            // "fromShare" 和 "findPoint" 做相同的逻辑处理
	            case "fromShare":
	            case "findPoint":
	                if (!map.children("#" + uFloor).find('#poiBox').length) {   // 等待添添加定位游标完成后再进行后续操作
	                    setTimeout(notNavActionFromUrl, 300);	// 1000 => 300
	                    return;
	                }

	                gTools.follow = false;  // 关闭地图跟随
	                if (UAREA) {    // 通过unit mapArea来指定店铺
	                    gTools.uPoint = UAREA;
	                } else if (gTools.ux && gTools.uy) {    // 通过(x,y)坐标来指定店铺
	                    gTools.uPoint = getNear(gTools.ux, gTools.uy, uFloor);
	                }
	                log.v('[notNavActionFromUrl] gTools.uPoint', gTools.uPoint, 'uarea', UAREA, 'coordination(' + gTools.ux + ',' + gTools.uy + ')');
	                if (!gTools.uPoint) {   //
	                    gTools.alert('缺少点位信息，无法执行' + gTools.action + '操作！');
	                    return;
	                }

	                // 设置钉子
	                //setPin({
	                //    mapArea: gTools.uPoint,
	                //    floor: uFloor,
	                //    type: "public"
	                //});
	                gTools.setPinScale();
	                // 设置地图中心位置为当前poi所对应的位置(同时会设置钉子)
	                setTimeout(function () {    // 延时是为了setPinScale()操作完成?
	                    $('#' + gTools.uPoint).trigger('tap');
	                }, 500);
	                break;
	            //case "findToilet":
	            case "findBathroom":
	            case "findElevator":
	            case "findZig":
	            case "findExit":
	            case "findPay":
	                if (gTools.linkList && gTools.floorIndex) {
	                    setTimeout(function () {
	                        $('[data-naction="' + gTools.action + '"]').trigger("click");
	                    }, 500);
	                }
	                break;
	            case "find":
	            case "find2":
	                if (localStorage.getParkedInfo && !!JSON.parse(localStorage.getParkedInfo).parkPoint) {
	                    var parkInfo = JSON.parse(localStorage.getParkedInfo), lp = parkInfo.parkPoint,
	                        lf = $("#F" + parkInfo.floorId);
	                    if (lf.length) {
	                        var lo = lf.find("#Doors #" + lp), lx = lo.attr("x1"), ly = lo.attr("y1");
	                        if (!gTools.blueTeachIsOpen && gTools.blueTeachIsOpen === 0) {//已判断过蓝牙为关闭状态
	                            $('#myMaps').wayfinding('setParkPin', lp);
	                            gTools.setPinScale();
	                            locationCurr(lx, ly, "F" + parkInfo.floorId);
	                        } else if (!gTools.blueTeachIsOpen) {//未判断蓝牙
	                            setTimeout(notNavActionFromUrl, 500);	// 300 => 500
	                        } else {//蓝牙开启
	                            $('#myMaps').wayfinding('setParkPin', lp);
	                            gTools.setPinScale();
	                        }
	                    }
	                } else {
	                    setTimeout(notNavActionFromUrl, 300);  // 300 => 1000
	                }
	                break;
	            default :
	                log.w('[notNavActionFromUrl] Not matched action.');
	                break;
	        }
	    };

	    /**
	     * 根据url的action 判断使用何种默认操作  需要等待initOver和定位成功才执行操作结束
	     */
	    function actionFromUrl() {
	        if (!gTools.action) {
	            log.v('[actionFromUrl] Not point the action, so not exec.');
	            return;
	        }

	        if (!gTools.initOver || (X == 0 || Y == 0)) {
	            if (gTools.initOver) {
	                log.v('[actionFromUrl] Not complete location. coordination(' + X, ',' + Y +')');
	            } else {
	                log.v('[actionFromUrl] Not complete gTools.initOver operation.');
	            }

	            //gTools.showLoading("亲，正在为您导航");   // 如果在现场的话,先显示提示会比较好; 但是如果不在现场的话,会一直显示loading弹框,不便于操作

	            setTimeout(actionFromUrl, 300); // 300 => 1000
	            return;
	        }

	        switch (gTools.action) {
	            case "park":
	                if (localStorage.getParkedInfo) {
	                    setTimeout(function () {
	                        $('[data-naction="if-record-car"]').trigger("click");
	                    }, 500);	// 300 => 500
	                } else {
	                    setTimeout(actionFromUrl, 300);
	                }
	                break;
	            case "find":
	                if (localStorage.getParkedInfo) {
	                    setTimeout(function () {
	                        $('[data-naction="search-car"]').trigger("click");
	                    }, 500);	// 300 => 500
	                } else {
	                    setTimeout(actionFromUrl, 300);
	                }
	                break;
	            case "fromShare":
	            case "findPoint":
	                if (!((gTools.ux && gTools.uy) || gTools.uPoint)) {
	                    var msg = '[actionFromUrl] ux=' + gTools.ux + ' uy= ' + gTools.uy + ' uPoint=' + gTools.uPoint + ' not exist, so not exec' + gTools.action;
	                    L(msg);
	                    log.v(msg);

	                    return;
	                }

	                gTools.destination = {
	                    floorId: gTools.floorid,
	                    buildingName: gTools.buildingName,
	                    isNavigatingFloor: 0
	                };
	                if (gTools.uPoint) {
	                    gTools.destination.pointId = gTools.uPoint;  // pointId指的应该是mapArea,如L1-32
	                } else {
	                    if (gTools.ux && gTools.uy) {
	                        gTools.destination.pointId = getNear(gTools.ux, gTools.uy, "F" + FLOORID);
	                    }
	                }
	                if (!gTools.destination.pointId) {
	                    gTools.alert('自动获取导航终点失败，请手动选择终点后，再进行导航！');
	                    return;
	                }
	                gTools.showLoading("亲，正在为您导航");
	                newNavigateOpt.text = "欢迎小主下次光临哦！";
	                newNavigateOpt.title = "恭喜您抵达目的地";
	                setTimeout(newNavigate, 300); // 100 => 300
	                break;
	            case "toshare":
	                if (X != 0 && Y != 0) {
	                    $("#if_share").addClass("active");
	                    gTools.startInitShare = true;
	                    initShareEvt();
	                } else {
	                    setTimeout(actionFromUrl, 300);
	                }
	                break;
	            default :
	                log.w('[actionFromUrl] Not matched action.');
	                break;
	        }

	        //return;
	        //// 停车信息处理?
	        //if (localStorage.getParkedInfo) {
	        //    if (X != 0 && Y != 0) {
	        //        setTimeout(function () {
	        //            //L("默认 寻车找车--"+gTools.action);
	        //            if (gTools.action == "park") {
	        //                $('[data-maction="if-record-car"]').trigger("click");
	        //            } else if (gTools.action == 'find') {
	        //                $('[data-maction="search-car"]').trigger("click");
	        //            }
	        //        }, 1000);
	        //    } else {
	        //        setTimeout(actionFromUrl, 300)
	        //    }
	        //} else if (X != 0 && Y != 0) {
	        //    setTimeout(function () {
	        //        if (gTools.action == "findPoint") {
	        //
	        //        }
	        //    }, 1000)
	        //} else {
	        //    setTimeout(actionFromUrl, 300)
	        //}
	    }

	    function dealWithData() {
	        //L("dealWithData")
	        for (var j = 1; /*j<floors.length+1*/0; j++) {
	            log.w('Into [dealWithData] loop......');

	            var floor = file.select('#F' + floors[j - 1].id);
	            if (!floor) {
	                continue;
	            }

	            var map = floor.select('#jz');
	            var Beacons = map.select('#beacons');
	            var tmpbeacons = beacondataList.get(j - 1);
	            if (tmpbeacons) {
	                for (var i = 1; i < tmpbeacons.length + 1; i++) {
	                    var newCircle = Beacons.circle(tmpbeacons[i - 1].X, tmpbeacons[i - 1].Y, 1.5);
	                    newCircle.attr({id: "beacon" + i, fill: "#00f", "fill-opacity": 1, display: "none"});
	                }
	            }
	        }
	        //L("dealWithData over");
	        InitBeacon();
	        //InitWeixin();
	    }

	    /**
	     * 获取卡券列表
	     */
	//  var getCarpos = function () {
	//      if (!gTools.showingFloor || !map.find("#" + gTools.showingFloor).length) {
	//          setTimeout(getCarpos, 1000);
	//          return;
	//      }
	//      gTools.couponList = gTools.couponList ? gTools.couponList : {};
	//      if (gTools.couponList[gTools.showingFloor]) {
	//          getPoi()
	//          return;
	//      }
	//      if (!gTools.showingFloor) {
	//          return
	//      }
	//      var fid = gTools.showingFloor, get_url = '';
	//      if (gTools.url.indexOf("dev") > -1) {
	//          get_url = 'http://ydev.wizarcan.com'
	//      } else {
	//          get_url = 'http://y.wizarcan.com'
	//      }
	//      carposApi.getCouponsByFloorId(fid).done(function (res, res2) {
	//
	//          typeof res === 'string' ? res = JSON.parse(res).data : "";
	//          res.links = res.records;//接口调整……
	//          !res.cards ? res.cards = [] : '';
	//          !res.links ? res.links = [] : '';
	//          !res.redpacks ? res.redpacks = [] : '';
	//          $.each(res.cards, function (i, v) {
	//              v.disable = "";
	//              v.frontText = ''
	//              gTools.couponList[fid] = gTools.couponList[fid] ? gTools.couponList[fid] : {}
	//              gTools.couponList[fid][v.position_id] = {cards: v};
	//          })
	//          $.each(res.links, function (i, v) {
	//              if ($.inArray(v.id, res2.links) > -1 && v.only_one_flag == '1') {
	//                  v.disable = "disabled";
	//                  v.frontText = '已'
	//              } else {
	//                  v.disable = "";
	//                  v.frontText = ''
	//              }
	//              v.get_url = get_url + "/yao/yao_api/get_link/2/" + v.id;
	//              v.background_img = get_url + v.background_img;
	//              v.x = v.idpObj.x
	//              v.y = v.idpObj.y
	//              v.floorId = fid;
	//              gTools.couponList[fid] = gTools.couponList[fid] ? gTools.couponList[fid] : {}
	//              gTools.couponList[fid][v.idpObj.mapArea] = {links: v};
	//              if (v.idpObj.isHide) {
	//                  hiddenLinks[fid] ? hiddenLinks[fid].push(v) : hiddenLinks[fid] = [v];
	//              }
	//          })
	//          $.each(res.redpacks, function (i, v) {
	//              if ($.inArray(v.id, res2.redpacks) > -1) {
	//                  v.disable = "disabled";
	//                  v.frontText = '已'
	//              } else {
	//                  v.disable = "";
	//                  v.frontText = ''
	//              }
	//              gTools.couponList[fid] = gTools.couponList[fid] ? gTools.couponList[fid] : {}
	//              gTools.couponList[fid][v.position_id] = {redpacks: v};
	//          })
	//          getPoi();
	//      });
	//  }

	    /**
	     * 获取poi列表
	     * @authro weibin
	     * @param {string}      [floor]     可选,指定要获取poi列表对应的楼层编号,如F40
	     * @param {boolean}     [onlyGet]   可选,是否只做获取poi列表操作. 1.true:是; 2.false:否
	     * @param {function}    [callback]  可选,完成获取poi列表之后的回调处理
	     */
	    function getPoi(floor, onlyGet, callback) {
	        floor = floor || gTools.showingFloor;

	        var svgB = Snap.select("#myMaps").select('#' + floor);
	        if (!svgB) {
	            log.w('[getPoi] not find map');
	            //todo  这是个奇怪的问题   即使是在createMap之后  有时候也 无法取到这个dom元素
	            setTimeout(function () {
	                getPoi();
	            }, 100);
	            return;
	        }

	        var map = $("#myMaps");
	        if (gTools.poiList && gTools.poiList[floor]) {
	            // poi已经存在  原本不做操作--->将当前floor下的text显示出来
	            //gTools.setPoiText = gTools.initSetPoiText("create");
	            if (!$("#text").children().length) {
	                // gTools.setPoiText();
	                gTools.transPoiText();
	            }
	            log.v('[getPoi] this floor poi list is exist, just need to transform.');
	        } else {
	            // 必须等待前一次获取poi列表操作完成
	            if (gTools.isGetingPoi) {
	                log.v('[getPoi] is getting poi, please waiting.');
	                return;
	            }
	            gTools.isGetingPoi = true;

	            //bug 这里将showingFloor缓存，不然可能出现这样的情况：获取F1数据——换楼层F2——F1数据获取完毕——数据被存储到F2上去……
	            gTools.getPoiListByFloorId(floor).done(function (res) {
	                var svg = svgB.select("#jz"), poiBox = svg.select("#poiBox");
	                if (!poiBox) {
	                    poiBox = svg.select("#transArea").el("g", {"id": "poiBox"});
	                }

	                typeof res === 'string' && (res = JSON.parse(res));
	                gTools.isGetingPoi = false;
	                gTools.poiList = gTools.poiList || {};
	                gTools.poiList[floor] = gTools.poiList[floor] || {};
	                $.each(res.poiList, function (i, v) {
	                    gTools.poiList[floor][v.mapArea] = v;

	                    // 只是做获取poi列表操作时,不需要添加poi到地图上
	                    if (onlyGet) {
	                        return;
	                    }

	                    // todo 设置 icon poi
	                    if (v.isShowIcon) {
	                        var poi = poiBox.image(gTools.origin + v.icon, v.x, v.y, v.width, v.height);
	                        poi.attr({"pointer-events": "none"});
	                    }
	                });

	                // 当不仅仅是做获取poi列表操作时,需要将将所有的文字poi放到一个DOM元素中
	                if (!onlyGet && map.find("svg").filter(":visible").length) {
	                    gTools.initSetPoiText("zoom")();
	                }

	                // 执行回调
	                callback && callback(gTools.poiList[floor]);

	                gTools.hideLoading();   // 在添加完文字poi成功之后再隐藏load框,防止未完成poi添加操作就开始操作地图,造成卡死的现象.
	            }).fail(function () {
	                gTools.isGetingPoi = false;
	                gTools.hideLoading();
	            });
	        }
	    }

	    // 初始化楼层按钮的事件
	    var FloorClass = function () {
	        this.btn = $(".rtmap_floor_btn");
	        this.changeList = $(".rtmap_floor_change_list");
	        this.listScroll = $('.list_scroll');
	        this.topAngle = $(".topAngle i");
	        this.bottomAngle = $(".bottomAngle i");
	        var self = this;
	        this.btn.click(function (event) {
	            event.stopPropagation();
	            event.preventDefault();
	            //_checkAngleStatus();

	            // 点击、切换楼层时,自动隐藏和显示左侧推荐店铺菜单
	            if (recommendStore.haveLeftPartData) {
	                $('#js_left_top_box').toggleClass('db');
	            }

	            self.openstatus = !self.openstatus;
	            self.changeList.toggleClass("open", self.openstatus);
	            if (self.openstatus) {
	                var activeLi = self.listScroll.find("li.active");
	                var t = activeLi[0].offsetTop;
	                var target = t - 80,
	                    start = self.listScroll[0].scrollTop;
	                var oneStep = (target - start) / 30;
	                var now = start;

	                function doit() {
	                    now += oneStep;
	                    self.listScroll[0].scrollTop = now;
	                    if (Math.abs(now - target) <= Math.abs(oneStep)) {
	                        self.listScroll[0].scrollTop = target;
	                        return;
	                    }
	                    //_checkAngleStatus();
	                    requestAnimationFrame(doit);
	                }
	                doit();
	            }
	        });

	        //function _checkAngleStatus() {
	        //    var top = self.listScroll[0].scrollTop,
	        //        scorllHeight = self.listScroll[0].scrollHeight;
	        //
	        //    offsetHeight = self.listScroll[0].offsetHeight;
	        //    realyHeight = scorllHeight - offsetHeight;
	        //
	        //    if (top == realyHeight) {
	        //        self.topAngle.removeClass("disable");
	        //        self.bottomAngle.addClass("disable");
	        //        if (top == 0 && realyHeight == 0) {
	        //            self.topAngle.addClass("disable");
	        //            self.bottomAngle.addClass("disable");
	        //        }
	        //    } else if (top == 0) {
	        //        self.topAngle.addClass("disable");
	        //        self.bottomAngle.removeClass("disable");
	        //    } else {
	        //        self.topAngle.removeClass("disable");
	        //        self.bottomAngle.removeClass("disable");
	        //
	        //    }
	        //}
	    };

	    // 创建地图
	    function createMap(arr, callback) {
	        //if (gTools.buildingName == 'changtai') {//长泰 使用后台计算
	        //    gTools.node = 1;
	        //}

	        setGEParkPatch();	// GE停车场设置
	        var tmpcolor = false;
	        var Rwidth = 1.5;
	        if (gTools.buildingId == 46 || gTools.buildingId == 50) {
	            tmpcolor = true;
	            Rwidth = 2;
	        }
	        var color = tmpcolor ? "rgb(255, 64, 24)" : '#2ECC71';
	        var l = arr.length;
	        var map = $('#myMaps');

	        map.wayfinding({
	            'maps': arr,
	            'path': {
	                width: Rwidth,
	                color: color,
	                radius: 8,
	                speed: 0
	            },
	            //'startpoint': function () {
	            //    currentFloor = "${pd.floorid}";
	            //    return '${pd.position}';
	            //},
	            'defaultMap': gTools.floorid,   //'F1'
	            'showLocation': true,
	            'loadMessage': ''       // 界面不用显示loadMessage,用loading弹框代替
	        }, function (type) {        // 该回调函数时怎么执行的? 每完加载完一个地图就调用一次,还是加载完所有的地图才调用一次?
	            L('创建地图完成回调 type=' + type);
	            log.i('创建地图完成回调 type =', type);
	            //ListenToBLE();
	            //retrivingData();
	            //gTools.hideLoading();
	            gTools.initZoomEvt();
	            gTools.IS_TAIKOOLI_SCENE && $("#body").addClass(gTools.floorid); // 太古里根据class名称（class名称为楼层编号）来判定是否显示顶部输入框的placeholder内容

	            //// 设置游标
	            //$("#myMaps").find("svg").each(function () {
	            //    var $locPoi = $(this).find("#poi").hide();
	            //    // 重置游标
	            //    if (gTools.IS_HX_HOME_EXPO_SCENE) {
	            //        $locPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/common/img/poi/arrow_loc_orange_2.png');
	            //    } else {
	            //        $locPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/cursor/arrow.png');
	            //        //if ((gTools.buildingId == 46 || gTools.buildingId == 50 || gTools.buildingId == 61) && $.os.android) {
	            //        //    $locPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/cursor/round.png');
	            //        //}
	            //    }
	            //    // 隐藏游标
	            //    $locPoi.hide();
	            //    //$locPoi.prev("g#pathBox").length?"":poi.before("<g id='pathBox' style='pointer-events: auto;'></g>");
	            //});

	            setFloorIndex();
	            setSearchPlaceholder();
	            setTimeout(locationCurr, 1000);
	            setTimeout(function () {
	                gTools.ratio = gTools.ratio || 2;
	                $("#myMaps > div").filter(":hidden").find("svg#jz").panzoom("setMatrix", [gTools.ratio, 0, 0, gTools.ratio, 0, 0]);
	            }, 2000);

	            if (type === "all") {    // all表示当前场景的所有地图都已经加载完成
	                gTools.$floorDom = {};
	                gTools.$floorSvg = {};
	                $("#myMaps > div").each(function (i, v) {
	                    gTools.$floorDom[v.id] = $("#" + v.id);
	                    gTools.$floorSvg[v.id] = Snap.select("#myMaps").select('#' + v.id).select("#jz");
	                    gTools.$floorDom[v.id].find("#poi").hide();
	                });

	                gTools.IS_TAIKOOLI_SCENE && $("#text").add("#body").removeClass().addClass(gTools.floorid); // 太古里场景的特殊处理: 对 #text #body #ttm 三个元素做相同处理, 完善后不需要对#ttm元素添加class名称了

	                setSTP();

	                var svgB, svg, transArea, poiBox, cursorBox, cursorPoi;
	                // var svgBox;

	                var svg_obj,
	                    tpl,
	                    _f,
	                    // 通过class和maction为公共设施设置点击事件
	                    typeObj = {
	                        Elevator: {
	                            name: "电梯",
	                            class: "poi7"
	                        },
	                        Stair: {
	                            name: "楼梯",
	                            class: ""
	                        },
	                        Exit: {
	                            name: "出口",
	                            class: "poi8"
	                        },
	                        Bathroom: {
	                            name: "卫生间",
	                            class: "poi6"
	                        },
	                        Zig: {
	                            name: "扶梯",
	                            class: "poi9"
	                        },
	                        ManWC: {
	                            name: "男厕",
	                            class: ""
	                        },
	                        WomanWC: {name: "女厕", class: ""},
	                        Subway: {name: "地铁", class: "poi19"},
	                        Pay: {name: "缴费机", class: 'poi12'},
	                        Server: {name: "客服中心", class: "poi18"},
	                        Sunvalley: {name: "阳光谷", class: ""},
	                        Fishtank: {name: "海景鱼缸", class: ""},
	                        Childroom: {name: "母婴室", class: "poi16"},
	                        ATM: {name: "ATM", class: "poi15"},
	                        Membercenter: {name: "会员中心", class: "poi17"}
	                    };
	                $.each(gTools.floorList, function (i, v) {
	                    svgB = Snap.select("#myMaps").select('#F' + v.id);
	                    if (!svgB) {
	                        return;
	                    }
	                    svg = svgB.select("#jz");
	                    transArea = svg.select("#transArea");
	                    //svgBox = transArea.select("#beacons");

	                    poiBox = transArea.select("#poiBox");
	                    // 如果poiBox不存在,则添加poiBox
	                    if (!poiBox) {
	                        poiBox = transArea.el("g", {"id": "poiBox"});
	                    }

	                    cursorBox = transArea.el("g", {"id": "cursorBox"});
	                    cursorPoi = transArea.select('#poi');
	                    // 设置游标：如果没有游标则添加一个游标，并隐藏；如果已经有游标了，则隐藏游标
	                    if (!cursorPoi) {
	                        cursorPoi = svg.paper.image('//oex38ct5y.qnssl.com/cursor/arrow.png', -20, -20, 40, 40).attr({id: 'poi', direction: 0, display: 'none'});
	                        log.w('缺少定位游标');
	                    } else {
	                        cursorPoi.attr({display: 'none'});
	                    }

	                    // 重置游标
	                    if (gTools.IS_HX_HOME_EXPO_SCENE) {
	                        cursorPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/common/img/poi/arrow_loc_orange_2.png');
	                    } else {
	                        cursorPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/cursor/arrow.png');
	                        //if ((gTools.buildingId == 46 || gTools.buildingId == 50 || gTools.buildingId == 61) && $.os.android) {
	                        //    $locPoi.attr('xlink:href', '//oex38ct5y.qnssl.com/cursor/round.png');
	                        //}
	                    }
	                    cursorBox.append(cursorPoi);

	                    //公共设施图片替换 原本是在getPoi之后再替换，但像findBathroom之类会全部地图都标识出来，于是未getPoi过的楼层会出现钉子被后添加的公共设施图片挡住
	                    svg_obj = map.find("#F" + v.id),
	                        tpl = "",
	                        _f = v.id;

	                    // 限定了基础设施必须是rect,不能是polygon. 区分基础设施与普通room的方法：只有基础设施的g标签加了class,普通room的g标签没有加class
	                    //svg_obj.find("#Rooms g[class] rect").each(function (i, v) {
	                    svg_obj.find("#Rooms g[class]").each(function (i, v) {
	                        var $this = $(this), $rect = $this.find('rect').eq(0), type = $this.attr("class"), x = $rect.attr("x"), y = $rect.attr("y"), w = $rect.attr("width"), h = $rect.attr("height"), id = $this.attr("id");
	                        tpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="//oex38ct5y.qnssl.com/img/' + type + '.png" data-icon="//oex38ct5y.qnssl.com/img/' + type + '.png" data-x="' + x + '" data-y="' + y + '" data-maction="public"   data-floor-id="' + _f + '" data-brand="' + typeObj[type].name + '" data-map-area="' + id + '" x="' + x + '" y="' + y + '" direction="0" width="' + w + '" height="' + h + '" style="pointer-events: auto; display: inline;" ></image>';
	                        //if(x === undefined){console.log(this)}
	                    });
	                    svg_obj.find("#poiBox")[0].innerHTML += tpl;
	                    gTools.setPinScale();
	                });

	                // 绑定平移事件
	                gTools.bindPanEvt = gTools.initPanEvt();
	                gTools.bindPanEvt("bind");
	                //showLinks();    // 初始化外链设置

	                // 没有设置路网文件?为什么要直接return?
	                if (!gTools.dataStoreAddress) {
	                    //gTools.alert('请先设置获取店铺信息的地址');
	                    log.i('请先设置获取店铺信息的地址');
	                    //return;
	                }
	            }

	            log.w('[createMap inner handle...].');

	            //todo hack 放大
	            //$('.zoom-in').trigger("click");$('.zoom-in').trigger("click");$('.zoom-in').trigger("click");
	            var h = mapH;
	            // todo attr 100% ?
	            // $("svg").attr({"height": mapH+"px",width:winW+"px"});
	            $("svg").attr('height', '100%').attr('width', '100%').attr('preserveAspectRatio', 'xMinYMin meet');
	            clearTimeout(locationCurrTimer);
	            locationCurr();
	            //L("createMap over");
	            beacondataList = new List();
	            var o = {};
	            //gTools.floorIndex = {};
	            gTools.BeaconIndex = {};
	            beaconObj.init = !0;
	            $.each(gTools.beaconList, function (i, v) {
	                if (!o["F" + v.floorId]) {
	                    o["F" + v.floorId] = [];
	                }
	                o["F" + v.floorId].push(v);
	                beaconObj['' + v.major + v.minor] = v;
	            });
	            var arr = [];
	            var tmpkey = 0;
	            $.each(o, function (i, v) {
	                gTools.BeaconIndex[i] = tmpkey++;
	                arr.push(v);
	            });

	            //$.each(gTools.floorList, function (i, v) {
	            //    gTools.floorIndex["F" + v.id] = i;
	            //})

	            //gTools.floorIndex = {F1:0,F2:1}
	            //对应 beacondataList {list:[{ F1的信息  },{  F2的信息 }]}
	            beacondataList.addAll({list: arr});
	            //gTools.createSideNav();
	            gTools.createBottomFloorNav();
	            gTools.floorEvt = new FloorClass();
	            if (type === "all") {
	                //setTimeout(getCarpos, 100);
	                //log.v('Will call getPoi...1');
	                getPoi();

	                callback && callback();
	            }

	            dealWithData();
	        });
	    }

	    // 缓存每一层的svg与屏幕坐标的转换系数
	    var setSTP = function () {
	        gTools.floorSP = gTools.floorSP || {};
	        if (gTools.floorSP[gTools.showingFloor]) {
	            //log.w('[setSTP] gTools.floorSP[' + gTools.showingFloor + '] not exist.');
	            return;
	        }
	        var $dom = $("#" + gTools.showingFloor),
	            matrix = $dom.panzoom("getMatrix") || [1, 0, 0, 1, 0, 0];
	        log.v('[setSTP] map matrix', matrix);
	        //gTools.ratio = +matrix[0];    // 需要重置ratio嘛?还是说只有太古里场景不需要重置ratio?
	        var svg = $dom.children("svg")[0],
	            stp = svgToPage(1, 1, svg).x - svgToPage(0, 0, svg).x,
	            pts = 1 / stp;

	        //gTools.floorSP = gTools.floorSP || {};  // 多余?
	        gTools.floorSP[gTools.showingFloor] = {
	            s2p: stp,
	            p2s: pts,
	            p2sw: pts * winW,
	            p2sh: pts * mapH
	        }
	    };


	    // 获取浏览器的朝向
	    function getBrowserOrientation() {
	        var orientation;
	        if (screen.orientation && screen.orientation.type) {
	            orientation = screen.orientation.type;
	        } else {
	            orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
	        }

	        return orientation;
	    }

	    // 方向判断
	    function onHeadingChange(event) {
	        var heading = event.alpha;
	        //L(event);
	        if (typeof event.webkitCompassHeading !== "undefined") {
	            heading = event.webkitCompassHeading; //iOS non-standard
	            /*L("iOS non-standard")*/
	        } else {
	            /* //L("iOS standard")*/
	        }
	        /*L("heading========"+heading);*/

	        var orientation = getBrowserOrientation();

	        if (typeof heading !== "undefined" && heading !== null) { // && typeof orientation !== "undefined") {
	            var adjustment = 0;
	            if (defaultOrientation === "landscape") {
	                adjustment -= 90;
	            }
	            if (typeof orientation !== "undefined") {
	                var currentOrientation = orientation.split("-");

	                if (defaultOrientation !== currentOrientation[0]) {
	                    if (defaultOrientation === "landscape") {
	                        adjustment -= 270;
	                    } else {
	                        adjustment -= 90;
	                    }
	                }

	                if (currentOrientation[1] === "secondary") {
	                    adjustment -= 180;
	                }
	            }
	            positionCurrent.hng = heading + adjustment;

	            var phase = positionCurrent.hng < 0 ? 360 + positionCurrent.hng : positionCurrent.hng;
	            if (positionCurrent.hng <= 15 || positionCurrent.hng > 345) {
	                lasthng = 0;
	            }
	            else if (positionCurrent.hng <= 45 && positionCurrent.hng > 15) {
	                lasthng = 30;
	            }
	            else if (positionCurrent.hng <= 75 && positionCurrent.hng > 45) {
	                lasthng = 60;
	            }
	            else if (positionCurrent.hng <= 105 && positionCurrent.hng > 75) {
	                lasthng = 90;
	            }
	            else if (positionCurrent.hng <= 135 && positionCurrent.hng > 105) {
	                lasthng = 120;
	            }
	            else if (positionCurrent.hng <= 165 && positionCurrent.hng > 135) {
	                lasthng = 150;
	            }
	            else if (positionCurrent.hng <= 195 && positionCurrent.hng > 165) {
	                lasthng = 180;
	            }
	            else if (positionCurrent.hng <= 225 && positionCurrent.hng > 195) {
	                lasthng = 210;
	            }
	            else if (positionCurrent.hng <= 255 && positionCurrent.hng > 225) {
	                lasthng = 240;
	            }
	            else if (positionCurrent.hng <= 285 && positionCurrent.hng > 255) {
	                lasthng = 270;
	            }
	            else if (positionCurrent.hng <= 315 && positionCurrent.hng > 285) {
	                lasthng = 300;
	            }
	            else {
	                lasthng = 330;
	            }

	        }
	        var initialAngle = 0;//$("svg").filter(":visible").find("#poi").attr("direction")?$("svg").filter(":visible").find("#poi").attr("direction"):0;
	        if (gTools.floorList && gTools.floorIndex) {
	            initialAngle = gTools.floorList[gTools.floorIndex[gTools.showingFloor]].direction;  // 楼层朝向
	            $.os.android && (initialAngle = -initialAngle);	// 安卓机 游标角度需要进行反转
	        }
	        var newRotateangle = lasthng + Number(initialAngle) + window.orientation;
	        rotateangle = rotateangle + 360 - Math.abs(rotateangle - newRotateangle)
	    }


	    // function retrivingData(){
	    //     beacondataList=new List();
	    //     //linkdataList=new List();
	    //     //plotLink(1,floors.length+1);
	    //     //LinkFlash();
	    //     PlotBeacon(1,floors.length+1);
	    // }

	    // 红星美凯龙的处理方法?
	    //function plotLink(j, length) {
	    //    //todo 没用到 可删？
	    //    alert("这是一条测试信息,请无视它");
	    //    if (j == length) {
	    //        DealWithLink(); // 红星美凯龙的特殊处理?
	    //        return;
	    //    }
	    //
	    //    $.getJSON("linkjson.do?mapname=anjipark" + "&floorid=F" + j, function (data) {
	    //        //alert(data);
	    //        var jsonobjs = eval(data);
	    //        var newbeacons = jsonobjs.varList;
	    //        linkdataList.add(newbeacons);
	    //        plotLink(++j, length);
	    //    });
	    //}

	    // 页面广告等
	    var showLinks = function () {
	        if (gTools.linkList && !$.isEmptyObject(gTools.linkList) && gTools.floorIndex) {
	            //log.w('[showLinks] Init succeed: because gTools.linkList is', gTools.linkList, ' and gTools.floorIndex is', gTools.floorIndex);
	            var floor, map, Links, tpl;

	            $.each(gTools.linkList, function (i0, v0) {
	                floor = file.select('#' + i0);
	                if (!floor) {
	                    return true;
	                }

	                map = floor.select('#jz');
	                Links = map.select('#Coupons');
	                if (!Links) {   // 如果页面上不存在#Coupons元素,则新建一个该元素
	                    Links = map.paper.g().attr('id', 'Coupons');
	                    map.select('#transArea').append(Links);
	                }
	                tpl = '';
	                $.each(v0, function (i1, v1) {
	                    // if(v1.type == 6){
	                    //     propellList[i0] ? propellList[i0].push(v1) : propellList[i0] = [v1];
	                    //     //推送类型的广告
	                    //     return true;
	                    // }
	                    // 隐藏广告(5) 或 图片推送(6)
	                    if (v1.type == 5 || v1.type == 6) {
	                        hiddenLinks[i0] ? hiddenLinks[i0].push(v1) : hiddenLinks[i0] = [v1];
	                        return true;
	                    }

	                    // if (gTools.buildingId == 33 && Links != null) {//TODO 太古里 硬编码
	                    //     var newCircle2 = Links.image(gTools.origin + "/img/gucci" + (i1 % 3) + ".png", v1.x + 20, v1.y - 10, 150, 50);	// 折扣图标
	                    //     newCircle2.attr({
	                    //         id: "link_gucci" + v1.id,
	                    //         class: "link_gucci",
	                    //         fill: "#f00",
	                    //         stroke: "#000",
	                    //         strokeWidth: 2,
	                    //         "fill-opacity": 0.5,
	                    //         "url": v1.url,
	                    //         "position": "relative"
	                    //     });
	                    // }

	                    var img = gTools.origin + "/img/bo" + (i1 % 3) + ".png";	// 气球图标
	                    // 详细说明(3)
	                    if (v1.type == 3 && Links != null) {
	                        var o = {
	                            x: v1.x,
	                            y: v1.y,
	                            text: v1.brand,
	                            pointerEvents: "none",
	                            style: "text-shadow:1px 1px 4px #000"
	                        };
	                        Links.el("text", o);
	                        return true;
	                    }
	                    // 3D图景(4)
	                    if (v1.type == 4) {
	                        img = "img/camera.png"
	                    }
	                    // 外链卡券(2)
	                    if (v1.type == 2) {
	                        img = 'img/bailianlogo.png'
	                    }
	                    // 后台配置了自定义的外链图片
	                    if (v1.icon && v1.icon != '') {
	                        img = v1.icon;
	                    }
	                    img = gTools.setImgLink(img);
	                    if (Links != null) {
	                        var newCircle = Links.image(img, v1.x, v1.y, v1.width, v1.height);
	                        newCircle.attr({
	                            id: "link" + v1.id,
	                            class: "link",
	                            fill: "#f00",
	                            stroke: "#000",
	                            strokeWidth: 2,
	                            "fill-opacity": 0.5,
	                            "url": v1.url,
	                            "position": "relative",
	                            target: "#link_gucci" + v1.id
	                        });
	                    }
	                });
	            });

	            // 为所有(楼层)的外链添加点击事件
	            $("svg").find("#Coupons").find(".link").tap(function () {
	                log.v('[showLinks] You clicked links');

	                var $this = $(this),
	                    id = $this.attr("target"),
	                    iid = id.split("cci")[1],
	                    url = $this.attr("url");

	                _hmt.push(['_trackEvent', "/idp/naviCat/adsClick", 'adsClick:' + gTools.buildingName, "adsClick:" + gTools.buildingName + "|" + id]);

	                //// TODO 太古里特殊处理气球展开。说明：原来太古里不需要进行跳转，只呈现或隐藏气球
	                //if (gTools.buildingId == 33) {
	                //    var o = $(id);
	                //    report.saveLink(iid, gTools.showingFloor).always(function () {
	                //        if (o.attr("show") != 'true') {
	                //            o.attr("show", true);
	                //        } else {
	                //            o.attr("show", false);
	                //        }
	                //    });
	                //    return;
	                //}

	                // 跳转到外链,点击的外链为当前查看的楼层
	                report.saveLink(iid, gTools.showingFloor).always(function () {
	                    location.href = url;
	                });
	            });
	            // LinkFlash();
	        } else {
	            log.w('[showLinks] Init failed: because gTools.linkList is', gTools.linkList, ' and gTools.floorIndex is', gTools.floorIndex);
	            //setTimeout(showLinks, 300);	// 不需要再设置定时器了，第一次没成功，后面就更不会成功了
	        }
	    };


	    /**
	     * 显示新手引导
	     * @author weibin
	     */
	    function showGuideTips() {
	        if (gTools.IS_TAIKOOLI_SCENE) {    // 太古里场景
	            if (!localStorage.hasOwnProperty("isPark") || !localStorage.hasOwnProperty("isOthers")) {
	                if ((gTools.showingFloor == "F138" || gTools.showingFloor == "F70") && !localStorage.hasOwnProperty("isPark")) {            // 太古里停车场场景
	                    localStorage.isPark = 1;
	                    gTools.tips();
	                    $("#step_1").css("display", "block");
	                    $("#step").css("display", "block");
	                    $("#step").css("margin-top", "6em");
	                    $(".circles").addClass("circle_0");

	                    setGuideStepHandler();
	                } else if ((gTools.showingFloor != "F138" && gTools.showingFloor != "F70") && !localStorage.hasOwnProperty("isOthers")) {   // 普通商场场景
	                    localStorage.isOthers = 1;
	                    gTools.tips();
	                    $("#step0").css("display", "block");
	                    $("#step").css("display", "block");

	                    setGuideStepHandler();
	                }
	            }

	            return;
	        }

	        // 其他场景暂时都按普通商场场景来显示新手引导
	        // 已经显示过新手引导了,不再重复显示
	        if (localStorage.hasOwnProperty("isOthers")) {
	            return;
	        }
	        // 显示商场场景的新手引导
	        localStorage.isOthers = 1;
	        gTools.tips();
	        $("#step0").css("display", "block");
	        $("#step").css("display", "block");

	        setGuideStepHandler();
	    }

	    // 动态添加二维码
	    var attention = function () {
	        var img = new Image(),
	            url = gTools.buildingInfo.qrCodeAddress || "//oex38ct5y.qnssl.com/img/qrcode_for_attention.jpg";   // 默认关注"微肯导航"公众号

	        img.src = url;
	        img.onload = function () {
	            gTools.alert('<img src="' + url + '" style="width:100%;" >', "长按二维码 关注公众号");
	        }
	    };

	    // 就是在页面上放点公共设施的钉子
	    var setPublicFacilitiesPin = function (type) {
	        var typeObj = {
	            Elevator: {
	                name: "电梯",
	                class: "poi7"
	            },
	            Stair: {
	                name: "楼梯",
	                class: ""
	            },
	            Exit: {
	                name: "出口",
	                class: "poi8"
	            },
	            Bathroom: {
	                name: "卫生间",
	                class: "poi6"
	            },
	            Zig: {
	                name: "扶梯",
	                class: "poi9"
	            },
	            ManWC: {
	                name: "男厕",
	                class: ""
	            },
	            WomanWC: {name: "女厕", class: ""},
	            Subway: {name: "地铁", class: "poi19"},
	            Pay: {name: "缴费机", class: 'poi12'},
	            Server: {name: "服务台", class: "poi18"},
	            Sunvalley: {name: "阳光谷", class: ""},
	            Fishtank: {name: "海景鱼缸", class: ""},
	            Childroom: {name: "母婴室", class: "poi16"},
	            ATM: {name: "ATM", class: "poi15"},
	            Membercenter: {name: "会员中心", class: "poi17"}
	        };

	        report.saveInfrastruc(typeObj[type].name, gTools.showingFloor.split("F").join(""));
	        removePin();
	        gTools.createClearPinBtn();
	        var arr = [];
	        var ifChangeFloor = false;
	        var nearPoint = {
	            x: 0, y: 0, distance: 9999
	        };
	        var _f = gTools.floorid;
	        if (!gTools.blueTeachIsOpen || (gTools.blueTeachIsOpen && X == 0 && Y == 0)) {
	            _f = gTools.showingFloor;
	        }
	        $.each(gTools.floorList, function (i, v) {
	            var ps = $("#F" + v.id).find("[type='" + type + "']"), isCurrentFloor = false;
	            if ("F" + v.id === _f) {//如果当前层木有找到这种类型的设施，需要切换楼层显示
	                isCurrentFloor = true;
	                if (!ps.length) {
	                    ifChangeFloor = true;
	                }
	            }
	            ps.each(function (ii, vv) {
	                var p = $(this), _x = Number(p.attr("x1")), _y = Number(p.attr("y1"))
	                if (isCurrentFloor) {
	                    var tmp = math.pointsDistance(_x, _y, X, Y);
	                    if (nearPoint.distance > tmp) {//是当前层并且缓存的距离大于
	                        nearPoint = {
	                            x: _x, y: _y, distance: tmp, floorId: "F" + v.id
	                        }
	                    }
	                }
	                arr.push({
	                    maparea: p.attr("id"),
	                    floor: "F" + v.id,
	                    x: _x,
	                    y: _y,
                        floor: "public " + type,
	                    data: {
	                        x: _x,
	                        y: _y,
	                        icon: "",
	                        "floor-id": v.id,
	                        brand: typeObj[type].name,
	                        class: typeObj[type].class,
	                        detail: "",
	                        "discount-info": "",
	                        "map-area": p.attr("id")
	                    }
	                })
	            })
	        });
	        if (!arr.length) {
	            gTools.alert("未能找到" + typeObj[type].name);
	            return;
	        }
	        //将地图显示区域转换到poi信息处 取消自动跟随 —— 似乎不太好弄。先简单的来，把地图缩放到最小，显示全景好了。
	        if (nearPoint.distance !== 9999) {
	            locationCurr(nearPoint.x, nearPoint.y, nearPoint.floorId);
	        } else {
	            locationCurr(arr[0].x, arr[0].y, arr[0].floor);
	        }
	        if (ifChangeFloor) {
	        }
	        //setTimeout(function () {
	            setPin(arr);
	        //}, 100);
	        //setTimeout(function () {
	            gTools.setPinScale();
	        //}, 150);
	        // 为公共设施设置点击事件
	        setTimeout(function () {
	            $("g.public").tap(function () {
	                var $this = $(this), data = $this.data();

	                showPoiDetail([data]);
	            });
	        }, 1000);
	    };

	    // 移除导航路径
	    function removeNavPath() {
	        //若是有导航路径，移除路径同时干掉预设的导航数据和导航提示信息
	        if ($('path[class^=directionPath]').length) {
	            clearInterval(gTools.timer);            // 移除实时导航定时器
	            $('[class^=directionPath]').remove();   // 移除路径
	            $('.startPin').remove();                // 移除起点
	            $('.destinationPin').remove();          // 移除终点

	            reportCancelNavigate();                 // 上报取消导航

	            // 轻导航的时候不需要删除起止点
	            if (!gTools.IS_CONTAIN_LIGHT_NAV) {
	                delete gTools.destination;
	                delete gTools.navTips;
	            }

	            gTools.isRouting = false;

	            log.w('[removePin] 取消实时导航');
	        }
	    }

	    // 移除钉子
	    var removePin = function () {
	        $(".pin").remove();         // 移除所有地图上的所有钉子
	        $("#clearPin").remove();    // 移除"清除"按钮
	        gTools.hideHalfModal();     // 隐藏半弹框

	        removeNavPath();
	    };


	    // 群体放钉子
	    var actSetPin = function ($this) {
	        removePin();
	        setPin({
	            maparea: $this.data("maparea"),
	            floor: $this.data("floor")
	        });
	        location.href = "#";
	        gTools.createClearPinBtn();
	    };

	    // 二级页面上的select
	    var dropDownSelectAct = function (_this) {
	        var $this = $(_this),
	            data = $this.data(),
	            val = data.value,
	            name = data.name,
	            type = data.type,// type对应的是category id.
	            btn = $("#fullModal").find('.am-dropdown');

	        btn.removeClass("am-active").find("button").html($this.text() + '<span class="am-icon-caret-down"></span>');
	        //gTools.poiTypeListModal2(type, "F" + val);    // old
	        gTools.poiTypeListModal3(type, "F" + val);      // new
	    };

	    // 获取停车信息
	    var getParkedInfo = function () {
	        gTools.getParkedInfo().done(function (resp) {
	            typeof resp === 'string' && (resp = JSON.parse(resp));

	            localStorage.getParkedInfo = JSON.stringify(resp);

	            //if (res.parkPoint) {
	            //    localStorage.getParkedInfo = JSON.stringify(res);
	            //} else {
	            //    //gTools.actionTimer?clearTimeout(gTools.actionTimer):"";
	            //}
	        });
	    };

	    // 停车记录
	    var parkRecord = function () {
	        Parking();
	        gTools.parkRecord(Parkpoint).done(getParkedInfo);
	        gTools.alert("亲，您的车位已记录，在" + Parkpoint + "附近");
	        // 去掉了？
	        // report.savePark(gTools.floorid,Parkpoint,0);
	    };

	    // 设置钉子
	    var setPin = function (pin) { //{maparea:"",floor:"",x:x,y:y,type:type}
	        if ($.isArray(pin)) {
	            $.each(pin, function (i, v) {   // 批量添加钉子操作
	                setPin(v);
	            });
	        } else {
	            // 呵呵哒,性能神马的放后面在想……这里懒得优化了。
	            var x, y;
	            if (pin.x) {
	                x = pin.x;
	                y = pin.y;
	            } else {
	                var svg = $("#" + pin.floor).find("svg"),
	                    p = svg.find("#Doors").find("#" + (pin.mapArea || pin.maparea));    // 字段替换兼容: pin.maparea => pin.mapArea

	                x = p.attr("x1");
	                y = p.attr("y1");
	            }
	            pin.type = pin.type || "";
	            pin.data = pin.data || {};

	            //log.v('[setPin] pin', pin);
	            map.wayfinding("setPin", {
	                x: x,
	                y: y,
	                floor: "#" + pin.floor,
	                type: pin.type,
	                data: pin.data
	            });
	        }
	    };

	    // 程序入口2
	    $(document).ready(function () {
	        'use strict';

	        // 点击地图上的房间(查看地图上的店铺)
	        file = Snap.select('#myMaps');
	        $('#myMaps').on('wayfinding:roomClicked', function (e, r) {
	            var _this = this,   // this 指向#myMaps DOM元素
	                poi, mapArea = r.roomId, category = r.category, floor;

	            // 获取点击room所属的floor,当从列表点击的时候往往与当前显示楼层不一致,所以不能直接取gTools.floorid或gTools.showingFloor的值
	            floor = map.children().has("#" + mapArea).attr("id");

	            if (!(gTools.poiList && gTools.poiList[floor])) {
	                getPoi(floor, true, function () {
	                    // 重新触发当前room的click事件
	                    $(_this).trigger('wayfinding:roomClicked', [{roomId: mapArea, category: category}]);
	                });
	            }

	            if (gTools.poiList && gTools.poiList[floor] && gTools.poiList[floor][mapArea]) {
	                poi = gTools.poiList[floor][mapArea];
	            }

	            if (!poi) {   // 未从poi列表中找到对应的poi,则直接退出
	                return;
	            }

	            setPinWithClean(mapArea);   // 移除旧的钉子并设置新的钉子
	            showPoiDetail([poi], category);       // 显示poi详情弹框
	            gTools.hideLoading();

	            //点击room  关闭跟随  将中心移动到room位置
	            gTools.follow = false;
	            clearTimeout(locationCurrTimer);    // 关闭实时定位

	            //安卓上面很奇怪，(立即)调用该函数会导致错位
	            setTimeout(function () {
	                locationCurr(poi.x, poi.y, floor);
	            }, 100);

	            // 后台上报
	            report.savePoi(poi.id, floor);
	            _hmt.push(['_trackEvent', "/idp/naviCat/shopClick", 'shopClick' + gTools.buildingName, 'shopClick' + gTools.buildingName + "|" + mapArea + "--" + gTools.poiList[floor][mapArea].brand]);
	        }).on('wayfinding:floorChanged', function (e, obj) {
	            log.v('[wayfinding:floorChanged]');
	            gTools.showingFloor = obj.mapId;    // 更新切换后的楼层
	            //showGuideTips();// 当有多个楼层的时候，发生楼层切换需要判断是否场景也发生了切换
	            //gTools.IS_TAIKOOLI_SCENE && $("#text").add("#body").add('#ttm').removeClass().addClass(obj.mapId);	// 太古里根据class名称决定是否显示推荐店铺菜单
	            gTools.IS_TAIKOOLI_SCENE && $("#text").add("#body").removeClass().addClass(obj.mapId);	// 太古里根据class名称决定是否显示推荐店铺菜单
	            setSTP();
	            gTools.initSetPoiText("zoom")();
	            gTools.setPinScale();
	            setTimeout(getPoi, 100);
	            //setLeftTopRecommendStores();  // 合并到一个接口(获取所有推荐店铺列表)中去了
	            handleFloorChanged();           // 楼层切换完成后的处理
	            L('[wayfinding:floorChanged] 楼层切换  gTools.showingFloor=' + gTools.showingFloor + "   gTools.floorid= " + gTools.floorid);
	            if (gTools.showingFloor == gTools.floorid) {    // 若不等，表示手动切换楼层
	                console.info('[wayfinding:floorChanged] showingFloor == pointFloor == ' + gTools.showingFloor + ' do something');
	                var svg_obj = $("#myMaps >div").filter(":visible")[0];
	                if (gTools.notLocationCurrAgain) {
	                    //刚画完路径 不需要重新定位
	                    gTools.notLocationCurrAgain = false;
	                    log.w('[wayfinding:floorChanged] 刚画完路径, 不需要重新定位');
	                } else {
	                    log.w('[wayfinding:floorChanged] 自定切换后, 需要重新定位');
	                    //真正的自动切换  需要定位
	                    if (X != 0 && gTools.follow) {
	                        gTools.showLoading("正在定位...");
	                    }
	                    if (!gTools.isRouting) {//如果不是在导航中，那么就不用重置位置
	                        X = 0, Y = 0;
	                    }

	                    clearTimeout(locationCurrTimer);
	                    locationCurr();

	                    // 只是为了隐藏loading弹框?
	                    //var tmpTimer = setInterval(function () {
	                    //    if (X != 0 && Y != 0) {
	                    //        clearInterval(tmpTimer);
	                    //        gTools.hideLoading();
	                    //    }
	                    //}, 1000);

	                    L("楼层切换中...");
	                    var temp = gTools.navTips;
	                    if (temp && temp.length) {
	                        temp = temp[0];
	                        gTools.tmpNavTip = temp;
	                        if (gTools.floorid != temp.to) {
	                            //gTools.halfModal('<div><p class="isNavigating smallsize">您当前在 <span style="font-size:1.1em;">'+gTools.floorList[gTools.floorIndex[gTools.floorid]].name+'</span> 层,您的目的地是 <span style="font-size:1.1em;">'+gTools.floorList[gTools.floorIndex[temp.to]].name+'</span> 层</p><p class="isNavigating largesize">正在引导您去附近的直梯</p></div>',{noEmpty:1});
	                            gTools.halfModal('<div><p class="isNavigating smallsize">您的目的地是 <span style="font-size:1.1em;">' + gTools.floorList[gTools.floorIndex[temp.to]].name + '</span> 层</p><p class="isNavigating largesize">请沿着路线方向行走</p></div>', {noEmpty: 1});
	                        } else if (gTools.floorid == temp.to) {
	                            gTools.halfModal('<div><p class="isNavigating largesize overwrite">请沿着路线方向行走</p></div>', {noEmpty: 1})
	                        }
	                    }
	                }
	            } else {
	                console.info('[wayfinding:floorChanged] showingFloor != pointFloor do nothing.');
	            }
	        }).on("wayfinding:routeTo", function () {
	            L("routeTo");
	            gTools.textBox.empty();
	            gTools.isRouting = true;
	            $("#myMaps >div").find("svg#jz").panzoom("setMatrix", [1, 0, 0, 1, X, Y]);
	            //setTimeout(gTools.hideLoading, 500);    // 隐藏loading弹框
	        }).on("wayfinding:routeToOver", function () {
	            gTools.createClearPinBtn();
	            L("routeToOver");
	            gTools.isRouting = false;
	            gTools.notLocationCurrAgain = true;//刚画完路径  不需要重新定位当前位置 标志位
	            $("#myMaps >div").find("svg#jz").panzoom("setMatrix", [gTools.ratio, 0, 0, gTools.ratio, Matrix_x, Matrix_y]);
	            // 利用定位自己切换回去，不再用这里的楼层切换
	            // $('#myMaps').wayfinding('currentMap', gTools.floorid);

	            //gTools.floorEvt.btn.text( gTools.floorList[gTools.floorIndex[gTools.floorid]  ].name  )
	            gTools.floorEvt.listScroll.find('[data-floor="' + gTools.floorid.slice(1) + '"]').trigger("click"); // 规划完路径后切回起点楼层


	            // 画好路线后判断是否跨楼层导航
	            var tempt = gTools.navTips;
	            if (tempt.length) {
	                tempt = tempt[0];
	                gTools.tmpNavTip = tempt;
	                if (gTools.floorid != tempt.to) {
	                    gTools.halfModal('<div><p class="isNavigating smallsize">您的目的地是 <span style="font-size:1.1em;">' + gTools.floorList[gTools.floorIndex[tempt.to]].name + '</span> 层</p><p class="isNavigating largesize">请沿着路线方向行走</p></div>', {noEmpty: 1});
	                } else {
	                    gTools.halfModal('<div><p class="isNavigating largesize overwrite">请沿着路线方向行走</p></div>', {noEmpty: 1})
	                }
	            } else {
	                gTools.halfModal('<div><p class="isNavigating largesize overwrite">请沿着路线方向行走</p></div>', {noEmpty: 1})
	            }

	            gTools.IS_TAIKOOLI_SCENE && gTools.transPoiText();	// 仅太古里场景需要平移一下？
	            locationCurr();
	            setTimeout(gTools.hideLoading, 500);    // 延时隐藏loading弹框,可以使弹框显示一会
	            //gTools.createSideNav();
	        });

	        gTools.ratio = 2;

	        // 设置设备方向变化监听器
	        if (window.DeviceOrientationEvent) {
	            window.addEventListener("deviceorientation", onHeadingChange);
	        } else {
	            //L("deviceorientation 监听l.;失败")
	        }

	        setInterval(function () {
	            //log.w('[setInterval] 2.5s: 楼层切换,不在现场校验等');
	            // 每隔一段时间检测一次是否楼层切换
	            !gTools.checkFloor && (gTools.checkFloor = 1);

	            // 不在现场 基本上是弃用了
	            if (gTools.notAtTheSceneTime && new Date() - gTools.notAtTheSceneTime > 300000 && gTools.blueTeachIsOpen && !gTools.alreadyShowNotAtScene) {
	                gTools.hideLoading();
	                //gTools.notAtTheScene();                 // 显示"不在现场"提示
	                gTools.alreadyShowNotAtScene = true;    // 避免重复显示"不在现场"提示
	            }

	            // 有定位的情况下才进行的一些处理逻辑
	            if (gTools.floorid && X != 0 && Y != 0) {
	                judgeIfNearChest(hiddenLinks[gTools.floorid]);
	                judgeIsNearSignPoint(globalSignFloors && globalSignFloors[gTools.floorid]);
	                showNavTips();

	                // 显示分享按钮,且不重复显示
	                //if (!gTools.showShare) {
	                //    gTools.showShare = true;
	                //    $('[data-naction="share"]').show();
	                //    wx.showMenuItems({
	                //        menuList: [
	                //            "menuItem:share:appMessage",
	                //            "menuItem:share:timeline"
	                //        ]
	                //    });
	                //}
	            }
	        }, 2500);

	        gTools.follow = gTools.follow || true;  // 默认开启页面跟随
	        setInterval(function () {
	            // 是否开启页面跟随
	            gTools.$followBtn = gTools.$followBtn || $("a.search"); // 设置"跟随定位"按钮
	            if (gTools.follow) {
	                !gTools.$followBtn.hasClass('active') && gTools.$followBtn.addClass("active");
	                clearTimeout(locationCurrTimer);
	                locationCurr();
	            } else {
	                gTools.$followBtn.hasClass('active') && gTools.$followBtn.removeClass("active");
	            }

	            // 每隔一段时间需重新配置分享的当前位置信息
	            initShareEvt();
	        }, 5000);
	        delete localStorage.getParkedInfo;

	        //  弃用 - 这段代码是做什么用的啊?还没研究
	        $(".ctrl-btn2").tap(function (e) {
	            var $this = $(this);
	            if (e.target.id) {
	                if (e.target.id == "sideMarket") {
	                    location.hash = 'links';
	                    _hmt.push(['_trackEvent', "/idp/naviCat/ticketList", 'ticketList:' + gTools.buildingName]);
	                    return;
	                }

	                if ($(e.target).hasClass("hover")) {
	                    $(e.target).removeClass("hover");
	                } else {
	                    $(this).find("div").removeClass("hover");
	                    $(e.target).addClass("hover");
	                }
	            } else {
	                $(e.target).trigger("click");
	                setTimeout(function () {
	                    $this.find("div").removeClass("hover");
	                }, 100);
	                return false;
	            }
	            e.stopPropagation();
	            e.preventDefault();
	            return false;
	        });
	    });

	    /**
	     * 规划路径: 原来Navigate()方法重命名为planPath()方法
	     * @param {string}  start   导航起点的mapArea,如L1-32
	     * @param {string}  end     导航终点的mapArea,如L2-22
	     * @returns {boolean}       起点和终点相同时返回false;否则,返回true
	     */
	    function planPath(start, end) {
	        if (start === end) {
	            gTools.hideLoading();
	            gTools.alert("您的目的地就在您旁边");
	            //gTools.finishPark();  // 不应该在此处上报完成停车和找车
	            // 此处返回false用于上游判断,表示不进行导航
	            return false;
	        }

	        // $('#myMaps').wayfinding('startpoint', start);
	        // $('#myMaps').wayfinding('currentMap', gTools.floorid);
	        // $('#myMaps').wayfinding('routeTo', end);
	        // return true;

	        // $('#myMaps').wayfinding('startpoint', start);
	        // $('#myMaps').wayfinding('newRouteTo', {start:start,end:end,floorid:gTools.floorid});
	        //return true;

	        // 定位到当前位置
	        locationCurr();
	        // 规划路径
	        $("#myMaps").wayfinding("startAndEnd", start, end);
	        return true;
	    }

	    // 根据类型导航到指定的公众设施
	    var navigateByType = function (type) {
	        if (!gTools.blueTeachIsOpen) {
	            startSearchBeacons().done(function () {
	                navigateByType(type);
	            })
	            return false;
	        }
	        var typeObj = {
	            Elevator: "电梯",
	            Stair: "楼梯",
	            Exit: "出口",
	            Bathroom: "卫生间",
	            Zig: "扶梯",
	            ManWC: "男厕",
	            WomanWC: "女厕",
	            Subway: "地铁口"
	        }
	        Lookpoint = getNear(X, Y);
	        var end = getNearest(X, Y, type)
	        if (typeof end == "boolean") {
	            if (!end) {
	                gTools.hideLoading();
	                gTools.alert("未找到" + typeObj[type])
	            } else {

	            }
	            return false;
	        }
	        //console.log(end)
	        if (Lookpoint == end) {
	            gTools.alert(typeObj[type] + "就在您旁边");
	            return true;
	        }
	        //console.log(Lookpoint);
	        //$('#myMaps').wayfinding('startpoint', Lookpoint);
	        //$('#myMaps').wayfinding('currentMap', gTools.floorid);
	        //$('#myMaps').wayfinding('routeTo', end);
	        //return
	        //　TODO pc
	        locationCurr();
	        $("#myMaps").wayfinding("startAndEnd", start, end);

	        // $('#myMaps').wayfinding('startpoint', Lookpoint);
	        // $('#myMaps').wayfinding('newRouteTo',{start:Lookpoint,end:end,floorid:gTools.floorid});
	        return true;
	        // $('#myMaps').wayfinding('startpoint', Lookpoint);
	        // $('#myMaps').wayfinding('currentMap', gTools.floorid);
	        // $('#myMaps').wayfinding('routeTo', end);
	        // return true;
	    };

	    // 太古里导航改版,提升为全局变量
	    //var newNavigateTimer;
	    //var newNavigateOpt = {text: "", title: ""};

	    // 新的导航方法： 根据起点和终点进行导航. 跨楼层导航注意事项: 跨楼层的portal连接到主路,在主路的连接点处必须断开,才能保证规划出跨楼层路径
	    var newNavigate = function () {
	        if (!gTools.destination) {
	            return;
	        }

	        if (X == 0 && Y == 0 && gTools.blueTeachIsOpen) {
	            clearTimeout(newNavigateTimer);
	            newNavigateTimer = setTimeout(newNavigate, 1000);
	            return;
	        }

	        if (!gTools.blueTeachIsOpen) {
	            startSearchBeacons().done(newNavigate);
	            return;
	        }

	        removePin();

	        Looking(gTools.destination.pointId, newNavigateOpt.text, newNavigateOpt.title);

	        // isNavigatingFloor的用途是干嘛的?
	        gTools.destination.isNavigatingFloor = gTools.floorid;
	    };

	    /**
	     * 判断指定X/Y是否靠近某点
	     * @param {number} x  指定X
	     * @param {number} y  指定Y
	     * @param {string|object} point  某点的信息，点Roomid或者点{x:1,y:1}
	     * @param {number} [dd]  指定距离。判定小于指定距离时则返回true。默认指定距离12
	     * @returns {boolean}
	     */
	    var ifNearPoint = function (x, y, point, dd) {
	        var pointEle, tx, ty;
	        dd = dd || 12;

	        // buildingId为49时,导航的距离,附近是否有外链的距离判断都是32?还是只是其中一个?
	        if (gTools.buildingId == 49) {
	            dd = 32;
	        }

	        //log.w('[ifNearPoint] nearby range is', dd);

	        if (typeof point == 'string') {
	            pointEle = $("#" + gTools.floorid).find("#Doors").find("#" + point);
	            if (!pointEle.length) {
	                return false;
	            }
	            tx = pointEle.attr("x1");
	            ty = pointEle.attr("y1");
	        } else {
	            tx = point.x, ty = point.y;
	        }
	        var distance = Math.sqrt(Math.pow((x - tx), 2) + Math.pow((y - ty), 2));
	        //log.w('[ifNearPoint] calculate distance', distance);
	        return distance < dd;
	    };

	    /**
	     * 是否需要在行走时判断周围是否有东东要提醒
	     * @param arr
	     */
	    var judgeIfNearChest = function (arr) {
	        if (!gTools.ifJudgeIfNearChest || !gTools.initOver || !arr) {
	            //log.v('[judgeIfNearChest] Not exec, because of ifJudgeIfNearChest=', gTools.ifJudgeIfNearChest, ', initOver=', gTools.initOver, ' exist arr', !!arr);
	            return;
	        }

	        $.each(arr, function (i, v) {
	            // 从商户平台配置的优惠券
	            if (v.idpObj) {
	                if ($.inArray(v.idpObj.mapArea, gTools.ignoreList) > -1) {
	                    L("隐藏优惠券 忽略" + v.link_title);
	                    return true;
	                }
	                if (ifNearPoint(X, Y, {x: v.x, y: v.y})) {
	                    log.v("恭喜您发现辣" + v.link_title);
	                    showHiddenLinks2(v);
	                    return false;
	                }
	            }

	            if ($.inArray(v.id, gTools.ignoreList) > -1) {
	                L("隐藏广告 忽略" + v.brand);
	                return true;
	            }
	            if (ifNearPoint(X, Y, {x: v.x, y: v.y})) {
	                log.v("恭喜您发现辣" + v.brand);
	                if (v.type == 6) {
	                    showpropellingLinks(v);
	                } else {
	                    showHiddenLinks(v);
	                }
	                return false;
	            } else {
	                log.v("早啊早啊澡盆呦");
	            }
	        });
	    };

	    var showNavTips = function () {
	        if (!gTools.initOver || gTools.isRouting || !gTools.navTips || gTools.navTips.length === 0) {
	            //log.w('[showNavTips] not show tips, becaus initOver', gTools.initOver, ' isRouting', gTools.isRouting, ' navTips', gTools.navTips);
	            return;
	        }
		log.w('[showNavTips] show tips');

	        //判断是否接近终点
	        var tmp = [];
	        $.each(gTools.navTips, function (i, v) {
	            if (v.floor != gTools.floorid) {
	                return true;
	            }

	            if (!gTools.IS_TAIKOOLI_SCENE) {
	                log.v('[showNavTips] 非太古里场景,不判断是否靠近终点');
	                return;
	            }

	            log.i('[showNavTips] 太古里场景,判断是否靠近终点或显示路线提示');
	            if (ifNearPoint(X, Y, {x: v.x, y: v.y}, 30)) {
	                log.i('[showNavTips] 太古里场景,已靠近终点');
	                tmp = gTools.navTips.splice(i, 1);
	                return false;
	            }
	            if (gTools.navTips[0].floor == gTools.floorid) {
	                log.i('[showNavTips] 太古里场景,显示路线提示');
	                gTools.halfModal('<div><p class="isNavigating largesize overwrite">请沿着路线方向行走</p></div>', {noEmpty: 1});
	            }
	        });

	        if (!gTools.IS_TAIKOOLI_SCENE) {
	            log.v('[showNavTips] 非太古里场景,不显示导航提示');
	            return;
	        }
	        log.i('[showNavTips] 太古里场景,显示导航提示');
	        if (tmp.length) {
	            tmp = tmp[0];
	            gTools.tmpNavTip = tmp;
	            if (tmp.from === tmp.floor) {
	                gTools.halfModal('<div><p class="isNavigating smallsize">您已在电梯附近</p><p class="isNavigating largesize">请乘坐电梯到 <span style="font-size:1.1em">' + gTools.floorList[gTools.floorIndex[tmp.to]].name + '</span> 层</p></div>', {noEmpty: 1});
	            } else {
	                gTools.halfModal('<div><p class="smallsize">您当前在<span style="font-size:1.1em">' + gTools.floorList[gTools.floorIndex[tmp.to]].name + '</span> 层</p><p class="isNavigating largesize">请沿着路线方向行走</p></div>', {noEmpty: 1});
	            }
	        }
	    };

	    // 广告推送
	    var showpropellingLinks = function (obj) {
	        gTools.ifJudgeIfNearChest = false;
	        var url = obj.icon;
	        var img = new Image();
	        img.src = url;
	        img.onload = function () {
	            var tpl = '<div id="hideAds" class="hideAds"> <div class="am-text-center" style="position: absolute;"><div class="title">' + obj.brand + '</div>  <a href="javascript:;" id="closeHideAds" class="closeHideAds0"></a><img src="' + url + '" style="width: 90%; z-index:2000"></div></div>';
	            $("body").find("#hideAds").remove().end().append(tpl);
	            //设置图片区域的top,left
	            var diffWidth = ($("#hideAds").outerWidth() - $("#hideAds >div").outerWidth()) / 2;
	            var diffHeight = ($("#hideAds").outerHeight() - $("#hideAds >div").outerHeight()) / 2;
	            $("#hideAds >div").css("left", diffWidth + "px");
	            $("#hideAds >div").css("top", diffHeight + "px");
	            // 确认推送广告
	            $(document).on("click", "#hideAds img", function () {
	                log.i('[document click on "#hideAds img"]');
	                location.href = obj.url;
	            });
	            // 关闭推送广告
	            $("#closeHideAds").click(function () {
	                gTools.ifJudgeIfNearChest = true;
	                gTools.ignoreList = gTools.ignoreList || [];
	                gTools.ignoreList.push(obj.id);
	                $("body").find("#hideAds").remove()
	            });
	        }
	    };

	    // 隐藏广告
	    var showHiddenLinks = function (obj) {
	        gTools.ifJudgeIfNearChest = false;      // 设置行走过程中是否判断附近有东西为false,即行走过程中不判断
	        var url = "";
	        // if(obj.icon){
	        // 	url = obj.icon;
	        // }else{
	        url = "http://oex38ct5y.qnssl.com/img/asd1.png";    // 隐藏广告背景图(招财猫)
	        // }
	        var img = new Image();
	        img.src = url;
	        img.onload = function () {
	            var tpl =
	                '<div id="hideAds">' +
	                    '<div class="am-text-center" style="position: absolute;top: 50%;margin-top: -180px;">' +
	                        '<a href="javascript:;" id="closeHideAds" class="closeHideAds1"></a>' +
	                        '<img src="' + url + '" style="width: 90%; z-index:2000">' +
	                        '<div class="am-text-center" style="position: absolute; width: 100%; bottom: 15px;">' +
	                            '<span style="font-size: 26px; color: #EC4201; display: block; height: 2em; width: 56%; margin: 0 auto; overflow: hidden;">' + obj.brand + ' </span>' +
	                            //'<a href="javascript:;" data-maction="gotoHiddenLinks" data-url="' + obj.url + '" style="display: block;"><img src="//oex38ct5y.qnssl.com/img/ads2.png?1=1" style="width: 60px;"></a>' +
	                            '<a id="js_sure_hide_ad" href="javascript:;" data-url="' + obj.url + '" data-type="' + obj.type + '" style="display: block;"><img src="//oex38ct5y.qnssl.com/img/ads2.png?1=1" style="width: 60px;"></a>' +
	                            //'<a id="js_sure_hide_ad" href="javascript:;" data-url="' + obj.url + '" data-type="' + obj.type + '" style="display: block;"><span class="btn-sure">签到</span></a>' +
	                        '</div>' +
	                    '</div>' +
	                '</div>';

	            $("body").find("#hideAds").remove().end().append(tpl);
	            var hideAds = $("#hideAds");
	            hideAds.find("span").height((hideAds.find("img").height() / 2 - 15 - 28) / 1.6);
	            // 关闭隐藏广告弹框
	            hideAds.find("#closeHideAds").click(function () {
	                gTools.ifJudgeIfNearChest = true;
	                gTools.ignoreList = gTools.ignoreList || [];
	                gTools.ignoreList.push(obj.id);
	                $("body").find("#hideAds").remove();
	            });
	            // 确认隐藏广告
	            hideAds.find('#js_sure_hide_ad').click(function () {
	                var jumpLink = $(this).data('url');
	                location.href = jumpLink;
	            });
	        };

	        // layer.open({
	        //     title:["","margin-top:-50px;border:none"],
	        //     content: '<div style="width:300px;background-image: url(//oex38ct5y.qnssl.com/img/chest_bg.png);background-size: 111% 111%; background-position: center center;"><img src="//oex38ct5y.qnssl.com/img/chest.gif?_='+Math.random()+'" data-maction="gotoHiddenLinks" data-url="'+obj.url+'"  style="max-width:100%"></div>',
	        //     shadeClose: false,
	        //     cancel:function(){
	        //       gTools.ifJudgeIfNearChest = true;
	        //       gTools.ignoreList =  gTools.ignoreList||[];
	        //       gTools.ignoreList.push(obj.id);
	        //     }
	        // });
	        // layer.open({
	        //     title:["恭喜您发现辣"+ obj.brand],
	        //     content: '听说要做的喜庆一些？一张图？or？',
	        //     btn: ['去看看',"泥奏凯"],
	        //     yes: function(){
	        //         location.href = obj.url;
	        //     },
	        //     no:function(){
	        //       gTools.ifJudgeIfNearChest = true;
	        //       gTools.ignoreList =   gTools.ignoreList||[];
	        //       gTools.ignoreList.push(obj.id)
	        //     },
	        //     shadeClose: false
	        // });
	    };

	    /**
	     * 红包？红包样式的优惠券
	     * @param  {object} obj 商户平台的优惠券对象
	     */
	    var showHiddenLinks2 = function (obj) {
	        var tpl =
	            '<div class="am-center hidden_box">\
	                <img src="//oex38ct5y.qnssl.com/img%2Fhidden_links.png">\
	                <button class="receive" href="' + obj.get_url + '" data-maction="receive-links" data-type="hide"   data-point="' + obj.idpObj.mapArea + '">领取</button>\
	                <span class="market_name" >' + obj.merchant_name + '</span>\
	                <span class="links_title" >' + obj.link_title + '</span>\
	                <a class="close"  href="javascript:;"></a>\
	              </div>';

	        box = $("#hidden_links");
	        if (box.hasClass("am-hide")) {
	            gTools.ifJudgeIfNearChest = false;
	            box.removeClass("am-hide").empty().append(tpl);
	            box.find(".close").click(function () {
	                box.addClass("am-hide");
	                gTools.ifJudgeIfNearChest = true;
	                gTools.ignoreList = gTools.ignoreList || [];
	                gTools.ignoreList.push(obj.idpObj.mapArea);
	            });
	        }
	    };
	    window.showHiddenLinks2 = showHiddenLinks2;

	    // 这个方法应该没有用.
	    //var getDistance = function (x1, y1, x2, y2) {
	    //    x2 = x2 || X, y2 = y2 || Y;
	    //    return Math.sqrt()
	    //}

	    // 判断当前位置是否接近指定点
	    function getNear(x, y, floor) {
	        floor = floor ? floor : gTools.floorid;
	        // 从svg门上获取对应room的mapArea值
	        ff = $('#myMaps #' + floor + ' #jz #Doors').children();

	        // 未定位成功的情况下,取中间一个元素
	        if (x == 0 && y == 0) {
	            return ff.eq(Math.floor(ff.length / 2)).attr('id');
	        }

	        var distance = 10000;
	        var index = -1;
	        for (var i = 0; i < ff.length; i++) {
	            var tmp = ff.eq(i);
	            var X1 = tmp.attr("x1");
	            var Y1 = tmp.attr("y1");
	            var X2 = tmp.attr("x2");
	            var Y2 = tmp.attr("y2");
	            var distance1 = Math.sqrt(Math.pow((x - X1), 2) + Math.pow((y - Y1), 2));
	            var distance2 = Math.sqrt(Math.pow((x - X2), 2) + Math.pow((y - Y2), 2));
	            var kk;
	            if (distance1 >= distance2) {
	                kk = distance1;
	            }
	            else {
	                kk = distance2;
	            }
	            if (kk <= distance) {
	                index = i;
	                distance = kk;
	            }
	        }

	        return ff.eq(index).attr("id");
	    }

	    // 判断距离当前位置最近的公共设施
	    function getNearest(x, y, type) {
	        var ff = $('#myMaps #' + gTools.floorid + ' #jz #Doors').find('[type="' + type + '"]');
	        if (!ff.length) {
	            return false;
	        }
	        var distance = 10000;
	        var index = -1;
	        for (var i = 0; i < ff.length; i++) {
	            var tmp = ff.eq(i);
	            //console.log(tmp.attr("type"));
	            //type 包括 Elevator, Stair, Exit, Bathroom, Zig, ManWC, WomanWC
	            if (tmp.attr("type") == type) {
	                //console.log(i+",equal");
	                var X1 = tmp.attr("x1");
	                var Y1 = tmp.attr("y1");
	                var X2 = tmp.attr("x2");
	                var Y2 = tmp.attr("y2");
	                var distance1 = Math.sqrt(Math.pow((x - X1), 2) + Math.pow((y - Y1), 2));
	                var distance2 = Math.sqrt(Math.pow((x - X2), 2) + Math.pow((y - Y2), 2));
	                var kk;
	                if (distance1 >= distance2) {
	                    kk = distance1;
	                }
	                else {
	                    kk = distance2;
	                }
	                if (kk <= distance) {
	                    index = i;
	                    distance = kk;
	                }
	            }
	        }
	        return ff.eq(index).attr("id");
	    }

	    // 获取最近楼梯 弃用？
	    function getNearestElevator(x, y, type) {
	        type = type ? type : "Elevator"
	        ff = $('#myMaps #' + gTools.floorid + ' #jz #Doors').children();
	        var distance = 10000;
	        var index = -1;
	        for (var i = 0; i < ff.length; i++) {
	            var tmp = ff.eq(i);
	            if (tmp.attr("type") == type) {
	                var X1 = tmp.attr("x1");
	                var Y1 = tmp.attr("y1");
	                var X2 = tmp.attr("x2");
	                var Y2 = tmp.attr("y2");
	                var distance1 = Math.sqrt(Math.pow((x - X1), 2) + Math.pow((y - Y1), 2));
	                var distance2 = Math.sqrt(Math.pow((x - X2), 2) + Math.pow((y - Y2), 2));
	                var kk;
	                if (distance1 >= distance2) {
	                    kk = distance1;
	                }
	                else {
	                    kk = distance2;
	                }
	                if (kk <= distance) {
	                    index = i;
	                    distance = kk;
	                }
	            }
	        }
	        if (index == -1) {
	            return "";
	        }
	        return ff.eq(index).attr("id");
	    }

	    // 设置停车图钉
	    function Parking() {
	        Parkpoint = getNear(X, Y);
	        //Parkpoint = 'F1-043';
	        $('#myMaps').wayfinding('setParkPin', Parkpoint);
	        gTools.IS_TAIKOOLI_SCENE && gTools.setPinScale();	// 调整pin的大小
	        //$('#myMaps').wayfinding('routeTo', "null");
	    }

	    // 实时导航监测，是否已抵达目的地附近
	    function Looking(_Parkpoint, text, title) {
	        text = text || "";
	        title = title || "";
	        _Parkpoint = _Parkpoint || Parkpoint;
	        Lookpoint = getNear(X, Y);

	        // 上报开始导航
	        reportStartNavigate(setNavStartPoint(gTools.floorid, Lookpoint), gTools.destination);

	        if (!planPath(Lookpoint, _Parkpoint)) {
	            return;
	        }

	        var dist = gTools.buildingId == 50 ? 23 : gTools.IS_FEILE_SCENE ? (globalNavRange || 4) : 18;   // 加入广州飞乐展区场景判断
	        clearInterval(gTools.timer);
	        gTools.timer = setInterval(function () {
	            //var currPoint = getNear(X,Y);
	            if (ifNearPoint(X, Y, _Parkpoint, dist)) {
	                //log.v('[Looking] inner clearInterval:', gTools.timer);
	                clearInterval(gTools.timer);

	                if (text || title) {
	                    //TODO 硬编码  贵阳的不显示“猫寻助手”这几个字
	                    gTools.buildingId == 48 && (text = '');
	                    gTools.alert(text, title);
	                }
	                if (title == '恭喜小主找到爱车') {
	                    gTools.finishPark();
	                    map.wayfinding("clearPath");
	                }

	                reportStopNavigate();

	                // 导航结束
	                gTools.hideHalfModal();
	                newNavigateOpt.text = '';
	                newNavigateOpt.title = '';
	                //newNavigateOpt.source = '';
	                newNavigateOpt.brand = '';
	                newNavigateOpt.startPoint = {};

	                delete gTools.destination;
	                delete gTools.navTips;
	                delete gTools.tmpNavTip;

	                $('[data-maction="remove-pin"]').trigger("click");
	            } else {
	                //log.v('[Looking] Not arrive the end-point nearby');
	            }
	        }, 1000);
	    }

	    /**
	     * 根据起点和终点进行导航
	     * @param {object}  startPoint      必传,导航起点
	     * @param {object}  endPoint        必传,导航终点
	     * @param {string}  [title]         可选,导航结束时提示框的标题
	     * @returns {*}
	     */
	    function startNavigate(startPoint, endPoint, title) {
	        // 参数校验
	        if (!startPoint) {
	            return weui.alert('请先选择导航起点');
	        }
	        if (!endPoint) {
	            return weui.alert('请先选择导航终点');
	        }

	        var endPointMapArea = endPoint.mapArea;

	        // 上报开始导航
	        reportStartNavigate(startPoint, endPoint);

	        // 规划路径,规划失败的情况下,直接退出
	        if (!planPath(startPoint.mapArea, endPointMapArea)) {
	            return;
	        }

	        // 清除定位图钉
	        clearLocPin();

	        var dist = gTools.buildingId == 50 ? 23 : gTools.IS_FEILE_SCENE ? (globalNavRange || 4) : 18;   // 加入广州飞乐展区场景判断
	        // 先清空定时器,避免重复
	        clearInterval(gTools.timer);
	        gTools.timer = setInterval(function () {
	            // 未到达终点不进行处理
	            if (!ifNearPoint(X, Y, endPointMapArea, dist)) {
	                return;
	            }

	            // 到达终点的处理
	            clearInterval(gTools.timer);

	            // 导航成功弹框提示
	            gTools.alert('欢迎小主下次光临哦！', title || '恭喜您抵达目的地');

	            // 寻车的特殊处理
	            if (title == '恭喜小主找到爱车') {
	                gTools.finishPark();    // 上报完成寻车
	                //map.wayfinding("clearPath");    // 清除路径
	            }

	            reportStopNavigate(startPoint, endPoint);

	            // 导航结束
	            gTools.hideHalfModal();
	            //newNavigateOpt.text = '';
	            //newNavigateOpt.title = '';
	            //newNavigateOpt.source = '';
	            //newNavigateOpt.brand = '';
	            //newNavigateOpt.startPoint = {};

	            //delete gTools.destination;
	            //delete gTools.navTips;
	            //delete gTools.tmpNavTip;

	            // 清除路线
	            $('[data-maction="remove-pin"]').trigger("click");
	        }, 1000);
	    }
	}



	//// svg坐标转换
	//function coordinateTransform(screenPoint, someSvgObject) {
	//    var CTM = someSvgObject.getScreenCTM();
	//    return screenPoint.matrixTransform(CTM.inverse());
	//}

	// 不想说话系列
	function hideFastNav() {
	    gTools.getPoiLabels().then(function (r) {
	        //log.v('[getPoiLabels]', r);
	        return r.poiLabels.filter(function (v) {
	            return v.isLabel;
	        });
	    }).then(_hideFastNav);
	}

	// 判断是否是整数
	function isInteger(obj) {
	    return typeof obj === 'number' && obj % 1 === 0
	}

	// 创建下拉快捷菜单
	function _hideFastNav(labelsArr) {
	    var _l = gTools.buildingInfo.labels || "";
	    var labels = _l.split("");  // 将字符串分割成字符
	    // 菜单需要重新排序
	    LABELSCONFIG.sort(function (pre, next) {
	        return pre.sort1 - next.sort1;
	    });

	    var data = LABELSCONFIG.concat(labelsArr);

	    var list = '', len = data.length, sl = 0, numsInOneLine = 5;
	    $.each(data, function (i, v) {
	        // 属于后台自带基础设施,但是没有配置
	        if (!v.isLabel && labels[v.p] == 0) {
	            return true;
	        }
	        // 分页处理
	        if (isInteger(sl / 2 / numsInOneLine)) {
	            list += '<li><ul class="am-menu-nav am-avg-sm-' + numsInOneLine + ' "  style="">';
	        }
	        if (v.isLabel) {    // 下拉菜单-自定义的poi分类图标
	            list +=
	                '<li>\
	                    <a href="javascript:;" data-naction="'+ setCustomizeDropdownMenuAction(v.name) +'" data-id="' + v.id + '" data-category="' + v.name + '">\
	                        <img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==" style="background-image:url(' + gTools.setImgLink(v.iconUrl) + ')" class="am-thumbnail" alt="' + v.name + '" />\
	                    </a>\
	                </li>';
	        } else {            // 下拉菜单-后台自带的poi分类图标
	            list +=
	                '<li class="poi' + v.class + '">\
	                    <a href="' + v.href + '" class="" data-naction="' + v.naction + '">\
	                        <img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==" class="am-thumbnail" alt="' + v.name + '" />\
	                    </a>\
	                </li>';
	        }
	        // 分页处理
	        if (i === len || isInteger((sl + 1 ) / 2 / numsInOneLine)) {
	            list += '</ul></li>';
	        }
	        sl++;
	    });

	    var tpl = '<ul class="am-slides">' + list + "</ul>";
	    $("#slideNav").empty().append(tpl);
	    setTimeout(function () {
	        $('#slideNav').flexslider({
	            itemWidth: winW,
	            slideshow: false,
	            start: function (slider) {
	                slider.find(".am-slides").children().css("width", winW);
	                $(".initial").removeClass("initial");
	                $(".am-in").removeClass("am-in");
	                //$(".am-menu-toggle").trigger("click");
	            }
	        });
	    }, 100);
	}

	/**
	 * 根据不同分组类型设置菜单图标
	 * @param {string}  type    必传,不同分组菜单的分类类型
	 * @param {object}  menu    必传,当前菜单对象
	 * @returns {string}        返回当前菜单对象的图标绝对路径
	 */
	function setDropdownMenusIconAccordGroupType(type, menu) {
	    switch (type) {
	        case DROPDOWN_MENU.TYPE.CUSTOMIZE:
	            //return location.origin + menu.iconUrl;
	            return '//taiguli.wizarcan.com' + menu.iconUrl;
	        case DROPDOWN_MENU.TYPE.FACILITY:
	            //return '//oex38ct5y.qnssl.com/img/taiguli/menu4/tgl' + menu.class + '.png?t=1';
	        case DROPDOWN_MENU.TYPE.FIND_CAR:
	            return '//oex38ct5y.qnssl.com/img/taiguli/menu4/tgl' + menu.class + '.png?t=1';
	        default:
	            log.e('设置菜单icon失败: 未匹配到下拉菜单的分类类型');
	            return '';
	    }
	}

	/**
	 * 根据分组类型设置分组菜单样式class
	 * @author weibin
	 * @param {string}  type    必传,不同分组菜单的分类类型
	 * @returns {string}        返回不同分组菜单的样式class
	 */
	function setDropdownMenusGroupClassNameAccordGroupType(type) {
	    switch (type) {
	        case DROPDOWN_MENU.TYPE.CUSTOMIZE:
	            return 'customize';
	        case DROPDOWN_MENU.TYPE.FACILITY:
	            return 'facility';
	        case DROPDOWN_MENU.TYPE.FIND_CAR:
	            return 'find-car';
	        default:
	            log.e('设置菜单分组样式失败: 未匹配到下拉菜单的分类类型');
	            return '';
	    }
	}

	/**
	 * 根据分组类型设置分组菜单标题
	 * @author weibin
	 * @param {string}  type    必传,不同分组菜单的分类类型
	 * @returns {string}        返回不同分组菜单的标题
	 */
	function setDropdownMenusGroupTitleNameAccordGroupType(type) {
	    switch (type) {
	        case DROPDOWN_MENU.TYPE.CUSTOMIZE:
	            return '业态分类';
	        case DROPDOWN_MENU.TYPE.FACILITY:
	            return '公共设施';
	        case DROPDOWN_MENU.TYPE.FIND_CAR:
	            return '停车找车';
	        default:
	            log.e('设置菜单分组名称失败: 未匹配到下拉菜单的分类类型');
	            return '';
	    }
	}

	/**
	 * 根据分组类型生成每组菜单模板
	 * @author weibin
	 * @param {string}  type    必传,不同分组菜单的分类类型
	 * @param {array}   menus   必传,当前分组菜单列表
	 * @returns {string}        返回当前分组菜单模板
	 */
	function generateDropdownMenusTplAccordGroupType(type, menus) {
	    var tpl =
	        '<div class="dropdown-category ' + setDropdownMenusGroupClassNameAccordGroupType(type) + '">' +
	            '<div class="dropdown-category-label-box"><i class="label-icon"></i><span class="label-title">' + setDropdownMenusGroupTitleNameAccordGroupType(type) + '</span></div>' +
	            '<div class="dropdown-category-menu-box">' +
	                '<i class="menu-sign"></i>' +
	                '<ul class="menu-list">';

	    // 设置分组中的每个菜单
	    menus.forEach(function (menu) {
	        if (type === DROPDOWN_MENU.TYPE.CUSTOMIZE) {
	            tpl += '<li class="menu-item" data-naction="findLabelsById" data-id="' + menu.id + '" data-category="' + menu.name + '"><img class="menu-icon" src="' + setDropdownMenusIconAccordGroupType(type, menu) + '"></li>';
	        } else {
	            // 会改变hash值
	            tpl += '<li class="menu-item" data-naction="' + menu.naction + '" data-category="' + menu.name + '"><a href="' + menu.href + '"><img class="menu-icon" src="' + setDropdownMenusIconAccordGroupType(type, menu) + '"></a></li>';
	            // 不改变hash值
	            //tpl += '<li class="menu-item" data-naction="' + menu.naction + '" data-category="' + menu.name + '"><img class="menu-icon" src="' + setDropdownMenusIconAccordGroupType(type, menu) + '"></li>';
	        }
	    });

	    tpl += '</ul></div></div>';

	    return tpl;
	}

	/**
	 * 获取自定义分类的下拉菜单项列表
	 * @author weibin
	 * @param {function}    [callback]  可选,获取成功后的回调函数
	 */
	function getCustomizePoiCategories(callback) {
	    // 获取所有自定义poi分类
	    gTools.getPoiLabels().then(function (resp) {
	        // 过滤出设置为下拉菜单的poi分类
	        var dropdownCustomizeCategories = resp.poiLabels.filter(function (category) {
	            return category.isLabel;
	        });

	        callback && callback(dropdownCustomizeCategories);
	    });
	}

	/**
	 * 区分出公共设施或停车找车分类
	 * @author weibin
	 * @param {array}   labels          必传,后台配置的下拉菜单列表
	 * @param {array}   labelsConfig    必传,系统自带的下拉菜单列表配置项
	 * @param {array}   findCarActions  必传,寻车(停车/找车)相关的下拉菜单项
	 * @param {boolean} isFacility      必传,区分当前操作是要获取公共设施分类,还是寻车分类. 1.true:获取公共设施分类; 2.false:获取寻车分类
	 * @returns {array} 返回公共设施分类菜单列表或寻车分类菜单列表
	 */
	function distinguishFacilityOrFindCarPoiCategories(labels, labelsConfig, findCarActions, isFacility) {
	    // 过滤出后台配置过的公共设施分类或停车找车分类
	    var setFacilityCategories = labelsConfig.filter(function (category) {
	        return labels[category.p] == 1 && (isFacility ? !inArray(category.naction, findCarActions) : inArray(category.naction, findCarActions));
	    });

	    // 返回排序后的结果
	    return setFacilityCategories.sort(function (pre, next) {
	        return pre.sort2 - next.sort2;
	    });
	}

	/**
	 * 创建按分类分组的下拉菜单
	 * @author weibin
	 */
	function createDropdownMenus() {
	    var dropdownTpl = '<div class="dropdown-box" id="js_dropdown_box">';

	    // 获取自定义业态分类
	    getCustomizePoiCategories(function (dropdownCustomizeCategories) {
	        // 设置业态分类分组
	        dropdownTpl += generateDropdownMenusTplAccordGroupType(DROPDOWN_MENU.TYPE.CUSTOMIZE, dropdownCustomizeCategories);

	        // 其他分组菜单的设置要放在设置自定义业态分类菜单之后
	        var labels = gTools.buildingInfo.labels.split(''), findCarActions = ['if-record-car', 'findPay', 'search-car'];
	        // 设置公共设施分组
	        dropdownTpl += generateDropdownMenusTplAccordGroupType(DROPDOWN_MENU.TYPE.FACILITY, distinguishFacilityOrFindCarPoiCategories(labels, LABELSCONFIG, findCarActions, true));

	        // 设置停车找车分组
	        dropdownTpl += generateDropdownMenusTplAccordGroupType(DROPDOWN_MENU.TYPE.FIND_CAR, distinguishFacilityOrFindCarPoiCategories(labels, LABELSCONFIG, findCarActions, false));

	        // 添加闭合标签
	        dropdownTpl += '</div>';

	        // 将下拉菜单模板添加到界面
	        $('#js_dropdown_nav_box').append(dropdownTpl);
	    });
	}



	// window.orientation旋转的角度,取值: 0:竖屏; 90:横屏
	$(window).bind('orientationchange', function (e) {
	    L(window.orientation);
	    log.v('switched window orientation', window.orientation);

	    if (window.orientation !== 0) {
	        gTools.alert("为了达到最佳体验，请将手机竖屏使用", "", "landscape");
	    } else {
	        L("竖屏回来，重新初始化文字位置");
	        log.i('竖屏回来，重新初始化文字位置');
	        $(".landscape").modal("close");
	        setTimeout(function () {
	            // gTools.setPoiText = gTools.initSetPoiText("create");
	            // gTools.setPoiText();
	            gTools.initSetPoiText("zoom")();
	        }, 1500);
	    }

	    gTools.initZoomEvt();
	    clearTimeout(locationCurrTimer);
	    locationCurr();
	});

	// window.onerror处理,可进行错误上报 只会返回三个参数: msg, url, line
	window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
	    //L("错误信息：" + errorMessage);
	    //L("出错文件：" + scriptURI);
	    //L("出错行号：" + lineNumber);
	    //L("出错列号：" + columnNumber);
	    //L("错误详情：" + errorObj);
	    //oneLog.w('错误类型：' + errorMessage + ' 行号：' + lineNumber + ' 列号：' + columnNumber + ' 文件：' + scriptURI + ' 详情：' + errorObj);
	    log.w('错误类型：' + errorMessage + ' 行号：' + lineNumber + ' 列号：' + columnNumber + ' 文件：' + scriptURI + ' 详情：' + errorObj);
	};


	// Begin test code.
	// 模拟扫描beacon: 需手动传入minor/major号
	window.testReceiveBeacon = function (minor) {
	    //$("svg").find("#poi").show();
	    gTools.poiIsHide = 1;
	    gTools.beaconList.forEach(function (v, i) {
	        v.minor === minor ? beaconsInRangeHandler({beacons: [{major: v.major, minor: v.minor, rssi: -11}]}) : ""
	    })
	};

	// 开始模拟扫描beacon: 读取数据后进行连续模拟,如读取上报的扫描到的beacon记录
	window.startSimulateScanBeacons = function (simulateScanBeacons) {
	    gTools.poiIsHide = 1;

	    simulateScanBeacons = simulateScanBeacons || window.simulateScanBeacons;

	    //simulateScanBeacons.start('//idp.dev2.wizarcan.com/rpm/TestApi/getBeaconScanSim/75', beaconsInRangeHandler);
	    simulateScanBeacons && simulateScanBeacons.start('/weibin/demos/node/logs/rst/searchedBeacons.json', beaconsInRangeHandler);
	};
	// 停止模拟扫描beacon: 停止读取数据模拟扫描,与startSimulateScanBeacons()方法对应
	window.stopSimulateScanBeacons = function (simulateScanBeacons) {
	    simulateScanBeacons = simulateScanBeacons || window.simulateScanBeacons;

	    simulateScanBeacons && simulateScanBeacons.stop();
	    //coordinate && coordinate.stopWatchPosition();
	};
	// End test code.




	/**
	 * GE的单独内容: GE停车场需要自定义键盘
	 * @author sx
	 */
	function setGEParkPatch() {
	    if (gTools.buildingId != 42) {
	        log.v('[setGEParkPatch] 非GE场景,不做处理');
	        return;
	    }

	    log.i('[setGEParkPatch] GE场景,设置自定义键盘');
	    $('body').append('<div id="fuck">\
			<div class="wrapper">\
			    <div class="code-list clearfix">\
			        <div id="codePrefix" class="code-item c-active">京</div>\
			        <div class="code-item c-num-item"></div>\
			        <div class="separated">&#xe605;</div>\
			        <div class="code-item c-num-item"></div>\
			        <div class="code-item c-num-item"></div>\
			        <div class="code-item c-num-item"></div>\
			        <div class="code-item c-num-item"></div>\
			        <div class="code-item c-num-item"></div>\
			    </div>\
			    <div class="add-btn">完成</div>\
			</div>\
			<ul class="keyboard-list hide" id="provinceList">\
			    <li class="list-item clearfix">\
			        <span class="p-item">京</span>\
			        <span class="p-item">津</span>\
			        <span class="p-item">冀</span>\
			        <span class="p-item">鲁</span>\
			        <span class="p-item">晋</span>\
			        <span class="p-item">蒙</span>\
			        <span class="p-item">辽</span>\
			        <span class="p-item">吉</span>\
			        <span class="p-item">黑</span>\
			        <span class="p-item">沪</span>\
			    </li>\
			    <li class="list-item clearfix">\
			        <span class="p-item">苏</span>\
			        <span class="p-item">浙</span>\
			        <span class="p-item">皖</span>\
			        <span class="p-item">闽</span>\
			        <span class="p-item">赣</span>\
			        <span class="p-item">豫</span>\
			        <span class="p-item">鄂</span>\
			        <span class="p-item">湘</span>\
			        <span class="p-item">粤</span>\
			        <span class="p-item">桂</span>\
			    </li>\
			    <li class="list-item list-three clearfix">\
			        <span class="p-item">渝</span>\
			        <span class="p-item">川</span>\
			        <span class="p-item">贵</span>\
			        <span class="p-item">云</span>\
			        <span class="p-item">藏</span>\
			        <span class="p-item">陕</span>\
			        <span class="p-item">甘</span>\
			        <span class="p-item">青</span>\
			    </li>\
			    <li class="list-item list-four clearfix">\
			        <span class="p-item">琼</span>\
			        <span class="p-item">新</span>\
			        <span class="p-item">港</span>\
			        <span class="p-item">澳</span>\
			        <span class="p-item">台</span>\
			        <span class="p-item">宁</span>\
			    </li>\
			</ul>\
			<ul class="keyboard-list hide" id="simKeyBoard">\
			    <li class="list-item clearfix">\
			        <span class="p-item">1</span>\
			        <span class="p-item">2</span>\
			        <span class="p-item">3</span>\
			        <span class="p-item">4</span>\
			        <span class="p-item">5</span>\
			        <span class="p-item">6</span>\
			        <span class="p-item">7</span>\
			        <span class="p-item">8</span>\
			        <span class="p-item">9</span>\
			        <span class="p-item">0</span>\
			    </li>\
			    <li class="list-item clearfix">\
			        <span class="p-item">Q</span>\
			        <span class="p-item">W</span>\
			        <span class="p-item">E</span>\
			        <span class="p-item">R</span>\
			        <span class="p-item">T</span>\
			        <span class="p-item">Y</span>\
			        <span class="p-item">U</span>\
			        <span class="p-item">I</span>\
			        <span class="p-item">O</span>\
			        <span class="p-item">P</span>\
			    </li>\
			    <li class="list-item list-three clearfix">\
			        <span class="p-item">A</span>\
			        <span class="p-item">S</span>\
			        <span class="p-item">D</span>\
			        <span class="p-item">F</span>\
			        <span class="p-item">G</span>\
			        <span class="p-item">H</span>\
			        <span class="p-item">J</span>\
			        <span class="p-item">K</span>\
			        <span class="p-item">L</span>\
			    </li>\
			    <li class="list-item list-four clearfix">\
			        <span class="p-item">Z</span>\
			        <span class="p-item">X</span>\
			        <span class="p-item">C</span>\
			        <span class="p-item">V</span>\
			        <span class="p-item">B</span>\
			        <span class="p-item">N</span>\
			        <span class="p-item">M</span>\
			        <span class="delete">&#xe606;</span>\
			    </li>\
			</ul>\
		</div>')
	    var upperLimit = false
	    var i = [];

	    $("#search").attr("disabled", true).on("touchstart", function () {
	        $("#simKeyBoard").hide(), $("#provinceList").show(), $(".c-active").removeClass("c-active"), $("#codePrefix").addClass("c-active")
	        i.length = 0;
	        $("#search").val($("#codePrefix").text() + i.join(""))
	    }), $(".c-num-item").on("touchstart", function () {
	        $("#provinceList").hide(), $("#simKeyBoard").show(), $(".c-active").removeClass("c-active"), $(".c-num-item").eq(Math.max(i.length - 1, 0)).addClass("c-active")
	        $("#search").val($("#codePrefix").text() + i.join(""))
	    }), $(".p-item").on("touchstart", function () {
	        var e = $(this);
	        if (e.css({
	                background: "#ccc"
	            }), setTimeout(function () {
	                e.css({
	                    background: "#fff"
	                })
	            }, 100), e.parents("#provinceList").length) $("#codePrefix").text(e.text()), $("#provinceList").hide(), $("#simKeyBoard").show();
	        else {
	            if (upperLimit) {
	                return false
	            }
	            var t = i.length;
	            6 > t && ($(".c-num-item").eq(t).text(e.text()).addClass("c-active").siblings(".c-active").removeClass("c-active"), i.push(e.text()), 5 == t && $(".add-btn").data("enable", !0).addClass("enable"))
	        }
	        $("#search").val($("#codePrefix").text() + i.join(""))
	        if (i.length === 6) {
	            $("#search").trigger("blur")
	            $('.keyboard-list').hide();
	        }
	    }), $(".list-item .delete").on("touchstart", function () {
	        var e = $(this);
	        $(".add-btn").data("enable", !1).removeClass("enable"), e.css({
	            background: "#fff"
	        }), setTimeout(function () {
	            e.css({
	                background: "#ACB4BF"
	            })
	        }, 100);
	        var t = i.length - 1;
	        t >= 0 ? (i.pop(), $(".c-num-item").eq(t).text("").removeClass("c-active"), 0 != t ? $(".c-num-item").eq(t - 1).addClass("c-active") : ($("#codePrefix").addClass("c-active"), $("#simKeyBoard").hide(), $("#provinceList").show())) : ($("#simKeyBoard").hide(), $("#provinceList").show())
	        $("#search").val($("#codePrefix").text() + i.join(""))
	    });
	}



	/** Begin append by weibin for Common. */
	/**
	 * 根据poi id从poi列表中获取对应的poi
	 * @author weibin
	 * @param {array} list poi数组
	 * @param {number} id 指定要获取的poi id
	 * @returns {*}
	 */
	function getPoiFromListById(list, id) {
	    for (var i = 0, len = list.length; i < len; i++) {
	        if (list[i].id === id) {
	            return list[i];
	        }
	    }

	    return null;
	}

	function getPoiFromListByMapArea(list, mapArea) {
	    for (var i = 0, len = list.length; i < len; i++) {
	        if (list[i].mapArea === mapArea) {
	            return list[i];
	        }
	    }

	    return null;
	}

	/**
	 * 显示poi详情
	 * @author weibin
	 * @param {array|object} obj poi对象的集合
	 * @param {number} [category] 当前店铺属于的poi分类
	 */
	function showPoiDetail(obj, category) {
	    if (gTools.IS_TAIKOOLI_SCENE) {  // 太古里场景
	        if (gTools.IS_CONTAIN_LIGHT_NAV) {
	            gTools.showPoiDetailForTaikooLiWithLightNav(obj, category);
	            //gTools.showNavHalfModal();
	        } else {
	            //gTools.newShowPoiInfo_TaikooLi(obj, category);

	            // 太古新版导航显示poi详情
	            refine.showPoiDetail(gTools.isArray(obj) ? obj[0] : obj);
	        }
	    } else {
	        gTools.newShowPoiInfo(obj);
	        //gTools.newShowPoiInfo_TaikooLi(obj);
	    }

	    $("#halfModalContent").find('[data-maction="locate-poi"]').trigger("click");    // 将地图中心移动到定位位置,包括楼层切换
	}

	/**
	 * 清除地图上之前放置的钉子,并在指定区域重新放置钉子
	 * @author weibin
	 * @param {string} mapArea 位置对应的地图编号,如L1-67
	 */
	function setPinWithClean(mapArea) {
	    map.wayfinding("clearPoiPoint");
	    map.wayfinding("setPoiPoint", mapArea);
	}


	/**
	 * 展示某个poi的详情信息
	 * @author weibin
	 * @param {object} poi poi的详情信息对象
	 */
	function showSomeOnePoiDetail(poi) {
	    if (!poi) {
	        gTools.alert('未能获取到对应的poi详情');
	        return;
	    }

	    setPinWithClean(poi.mapArea);
	    showPoiDetail([poi]);
	}

	function getRecommendStoreFieldByType(type, field) {
	    switch (type) {
	        case recommendStore.prePayCard.type:
	            return recommendStore.prePayCard[field];
	        case recommendStore.vipDiscount.type:
	            return recommendStore.vipDiscount[field];
	        case recommendStore.recommend.type:
	            return recommendStore.recommend[field];
	        default:
	            log.w('[getRecommendStoreFieldByType] Not matched type', type, 'field', field);
	            return null;
	    }
	}

	function rememberCurrentShowRecommendStoreListByType(type) {
	    switch (type) {
	        case recommendStore.prePayCard.type:
	            recommendStore.currentShow = recommendStore.prePayCard;
	            break;
	        case recommendStore.vipDiscount.type:
	            recommendStore.currentShow = recommendStore.vipDiscount;
	            break;
	        case recommendStore.recommend.type:
	            recommendStore.currentShow = recommendStore.recommend;
	            break;
	        default:
	            recommendStore.currentShow = null;
	    }

	    // 如果当前显示的列表不存在,说明当前点击的菜单不属于推荐菜单
	    if (!recommendStore.currentShow) {
	        log.w('您当前点击的菜单不属于推荐店铺菜单.');
	        return;
	    }

	    // 隐藏poi详情弹框
	    closeHalfModal();
	    // 上报点击推荐店铺菜单
	    reportClickEvent(getRecommendStoreFieldByType(type, recommendStore.field.code));
	}

	function clearCurrentShowRecommendStoreList() {
	    recommendStore.currentShow = null;
	}

	function showRecommendStoreDetail(id, type) {
	    var list, poi;

	    list = getRecommendStoreFieldByType(type, recommendStore.field.list);
	    if (!list) {
	        gTools.alert('未能获取到对应的推荐店铺列表');
	        return;
	    }

	    poi = getPoiFromListById(list, id);
	    hideCurrentShowRecommendStoreList();    // 隐藏当前展开的推荐列表
	    showSomeOnePoiDetail(poi);              // 显示查看的poi详情

	    // 百度统计
	    bdStat.trackEvent(STAT.ACTION.VIEW_POI_DETAIL);
	    // 后台统计: 第三个参数3代表的是从推荐列表查看详情
	    report.savePoi(id, poi.floorId, 3);
	}

	function closeSomeOneRecommendStoreList($wrpId) {
	    $wrpId.removeClass('show');
	    clearCurrentShowRecommendStoreList();
	}

	function hideCurrentShowRecommendStoreList() {
	    if (recommendStore.currentShow && recommendStore.currentShow.containerWrpId) {
	        setTimeout(function () {
	            $('#' + recommendStore.currentShow.containerWrpId).removeClass('show');
	        }, 300);
	    }

	}

	function setRecommendStoreListStatus(type, $wrpId) {
	    // 合起当前展开的列表
	    hideCurrentShowRecommendStoreList();
	    // 展开本次需要展开的列表
	    $wrpId.addClass('show');

	    rememberCurrentShowRecommendStoreListByType(type);
	}

	function switchRecommendStoreListStatus(type) {
	    var wrpId = getRecommendStoreFieldByType(type, recommendStore.field.containerWrpId), $wrpId = $('#' + wrpId);

	    if (!recommendStore.currentShow || recommendStore.currentShow.type === type) {
	        if ($wrpId.hasClass('show')) {
	            closeSomeOneRecommendStoreList($wrpId);
	        } else {
	            $wrpId.addClass('show');
	            rememberCurrentShowRecommendStoreListByType(type);
	        }
	    } else {
	        setRecommendStoreListStatus(type, $wrpId);
	    }
	}

	/**
	 * 获取访问日期
	 * @author weibin
	 * @returns {string}
	 */
	function getAccessDate() {
	    return new Date().format().split(' ')[0];
	}

	/**
	 * 从localStorage中获取场景信息
	 * @param name {string} 场景名称(英文或拼音)
	 * @returns {object} 场景信息对象
	 */
	function getSceneInfoFromLocalStorage(name) {
	    return localStorage[name] ? JSON.parse(localStorage[name]) : {};
	}

	/**
	 * 更新场景信息到localStorage中
	 * @param name {string} 场景名称
	 * @param data {object} 场景信息对象
	 */
	function updateSceneInfoIntoLocalStorage(name, data) {
	    // 清除之前的缓存字段
	    if (localStorage.hasOwnProperty('preAccessDate')) {
	        delete localStorage.preAccessDate;
	    }

	    localStorage[name] = JSON.stringify(data);
	}

	/**
	 * 初始化欢迎页,欢迎页也可以作为开屏广告
	 * @author weibin
	 * @param {number} [buildingId] 场景id
	 * @param {function} [callback] 回调函数
	 */
	function initWelcomePage(buildingId, callback) {
	    // 判断是否显示浮层广告的方法
	    function _isShowFloatAds() {
	        var curAccessDate = getAccessDate(),
	            sceneName = gTools.buildingName,
	            sceneInfo = getSceneInfoFromLocalStorage(sceneName);

	        if (curAccessDate === sceneInfo.preAccessDate) {
	            return false;
	        }

	        sceneInfo.preAccessDate = curAccessDate; // 记住当前访问时间,用作下次访问的前次访问时间
	        updateSceneInfoIntoLocalStorage(sceneName, sceneInfo);
	        return true;
	    }

	    gTools.getFloatAds(buildingId)
	        .done(function(resp) {
	            var floatAd = resp.floatLayer;

	            if (floatAd) {  // 设置了浮层广告
	                if (!_isShowFloatAds()) {
	                    log.v('[initWelcomePage] 一天内不重复显示浮层广告');
	                    callback && callback();
	                    return;
	                }

	                //log.v('[initWelcomePage] 每天显示一次浮层广告');
	                // 缓存信息到gTools对象上
	                gTools.floatLayerId = floatAd.id;
	                gTools.showWelcomePage(gTools.setImgLink(floatAd.image), floatAd.url || '//www.wizarcan.com', callback);
	            } else {    // 未设置浮层广告
	                // 太古里场景并且用户又是第一次访问,则显示默认欢迎页. 20170810版本迭代去除默认浮层广告
	                //if (gTools.IS_TAIKOOLI_SCENE && !localStorage.hasOwnProperty('isFirst')) {
	                //    log.v('[initWelcomePage] Show TaikooLi welcome page for new user.');
	                //    gTools.showWelcomePage('', '', callback);
	                //    return;
	                //}

	                // 其他场景未获取到浮层广告或太古里老用户再次访问时的统一处理
	                //log.v('[initWelcomePage] Not set float ads, so not show.');
	                callback && callback();
	            }
	        })
	        .fail(function(respOrXhr) {
	            log.v('[initWelcomePage] 获取浮层广告失败:', respOrXhr);
	            callback && callback();
	        });
	}
	/** End append by weibin for Common. */



	/** Begin append by weibin for TaikooLi. */
	function setRecommendStoreListHeight($list) {
	    DEVICE.IPHONE5 && $list.addClass('iphone5');
	}

	function setRecommendStoresCnt(eleId, cnt) {
	    $('#' + eleId).find('.stores-cnt').text(cnt);
	}

	/**
	 * 添加推荐店铺: 1.推荐店铺; 2.预付卡店铺; 3.会员优惠店铺
	 * @author weibin
	 * @param type:         推荐门店类型
	 * @param containerId:  容器元素id
	 * @param stores:       推荐门店列表数据
	 */
	function appendRecommendStores(type, containerId, stores) {
	    var store, storeStr = '', $storeContainer = $('#' + containerId), desc;

	    $storeContainer.empty();    // 清除之前的历史数据

	    for (var i = 0, len = stores.length; i < len; i++) {
	        store = stores[i];
	        if (type === recommendStore.prePayCard.type) {
	            desc = store.typeName ? store.typeName.replace(/,/g, '/') : '';
	        } else {
	            desc = store.discountInfo || store.detail || '';
	        }

	        storeStr +=
	            '<li class="store" data-id="' + store.id + '" data-map-area="' + store.mapArea + '" data-type="' + type + '" data-floor="F' + store.floorId + '" data-source="">' +
	                '<div class="merchant-logo-wrp">' +
	                    '<span class="merchant-logo" style="background: url(' + gTools.setImgLink(store.icon) + ') no-repeat center;background-size: contain;"></span>' +
	                '</div>' +
	                '<div class="content">' +
	                    '<span class="store-name">' + store.brand.replace('#', ' ') + '</span>' +
	                    (desc ? '<span class="discount-info">' + desc + '</span>' : '') +
	                '</div>' +
	                '<div class="location-pin-wrp">' +
	                    '<img class="location-pin" src="//oex38ct5y.qnssl.com/img/pinPoint.png">' +
	                '</div>' +
	            '</li>';
	    }

	    $storeContainer.append(storeStr);
	    setRecommendStoreListHeight($storeContainer);   // 设置列表高度
	}

	/**
	 * 设置推荐店铺的菜单和列表样式
	 * @author weibin
	 * @param multi {boolean}        是否获取了多个类型的推荐店铺
	 */
	function setRecommendStoreMenuAndListStyle(multi) {
	    if (multi) {
	        $('#js_toggle_vip_discount_stores').addClass('mt10');           // 为展开/合并会员优惠列表的菜单元素添加margin-top:10px;样式
	        $('#js_vip_discount_store_list_wrp').addClass('reset-top');     // 为会员优惠列表添加reset-top类,用于设置列表的三角形样式
	    }
	}

	function initRightTopRecommendStores() {
	    if (!IS_USE_OLD_MAP) {
	        return;
	    }

	    gTools.getRightTopRecommendStores(gTools.buildingId)
	        .done(function (resp) {
	            var recStoreCategoryCnt = 0;

	            if ((!resp.valueCards || resp.valueCards.length === 0) && (!resp.discounts || resp.discounts.length === 0) && (!resp.reCommends || resp.reCommends.length === 0)) {
	                log.i('没有配置推荐店铺');
	                return;
	            }

	            // 设置预付卡店铺——右侧
	            if (resp.valueCards && resp.valueCards.length) {
	                setRecommendStoresCnt(recommendStore.prePayCard.containerWrpId, resp.valueCards.length);
	                appendRecommendStores(recommendStore.prePayCard.type, recommendStore.prePayCard.containerId, resp.valueCards);
	                recommendStore.prePayCard.list = resp.valueCards;
	                $('#js_toggle_pre_pay_card_stores').addClass('db');     // 显示预付卡店铺菜单
	                // 注册菜单事件
	                new Hammer(document.getElementById('js_toggle_pre_pay_card_stores')).on('tap', function () {
	                    switchRecommendStoreListStatus(recommendStore.prePayCard.type);
	                });
	                // 注册关闭列表事件
	                new Hammer(document.getElementById('js_close_pre_pay_card_store_list')).on('tap', function () {
	                    closeSomeOneRecommendStoreList($('#' + recommendStore.prePayCard.containerWrpId));
	                });
	                // 设置查看poi详情事件
	                $('#' + recommendStore.prePayCard.containerId).on('click', '.store', function () {
	                    showRecommendStoreDetail($(this).data('id'), recommendStore.prePayCard.type);
	                });
	                recommendStore.haveRightPartData = true;
	                recStoreCategoryCnt++;
	            }

	            // 设置会员优惠店铺——右侧
	            if (resp.discounts && resp.discounts.length) {
	                setRecommendStoresCnt(recommendStore.vipDiscount.containerWrpId, resp.discounts.length);
	                appendRecommendStores(recommendStore.vipDiscount.type, recommendStore.vipDiscount.containerId, resp.discounts);
	                recommendStore.vipDiscount.list = resp.discounts;
	                $('#js_toggle_vip_discount_stores').addClass('db');     // 显示会员优惠菜单
	                // 注册菜单事件
	                new Hammer(document.getElementById('js_toggle_vip_discount_stores')).on('tap', function () {
	                    switchRecommendStoreListStatus(recommendStore.vipDiscount.type);
	                });
	                // 注册关闭列表事件
	                new Hammer(document.getElementById('js_close_vip_discount_store_list')).on('tap', function () {
	                    closeSomeOneRecommendStoreList($('#' + recommendStore.vipDiscount.containerWrpId));
	                });
	                // 设置查看poi详情事件
	                $('#' + recommendStore.vipDiscount.containerId).on('click', '.store', function () {
	                    showRecommendStoreDetail($(this).data('id'), recommendStore.vipDiscount.type);
	                });
	                recommendStore.haveRightPartData = true;
	                recStoreCategoryCnt++;
	            }

	            // 设置推荐店铺——左侧
	            if (resp.reCommends && resp.reCommends.length) {
	                setRecommendStoresCnt(recommendStore.recommend.containerWrpId, resp.reCommends.length);
	                appendRecommendStores(recommendStore.recommend.type, recommendStore.recommend.containerId, resp.reCommends);
	                recommendStore.recommend.list = resp.reCommends;
	                $('#js_toggle_recommend_stores').addClass('db');     // 显示会员优惠菜单
	                // 注册菜单事件
	                new Hammer(document.getElementById('js_toggle_recommend_stores')).on('tap', function () {
	                    switchRecommendStoreListStatus(recommendStore.recommend.type);
	                });
	                // 注册关闭列表事件
	                new Hammer(document.getElementById('js_close_recommend_store_list')).on('tap', function () {
	                    closeSomeOneRecommendStoreList($('#' + recommendStore.recommend.containerWrpId));
	                });
	                // 设置查看poi详情事件
	                $('#' + recommendStore.recommend.containerId).on('click', '.store', function () {
	                    showRecommendStoreDetail($(this).data('id'), recommendStore.recommend.type);
	                });
	                recommendStore.haveLeftPartData = true;
	                //recStoreCategoryCnt++;    // 此菜单与上面两个菜单不在同一侧,所以不需要计数
	            }

	            // 设置(右侧)推荐店铺的菜单和列表样式
	            setRecommendStoreMenuAndListStyle(recStoreCategoryCnt >= 2);

	            // 如果为太古里停车场,就不显示右上角的推荐店铺菜单
	            if(gTools.IS_TAIKOOLI_SCENE && gTools.isParking()){
	                return;
	            }

	            // 显示右上角容器
	            recommendStore.haveRightPartData && $('#js_right_top_box').addClass('db');
	            // 显示左上角容器
	            recommendStore.haveLeftPartData && $('#js_left_top_box').addClass('db');

	            // 自动展开对应的推荐店铺列表，目前只自动展开“预付卡店铺”或“会员优惠店铺”
	            if (conf.EXTEND_RSL_CODE) {
	                switchRecommendStoreListStatus(conf.EXTEND_RSL_CODE === 2 ? recommendStore.prePayCard.type : recommendStore.vipDiscount.type);
	            }
	        })
	        .fail(function (xhrOrResp) {
	            log.e('获取右上角的推荐店铺失败', xhrOrResp);
	        });
	}



	function setLeftTopRecommendStores(callback) {
	    // 目前先一次性获取(100个),后面再考虑滚动加载
	    log.v('[setLeftTopRecommendStores] gTools.floorList', gTools.floorList, 'gTools.floorIndex', gTools.floorIndex);

	    gTools.getRecommendPoiListByFloorId(gTools.floorList[gTools.floorIndex[gTools.showingFloor]].id, 100, 1)
	        .done(function (resp) {
	            typeof resp === 'string' && (resp = JSON.parse(resp));

	            if (!resp.list.length) { // 未设置推荐店铺,不用显示推荐店铺按钮
	                $('#js_toggle_recommend_stores').removeClass('db');
	                return;
	            }

	            // 设置了推荐店铺,则显示推荐店铺按钮,设置推荐店铺的处理逻辑
	            $('#js_toggle_recommend_stores').addClass('db');
	            setRecommendStoresCnt(recommendStore.recommend.containerWrpId, resp.list.length);
	            appendRecommendStores(recommendStore.recommend.type, recommendStore.recommend.containerId, resp.list);
	            recommendStore.recommend.list = resp.list;      // 缓存到全局变量
	        })
	        .always(function () {
	            callback && callback();
	        });
	}

	function setFloorIndex() {
	    gTools.floorIndex = {};
	    for (var i = 0, floorList = gTools.floorList, len = floorList.length; i < len; i++) {
	        gTools.floorIndex['F' + floorList[i].id] = i;
	    }
	}

	/**
	 * 设置搜索框的提示信息placeholder
	 * @author weibin
	 * @param {boolean|*} [isParking] 是否是停车场的标识
	 */
	function setSearchPlaceholder(isParking) {
	    isParking = isParking !== undefined ? isParking : gTools.isParking();
	    log.v('[setSearchPlaceholder] is parking', isParking);

	    if (isParking) {
	        $('#search').attr('placeholder', '请输入您的车位号');

	        $('#header').addClass('header-has-top-tips');       // 设置页头的样式
	        $('#btm').css({bottom: '44px'});          // 设置页面下方按钮控件样式
	        $('#js_top_tips_box').show();   // 显示停车场的顶部提示
	    } else {
	        $('#search').attr('placeholder', '输入品牌名搜索');

	        $('#header').removeClass('header-has-top-tips');    // 设置页头的样式
	        $('#btm').css({bottom: '0'});       // 设置页面下方按钮控件样式
	        $('#js_top_tips_box').hide();   // 隐藏停车场的顶部提示
	    }
	}

	/**
	 * 完成楼层切换后需要做的逻辑处理. 如:1.搜索框提示信息的修改; 2.不同快捷菜单的显示与隐藏.
	 * @author weibin
	 * @param {boolean|*} [isParking] 是否是停车场的标识
	 */
	function handleFloorChanged(isParking) {
	    // 太古里场景特殊处理
	    if (gTools.IS_TAIKOOLI_SCENE && 0) {
	        isParking = isParking !== undefined ? isParking : gTools.isParking();
	        log.v('[handleFloorChanged] is parking', isParking);

	        setSearchPlaceholder(isParking);
	        if (isParking) {    // 停车场场景
	            $('#js_right_top_box').removeClass('db'); // 隐藏商场场景的右边菜单
	        } else {            // 商场场景
	            recommendStore.haveRightPartData && $('#js_right_top_box').addClass('db');  // 显示商场场景的右边菜单
	        }
	    }
	}

	/**
	 * 初始化推荐店铺:按道理是设置了推荐店铺,则注册对应的事件处理;但是涉及到跨楼层不太弄,所以索性就先把对应事件给注册了.
	 * @author weibin
	 */
	function initLeftTopRecommendStores(callback) {
	    // 注册菜单事件
	    new Hammer(document.getElementById('js_toggle_recommend_stores')).on('tap', function () {
	        switchRecommendStoreListStatus(recommendStore.recommend.type);
	    });
	    // 注册关闭列表事件
	    new Hammer(document.getElementById('js_close_recommend_store_list')).on('tap', function () {
	        closeSomeOneRecommendStoreList($('#' + recommendStore.recommend.containerWrpId));
	    });
	    // 设置查看poi详情事件
	    $('#' + recommendStore.recommend.containerId).on('click', '.store', function () {
	        showRecommendStoreDetail($(this).data('id'), recommendStore.recommend.type);
	    });

	    setLeftTopRecommendStores(callback);
	}

	/**
	 * 设置推荐店铺处理逻辑
	 * 说明: 2017年5月上线后,对推荐店铺改用新的处理逻辑
	 * @author sx
	 */
	function setRecommendStoresHandler() {
	    $(function () {
	        var transX = 0,
	            transY = 0,
	            $recMenuWrp = $("#eleColumn"),
	            recMenuPosition = $recMenuWrp.position(),
	            x = recMenuPosition.left,
	            y = recMenuPosition.top,
	            screenW = window.screen.width,
	            screenH = window.screen.height;

	        /** Begin 对推荐按钮包裹元素的处理. */
	        var panStart = function (e) {
	            e.preventDefault();
	        };
	        var pan = function (e) {
	            transX = e.deltaX;
	            transY = e.deltaY;

	            $recMenuWrp.css({
	                "-webkit-transform": 'translate(' + transX + 'px,' + transY + 'px)',
	                "transform": 'translate(' + transX + 'px,' + transY + 'px)'
	            });
	        };
	        var panEnd = function (e) {
	            x += transX;
	            y += transY;

	            if ((6 < x && (x + 60) < screenW) && (60 < y && (y + 120) < screenH)) {
	                $recMenuWrp.css({
	                    "left": x + "px",
	                    "top": y + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                //x = x;
	                //y = y;
	            } else if (screenW <= (x + 60) && screenH <= (y + 120)) {
	                $recMenuWrp.css({
	                    "left": screenW - 56 + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = screenW - 56;

	                if ($.os.ios) { // iphone
	                    y = screenH - 116;
	                } else {        // android
	                    y = screenH - 124;
	                }
	                $recMenuWrp.css("top", y + "px");
	            } else if (x < 6 && y < 60) {
	                $recMenuWrp.css({
	                    "left": 6 + "px",
	                    "top": 70 + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = 6;
	                y = 70;
	            } else if (x < 6 && (60 < y && (y + 120) < screenH)) {
	                $recMenuWrp.css({
	                    "left": 6 + "px",
	                    "top": y + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = 6;
	                //y = y;
	            } else if (x < 6 && screenH <= (y + 120)) {
	                $recMenuWrp.css({
	                    "left": 6 + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = 6;
	                if ($.os.ios) {
	                    y = screenH - 116;
	                } else {
	                    y = screenH - 124;
	                }
	                $recMenuWrp.css("top", y + "px");
	            } else if (y < 60 && (6 < x && (x + 60) < screenW)) {
	                $recMenuWrp.css({
	                    "left": x + "px",
	                    "top": 70 + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                //x = x;
	                y = 70;
	            } else if (screenH <= (y + 120) && (6 < x && (x + 60) < screenW)) {
	                $recMenuWrp.css({
	                    "left": x + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                //x = x;
	                if ($.os.ios) {
	                    y = screenH - 116;
	                } else {
	                    y = screenH - 124;
	                }
	                $recMenuWrp.css("top", y + "px");
	            } else if (screenW < (x + 60) && (60 < y && (y + 120) < screenH)) {
	                $recMenuWrp.css({
	                    "left": screenW - 56 + "px",
	                    "top": y + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = screenW - 56;
	                //y = y;
	            } else if (screenW < (x + 60) && y < 60) {
	                $recMenuWrp.css({
	                    "left": screenW - 56 + "px",
	                    "top": 70 + "px",
	                    "-webkit-transform": 'translate(0px,0px)',
	                    "transform": 'translate(0px,0px)'
	                });
	                x = screenW - 56;
	                y = 70;
	            }
	        };
	        /** End 对推荐按钮包裹元素的处理. */


	        function _showRecommendStores(stores) {
	            // 添加推荐列表
	            gTools.recommendStores(stores);
	            // 设置列表位置
	            var listH = $(".storeLists").height() - 100;
	            if (screenW < (x + 215) && (y + listH) < screenH) {
	                $(".storeLists").css("left", "-176px");
	            } else if (screenW > (x + 215) && x > 180 && (y + listH) > screenH) {
	                $(".storeLists").css({
	                    "top": "-362px",
	                    "left": "-62px"
	                });
	            } else if (x > 180 && screenW < (x + 215) && (y + listH) > screenH) {
	                $(".storeLists").css({
	                    "top": "-320px",
	                    "left": "-176px"
	                });
	            } else if (x >= 6 && x < 180 && (y + listH) > screenH) {
	                $(".storeLists").css({
	                    "top": "-320px",
	                    "left": "44px"
	                });
	            }
	            // 显示菜单
	            //$recMenuWrp.find('#js_rec_stores_menu_wrp').removeClass('dn');
	            //$recMenuWrp.removeClass('dn');
	        }

	        //function _hideRecommendStores() {
	        //    // 隐藏菜单
	        //    $recMenuWrp.find('#js_rec_stores_menu_wrp').addClass('dn');
	        //    $recMenuWrp.addClass('dn');
	        //}

	        /** Begin 对推荐按钮的处理. */
	        var reColumn = new Hammer.Manager(document.getElementById('reColumn'));
	        reColumn.add(new Hammer.Tap({
	            event: 'tap'
	        }));
	        reColumn.add(new Hammer.Pan({
	            event: 'pan'
	        }));
	        reColumn.on("tap panstart pan panend", function (e) {
	            // tap 事件
	            if (e.type == 'tap') {
	                if ($(".storeLists").length) {  // 推荐列表 展开 => 合起(移除)
	                    $(".storeLists").remove();
	                    return;
	                }

	                // 获取推荐店铺相关POI  推荐列表 合起 => 展开
	                //gTools.getRecommendPoiListByFloorId(gTools.floorList[gTools.floorIndex[gTools.showingFloor]].id, 10, 1).done(function (res) {
	                //    typeof res === 'string' && (res = JSON.parse(res));
	                //
	                //    if (!res.list.length) {     // 未设置推荐店铺,则隐藏对应按钮
	                //        //_hideRecommendStores();
	                //        gTools.alert('本楼层没有推荐店铺，您可以通过切换楼层来查看其他楼层的推荐店铺！');
	                //        return;
	                //    }
	                //
	                //    // 设置了推荐店铺,则显示推荐店铺按钮,添加推荐店铺列表
	                //    recStores = res.list;        // 缓存到全局变量
	                //    _showRecommendStores(recStores);
	                //});
	                _showRecommendStores(recStores);
	                return;
	            }

	            // 平移事件
	            if ($(".storeLists").length) {  // 推荐列表展开的情况下,禁止拖动,不执行平移事件
	                return;
	            }

	            if (e.type == 'panstart') {
	                panStart(e);
	            } else if (e.type == 'pan') {
	                pan(e);
	            } else {
	                panEnd(e);
	            }
	        });
	        /** End 对推荐按钮的处理. */


	        // 设置点击推荐店铺事件处理
	        //$(document).on("click", ".storeName", function () {
	        $recMenuWrp.on("click", ".stores", function () {
	            log.i('[menu-wrp click on storeName]');
	            //var mapArea = $(this).data("maction");    // 从maction => mapArea会不会有影响,因为设置为maction时,还会去执行对应的maction逻辑处理.
	            var mapArea = $(this).data("mapArea");
	            console.log('查看推荐店铺详情 mapArea',mapArea);
	            $.each(recStores, function (i, poi) {
	                if (poi.mapArea == mapArea) {
	                    //map.wayfinding("clearPoiPoint");
	                    //map.wayfinding("setPoiPoint", poi.mapArea);
	                    setPinWithClean(poi.mapArea);
	                    // locationCurr();
	                    showPoiDetail([poi]);
	                    $("#halfModalContent").find('[data-maction="locate-poi"]').first().trigger("click");
	                    // if(v.type == 6){
	                    //     showpropellingLinks(v);
	                    // }else{
	                    //     showHiddenLinks(v);
	                    // }
	                }
	            });
	        });

	        gTools.IS_SETTED_REC_STORES_HANDLER = true;
	    });
	}

	/**
	 * 设置寻宝
	 * @author sx
	 * @param {object} buildingInfo 场景信息
	 */
	function setXunBao(buildingInfo) {
	    if (buildingInfo.isOpenTreasure) {
	        console.log('开启寻宝');
	        $("body").append('<img id="xunbaoIcon" src="//oex38ct5y.qnssl.com/xunbaoicon4.png" style="position: absolute;top: 70px;left: 10px;z-index:1;width: 42px;height: 42px;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;-webkit-box-shadow: 3px 4px 8px darkgrey;box-shadow: 3px 4px 8px darkgrey;overflow: hidden;backface-visibility:hidden;transform-origin: 0px 0px 0px;touch-action:pan-y;-webkit-user-select: none;-webkit-user-drag: none;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">');

	        $(function () {
	            var transX = 0,
	                transY = 0,
	                $xunbaoMenu = $("#xunbaoIcon"),
	                xunbaoMenuPosition = $xunbaoMenu.position(),
	                x = xunbaoMenuPosition.left,
	                y = xunbaoMenuPosition.top,
	                screenW = window.screen.width,
	                screenH = window.screen.height;

	            var panStart = function (e) {
	                e.preventDefault();
	            };
	            var pan = function (e) {
	                transX = e.deltaX;
	                transY = e.deltaY;
	                $xunbaoMenu.css({
	                    "-webkit-transform": 'translate(' + transX + 'px,' + transY + 'px)',
	                    "transform": 'translate(' + transX + 'px,' + transY + 'px)'
	                });
	            };
	            var panEnd = function (e) {
	                x += transX;
	                y += transY;
	                if ((6 < x && (x + 60) < screenW) && (60 < y && (y + 120) < screenH)) {
	                    $xunbaoMenu.css({
	                        "left": x + "px",
	                        "top": y + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    //x = x;
	                    //y = y;
	                } else if (screenW <= (x + 60) && screenH <= (y + 120)) {
	                    $xunbaoMenu.css({
	                        "left": screenW - 56 + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = screenW - 56;
	                    if ($.os.ios) {
	                        y = screenH - 116;
	                    } else {
	                        y = screenH - 124;
	                    }
	                    $xunbaoMenu.css("top", y + "px");
	                } else if (x < 6 && y < 60) {
	                    $xunbaoMenu.css({
	                        "left": 6 + "px",
	                        "top": 60 + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = 6;
	                    y = 60;
	                } else if (x < 6 && (60 < y && (y + 120) < screenH)) {
	                    $xunbaoMenu.css({
	                        "left": 6 + "px",
	                        "top": y + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = 6;
	                    //y = y;
	                } else if (x < 6 && screenH <= (y + 120)) {
	                    $xunbaoMenu.css({
	                        "left": 6 + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = 6;
	                    if ($.os.ios) {
	                        y = screenH - 116;
	                    } else {
	                        y = screenH - 124;
	                    }
	                    $xunbaoMenu.css("top", y + "px");
	                } else if (y < 60 && (6 < x && (x + 60) < screenW)) {
	                    $xunbaoMenu.css({
	                        "left": x + "px",
	                        "top": 60 + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    //x = x;
	                    y = 60;
	                } else if (screenH <= (y + 120) && (6 < x && (x + 60) < screenW)) {
	                    $xunbaoMenu.css({
	                        "left": x + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    //x = x;
	                    if ($.os.ios) {
	                        y = screenH - 116;
	                    } else {
	                        y = screenH - 124;
	                    }
	                    $xunbaoMenu.css("top", y + "px");
	                } else if (screenW < (x + 60) && (60 < y && (y + 120) < screenH)) {
	                    $xunbaoMenu.css({
	                        "left": screenW - 56 + "px",
	                        "top": y + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = screenW - 56;
	                    //y = y;
	                } else if (screenW < (x + 60) && y < 60) {
	                    $xunbaoMenu.css({
	                        "left": screenW - 56 + "px",
	                        "top": 60 + "px",
	                        "-webkit-transform": 'translate(0px,0px)',
	                        "transform": 'translate(0px,0px)'
	                    });
	                    x = screenW - 56;
	                    y = 60;
	                }
	            };


	            var xunbao = new Hammer.Manager(document.getElementById('xunbaoIcon'));
	            xunbao.add(new Hammer.Tap({
	                event: 'tap'
	            }));
	            xunbao.add(new Hammer.Pan({
	                event: 'pan'
	            }));
	            xunbao.on("tap panstart pan panend", function (e) {
	                // 触发tap事件
	                if (e.type == 'tap') {
	                    window.location.href = buildingInfo.treasureUrl;
	                    return;
	                }

	                // 触发pan事件
	                if (e.type == 'panstart') {
	                    panStart(e);
	                } else if (e.type == 'pan') {
	                    pan(e);
	                } else {
	                    panEnd(e);
	                }
	            });
	        });
	    } else {
	        console.log('未开启寻宝');
	        $("#xunbaoIcon").remove();
	    }
	}

	/**
	 * 为太古里停车场场景设置快捷菜单: 1."记住车位"; 2."找车"; 3."缴费机"
	 * 说明: 2017年5月底上线,去除"记住车位"和"找车"两个快捷按钮,新增"线上缴费"按钮
	 * @author sx
	 */
	//function setShortcutMenuForTaikooLiParking_old() {
	//    if (!gTools.IS_TAIKOOLI_SCENE) {
	//        return;
	//    }
	//
	//    log.v('[setShortcutMenuForTaikooLiParking_old] Set shortcut menu for TaikooLi parking.');
	//    map.before(
	//        '<div id="ttm">\
	//            <div class="btns">\
	//                <a href="javascript:;" class="btn" data-naction="if-record-car">\
	//                    <img src="//oex38ct5y.qnssl.com/img/taiguli/parkIcon.png" >\
	//                </a>\
	//                <a href="javascript:;" class="btn" data-naction="search-car">\
	//                    <img src="//oex38ct5y.qnssl.com/img/taiguli/findIcon.png" >\
	//                </a>\
	//                <a href="javascript:;" class="btn" data-naction="findPay">\
	//                    <img src="//oex38ct5y.qnssl.com/img/taiguli/payIcon.png" >\
	//                </a>\
	//            </div>\
	//        </div>');
	//}

	/**
	 * 为太古里停车场场景设置快捷菜单: 1."在线缴费"; 2.'缴费机'
	 * @author weibin
	 */
	function setShortcutMenuForTaikooLiParking() {
	    if (!gTools.IS_TAIKOOLI_SCENE) {
	        return;
	    }

	    log.v('[setShortcutMenuForTaikooLiParking] Set shortcut menu for TaikooLi parking.');

	    // 在线停车缴费功能存在问题,不能获取太古里公众号的openid,所以先去除该功能
	    //map.before(
	    //    '<div id="ttm">\
	    //        <div class="btns">\
	    //            <a href="javascript:;" class="btn" data-naction="onlinePayment">\
	    //                <img src="//oex38ct5y.qnssl.com/img/taiguli/parking/onlinePayment2.png" >\
	    //            </a>\
	    //            <a href="javascript:;" class="btn" data-naction="findPay">\
	    //                <img src="//oex38ct5y.qnssl.com/img/taiguli/parking/payIcon2.png" >\
	    //            </a>\
	    //        </div>\
	    //    </div>');

	    map.before(
	        '<div id="ttm">\
	            <div class="btns">\
	                <a href="javascript:;" class="btn" data-naction="findPay">\
	                    <img src="//oex38ct5y.qnssl.com/img/taiguli/parking/payIcon2.png" >\
	                </a>\
	            </div>\
	        </div>');
	}

	/**
	 * 设置引导步骤的处理逻辑
	 * @author weibin
	 */
	function setGuideStepHandler() {
	    $(document).on("click", "#step", function (event) {
	        log.i('[document click on #step]');
	        event.preventDefault();
	        event.stopPropagation();

	        if (gTools.showingFloor == "F138" || gTools.showingFloor == "F70") {    // 太古里停车场的特殊处理
	            if ($("#step_1").is(":visible")) {
	                $("#step_1").css("display", "none");
	                $("#step_2").css("display", "block");
	                $(this).css("margin-top", "11rem");
	                $(".circles").removeClass("circle_0").addClass("circle_1");
	            } else if ($("#step_2").is(":visible")) {
	                $("#step_2").css("display", "none");
	                $("#step_3").css("display", "block");
	                $(this).css("margin-top", "15rem");
	                $(".circles").removeClass("circle_1").addClass("circle_2");
	            } else if ($("#step_3").is(":visible")) {
	                $("#step_3").css("display", "none");
	                $("#step_4").css("display", "block");
	                $(this).css("margin-top", "20rem");
	                $(".circles").removeClass("circle_2").addClass("circle_3");
	            } else {
	                $("#stepBox").remove();
	            }
	        } else {
	            if ($("#step0").is(":visible")) {
	                $("#step0").css("display", "none");
	                $("#step1").css("display", "block");
	                $(this).css("bottom", "40px");
	                $(".circles").removeClass("circle0").addClass("circle1");
	            } else if ($("#step1").is(":visible")) {
	                $("#step1").css("display", "none");
	                $("#step2").css("display", "block");
	                $(this).css("bottom", "70px");
	                $(".circles").removeClass("circle1").addClass("circle2");
	            } else {
	                $("#stepBox").remove();
	            }
	        }
	    });
	}

	/**
	 * 显示下拉菜单
	 * @author weibin
	 */
	function showDropdownMenu() {
	    // old menu
	    //$('#js_dropdown_menu_container').addClass("am-in");

	    // new menu
	    $('#js_dropdown_box').addClass("db");
	    gTools.IS_HID_DROPDOWN_MENU = false;
	}

	/**
	 * 隐藏下拉菜单
	 * @author weibin
	 */
	function hideDropdownMenu() {
	    if (gTools.IS_HID_DROPDOWN_MENU) {
	        return;
	    }

	    // old menu
	    //$('#js_dropdown_menu_container').removeClass("am-in");

	    // new menu
	    $('#js_dropdown_box').removeClass("db");
	    gTools.IS_HID_DROPDOWN_MENU = true;
	}

	/**
	 * 切换下拉菜单的显示/隐藏
	 * @author weibin
	 */
	function toggleDropdownMenuStatus() {
	    //$('#js_dropdown_menu_container').toggleClass("am-in");
	    gTools.IS_HID_DROPDOWN_MENU ? showDropdownMenu() : hideDropdownMenu();
	}

	/**
	 * 关闭半弹框
	 * @author weibin
	 */
	function closeHalfModal() {
	    map.wayfinding("clearPoiPoint");
	    if ($("#search").val()) {
	        $("#search").val("");
	    }
	    $("#halfModal").remove();
	}

	/**
	 * 清除定位图钉
	 * @author weibin
	 */
	function clearLocPin() {
	    map.wayfinding("clearPoiPoint");
	}

	/**
	 * 显示反馈二级选项对话框
	 * @author weibin
	 * @param {number} type 反馈问题的一级编号
	 */
	function showFeedbackSecondOptionDialog(type) {
	    $(".post_main").remove();   // 隐藏一级分类对话框

	    // 显示二级分类对话框
	    switch (type) {
	        case 0: // 定位错误
	            gTools.locate_error();
	            break;
	        case 1: // 路径不合理
	            gTools.route_error();
	            break;
	        case 2: // 店铺错误
	            gTools.store_error();
	            break;
	        case 3: // 其他错误
	            gTools.other_error();
	            break;
	        default:
	            log.w('未匹配到要反馈的问题所属一级分类');
	    }
	}

	/**
	 * 关闭反馈二级选项对话框
	 * @author weibin
	 */
	function closeFeedbackSecondOptionDialog() {
	    $(".post_loc_error").remove();
	}

	/**
	 * 是否选择了反馈问题分类
	 * @author weibin
	 * @param {string} optId 分类选项元素id
	 * @returns {boolean} true: 选择了该分类; false: 未选择该分类
	 */
	function isSelectedFeedbackErrOpt(optId) {
	    return $('#' + optId).hasClass('changeBg');
	}

	/**
	 * 设置反馈的内容,错误分类可多选
	 * @author weibin
	 * @param {number} type 一级分类编号
	 * @param {string} opt1Id 二级分类标识元素id
	 * @param {string} opt2Id 二级分类标识元素id
	 * @param {string} opt3Id 二级分类标识元素id
	 * @return {string} fb 反馈内容
	 */
	function setFeedbackContent(type, opt1Id, opt2Id, opt3Id) {
	    var fb = '', desc, opt1, opt2, opt3;

	    opt1 = isSelectedFeedbackErrOpt(opt1Id);
	    opt2 = isSelectedFeedbackErrOpt(opt2Id);
	    opt3 = isSelectedFeedbackErrOpt(opt3Id);

	    if (!(opt1 || opt2 || opt3)) {
	        gTools.alert('至少要勾选一个问题分类！');
	        return 'no err type';
	    }

	    // 设置问题分类
	    switch (type) {
	        case 0: // 定位错误
	            opt1 && (fb += '定位失败;');
	            opt2 && (fb += '定位不准;');
	            break;
	        case 1: // 路径不合理
	            opt1 && (fb += '路径错误;');
	            opt2 && (fb += '绕路;');
	            break;
	        case 2: // 店铺错误
	            opt1 && (fb += '名称错误;');
	            opt2 && (fb += '品牌更换;');
	            break;
	        default:
	            log.w('未匹配到要反馈的问题所属一级分类');
	    }

	    opt3 && (fb += '其他;');

	    // 设置问题描素
	    desc = $('.post_loc_error').find('.icons_container').find('.detail_des').val();
	    desc && (fb += desc + ';');

	    return fb;
	}

	/**
	 * 上报反馈内容: 如果不存在反馈信息,则不进行上报;反之进行上报
	 * @author weibin
	 * @param {string} data 要上报的内容
	 */
	function reportFeedback(data) {
	    var tel;

	    if (!data) {
	        gTools.alert('请先填写问题描述！');
	        return;
	    }
	    if (data === 'no err type') {
	        return;
	    }

	    tel = $('.post_loc_error').find('.icons_container').find('.phoneNumber').val();
	    tel && (data += tel);

	    log.v('[Report Feedback]', data);

	    // 执行上报操作
	    report.feedback(data)
	        .done(function () {
	            $(".post_loc_error").remove();  // 关闭反馈页面
	            gTools.success_tips();
	        })
	        .fail(function () {
	            gTools.alert('抱歉~提交失败，请尝试重新提交！');
	        });
	}


	/**
	 * 上报click事件: 统计如推荐店铺/预付卡店铺/会员优惠/在线缴费等菜单的点击量
	 * @author weibin
	 * @param {number} code 动作事件的code值
	 * @param {function} [callback] 上报完成后的处理函数
	 */
	function reportClickEvent(code, callback) {
	    var actionName;

	    switch (code) {
	        case STAT.ACT_CODE.CLICK_MENU.REC_STORES_RECOMMEND:
	            actionName = STAT.ACTION.REC_STORES_RECOMMEND;
	            break;
	        case STAT.ACT_CODE.CLICK_MENU.REC_STORES_PRE_PAY:
	            actionName = STAT.ACTION.REC_STORES_PRE_PAY;
	            break;
	        case STAT.ACT_CODE.CLICK_MENU.REC_STORES_VIP_DISCOUNT:
	            actionName = STAT.ACTION.REC_STORES_VIP_DISCOUNT;
	            break;
	        case STAT.ACT_CODE.CLICK_MENU.ONLINE_PAYMENT:
	            actionName = STAT.ACTION.ONLINE_PAYMENT;
	            break;
	        default:
	            actionName = '未知菜单类型';
	            log.w('未匹配到菜单的类型');
	    }

	    // 百度统计
	    bdStat.trackEvent(actionName);
	    // 后台统计
	    report.saveClick(code, +gTools.showingFloor.substr(1)).always(function () {
	        callback && callback();
	    });
	    log.v('上报点击菜单操作');
	}


	/**
	 * 设置导航点
	 * @author weibin
	 * @param {string}  floor       必传,楼层编号,如F140
	 * @param {string}  mapArea     必传,poi的地图编号,如L1-32
	 * @param {boolean} [useCurrentLoc]     可选,是否使用当前位置作为导航点的标志位,一般情况下是将当前位置设为导航起点
	 * @returns {object}            返回点位信息(简化后的poi信息)
	 */
	function setNavPoint(floor, mapArea, useCurrentLoc) {
	    // 可能获取不到poi信息,因为有的公共设施未添加poi
	    var poi = gTools.getSomeOneFloorPoiInfoByMapArea(floor, mapArea);

	    if (!(poi && poi.id)) {
	        console.warn('获取导航点位失败, floor:', floor, 'mapArea:', mapArea, 'useCurrentLoc:', useCurrentLoc);
	        return null;
	    }

	    return {
	        x: poi.x || 0,
	        y: poi.y || 0,
	        poiId: poi.id || 0,
	        mapArea: poi.mapArea || '',
	        brand: useCurrentLoc ? '当前位置' : poi.brand
	    };
	}

	/**
	 * 获取导航起点
	 * @author weibin
	 * @returns {*}
	 */
	function getNavStartPoint() {
	    return (gTools.IS_CONTAIN_LIGHT_NAV ? gTools.startPoint : newNavigateOpt.startPoint) || null;
	}

	/**
	 * 设置导航起点: 融合轻导航前,起点的信息是存储在newNavigateOpt.startPoint字段中; 融合轻导航后,起点的信息是存储在gTools.startPoint字段中
	 * @author weibin
	 * @param {string}  floor       必传,楼层编号,如F140
	 * @param {string}  mapArea     必传,poi的地图编号,如L1-32
	 */
	function setNavStartPoint(floor, mapArea) {
	    if (gTools.IS_CONTAIN_LIGHT_NAV) {
	        return gTools.startPoint = setNavPoint(floor, mapArea);
	    } else {
	        return newNavigateOpt.startPoint = setNavPoint(floor, mapArea);
	    }
	}

	// 清空导航起点
	function clearNavStartPoint() {
	    if (gTools.IS_CONTAIN_LIGHT_NAV) {
	        gTools.startPoint = null;
	    } else {
	        newNavigateOpt.startPoint = null;
	    }
	}

	// 判断是否定位成功
	function isLocated() {
	    return window.X !== 0 && window.Y !== 0;
	}

	// 获取当前位置作为导航起点
	function getCurrentLocAsNavStartPoint(x, y, floor) {
	    return isLocated() ? setNavPoint(floor, getNear(x, y, floor), true) : null;
	}

	// 设置当前位置作为导航起点
	function setCurrentLocAsNavStartPoint() {
	    // 定位未成功或不能获取当前位置附近的poi处理
	    if (!getCurrentLocAsNavStartPoint(window.X, window.Y, gTools.floorid)) {
	        setTimeout(function () {
	            weui.alert('未能获取您当前的位置，请手动选择起点！');
	        }, 500);

	        return;
	    }

	    // 定位成功处理
	    // 设置导航起点名称为"当前位置"
	    document.getElementById('js_nav_start_point_name').innerHTML = '当前位置';
	    // 清空导航起点
	    clearNavStartPoint();
	}

	// 自动设置导航起点
	function autoGetNavStartPoint() {
	    return getNavStartPoint() || getCurrentLocAsNavStartPoint(window.X, window.Y, gTools.floorid);
	}

	/**
	 * 获取导航终点
	 * @author weibin
	 * @returns {*}
	 */
	function getNavEndPoint() {
	    return gTools.destination || null;
	}

	/**
	 * 设置导航终点: 终点的信息存储在gTools.destination字段中
	 * @author weibin
	 * @param {string}  floor       必传,楼层编号,如F140
	 * @param {string}  mapArea     必传,poi的地图编号,如L1-32
	 */
	function setNavEndPoint(floor, mapArea) {
	    return gTools.destination = setNavPoint(floor, mapArea);
	}

	/**
	 * 导航从这里出发
	 * @author weibin
	 * @param {string}  floor       必传,楼层编号,如F140
	 * @param {string}  mapArea     必传,poi的地图编号,如L1-32
	 */
	function fromHere(floor, mapArea) {
	    // 设置起点
	    setNavStartPoint(floor, mapArea);
	    // 显示导航弹框
	    gTools.showNavHalfModal(autoGetNavStartPoint(), getNavEndPoint());
	}

	/**
	 * 导航到这里去. 设置终点的时候可能会指定其他楼层的poi为终点,此时其他楼层的poi列表可能还未被缓存,这个时候需要先获取对应楼层的poi列表之后,再进行设置终点的操作
	 * @author weibin
	 * @param {string}  floor       必传,楼层编号,如F140
	 * @param {string}  mapArea     必传,poi的地图编号,如L1-32
	 */
	function toHere(floor, mapArea) {
	    // 判断时候已缓存了该楼层的poi列表.如果已经缓存了,则直接进行设置终点操作; 否则,先获取该楼层的poi列表,再进行设置终点的操作
	    if (!gTools.isCachedFloorPoiList(floor)) {
	        gTools.showLoading();

	        // 获取指定楼层的poi列表
	        getPoi(floor, true, function () {
	            gTools.hideLoading();
	            // 获取楼层poi列表成功后,再次调用toHere()方法来设置终点
	            toHere(floor, mapArea);
	        });

	        return;
	    }

	    // 设置终点
	    setNavEndPoint(floor, mapArea);
	    // 显示导航弹框
	    gTools.showNavHalfModal(autoGetNavStartPoint(), getNavEndPoint());
	}

	// 切换起点
	function switchNavStartPoint() {
	    weui.confirm('要使用当前位置作为起点吗？', function () {
	        log.v('Yes...');

	        // 设置当前位置作为导航起点
	        setCurrentLocAsNavStartPoint();
	    });
	}

	/**
	 * 设置导航操作时需要上报的数据
	 * @author weibin
	 * @param {object}  startPoint  导航的起点
	 * @param {object}  endPoint    导航的终点
	 * @returns {*} 返回导航操作时需要上报的数据
	 */
	function setNavigateOperateReportData(startPoint, endPoint) {
	    startPoint = startPoint || newNavigateOpt.startPoint || {};
	    endPoint = endPoint || gTools.destination || {};

	    return {
	        startX: startPoint.x || 0,
	        startY: startPoint.y || 0,
	        startPoiId: startPoint.poiId || 0,
	        endX: X || endPoint.x || 0,
	        endY: Y || endPoint.y || 0,
	        endPoiId: endPoint.poiId || 0,
	        //action: newNavigateOpt.source,
	        brand: endPoint.brand || ''
	    };
	}

	/**
	 * 上报开始导航
	 * @author weibin
	 * @param {object}  [startPoint]    可选,导航的起点
	 * @param {object}  [endPoint]      可选,导航的终点
	 */
	function reportStartNavigate (startPoint, endPoint) {
	    startPoint = startPoint || newNavigateOpt.startPoint || gTools.startPoint;
	    endPoint = endPoint || gTools.destination;

	    // 设置上报数据
	    report.data = setNavigateOperateReportData(startPoint, endPoint);
	    // 上报-开始导航
	    report.startNavigate(report.data);
	    // 百度统计-开始导航
	    bdStat.trackEvent(STAT.ACTION.NAV_START, {navStart: report.data});
	}

	/**
	 * 上报取消导航
	 * @author weibin
	 * @param {object}  [startPoint]    可选,导航的起点
	 * @param {object}  [endPoint]      可选,导航的终点
	 */
	function reportCancelNavigate(startPoint, endPoint) {
	    startPoint = startPoint || newNavigateOpt.startPoint || gTools.startPoint;
	    endPoint = endPoint || gTools.destination;

	    // 设置上报数据
	    report.data = setNavigateOperateReportData(startPoint, endPoint);
	    // 上报-取消导航
	    report.stopNavigate(report.data);
	    // 百度统计-取消导航
	    bdStat.trackEvent(STAT.ACTION.NAV_STOP, {navCancel: report.data});
	}

	/**
	 * 上报停止导航
	 * @author weibin
	 * @param {object}  [startPoint]    可选,导航的起点
	 * @param {object}  [endPoint]      可选,导航的终点
	 */
	function reportStopNavigate(startPoint, endPoint) {
	    startPoint = startPoint || newNavigateOpt.startPoint || gTools.startPoint;
	    endPoint = endPoint || gTools.destination;

	    // 设置上报数据
	    report.data = setNavigateOperateReportData(startPoint, endPoint);
	    // 上报-停止导航
	    report.stopNavigate(report.data);
	    // 百度统计-停止导航
	    bdStat.trackEvent(STAT.ACTION.NAV_STOP, {navStop: report.data});
	}



	/**
	 * 设置自定义菜单的action
	 * @author weibin
	 * @param {string} name action的(中文)名称
	 * @returns {string} action指令名称
	 */
	function setCustomizeDropdownMenuAction(name) {

	    // Begin 广州飞乐灯展特殊处理
	    if (gTools.IS_FEILE_SCENE) {
	        return 'showInfrastructureRelativePosition'
	    }
	    // End 广州飞乐灯展特殊处理

	    switch (name) {
	        /** Begin 走系统自带的公共设施等菜单处理逻辑 */
	        case '出口':
	            return 'findExit';
	        // Begin 洗手间/卫生间/厕所
	        case '洗手间':
	            return 'findBathroom';
	        case '卫生间':
	            return 'findBathroom';
	        case  '厕所':
	            return 'findBathroom';
	        // End 洗手间/卫生间/厕所
	        // Begin 分享位置/分享
	        case '分享位置':
	            return 'share';
	        case '分享':
	            return 'share';
	        // End 分享位置/分享
	        /** End 走系统自带的公共设施等菜单处理逻辑 */
	        default:
	            return 'findLabelsById';     // 走自定义的菜单的处理逻辑
	    }
	}




	// Begin sign module.
	/**
	 * 判断是否显示签到弹框: 5分钟内不重复显示同一签到点的签到弹框
	 * @author weibin
	 * @param {number} signPointId 签到点的id
	 * @returns {boolean}
	 */
	function isShowSignDialog(signPointId) {
	    var curTimestamp = parseInt(Date.now() / 1000);

	    // 当前签到点在忽略列表内
	    for (var id in globalIgnoredSignPoints) {
	        // 不匹配, 虽然初始化的时候用数字作为key,但是会被转化成字符串
	        if (id != signPointId) {
	            //log.v('[isShowSignDialog] Not equal id', id, 'signPointId', signPointId);
	            continue;
	        }

	        // 5分钟 = 300秒, 超过300秒再次显示签到弹框
	        if ((curTimestamp - globalIgnoredSignPoints[id]) > 300) {
	            //log.v('[isShowSignDialog] Will show, because arrived time, id', id, 'signPointId', signPointId);
	            return true;
	        }

	        // 5分钟内不重复显示签到弹框
	        //log.v('[isShowSignDialog] Not show , beacuse not arrived time, id', id, 'signPointId', signPointId);
	        return false;
	    }

	    // 当前签到点不在忽略列表内
	    //log.v('[isShowSignDialog] Will show, because not in ignoredSignPointList signPointId', signPointId);
	    return true;
	}

	/**
	 * 判断是否靠近某个签到点
	 * @author weibin
	 * @param {array} pointArr 某个楼层的签到点位数组
	 */
	function judgeIsNearSignPoint(pointArr) {
	    if (globalSignedPointIds.length === globalSignPointCnt) {
	        //log.i('[judgeIsNearSignPoint] 已经完成所有点位的签到了');
	        return;
	    }

	    if (!(gTools.ifJudgeIfNearChest && pointArr && pointArr.length)) {
	        //log.i('[judgeIsNearSignPoint] Not judge, because ifJudgeIfNearChest', gTools.ifJudgeIfNearChest, 'pointArr is exist', !!pointArr);
	        return;
	    }

	    var point;
	    for (var i = 0, len = pointArr.length; i < len; i++) {
	        point = pointArr[i];

	        if ($.inArray(point.id, globalSignedPointIds) > -1) {
	            //log.i('[judgeIsNearSignPoint] 点位', point.id, point.brand,'已经签到过了');
	            continue;
	        }

	        // 按道理isShowSignDialog()判断应该放在ifNearPoint()判断之后,这里颠倒顺序是为了减少计算
	        if (!isShowSignDialog(point.id)) {
	            //log.i('[judgeIsNearSignPoint] 点位', point.id, point.brand,'在忽略时间范围内,不重复显示');
	            continue;
	        }

	        if (!ifNearPoint(X, Y, {x: point.x, y: point.y}, globalNearbyRange)) {
	            //log.i('[judgeIsNearSignPoint] 不在', point.id, point.brand, '签到点位附近');
	            continue;
	        }

	        //log.i('[judgeIsNearSignPoint] 在', point.id, point.brand, '签到点位附近');
	        return showSignDialog(point);
	    }
	}

	/**
	 * 显示兑换礼品对话框
	 * @author weibin
	 */
	function showGiftExchangeDialog() {
	    var $giftExchangeDialogMask = $('#js_gift_exchange_dialog_mask'), $codeInput, $errTip;

	    // 已经存在,则直接显示礼品兑换对话框
	    if ($giftExchangeDialogMask.length) {
	        log.v('[showGiftExchangeDialog] already exist.');
	        $giftExchangeDialogMask.find('.gift-exchange-input-code').val('');     // 清空核销框
	        $giftExchangeDialogMask.find('#js_gift_exchange_code_err').addClass('dn'); // 隐藏错误提示
	        $giftExchangeDialogMask.show();
	        return;
	    }

	    log.v('[showGiftExchangeDialog] create new dialog.');
	    // 不存在,则新建一个礼品兑换对话框
	    $giftExchangeDialogMask = $(
	        '<div class="gift-exchange-dialog-mask" id="js_gift_exchange_dialog_mask">' +
	            '<div class="am-modal am-modal-alert gift-exchange-dialog" tabindex="-1" id="js_gift_exchange_dialog">' +
	                '<div class="am-modal-dialog">' +
	                    '<div class="am-modal-hd">礼品兑换</div>' +
	                    '<div class="am-modal-bd">' +
	                        '<input class="gift-exchange-input-code" type="number" maxlength="6" placeholder="请输入6位核销码">' +
	                        '<p class="gift-exchange-tip err dn" id="js_gift_exchange_code_err"></p>' +
	                        '<p class="gift-exchange-tip">请前往兑奖点，由工作人员核销后发放礼品！</p>' +
	                    '</div>' +
	                    '<div class="am-modal-footer"><span class="am-modal-btn-2 cancel" id="js_gift_exchange_cancel">取消</span><span class="am-modal-btn-2 sure" id="js_gift_exchange_sure">确定</span></div>' +
	                '</div>' +
	            '</div>' +
	        '</div>');

	    $("#body").append($giftExchangeDialogMask);
	    //$giftExchangeDialogMask.modal();    // 首次显示礼品兑换对话框

	    // 设置核销码输入框事件
	    $codeInput = $giftExchangeDialogMask.find('.gift-exchange-input-code'), $errTip = $giftExchangeDialogMask.find('#js_gift_exchange_code_err');

	    $codeInput
	        .on('focus', function () {
	            $codeInput.val('');     // 清空输入框
	            $errTip.addClass('dn');
	            log.v('[showGiftExchangeDialog] focus in...');
	        });

	    // 取消核销事件
	    new Hammer(document.getElementById('js_gift_exchange_cancel')).on('tap', function () {
	        log.v('取消核销');

	        $giftExchangeDialogMask.hide();
	    });

	    // 确认核销事件
	    new Hammer(document.getElementById('js_gift_exchange_sure')).on('tap', function () {
	        log.v('确认核销');

	        var code = $codeInput.val();
	        log.v('Input code is', code);
	        // 核销失败
	        if (!code) {    // 未输入核销码
	            $errTip.text('请先输入核销码！').removeClass('dn');   // 显示错误提示
	            return;
	        }
	        if (code !== GLOBAL_FEILE_GIFT_EXCHANGE_CODE) { // 核销码错误
	            $errTip.text('验证码错误，请重新输入！').removeClass('dn');   // 显示错误提示
	            return;
	        }

	        // 核销成功
	        $giftExchangeDialogMask.remove();
	        localStorage.isExchangedGift = 1;   // 本地缓存设置礼品兑换成功标志位
	        gTools.toast('恭喜您兑换成功！');

	        // 百度统计-上报"兑换奖品"事件
	        bdStat.trackEvent(STAT.ACTION.GIFT_EXCHANGE_SUCC);
	    });
	}

	/**
	 * 显示签到活动规则
	 * @author weibin
	 */
	function showSignActivityRules() {
	    var rules =
	        '<h3>签到领礼品活动规则： </h3>' +
	        '<p class="sign-activity-rule">灯具牵手室内定位会撞出怎样的火花？邀您参与“签到领奖”任务，共同体验室内定位导航功能，发掘新的照明商业模式。 </p>' +
	        '<p class="sign-activity-rule"><span class="step">第一步：</span>点选某个签到展区，点击“带我去”进行路线规划，导航到达该展区位置后，完成参观并点击弹出的“签到”按钮进行签到；</p>' +
	        '<p class="sign-activity-rule"><span class="step">第二步：</span>完成地图中所有展示区签到任务，方可进行兑奖；</p>' +
	        '<p class="sign-activity-rule"><span class="step">第三步：</span>完成所有签到后，可凭签到结果至飞乐音响展台接待处领取礼品。</p>' +
	        '<p class="sign-activity-rule comment">*飞乐展区设置以下5大展示体验专区：智能路灯网展示区、智慧园区展示区、光通信视频体验区、喜万年产品展示区、亚牌智能产品展区。</p>';

	    gTools.halfModal(rules, {class: "showPoi flag sign-activity-rules"});
	}


	function showInfrastructureRelativePosition(category) {
	    category = category || '';
	    var link;

	    if (category.includes('洗手间') || category.includes('卫生间') || category.includes('厕所')) {
	        link = 'bathroom';
	    } else if (category.includes('服务')) {   // 匹配"服务台"或"服务中心"等
	        link = 'service';
	    } else if (category.includes('小卖部')) {
	        link = 'canteen';
	    } else if (category.includes('电梯') || category.includes('直梯')) {
	        link = 'elevator';
	    } else if (category.includes('出口')) {
	        link = 'exit';
	    } else {
	        log.w('未能识别基础设施的分类');
	    }

	    link = link ? '//oex38ct5y.qnssl.com/img/feile/relative_position_' + link + '.jpeg' : gTools.setImgLink();

	    // 展示相对位置的图片
	    gTools.halfModal('<img src="' + link + '">', {class: "showPoi flag infrastructure-relative-position"});
	}

	/**
	 * 初始化签到功能相关的菜单按钮
	 * @author weibin
	 */
	function initSignMenus() {
	    // 显示签到按钮相关的菜单
	    $('#js_btn_gift_exchange').addClass('db');
	    $('#js_btn_game_rules').addClass('db');
	    // 显示右上角容器
	    $('#js_right_top_box').addClass('db');

	    // 注册"礼品兑换"按钮事件
	    new Hammer(document.getElementById('js_btn_gift_exchange')).on('tap', function () {
	        // 百度统计-"兑换礼品"按钮的点击量
	        bdStat.trackEvent(STAT.ACTION.GIFT_EXCHANGE);

	        if (globalSignedPointIds.length !== globalSignPointCnt) {
	            //gTools.alert('请先完成所有点位的签到，再来领奖！');
	            gTools.toast('请先完成所有点位的签到，再来领奖！');
	            log.v('尚未完成所有点位的签到');
	            return;
	        }

	        log.v('完成了所有点位的签到');
	        localStorage.hasOwnProperty('isExchangedGift') ? gTools.toast('您已兑换过奖品，感谢您的参与！') : showGiftExchangeDialog();
	    });

	    // 注册"活动规则"按钮事件
	    new Hammer(document.getElementById('js_btn_game_rules')).on('tap', function () {
	        if ($('#halfModal.sign-activity-rules').length) {
	            log.v('已经显示了签到活动规则,不在重复显示');
	            return;
	        }

	        // 百度统计-"活动规则"按钮的点击量
	        bdStat.trackEvent(STAT.ACTION.GAME_RULES);

	        // 显示活动规则
	        log.v('显示了签到活动规则,不在重复显示');
	        return showSignActivityRules();
	    });
	}

	/**
	 * 显示签到点位
	 * @author weibin
	 * @param {object} signFloors 签到点位按楼层分组后组成的对象
	 */
	function showSignPoints(signFloors) {
	    if (!signFloors || $.isEmptyObject(signFloors)) {
	        log.w('[showSignPoints] 未配置签到点位');
	        return;
	    }

	    log.w('[showSignPoints] 配置了签到点位');

	    initSignMenus();    // 初始化签到菜单

	    var map, signPointsGroup, points, point, iconLink, i, len;
	    for (var floor in signFloors) { // 遍历楼层
	        map = file.select('#' + floor).select('#jz');

	        signPointsGroup = map.select('#SignPoints');
	        if (!signPointsGroup) {     // 如果地图中不存在签到点位图层,则新建一个签到点位分组,并把该分组移到平移区域分组下面去
	            signPointsGroup = map.paper.g().attr('id', 'SignPoints');
	            map.select('#transArea').append(signPointsGroup);   // 将签到点位分组移到#transArea分组下面去
	        }

	        points = signFloors[floor];

	        for (i = 0, len = points.length; i < len; i++) {    // 遍历每个楼层的点位
	            point = points[i];

	            iconLink = $.inArray(point.id, globalSignedPointIds) > -1 ? '//oex38ct5y.qnssl.com/img/feile/signPointFinished.png' : '//oex38ct5y.qnssl.com/img/feile/signPointUnfinished.png';

	            signPointsGroup.image(iconLink, point.x, point.y, point.width, point.height)
	                .attr({
	                    id: "link" + point.id,
	                    class: "link",
	                    fill: "#f00",
	                    stroke: "#000",
	                    strokeWidth: 2,
	                    "fill-opacity": 0.5,
	                    //"url": point.url,
	                    "position": "relative",
	                    target: "#link_gucci" + point.id
	                });
	        }
	    }
	}

	/**
	 * 显示签到对话框
	 * @author weibin
	 * @param {object} obj 签到点位信息对象
	 */
	function showSignDialog (obj) {
	    gTools.ifJudgeIfNearChest = false;      // 设置行走过程中是否判断附近有东西为false,即行走过程中不判断
	    var url = "http://oex38ct5y.qnssl.com/img/asd1.png";    // 隐藏广告背景图(招财猫)

	    var img = new Image();
	    img.src = url;
	    img.onload = function () {
	        var tpl =
	            '<div id="hideAds">' +
	                '<div class="am-text-center" style="position: absolute;top: 50%;margin-top: -180px;">' +
	                    '<a href="javascript:;" id="closeHideAds" class="closeHideAds1"></a>' +
	                    '<img src="' + url + '" style="width: 90%; z-index:2000">' +
	                    '<div class="am-text-center" style="position: absolute; width: 100%; bottom: 15px;">' +
	                        '<span style="font-size: 20px; color: #ec4201; display: block; height: 2em; width: 56%; margin: 0 auto; overflow: hidden;">' + obj.brand + ' </span>' +
	                        '<a id="js_sure_hide_ad" href="javascript:;" data-url="' + obj.url + '" data-type="' + obj.type + '" style="display: block;"><span class="btn-sure">签到</span></a>' +
	                    '</div>' +
	                '</div>' +
	            '</div>';

	        $("body").find("#hideAds").remove().end().append(tpl);
	        var hideAds = $("#hideAds");
	        //hideAds.find("span").height((hideAds.find("img").height() / 2 - 15 - 28) / 1.6);
	        // 关闭签到对话框
	        hideAds.find("#closeHideAds").click(function () {
	            globalIgnoredSignPoints[obj.id] = parseInt(Date.now() / 1000);

	            $("body").find("#hideAds").remove();
	            gTools.ifJudgeIfNearChest = true;

	            // 百度统计-上报签到成功
	            bdStat.trackEvent(obj.brand + '放弃签到');
	        });

	        // 确认签到
	        hideAds.find('#js_sure_hide_ad').click(function () {
	            globalSignedPointIds.push(obj.id);
	            $("body").find("#hideAds").remove();
	            gTools.toast('恭喜您签到成功！');
	            $('#' + obj.floorId).find('#SignPoints').find('#link' + obj.id).attr('href', '//oex38ct5y.qnssl.com/img/feile/signPointFinished.png');     // 更新签到点位的图标为签到成功的样式
	            localStorage.signedPointIds = JSON.stringify(globalSignedPointIds);     // 每次都需要缓存到本地,以保证数据同步
	            gTools.ifJudgeIfNearChest = true;

	            // 百度统计-上报签到成功
	            bdStat.trackEvent(obj.brand + '签到成功');

	            // 上报签到成功
	            report.saveLink(obj.id, gTools.floorid);
	        });
	    };
	}
	// End sign module.
	/** End append by weibin for TaikooLi. */

/***/ },
/* 2 */
/***/ function(module, exports) {

	//不要修改
	// 定位算法部分……其实可以优化的
	// 其实我已经优化了（大致就是200ms到20ms），但是其他地方也要改，在某个死掉的小demo里有用，这个我懒的改= =

	function Algorithm() {
	    this.position = {};
	    this.floorbeacons = {};
	}

	Algorithm.prototype.clearRssiChain = function (beaconList) {
	    for (var i = 0, len = beaconList.size(); i < len; i++) {
	        beaconList.get(i).rssiChain.length = 0;
	    }
	};

	Algorithm.prototype.getPosition = function (oldX, oldY, beaconList, beaconsFromWx) {
	    var hasData, des_number, beacon, beaconFromWx, position = this.position, rssiChain;
	    
	    for (var i = 0, len = beaconList.size(); i < len; i++) {
	        hasData = 0;
	        des_number = 0;
	        beacon = beaconList.get(i);
	        rssiChain = beacon.rssiChain;
	        
	        if (rssiChain.length == 5) {
	            rssiChain.shift();
	        }

	        for (var y = 0, len2 = beaconsFromWx.length; y < len2; y++) {
	            beaconFromWx = beaconsFromWx[y];
	            if (beacon.getMajor() == beaconFromWx.major && beacon.getMinor() == beaconFromWx.minor) {
	                des_number = y;
	                hasData = 1;
	                break;
	            }
	        }
	        
	        if (hasData == 1) {
	            rssiChain.push(Number(beaconsFromWx[des_number].rssi));
	            beacon.measuredPower = -59;
	        } else {
	            rssiChain.push(0);
	        }
	    }

	    var tmpX = 0,tmpY = 0, tmpD = 0, dist, distPow2;
	    for (var k = 0, len3 = beaconList.size(); k < len3; k++) {
	        beacon = beaconList.get(k);
	        //var ave = beacon.getaveRssi();
	        dist = beacon.getdistance();
	        distPow2 = dist * dist;

	        if (dist != 0 && beacon.geteffcount() >= 3) {
	            tmpX = tmpX + beacon.getX() / distPow2;
	            tmpY = tmpY + beacon.getY() / distPow2;
	            tmpD = tmpD + 1 / distPow2;
	        }
	    }

	    if (tmpD != 0) {
	        tmpX = tmpX / tmpD;
	        tmpY = tmpY / tmpD;
	        position.X = tmpX;
	        position.Y = tmpY;
	        return position;
	    }
	    else {
	        position.X = oldX;
	        position.Y = oldY;
	        return position;
	    }
	};

	Algorithm.prototype.getPositionWithFilter = function (oldX, oldY, oldFloor, beaconDataList, beaconsFromWx) {
	    var rssi = -100,
	        des_number = 0,
	        floorId,
	        floor_number = 0,
	        find_floor = 0,
	        beaconFromWx,
	        position = this.position,
	        rssiChain;
	    
	    var y, len;
	    for (y = 0, len = beaconsFromWx.length; y < len; y++) {
	        beaconFromWx = beaconsFromWx[y];
	        if (beaconFromWx.rssi >= rssi) {
	            rssi = beaconFromWx.rssi;
	            des_number = y;
	        }
	    }
	    
	    var i, j, len2,len3, beaconArr, beacon;
	    for (i = 0, len2 = beaconDataList.size(); i < len2; i++) {
	        beaconArr = beaconDataList.get(i);
	        for (j = 0, len3 = beaconArr.length; j < len3; j++) {
	            beacon = beaconArr[j];
	            if (beacon.major == beaconsFromWx[des_number].major && beacon.minor == beaconsFromWx[des_number].minor) {
	                floorId = beacon.floorid;
	                floor_number = i;
	                find_floor = 1;
	                break;
	            }
	        }

	        if (find_floor == 1) {
	            break;
	        }
	    }
	    
	    var beaconList = beaconDataList.get(floor_number);
	    var len4, len5, hasData;
	    for (i = 0, len4 = beaconList.size(); i < len4; i++) {
	        hasData = 0;
	        des_number = 0;
	        beacon = beaconList.get(i);
	        rssiChain = beacon.rssiChain;
	        
	        if (rssiChain.length == 5) {
	            rssiChain.shift();
	        }

	        for (y = 0, len5 = beaconsFromWx.length; y < len5; y++) {
	            beaconFromWx = beaconsFromWx[y];
	            if (beacon.getMajor() == beaconFromWx.major && beacon.getMinor() == beaconFromWx.minor) {
	                des_number = y;
	                hasData = 1;
	                break;
	            }
	        }

	        if (hasData == 1) {
	            rssiChain.push(Number(beaconsFromWx[des_number].rssi));
	            beacon.measuredPower = -59;
	        } else {
	            rssiChain.push(0);
	        }
	    }

	    var tmpX = 0, tmpY = 0, tmpD = 0, k, len6, dist, distPow2;
	    for (k = 0, len6 = beaconList.size(); k < len6; k++) {
	        beacon = beaconList.get(k);
	        //var ave = beacon.getaveRssi();
	        dist = beacon.getdistance();
	        distPow2 = dist * dist;

	        if (dist != 0 && beacon.geteffcount() >= 3) {
	            tmpX = tmpX + beacon.getX() / distPow2;
	            tmpY = tmpY + beacon.getY() / distPow2;
	            tmpD = tmpD + 1 / distPow2;
	        }
	    }

	    if (tmpD != 0) {
	        tmpX = tmpX / tmpD;
	        tmpY = tmpY / tmpD;
	        position.X = tmpX;
	        position.Y = tmpY;
	        position.floorid = floorId;
	        return position;
	    }
	    else {
	        position.X = oldX;
	        position.Y = oldY;
	        position.floorid = oldFloor;
	        return position;
	    }
	};

	module.exports = Algorithm;

/***/ },
/* 3 */
/***/ function(module, exports) {

	//不要修改
	/*
	 * List 大小可变数组
	 *  author: 吴安国
	 * version: 1.0
	 */
	// 定位算法部分……其实可以优化的
	// 其实我已经优化了（大致就是200ms到20ms），但是其他地方也要改，在某个死掉的小demo里有用，这个我懒的改= =
	function Beacon() {
	    this.rssiChain = new Array();
	    this.aveRssi = 0;
	    this.distance = 0;
	    this.measuredPower = -59;
	    this.floorid = "F1";
	};


	Beacon.prototype.setMeasuredPower = function (object) {
	    this.measuredPower = object;
	};


	Beacon.prototype.getMeasuredPower = function () {
	    return this.measuredPower;
	};
	Beacon.prototype.setX = function (object) {
	    this.X = object;
	};

	Beacon.prototype.getX = function () {
	    return this.X;
	};

	Beacon.prototype.setY = function (object) {
	    this.Y = object;
	};

	Beacon.prototype.getY = function () {
	    return this.Y;
	};

	Beacon.prototype.setMajor = function (object) {
	    this.Major = object;
	};

	Beacon.prototype.getMajor = function () {
	    return this.Major;
	};

	Beacon.prototype.setFloorid = function (object) {
	    this.floorid = object;
	};

	Beacon.prototype.getFloorid = function () {
	    return this.floorid;
	};

	Beacon.prototype.setMinor = function (object) {
	    this.Minor = object;
	};

	Beacon.prototype.getMinor = function () {
	    return this.Minor;
	};

	Beacon.prototype.geteffcount = function () {
	    var effcount = 0;
	    for (var i = 0; i < this.rssiChain.length; i++) {

	        if (this.rssiChain[i] != 0) {
	            effcount++;
	        }
	    }
	    return effcount;
	};

	Beacon.prototype.getaveRssi = function () {
	    var num = 0;
	    var effcount = 0;
	    for (var i = 0; i < this.rssiChain.length; i++) {

	        if (this.rssiChain[i] != 0) {
	            num = num + this.rssiChain[i];
	            effcount++;
	        }
	    }
	    if (effcount != 0) {

	        this.aveRssi = num / effcount;
	    }
	    else {
	        this.aveRssi = 0;
	    }
	    return this.aveRssi;
	};

	Beacon.prototype.getdistance = function () {

	    var ratio = this.getaveRssi() / this.measuredPower;
	    var Correction = 0.96 + Math.pow(Math.abs(this.getaveRssi()), 3.0) % 10.0 / 150.0;
	    if (ratio < 1) {
	        this.distance = Math.pow(ratio, 9.98) * Correction;
	    }
	    else {

	        this.distance = 0.103 + 0.89978 * Math.pow(ratio, 9) * Correction;
	    }
	    return this.distance;

	};

	Beacon.prototype.getRSSIChain = function () {
	    return this.rssiChain;

	};


	module.exports = Beacon;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * List 大小可变数组
	 *  author: 吴安国
	 * version: 1.0
	 */
	function List() {
	    this.list = [];
	}

	/**
	 * 将指定的元素添加到此列表的尾部
	 * @param object 指定的元素
	 */
	List.prototype.add = function (object) {
	    this.list[this.list.length] = object;
	};

	/**
	 * 将List添加到此列表的尾部
	 * @param listObject 一个列表
	 */
	List.prototype.addAll = function (listObject) {
	    this.list = this.list.concat(listObject.list);
	};

	/**
	 * 返回此列表中指定位置上的元素
	 * @param index 指定位置
	 * @return 此位置的元素
	 */
	List.prototype.get = function (index) {
	    return this.list[index];
	};

	/**
	 * 移除此列表中指定位置上的元素
	 * @param index 指定位置
	 * @return 此位置的元素
	 */
	List.prototype.removeIndex = function (index) {
	    var object = this.list[index];
	    this.list.splice(index, 1);
	    return object;
	};

	/**
	 * 移除此列表中指定元素
	 * @param object 指定元素
	 * @return 此位置的元素
	 */
	List.prototype.remove = function (object) {
	    var i = 0;
	    for (; i < this.list.length; i++) {
	        if (this.list[i] === object) {
	            break;
	        }
	    }
	    if (i >= this.list.length) {
	        return null;
	    } else {
	        return this.removeIndex(i);
	    }
	};

	/**
	 * 移除此列表中的所有元素
	 */
	List.prototype.clear = function () {
	    this.list.splice(0, this.list.length);
	};

	/**
	 * 返回此列表中的元素数
	 * @return 元素数量
	 */
	List.prototype.size = function () {
	    return this.list.length;
	};

	/**
	 * 返回列表中指定的 start（包括）和 end（不包括）之间列表
	 * @param start 开始位置
	 * @param end   结束位置
	 * @return {Object} 新的列表
	 */
	List.prototype.subList = function (start, end) {
	    var list = new List();
	    list.list = this.list.slice(start, end);
	    return list;
	};

	/**
	 * 如果列表不包含元素，则返回 true
	 * @return {Boolean}
	 */
	List.prototype.isEmpty = function () {
	    return this.list.length == 0;
	};


	module.exports = List;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! jQuery v2.0.0 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
	//@ sourceMappingURL=jquery.min.map
	*/
	(function(e,undefined){var t,n,r=typeof undefined,i=e.location,o=e.document,s=o.documentElement,a=e.jQuery,u=e.$,l={},c=[],f="2.0.0",p=c.concat,h=c.push,d=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=f.trim,x=function(e,n){return new x.fn.init(e,n,t)},b=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^-ms-/,N=/-([\da-z])/gi,E=function(e,t){return t.toUpperCase()},S=function(){o.removeEventListener("DOMContentLoaded",S,!1),e.removeEventListener("load",S,!1),x.ready()};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,t,n){var r,i;if(!e)return this;if("string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:T.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof x?t[0]:t,x.merge(this,x.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:o,!0)),C.test(r[1])&&x.isPlainObject(t))for(r in t)x.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=o.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?n.ready(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return d.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},a=2),"object"==typeof s||x.isFunction(s)||(s={}),u===a&&(s=this,--a);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(x.isPlainObject(r)||(i=x.isArray(r)))?(i?(i=!1,o=n&&x.isArray(n)?n:[]):o=n&&x.isPlainObject(n)?n:{},s[t]=x.extend(l,o,r)):r!==undefined&&(s[t]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=a),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){(e===!0?--x.readyWait:x.isReady)||(x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(o,[x]),x.fn.trigger&&x(o).trigger("ready").off("ready")))},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if("object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=undefined}return(!t||t.getElementsByTagName("parsererror").length)&&x.error("Invalid XML: "+e),t},noop:function(){},globalEval:function(e){var t,n=eval;e=x.trim(e),e&&(1===e.indexOf("use strict")?(t=o.createElement("script"),t.text=e,o.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(k,"ms-").replace(N,E)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,s=j(e);if(n){if(s){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(s){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:function(e){return null==e?"":v.call(e)},makeArray:function(e,t){var n=t||[];return null!=e&&(j(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:g.call(t,e,n)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},grep:function(e,t,n){var r,i=[],o=0,s=e.length;for(n=!!n;s>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,s=j(e),a=[];if(s)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(a[a.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(a[a.length]=r);return p.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),x.isFunction(e)?(r=d.call(arguments,2),i=function(){return e.apply(t||this,r.concat(d.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):undefined},access:function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===x.type(n)){i=!0;for(a in n)x.access(e,t,a,n[a],!0,o,s)}else if(r!==undefined&&(i=!0,x.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(x(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},now:Date.now,swap:function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i}}),x.ready.promise=function(t){return n||(n=x.Deferred(),"complete"===o.readyState?setTimeout(x.ready):(o.addEventListener("DOMContentLoaded",S,!1),e.addEventListener("load",S,!1))),n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function j(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}t=x(o),function(e,undefined){var t,n,r,i,o,s,a,u,l,c,f,p,h,d,g,m,y="sizzle"+-new Date,v=e.document,b={},w=0,T=0,C=ot(),k=ot(),N=ot(),E=!1,S=function(){return 0},j=typeof undefined,D=1<<31,A=[],L=A.pop,q=A.push,H=A.push,O=A.slice,F=A.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",R="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=M.replace("w","w#"),$="\\["+R+"*("+M+")"+R+"*(?:([*^$|!~]?=)"+R+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+R+"*\\]",B=":("+M+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",I=RegExp("^"+R+"+|((?:^|[^\\\\])(?:\\\\.)*)"+R+"+$","g"),z=RegExp("^"+R+"*,"+R+"*"),_=RegExp("^"+R+"*([>+~]|"+R+")"+R+"*"),X=RegExp(R+"*[+~]"),U=RegExp("="+R+"*([^\\]'\"]*)"+R+"*\\]","g"),Y=RegExp(B),V=RegExp("^"+W+"$"),G={ID:RegExp("^#("+M+")"),CLASS:RegExp("^\\.("+M+")"),TAG:RegExp("^("+M.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+B),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+R+"*(even|odd|(([+-]|)(\\d*)n|)"+R+"*(?:([+-]|)"+R+"*(\\d+)|))"+R+"*\\)|)","i"),"boolean":RegExp("^(?:"+P+")$","i"),needsContext:RegExp("^"+R+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+R+"*((?:-\\d)?\\d*)"+R+"*\\)|)(?=[^-]|$)","i")},J=/^[^{]+\{\s*\[native \w/,Q=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,et=/'|\\/g,tt=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,nt=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{H.apply(A=O.call(v.childNodes),v.childNodes),A[v.childNodes.length].nodeType}catch(rt){H={apply:A.length?function(e,t){q.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function it(e){return J.test(e+"")}function ot(){var e,t=[];return e=function(n,i){return t.push(n+=" ")>r.cacheLength&&delete e[t.shift()],e[n]=i}}function st(e){return e[y]=!0,e}function at(e){var t=c.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ut(e,t,n,r){var i,o,s,a,u,f,d,g,x,w;if((t?t.ownerDocument||t:v)!==c&&l(t),t=t||c,n=n||[],!e||"string"!=typeof e)return n;if(1!==(a=t.nodeType)&&9!==a)return[];if(p&&!r){if(i=Q.exec(e))if(s=i[1]){if(9===a){if(o=t.getElementById(s),!o||!o.parentNode)return n;if(o.id===s)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(s))&&m(t,o)&&o.id===s)return n.push(o),n}else{if(i[2])return H.apply(n,t.getElementsByTagName(e)),n;if((s=i[3])&&b.getElementsByClassName&&t.getElementsByClassName)return H.apply(n,t.getElementsByClassName(s)),n}if(b.qsa&&(!h||!h.test(e))){if(g=d=y,x=t,w=9===a&&e,1===a&&"object"!==t.nodeName.toLowerCase()){f=gt(e),(d=t.getAttribute("id"))?g=d.replace(et,"\\$&"):t.setAttribute("id",g),g="[id='"+g+"'] ",u=f.length;while(u--)f[u]=g+mt(f[u]);x=X.test(e)&&t.parentNode||t,w=f.join(",")}if(w)try{return H.apply(n,x.querySelectorAll(w)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(I,"$1"),t,n,r)}o=ut.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},l=ut.setDocument=function(e){var t=e?e.ownerDocument||e:v;return t!==c&&9===t.nodeType&&t.documentElement?(c=t,f=t.documentElement,p=!o(t),b.getElementsByTagName=at(function(e){return e.appendChild(t.createComment("")),!e.getElementsByTagName("*").length}),b.attributes=at(function(e){return e.className="i",!e.getAttribute("className")}),b.getElementsByClassName=at(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),b.sortDetached=at(function(e){return 1&e.compareDocumentPosition(c.createElement("div"))}),b.getById=at(function(e){return f.appendChild(e).id=y,!t.getElementsByName||!t.getElementsByName(y).length}),b.getById?(r.find.ID=function(e,t){if(typeof t.getElementById!==j&&p){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},r.filter.ID=function(e){var t=e.replace(tt,nt);return function(e){return e.getAttribute("id")===t}}):(r.find.ID=function(e,t){if(typeof t.getElementById!==j&&p){var n=t.getElementById(e);return n?n.id===e||typeof n.getAttributeNode!==j&&n.getAttributeNode("id").value===e?[n]:undefined:[]}},r.filter.ID=function(e){var t=e.replace(tt,nt);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),r.find.TAG=b.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==j?t.getElementsByTagName(e):undefined}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=b.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==j&&p?t.getElementsByClassName(e):undefined},d=[],h=[],(b.qsa=it(t.querySelectorAll))&&(at(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||h.push("\\["+R+"*(?:value|"+P+")"),e.querySelectorAll(":checked").length||h.push(":checked")}),at(function(e){var t=c.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&h.push("[*^$]="+R+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||h.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),h.push(",.*:")})),(b.matchesSelector=it(g=f.webkitMatchesSelector||f.mozMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&at(function(e){b.disconnectedMatch=g.call(e,"div"),g.call(e,"[s!='']:x"),d.push("!=",B)}),h=h.length&&RegExp(h.join("|")),d=d.length&&RegExp(d.join("|")),m=it(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},S=f.compareDocumentPosition?function(e,n){if(e===n)return E=!0,0;var r=n.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(n);return r?1&r||!b.sortDetached&&n.compareDocumentPosition(e)===r?e===t||m(v,e)?-1:n===t||m(v,n)?1:u?F.call(u,e)-F.call(u,n):0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,n){var r,i=0,o=e.parentNode,s=n.parentNode,a=[e],l=[n];if(e===n)return E=!0,0;if(!o||!s)return e===t?-1:n===t?1:o?-1:s?1:u?F.call(u,e)-F.call(u,n):0;if(o===s)return lt(e,n);r=e;while(r=r.parentNode)a.unshift(r);r=n;while(r=r.parentNode)l.unshift(r);while(a[i]===l[i])i++;return i?lt(a[i],l[i]):a[i]===v?-1:l[i]===v?1:0},c):c},ut.matches=function(e,t){return ut(e,null,null,t)},ut.matchesSelector=function(e,t){if((e.ownerDocument||e)!==c&&l(e),t=t.replace(U,"='$1']"),!(!b.matchesSelector||!p||d&&d.test(t)||h&&h.test(t)))try{var n=g.call(e,t);if(n||b.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return ut(t,c,null,[e]).length>0},ut.contains=function(e,t){return(e.ownerDocument||e)!==c&&l(e),m(e,t)},ut.attr=function(e,t){(e.ownerDocument||e)!==c&&l(e);var n=r.attrHandle[t.toLowerCase()],i=n&&n(e,t,!p);return i===undefined?b.attributes||!p?e.getAttribute(t):(i=e.getAttributeNode(t))&&i.specified?i.value:null:i},ut.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},ut.uniqueSort=function(e){var t,n=[],r=0,i=0;if(E=!b.detectDuplicates,u=!b.sortStable&&e.slice(0),e.sort(S),E){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return e};function lt(e,t){var n=t&&e,r=n&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ct(e,t,n){var r;return n?undefined:(r=e.getAttributeNode(t))&&r.specified?r.value:e[t]===!0?t.toLowerCase():null}function ft(e,t,n){var r;return n?undefined:r=e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function pt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ht(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function dt(e){return st(function(t){return t=+t,st(function(n,r){var i,o=e([],n.length,t),s=o.length;while(s--)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}i=ut.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[r];r++)n+=i(t);return n},r=ut.selectors={cacheLength:50,createPseudo:st,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(tt,nt),e[3]=(e[4]||e[5]||"").replace(tt,nt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ut.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ut.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return G.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&Y.test(n)&&(t=gt(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(tt,nt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=RegExp("(^|"+R+")"+e+"("+R+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=ut.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,h,d,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,v=a&&t.nodeName.toLowerCase(),x=!u&&!a;if(m){if(o){while(g){f=t;while(f=f[g])if(a?f.nodeName.toLowerCase()===v:1===f.nodeType)return!1;d=g="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?m.firstChild:m.lastChild],s&&x){c=m[y]||(m[y]={}),l=c[e]||[],h=l[0]===w&&l[1],p=l[0]===w&&l[2],f=h&&m.childNodes[h];while(f=++h&&f&&f[g]||(p=h=0)||d.pop())if(1===f.nodeType&&++p&&f===t){c[e]=[w,h,p];break}}else if(x&&(l=(t[y]||(t[y]={}))[e])&&l[0]===w)p=l[1];else while(f=++h&&f&&f[g]||(p=h=0)||d.pop())if((a?f.nodeName.toLowerCase()===v:1===f.nodeType)&&++p&&(x&&((f[y]||(f[y]={}))[e]=[w,p]),f===t))break;return p-=i,p===r||0===p%r&&p/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||ut.error("unsupported pseudo: "+e);return i[y]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?st(function(e,n){var r,o=i(e,t),s=o.length;while(s--)r=F.call(e,o[s]),e[r]=!(n[r]=o[s])}):function(e){return i(e,0,n)}):i}},pseudos:{not:st(function(e){var t=[],n=[],r=s(e.replace(I,"$1"));return r[y]?st(function(e,t,n,i){var o,s=r(e,null,i,[]),a=e.length;while(a--)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:st(function(e){return function(t){return ut(e,t).length>0}}),contains:st(function(e){return function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:st(function(e){return V.test(e||"")||ut.error("unsupported lang: "+e),e=e.replace(tt,nt).toLowerCase(),function(t){var n;do if(n=p?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===c.activeElement&&(!c.hasFocus||c.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Z.test(e.nodeName)},input:function(e){return K.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:dt(function(){return[0]}),last:dt(function(e,t){return[t-1]}),eq:dt(function(e,t,n){return[0>n?n+t:n]}),even:dt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:dt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:dt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:dt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=pt(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=ht(t);function gt(e,t){var n,i,o,s,a,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);a=e,u=[],l=r.preFilter;while(a){(!n||(i=z.exec(a)))&&(i&&(a=a.slice(i[0].length)||a),u.push(o=[])),n=!1,(i=_.exec(a))&&(n=i.shift(),o.push({value:n,type:i[0].replace(I," ")}),a=a.slice(n.length));for(s in r.filter)!(i=G[s].exec(a))||l[s]&&!(i=l[s](i))||(n=i.shift(),o.push({value:n,type:s,matches:i}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ut.error(e):k(e,u).slice(0)}function mt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function yt(e,t,r){var i=t.dir,o=r&&"parentNode"===i,s=T++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,r,a){var u,l,c,f=w+" "+s;if(a){while(t=t[i])if((1===t.nodeType||o)&&e(t,r,a))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[y]||(t[y]={}),(l=c[i])&&l[0]===f){if((u=l[1])===!0||u===n)return u===!0}else if(l=c[i]=[f],l[1]=e(t,r,a)||n,l[1]===!0)return!0}}function vt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,s=[],a=0,u=e.length,l=null!=t;for(;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function bt(e,t,n,r,i,o){return r&&!r[y]&&(r=bt(r)),i&&!i[y]&&(i=bt(i,o)),st(function(o,s,a,u){var l,c,f,p=[],h=[],d=s.length,g=o||Ct(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:xt(g,p,e,a,u),y=n?i||(o?e:d||r)?[]:s:m;if(n&&n(m,y,a,u),r){l=xt(y,h),r(l,[],a,u),c=l.length;while(c--)(f=l[c])&&(y[h[c]]=!(m[h[c]]=f))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(f=y[c])&&l.push(m[c]=f);i(null,y=[],l,u)}c=y.length;while(c--)(f=y[c])&&(l=i?F.call(o,f):p[c])>-1&&(o[l]=!(s[l]=f))}}else y=xt(y===s?y.splice(d,y.length):y),i?i(null,s,y,u):H.apply(s,y)})}function wt(e){var t,n,i,o=e.length,s=r.relative[e[0].type],u=s||r.relative[" "],l=s?1:0,c=yt(function(e){return e===t},u,!0),f=yt(function(e){return F.call(t,e)>-1},u,!0),p=[function(e,n,r){return!s&&(r||n!==a)||((t=n).nodeType?c(e,n,r):f(e,n,r))}];for(;o>l;l++)if(n=r.relative[e[l].type])p=[yt(vt(p),n)];else{if(n=r.filter[e[l].type].apply(null,e[l].matches),n[y]){for(i=++l;o>i;i++)if(r.relative[e[i].type])break;return bt(l>1&&vt(p),l>1&&mt(e.slice(0,l-1)).replace(I,"$1"),n,i>l&&wt(e.slice(l,i)),o>i&&wt(e=e.slice(i)),o>i&&mt(e))}p.push(n)}return vt(p)}function Tt(e,t){var i=0,o=t.length>0,s=e.length>0,u=function(u,l,f,p,h){var d,g,m,y=[],v=0,x="0",b=u&&[],T=null!=h,C=a,k=u||s&&r.find.TAG("*",h&&l.parentNode||l),N=w+=null==C?1:Math.random()||.1;for(T&&(a=l!==c&&l,n=i);null!=(d=k[x]);x++){if(s&&d){g=0;while(m=e[g++])if(m(d,l,f)){p.push(d);break}T&&(w=N,n=++i)}o&&((d=!m&&d)&&v--,u&&b.push(d))}if(v+=x,o&&x!==v){g=0;while(m=t[g++])m(b,y,l,f);if(u){if(v>0)while(x--)b[x]||y[x]||(y[x]=L.call(p));y=xt(y)}H.apply(p,y),T&&!u&&y.length>0&&v+t.length>1&&ut.uniqueSort(p)}return T&&(w=N,a=C),b};return o?st(u):u}s=ut.compile=function(e,t){var n,r=[],i=[],o=N[e+" "];if(!o){t||(t=gt(e)),n=t.length;while(n--)o=wt(t[n]),o[y]?r.push(o):i.push(o);o=N(e,Tt(i,r))}return o};function Ct(e,t,n){var r=0,i=t.length;for(;i>r;r++)ut(e,t[r],n);return n}function kt(e,t,n,i){var o,a,u,l,c,f=gt(e);if(!i&&1===f.length){if(a=f[0]=f[0].slice(0),a.length>2&&"ID"===(u=a[0]).type&&9===t.nodeType&&p&&r.relative[a[1].type]){if(t=(r.find.ID(u.matches[0].replace(tt,nt),t)||[])[0],!t)return n;e=e.slice(a.shift().value.length)}o=G.needsContext.test(e)?0:a.length;while(o--){if(u=a[o],r.relative[l=u.type])break;if((c=r.find[l])&&(i=c(u.matches[0].replace(tt,nt),X.test(a[0].type)&&t.parentNode||t))){if(a.splice(o,1),e=i.length&&mt(a),!e)return H.apply(n,i),n;break}}}return s(e,f)(i,t,!p,n,X.test(e)),n}r.pseudos.nth=r.pseudos.eq;function Nt(){}Nt.prototype=r.filters=r.pseudos,r.setFilters=new Nt,b.sortStable=y.split("").sort(S).join("")===y,l(),[0,0].sort(S),b.detectDuplicates=E,at(function(e){if(e.innerHTML="<a href='#'></a>","#"!==e.firstChild.getAttribute("href")){var t="type|href|height|width".split("|"),n=t.length;while(n--)r.attrHandle[t[n]]=ft}}),at(function(e){if(null!=e.getAttribute("disabled")){var t=P.split("|"),n=t.length;while(n--)r.attrHandle[t[n]]=ct}}),x.find=ut,x.expr=ut.selectors,x.expr[":"]=x.expr.pseudos,x.unique=ut.uniqueSort,x.text=ut.getText,x.isXMLDoc=ut.isXML,x.contains=ut.contains}(e);var D={};function A(e){var t=D[e]={};return x.each(e.match(w)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?D[e]||A(e):x.extend({},e);var t,n,r,i,o,s,a=[],u=!e.once&&[],l=function(f){for(t=e.memory&&f,n=!0,s=i||0,i=0,o=a.length,r=!0;a&&o>s;s++)if(a[s].apply(f[0],f[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,a&&(u?u.length&&l(u.shift()):t?a=[]:c.disable())},c={add:function(){if(a){var n=a.length;(function s(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&c.has(n)||a.push(n):n&&n.length&&"string"!==r&&s(n)})})(arguments),r?o=a.length:t&&(i=n,l(t))}return this},remove:function(){return a&&x.each(arguments,function(e,t){var n;while((n=x.inArray(t,a,n))>-1)a.splice(n,1),r&&(o>=n&&o--,s>=n&&s--)}),this},has:function(e){return e?x.inArray(e,a)>-1:!(!a||!a.length)},empty:function(){return a=[],o=0,this},disable:function(){return a=u=t=undefined,this},disabled:function(){return!a},lock:function(){return u=undefined,t||c.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!a||n&&!u||(r?u.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!n}};return c},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var s=o[0],a=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=d.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),s=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?d.call(arguments):r,n===a?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},a,u,l;if(r>1)for(a=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(s(t,l,n)).fail(o.reject).progress(s(t,u,a)):--i;return i||o.resolveWith(l,n),o.promise()}}),x.support=function(t){var n=o.createElement("input"),r=o.createDocumentFragment(),i=o.createElement("div"),s=o.createElement("select"),a=s.appendChild(o.createElement("option"));return n.type?(n.type="checkbox",t.checkOn=""!==n.value,t.optSelected=a.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,n.checked=!0,t.noCloneChecked=n.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!a.disabled,n=o.createElement("input"),n.value="t",n.type="radio",t.radioValue="t"===n.value,n.setAttribute("checked","t"),n.setAttribute("name","t"),r.appendChild(n),t.checkClone=r.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in e,i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===i.style.backgroundClip,x(function(){var n,r,s="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",a=o.getElementsByTagName("body")[0];a&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(i),i.innerHTML="",i.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",x.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===i.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(i,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(i,null)||{width:"4px"}).width,r=i.appendChild(o.createElement("div")),r.style.cssText=i.style.cssText=s,r.style.marginRight=r.style.width="0",i.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),a.removeChild(n))}),t):t}({});var L,q,H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,O=/([A-Z])/g;function F(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=x.expando+Math.random()}F.uid=1,F.accepts=function(e){return e.nodeType?1===e.nodeType||9===e.nodeType:!0},F.prototype={key:function(e){if(!F.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=F.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,x.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(x.isEmptyObject(o))this.cache[i]=t;else for(r in t)o[r]=t[r]},get:function(e,t){var n=this.cache[this.key(e)];return t===undefined?n:n[t]},access:function(e,t,n){return t===undefined||t&&"string"==typeof t&&n===undefined?this.get(e,t):(this.set(e,t,n),n!==undefined?n:t)},remove:function(e,t){var n,r,i=this.key(e),o=this.cache[i];if(t===undefined)this.cache[i]={};else{x.isArray(t)?r=t.concat(t.map(x.camelCase)):t in o?r=[t]:(r=x.camelCase(t),r=r in o?[r]:r.match(w)||[]),n=r.length;while(n--)delete o[r[n]]}},hasData:function(e){return!x.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){delete this.cache[this.key(e)]}},L=new F,q=new F,x.extend({acceptData:F.accepts,hasData:function(e){return L.hasData(e)||q.hasData(e)},data:function(e,t,n){return L.access(e,t,n)},removeData:function(e,t){L.remove(e,t)},_data:function(e,t,n){return q.access(e,t,n)},_removeData:function(e,t){q.remove(e,t)}}),x.fn.extend({data:function(e,t){var n,r,i=this[0],o=0,s=null;if(e===undefined){if(this.length&&(s=L.get(i),1===i.nodeType&&!q.get(i,"hasDataAttrs"))){for(n=i.attributes;n.length>o;o++)r=n[o].name,0===r.indexOf("data-")&&(r=x.camelCase(r.substring(5)),P(i,r,s[r]));q.set(i,"hasDataAttrs",!0)}return s}return"object"==typeof e?this.each(function(){L.set(this,e)}):x.access(this,function(t){var n,r=x.camelCase(e);if(i&&t===undefined){if(n=L.get(i,e),n!==undefined)return n;if(n=L.get(i,r),n!==undefined)return n;if(n=P(i,r,undefined),n!==undefined)return n}else this.each(function(){var n=L.get(this,r);L.set(this,r,t),-1!==e.indexOf("-")&&n!==undefined&&L.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){L.remove(this,e)})}});function P(e,t,n){var r;if(n===undefined&&1===e.nodeType)if(r="data-"+t.replace(O,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:H.test(n)?JSON.parse(n):n}catch(i){}L.set(e,t,n)}else n=undefined;return n}x.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=q.get(e,t),n&&(!r||x.isArray(n)?r=q.access(e,t,x.makeArray(n)):r.push(n)),r||[]):undefined},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),s=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return q.get(e,n)||q.access(e,n,{empty:x.Callbacks("once memory").add(function(){q.remove(e,[t+"queue",n])})})}}),x.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?x.queue(this[0],e):t===undefined?this:this.each(function(){var n=x.queue(this,e,t);
	x._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=x.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=undefined),e=e||"fx";while(s--)n=q.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var R,M,W=/[\t\r\n]/g,$=/\r/g,B=/^(?:input|select|textarea|button)$/i;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[x.propFix[e]||e]})},addClass:function(e){var t,n,r,i,o,s=0,a=this.length,u="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,s=0,a=this.length,u=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,i="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,s=0,a=x(this),u=t,l=e.match(w)||[];while(o=l[s++])u=i?u:!a.hasClass(o),a[u?"addClass":"removeClass"](o)}else(n===r||"boolean"===n)&&(this.className&&q.set(this,"__className__",this.className),this.className=this.className||e===!1?"":q.get(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(W," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=x.isFunction(e),this.each(function(n){var i,o=x(this);1===this.nodeType&&(i=r?e.call(this,n,o.val()):e,null==i?i="":"number"==typeof i?i+="":x.isArray(i)&&(i=x.map(i,function(e){return null==e?"":e+""})),t=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&t.set(this,i,"value")!==undefined||(this.value=i))});if(i)return t=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&(n=t.get(i,"value"))!==undefined?n:(n=i.value,"string"==typeof n?n.replace($,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;for(;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),s=i.length;while(s--)r=i[s],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===r?x.prop(e,t,n):(1===s&&x.isXMLDoc(e)||(t=t.toLowerCase(),i=x.attrHooks[t]||(x.expr.match.boolean.test(t)?M:R)),n===undefined?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=x.find.attr(e,t),null==o?undefined:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==undefined?o:(e.setAttribute(t,n+""),n):(x.removeAttr(e,t),undefined))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.boolean.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!x.isXMLDoc(e),o&&(t=x.propFix[t]||t,i=x.propHooks[t]),n!==undefined?i&&"set"in i&&(r=i.set(e,n,t))!==undefined?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||B.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),M={set:function(e,t,n){return t===!1?x.removeAttr(e,n):e.setAttribute(n,n),n}},x.each(x.expr.match.boolean.source.match(/\w+/g),function(e,t){var n=x.expr.attrHandle[t]||x.find.attr;x.expr.attrHandle[t]=function(e,t,r){var i=x.expr.attrHandle[t],o=r?undefined:(x.expr.attrHandle[t]=undefined)!=n(e,t,r)?t.toLowerCase():null;return x.expr.attrHandle[t]=i,o}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,t){return x.isArray(t)?e.checked=x.inArray(x(e).val(),t)>=0:undefined}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var I=/^key/,z=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,X=/^([^.]*)(?:\.(.+)|)$/;function U(){return!0}function Y(){return!1}function V(){try{return o.activeElement}catch(e){}}x.event={global:{},add:function(e,t,n,i,o){var s,a,u,l,c,f,p,h,d,g,m,y=q.get(e);if(y){n.handler&&(s=n,n=s.handler,o=s.selector),n.guid||(n.guid=x.guid++),(l=y.events)||(l=y.events={}),(a=y.handle)||(a=y.handle=function(e){return typeof x===r||e&&x.event.triggered===e.type?undefined:x.event.dispatch.apply(a.elem,arguments)},a.elem=e),t=(t||"").match(w)||[""],c=t.length;while(c--)u=X.exec(t[c])||[],d=m=u[1],g=(u[2]||"").split(".").sort(),d&&(p=x.event.special[d]||{},d=(o?p.delegateType:p.bindType)||d,p=x.event.special[d]||{},f=x.extend({type:d,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&x.expr.match.needsContext.test(o),namespace:g.join(".")},s),(h=l[d])||(h=l[d]=[],h.delegateCount=0,p.setup&&p.setup.call(e,i,g,a)!==!1||e.addEventListener&&e.addEventListener(d,a,!1)),p.add&&(p.add.call(e,f),f.handler.guid||(f.handler.guid=n.guid)),o?h.splice(h.delegateCount++,0,f):h.push(f),x.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,h,d,g,m=q.hasData(e)&&q.get(e);if(m&&(u=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(a=X.exec(t[l])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){f=x.event.special[h]||{},h=(r?f.delegateType:f.bindType)||h,p=u[h]||[],a=a[2]&&RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));s&&!p.length&&(f.teardown&&f.teardown.call(e,d,m.handle)!==!1||x.removeEvent(e,h,m.handle),delete u[h])}else for(h in u)x.event.remove(e,h+t[l],n,r,!0);x.isEmptyObject(u)&&(delete m.handle,q.remove(e,"events"))}},trigger:function(t,n,r,i){var s,a,u,l,c,f,p,h=[r||o],d=y.call(t,"type")?t.type:t,g=y.call(t,"namespace")?t.namespace.split("."):[];if(a=u=r=r||o,3!==r.nodeType&&8!==r.nodeType&&!_.test(d+x.event.triggered)&&(d.indexOf(".")>=0&&(g=d.split("."),d=g.shift(),g.sort()),c=0>d.indexOf(":")&&"on"+d,t=t[x.expando]?t:new x.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.namespace_re=t.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=r),n=null==n?[t]:x.makeArray(n,[t]),p=x.event.special[d]||{},i||!p.trigger||p.trigger.apply(r,n)!==!1)){if(!i&&!p.noBubble&&!x.isWindow(r)){for(l=p.delegateType||d,_.test(l+d)||(a=a.parentNode);a;a=a.parentNode)h.push(a),u=a;u===(r.ownerDocument||o)&&h.push(u.defaultView||u.parentWindow||e)}s=0;while((a=h[s++])&&!t.isPropagationStopped())t.type=s>1?l:p.bindType||d,f=(q.get(a,"events")||{})[t.type]&&q.get(a,"handle"),f&&f.apply(a,n),f=c&&a[c],f&&x.acceptData(a)&&f.apply&&f.apply(a,n)===!1&&t.preventDefault();return t.type=d,i||t.isDefaultPrevented()||p._default&&p._default.apply(h.pop(),n)!==!1||!x.acceptData(r)||c&&x.isFunction(r[d])&&!x.isWindow(r)&&(u=r[c],u&&(r[c]=null),x.event.triggered=d,r[d](),x.event.triggered=undefined,u&&(r[c]=u)),t.result}},dispatch:function(e){e=x.event.fix(e);var t,n,r,i,o,s=[],a=d.call(arguments),u=(q.get(this,"events")||{})[e.type]||[],l=x.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),t=0;while((i=s[t++])&&!e.isPropagationStopped()){e.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),r!==undefined&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",r[i]===undefined&&(r[i]=o.needsContext?x(i,this).index(u)>=0:x.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return t.length>a&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||o,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||s===undefined||(e.which=1&s?1:2&s?3:4&s?2:0),e}},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=z.test(i)?this.mouseHooks:I.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return 3===e.target.nodeType&&(e.target=e.target.parentNode),s.filter?s.filter(e,o):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==V()&&this.focus?(this.focus(),!1):undefined},delegateType:"focusin"},blur:{trigger:function(){return this===V()&&this.blur?(this.blur(),!1):undefined},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&x.nodeName(this,"input")?(this.click(),!1):undefined},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},x.Event=function(e,t){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.getPreventDefault&&e.getPreventDefault()?U:Y):this.type=e,t&&x.extend(this,t),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,undefined):new x.Event(e,t)},x.Event.prototype={isDefaultPrevented:Y,isPropagationStopped:Y,isImmediatePropagationStopped:Y,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=U,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=U,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=U,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=undefined);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=undefined):null==r&&("string"==typeof t?(r=n,n=undefined):(r=n,n=t,t=undefined)),r===!1)r=Y;else if(!r)return this;return 1===i&&(o=r,r=function(e){return x().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=x.guid++)),this.each(function(){x.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,x(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=undefined),n===!1&&(n=Y),this.each(function(){x.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?x.event.trigger(e,t,n,!0):undefined}});var G=/^.[^:#\[\.,]*$/,J=x.expr.match.needsContext,Q={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n,r,i=this.length;if("string"!=typeof e)return t=this,this.pushStack(x(e).filter(function(){for(r=0;i>r;r++)if(x.contains(t[r],this))return!0}));for(n=[],r=0;i>r;r++)x.find(e,this[r],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=(this.selector?this.selector+" ":"")+e,n},has:function(e){var t=x(e,this),n=t.length;return this.filter(function(){var e=0;for(;n>e;e++)if(x.contains(this,t[e]))return!0})},not:function(e){return this.pushStack(Z(this,e||[],!0))},filter:function(e){return this.pushStack(Z(this,e||[],!1))},is:function(e){return!!e&&("string"==typeof e?J.test(e)?x(e,this.context).index(this[0])>=0:x.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,o=[],s=J.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(s?s.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?g.call(x(e),this[0]):g.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function K(e,t){while((e=e[t])&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return K(e,"nextSibling")},prev:function(e){return K(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(Q[e]||x.unique(i),"p"===e[0]&&i.reverse()),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){var r=[],i=n!==undefined;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&x(e).is(n))break;r.push(e)}return r},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function Z(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(G.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return g.call(t,e)>=0!==n})}var et=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,tt=/<([\w:]+)/,nt=/<|&#?\w+;/,rt=/<(?:script|style|link)/i,it=/^(?:checkbox|radio)$/i,ot=/checked\s*(?:[^=]|=\s*.checked.)/i,st=/^$|\/(?:java|ecma)script/i,at=/^true\/(.*)/,ut=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,lt={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};lt.optgroup=lt.option,lt.tbody=lt.tfoot=lt.colgroup=lt.caption=lt.col=lt.thead,lt.th=lt.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===undefined?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=ct(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=ct(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(gt(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&ht(gt(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++)1===e.nodeType&&(x.cleanData(gt(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===undefined&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!rt.test(e)&&!lt[(tt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(et,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(x.cleanData(gt(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=p.apply([],e);var r,i,o,s,a,u,l=0,c=this.length,f=this,h=c-1,d=e[0],g=x.isFunction(d);if(g||!(1>=c||"string"!=typeof d||x.support.checkClone)&&ot.test(d))return this.each(function(r){var i=f.eq(r);g&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(r=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),i=r.firstChild,1===r.childNodes.length&&(r=i),i)){for(o=x.map(gt(r,"script"),ft),s=o.length;c>l;l++)a=r,l!==h&&(a=x.clone(a,!0,!0),s&&x.merge(o,gt(a,"script"))),t.call(this[l],a,l);if(s)for(u=o[o.length-1].ownerDocument,x.map(o,pt),l=0;s>l;l++)a=o[l],st.test(a.type||"")&&!q.access(a,"globalEval")&&x.contains(u,a)&&(a.src?x._evalUrl(a.src):x.globalEval(a.textContent.replace(ut,"")))}return this}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=[],i=x(e),o=i.length-1,s=0;for(;o>=s;s++)n=s===o?this:this.clone(!0),x(i[s])[t](n),h.apply(r,n.get());return this.pushStack(r)}}),x.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=x.contains(e.ownerDocument,e);if(!(x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(s=gt(a),o=gt(e),r=0,i=o.length;i>r;r++)mt(o[r],s[r]);if(t)if(n)for(o=o||gt(e),s=s||gt(a),r=0,i=o.length;i>r;r++)dt(o[r],s[r]);else dt(e,a);return s=gt(a,"script"),s.length>0&&ht(s,!u&&gt(e,"script")),a},buildFragment:function(e,t,n,r){var i,o,s,a,u,l,c=0,f=e.length,p=t.createDocumentFragment(),h=[];for(;f>c;c++)if(i=e[c],i||0===i)if("object"===x.type(i))x.merge(h,i.nodeType?[i]:i);else if(nt.test(i)){o=o||p.appendChild(t.createElement("div")),s=(tt.exec(i)||["",""])[1].toLowerCase(),a=lt[s]||lt._default,o.innerHTML=a[1]+i.replace(et,"<$1></$2>")+a[2],l=a[0];while(l--)o=o.firstChild;x.merge(h,o.childNodes),o=p.firstChild,o.textContent=""}else h.push(t.createTextNode(i));p.textContent="",c=0;while(i=h[c++])if((!r||-1===x.inArray(i,r))&&(u=x.contains(i.ownerDocument,i),o=gt(p.appendChild(i),"script"),u&&ht(o),n)){l=0;while(i=o[l++])st.test(i.type||"")&&n.push(i)}return p},cleanData:function(e){var t,n,r,i=e.length,o=0,s=x.event.special;for(;i>o;o++){if(n=e[o],x.acceptData(n)&&(t=q.access(n)))for(r in t.events)s[r]?x.event.remove(n,r):x.removeEvent(n,r,t.handle);L.discard(n),q.discard(n)}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"text",async:!1,global:!1,success:x.globalEval})}});function ct(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function ft(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function pt(e){var t=at.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function ht(e,t){var n=e.length,r=0;for(;n>r;r++)q.set(e[r],"globalEval",!t||q.get(t[r],"globalEval"))}function dt(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(q.hasData(e)&&(o=q.access(e),s=x.extend({},o),l=o.events,q.set(t,s),l)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)x.event.add(t,i,l[i][n])}L.hasData(e)&&(a=L.access(e),u=x.extend({},a),L.set(t,u))}}function gt(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return t===undefined||t&&x.nodeName(e,t)?x.merge([e],n):n}function mt(e,t){var n=t.nodeName.toLowerCase();"input"===n&&it.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}x.fn.extend({wrapAll:function(e){var t;return x.isFunction(e)?this.each(function(t){x(this).wrapAll(e.call(this,t))}):(this[0]&&(t=x(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var yt,vt,xt=/^(none|table(?!-c[ea]).+)/,bt=/^margin/,wt=RegExp("^("+b+")(.*)$","i"),Tt=RegExp("^("+b+")(?!px)[a-z%]+$","i"),Ct=RegExp("^([+-])=("+b+")","i"),kt={BODY:"block"},Nt={position:"absolute",visibility:"hidden",display:"block"},Et={letterSpacing:0,fontWeight:400},St=["Top","Right","Bottom","Left"],jt=["Webkit","O","Moz","ms"];function Dt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=jt.length;while(i--)if(t=jt[i]+n,t in e)return t;return r}function At(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function Lt(t){return e.getComputedStyle(t,null)}function qt(e,t){var n,r,i,o=[],s=0,a=e.length;for(;a>s;s++)r=e[s],r.style&&(o[s]=q.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&At(r)&&(o[s]=q.access(r,"olddisplay",Pt(r.nodeName)))):o[s]||(i=At(r),(n&&"none"!==n||!i)&&q.set(r,"olddisplay",i?n:x.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}x.fn.extend({css:function(e,t){return x.access(this,function(e,t,n){var r,i,o={},s=0;if(x.isArray(t)){for(r=Lt(e),i=t.length;i>s;s++)o[t[s]]=x.css(e,t[s],!1,r);return o}return n!==undefined?x.style(e,t,n):x.css(e,t)},e,t,arguments.length>1)},show:function(){return qt(this,!0)},hide:function(){return qt(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:At(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=yt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=x.camelCase(t),u=e.style;return t=x.cssProps[a]||(x.cssProps[a]=Dt(u,a)),s=x.cssHooks[t]||x.cssHooks[a],n===undefined?s&&"get"in s&&(i=s.get(e,!1,r))!==undefined?i:u[t]:(o=typeof n,"string"===o&&(i=Ct.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(x.css(e,t)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||x.cssNumber[a]||(n+="px"),x.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,r))===undefined||(u[t]=n)),undefined)}},css:function(e,t,n,r){var i,o,s,a=x.camelCase(t);return t=x.cssProps[a]||(x.cssProps[a]=Dt(e.style,a)),s=x.cssHooks[t]||x.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),i===undefined&&(i=yt(e,t,r)),"normal"===i&&t in Et&&(i=Et[t]),""===n||n?(o=parseFloat(i),n===!0||x.isNumeric(o)?o||0:i):i}}),yt=function(e,t,n){var r,i,o,s=n||Lt(e),a=s?s.getPropertyValue(t)||s[t]:undefined,u=e.style;return s&&(""!==a||x.contains(e.ownerDocument,e)||(a=x.style(e,t)),Tt.test(a)&&bt.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=s.width,u.width=r,u.minWidth=i,u.maxWidth=o)),a};function Ht(e,t,n){var r=wt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function Ot(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;for(;4>o;o+=2)"margin"===n&&(s+=x.css(e,n+St[o],!0,i)),r?("content"===n&&(s-=x.css(e,"padding"+St[o],!0,i)),"margin"!==n&&(s-=x.css(e,"border"+St[o]+"Width",!0,i))):(s+=x.css(e,"padding"+St[o],!0,i),"padding"!==n&&(s+=x.css(e,"border"+St[o]+"Width",!0,i)));return s}function Ft(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Lt(e),s=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=yt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Tt.test(i))return i;r=s&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+Ot(e,t,n||(s?"border":"content"),r,o)+"px"}function Pt(e){var t=o,n=kt[e];return n||(n=Rt(e,t),"none"!==n&&n||(vt=(vt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(vt[0].contentWindow||vt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=Rt(e,t),vt.detach()),kt[e]=n),n}function Rt(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,t){x.cssHooks[t]={get:function(e,n,r){return n?0===e.offsetWidth&&xt.test(x.css(e,"display"))?x.swap(e,Nt,function(){return Ft(e,t,r)}):Ft(e,t,r):undefined},set:function(e,n,r){var i=r&&Lt(e);return Ht(e,n,r?Ot(e,t,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,t){return t?x.swap(e,{display:"inline-block"},yt,[e,"marginRight"]):undefined}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,t){x.cssHooks[t]={get:function(e,n){return n?(n=yt(e,t),Tt.test(n)?x(e).position()[t]+"px":n):undefined}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+St[r]+t]=o[r]||o[r-2]||o[0];return i}},bt.test(e)||(x.cssHooks[e+t].set=Ht)});var Mt=/%20/g,Wt=/\[\]$/,$t=/\r?\n/g,Bt=/^(?:submit|button|image|reset|file)$/i,It=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&It.test(this.nodeName)&&!Bt.test(e)&&(this.checked||!it.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace($t,"\r\n")}}):{name:t.name,value:n.replace($t,"\r\n")}}).get()}}),x.param=function(e,t){var n,r=[],i=function(e,t){t=x.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===undefined&&(t=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){i(this.name,this.value)});else for(n in e)zt(n,e[n],t,i);return r.join("&").replace(Mt,"+")};function zt(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||Wt.test(e)?r(e,i):zt(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)zt(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var _t,Xt,Ut=x.now(),Yt=/\?/,Vt=/#.*$/,Gt=/([?&])_=[^&]*/,Jt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Qt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Kt=/^(?:GET|HEAD)$/,Zt=/^\/\//,en=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,tn=x.fn.load,nn={},rn={},on="*/".concat("*");try{Xt=i.href}catch(sn){Xt=o.createElement("a"),Xt.href="",Xt=Xt.href}_t=en.exec(Xt.toLowerCase())||[];function an(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];
	if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function un(e,t,n,r){var i={},o=e===rn;function s(a){var u;return i[a]=!0,x.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):undefined:(t.dataTypes.unshift(l),s(l),!1)}),u}return s(t.dataTypes[0])||!i["*"]&&s("*")}function ln(e,t){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in t)t[n]!==undefined&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,t,n){if("string"!=typeof e&&tn)return tn.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=e.slice(a),e=e.slice(0,a)),x.isFunction(t)?(n=t,t=undefined):t&&"object"==typeof t&&(i="POST"),s.length>0&&x.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?x("<div>").append(x.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Xt,type:"GET",isLocal:Qt.test(_t[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":on,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?ln(ln(e,x.ajaxSettings),t):ln(x.ajaxSettings,e)},ajaxPrefilter:an(nn),ajaxTransport:an(rn),ajax:function(e,t){"object"==typeof e&&(t=e,e=undefined),t=t||{};var n,r,i,o,s,a,u,l,c=x.ajaxSetup({},t),f=c.context||c,p=c.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),d=x.Callbacks("once memory"),g=c.statusCode||{},m={},y={},v=0,b="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===v){if(!o){o={};while(t=Jt.exec(i))o[t[1].toLowerCase()]=t[2]}t=o[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===v?i:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return v||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return v||(c.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>v)for(t in e)g[t]=[g[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||b;return n&&n.abort(t),k(0,t),this}};if(h.promise(T).complete=d.add,T.success=T.done,T.error=T.fail,c.url=((e||c.url||Xt)+"").replace(Vt,"").replace(Zt,_t[1]+"//"),c.type=t.method||t.type||c.method||c.type,c.dataTypes=x.trim(c.dataType||"*").toLowerCase().match(w)||[""],null==c.crossDomain&&(a=en.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===_t[1]&&a[2]===_t[2]&&(a[3]||("http:"===a[1]?"80":"443"))===(_t[3]||("http:"===_t[1]?"80":"443")))),c.data&&c.processData&&"string"!=typeof c.data&&(c.data=x.param(c.data,c.traditional)),un(nn,c,t,T),2===v)return T;u=c.global,u&&0===x.active++&&x.event.trigger("ajaxStart"),c.type=c.type.toUpperCase(),c.hasContent=!Kt.test(c.type),r=c.url,c.hasContent||(c.data&&(r=c.url+=(Yt.test(r)?"&":"?")+c.data,delete c.data),c.cache===!1&&(c.url=Gt.test(r)?r.replace(Gt,"$1_="+Ut++):r+(Yt.test(r)?"&":"?")+"_="+Ut++)),c.ifModified&&(x.lastModified[r]&&T.setRequestHeader("If-Modified-Since",x.lastModified[r]),x.etag[r]&&T.setRequestHeader("If-None-Match",x.etag[r])),(c.data&&c.hasContent&&c.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",c.contentType),T.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+("*"!==c.dataTypes[0]?", "+on+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)T.setRequestHeader(l,c.headers[l]);if(c.beforeSend&&(c.beforeSend.call(f,T,c)===!1||2===v))return T.abort();b="abort";for(l in{success:1,error:1,complete:1})T[l](c[l]);if(n=un(rn,c,t,T)){T.readyState=1,u&&p.trigger("ajaxSend",[T,c]),c.async&&c.timeout>0&&(s=setTimeout(function(){T.abort("timeout")},c.timeout));try{v=1,n.send(m,k)}catch(C){if(!(2>v))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,t,o,a){var l,m,y,b,w,C=t;2!==v&&(v=2,s&&clearTimeout(s),n=undefined,i=a||"",T.readyState=e>0?4:0,l=e>=200&&300>e||304===e,o&&(b=cn(c,T,o)),b=fn(c,b,T,l),l?(c.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(x.lastModified[r]=w),w=T.getResponseHeader("etag"),w&&(x.etag[r]=w)),204===e?C="nocontent":304===e?C="notmodified":(C=b.state,m=b.data,y=b.error,l=!y)):(y=C,(e||!C)&&(C="error",0>e&&(e=0))),T.status=e,T.statusText=(t||C)+"",l?h.resolveWith(f,[m,C,T]):h.rejectWith(f,[T,C,y]),T.statusCode(g),g=undefined,u&&p.trigger(l?"ajaxSuccess":"ajaxError",[T,c,l?m:y]),d.fireWith(f,[T,C]),u&&(p.trigger("ajaxComplete",[T,c]),--x.active||x.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,t){return x.get(e,undefined,t,"script")}}),x.each(["get","post"],function(e,t){x[t]=function(e,n,r,i){return x.isFunction(n)&&(i=i||r,r=n,n=undefined),x.ajax({url:e,type:t,dataType:i,data:n,success:r})}});function cn(e,t,n){var r,i,o,s,a=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),r===undefined&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):undefined}function fn(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(f){return{state:"parsererror",error:s?f:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),x.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=x("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),o.head.appendChild(t[0])},abort:function(){n&&n()}}}});var pn=[],hn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=pn.pop()||x.expando+"_"+Ut++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(hn.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&hn.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=x.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(hn,"$1"+i):t.jsonp!==!1&&(t.url+=(Yt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||x.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,pn.push(i)),s&&x.isFunction(o)&&o(s[0]),s=o=undefined}),"script"):undefined}),x.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var dn=x.ajaxSettings.xhr(),gn={0:200,1223:204},mn=0,yn={};e.ActiveXObject&&x(e).on("unload",function(){for(var e in yn)yn[e]();yn=undefined}),x.support.cors=!!dn&&"withCredentials"in dn,x.support.ajax=dn=!!dn,x.ajaxTransport(function(e){var t;return x.support.cors||dn&&!e.crossDomain?{send:function(n,r){var i,o,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)s[i]=e.xhrFields[i];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)s.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete yn[o],t=s.onload=s.onerror=null,"abort"===e?s.abort():"error"===e?r(s.status||404,s.statusText):r(gn[s.status]||s.status,s.statusText,"string"==typeof s.responseText?{text:s.responseText}:undefined,s.getAllResponseHeaders()))}},s.onload=t(),s.onerror=t("error"),t=yn[o=mn++]=t("abort"),s.send(e.hasContent&&e.data||null)},abort:function(){t&&t()}}:undefined});var vn,xn,bn=/^(?:toggle|show|hide)$/,wn=RegExp("^(?:([+-])=|)("+b+")([a-z%]*)$","i"),Tn=/queueHooks$/,Cn=[Dn],kn={"*":[function(e,t){var n,r,i=this.createTween(e,t),o=wn.exec(t),s=i.cur(),a=+s||0,u=1,l=20;if(o){if(n=+o[2],r=o[3]||(x.cssNumber[e]?"":"px"),"px"!==r&&a){a=x.css(i.elem,e,!0)||n||1;do u=u||".5",a/=u,x.style(i.elem,e,a+r);while(u!==(u=i.cur()/s)&&1!==u&&--l)}i.unit=r,i.start=a,i.end=o[1]?a+(o[1]+1)*n:n}return i}]};function Nn(){return setTimeout(function(){vn=undefined}),vn=x.now()}function En(e,t){x.each(t,function(t,n){var r=(kn[t]||[]).concat(kn["*"]),i=0,o=r.length;for(;o>i;i++)if(r[i].call(e,t,n))return})}function Sn(e,t,n){var r,i,o=0,s=Cn.length,a=x.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=vn||Nn(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;for(;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:vn||Nn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(jn(c,l.opts.specialEasing);s>o;o++)if(r=Cn[o].call(l,e,c,l.opts))return r;return En(l,c),x.isFunction(l.opts.start)&&l.opts.start.call(e,l),x.fx.timer(x.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function jn(e,t){var n,r,i,o,s;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=x.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(Sn,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],kn[n]=kn[n]||[],kn[n].unshift(t)},prefilter:function(e,t){t?Cn.unshift(e):Cn.push(e)}});function Dn(e,t,n){var r,i,o,s,a,u,l,c,f,p=this,h=e.style,d={},g=[],m=e.nodeType&&At(e);n.queue||(c=x._queueHooks(e,"fx"),null==c.unqueued&&(c.unqueued=0,f=c.empty.fire,c.empty.fire=function(){c.unqueued||f()}),c.unqueued++,p.always(function(){p.always(function(){c.unqueued--,x.queue(e,"fx").length||c.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),a=q.get(e,"fxshow");for(r in t)if(o=t[r],bn.exec(o)){if(delete t[r],u=u||"toggle"===o,o===(m?"hide":"show")){if("show"!==o||a===undefined||a[r]===undefined)continue;m=!0}g.push(r)}if(s=g.length){a=q.get(e,"fxshow")||q.access(e,"fxshow",{}),"hidden"in a&&(m=a.hidden),u&&(a.hidden=!m),m?x(e).show():p.done(function(){x(e).hide()}),p.done(function(){var t;q.remove(e,"fxshow");for(t in d)x.style(e,t,d[t])});for(r=0;s>r;r++)i=g[r],l=p.createTween(i,m?a[i]:0),d[i]=a[i]||x.style(e,i),i in a||(a[i]=l.start,m&&(l.end=l.start,l.start="width"===i||"height"===i?1:0))}}function An(e,t,n,r,i){return new An.prototype.init(e,t,n,r,i)}x.Tween=An,An.prototype={constructor:An,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=An.propHooks[this.prop];return e&&e.get?e.get(this):An.propHooks._default.get(this)},run:function(e){var t,n=An.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):An.propHooks._default.set(this),this}},An.prototype.init.prototype=An.prototype,An.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},An.propHooks.scrollTop=An.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(Ln(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(At).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),s=function(){var t=Sn(this,x.extend({},e),o);s.finish=function(){t.stop(!0)},(i||q.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=undefined),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=x.timers,s=q.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&Tn.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=q.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,s=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function Ln(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=St[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:Ln("show"),slideUp:Ln("hide"),slideToggle:Ln("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=An.prototype.init,x.fx.tick=function(){var e,t=x.timers,n=0;for(vn=x.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||x.fx.stop(),vn=undefined},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){xn||(xn=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(xn),xn=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===undefined?this:this.each(function(t){x.offset.setOffset(this,e,t)});var t,n,i=this[0],o={top:0,left:0},s=i&&i.ownerDocument;if(s)return t=s.documentElement,x.contains(t,i)?(typeof i.getBoundingClientRect!==r&&(o=i.getBoundingClientRect()),n=qn(s),{top:o.top+n.pageYOffset-t.clientTop,left:o.left+n.pageXOffset-t.clientLeft}):o},x.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=x.css(e,"position"),f=x(e),p={};"static"===c&&(e.style.position="relative"),a=f.offset(),o=x.css(e,"top"),u=x.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=f.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),x.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(p.top=t.top-a.top+s),null!=t.left&&(p.left=t.left-a.left+i),"using"in t?t.using.call(e,p):f.css(p)}},x.fn.extend({position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===x.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(r=e.offset()),r.top+=x.css(e[0],"borderTopWidth",!0),r.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-x.css(n,"marginTop",!0),left:t.left-r.left-x.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;x.fn[t]=function(i){return x.access(this,function(t,i,o){var s=qn(t);return o===undefined?s?s[n]:t[i]:(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o,undefined)},t,i,arguments.length,null)}});function qn(e){return x.isWindow(e)?e:9===e.nodeType&&e.defaultView}x.each({Height:"height",Width:"width"},function(e,t){x.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){x.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return x.access(this,function(t,n,r){var i;return x.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):r===undefined?x.css(t,n,s):x.style(t,n,r,s)},t,o?r:undefined,o,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&"object"==typeof module.exports?module.exports=x:"function"=="function"&&__webpack_require__(6)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return x}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)),"object"==typeof e&&"object"==typeof e.document&&(e.jQuery=e.$=x)})(window);

/***/ },
/* 6 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Ajax = __webpack_require__(8);

	var _require = __webpack_require__(9);

	var getQueryString = _require.getQueryString;
	var ua = _require.ua;

	var _require2 = __webpack_require__(10);

	var appVersion = _require2.appVersion;

	var org = location.origin,

	//ajaxUrl = org.indexOf("localhost") > -1?(location.href.indexOf("dev")>-1?"http://stats.dev2.wizarcan.com":"http://stats.wizarcan.com"):org;
	//
	//TODO 生产上暂时没有布置反馈的接口  因此暂时注释掉
	//ajaxUrl = location.href.indexOf("dev")>-1?"http://stats.dev2.wizarcan.com":"http://stats.wizarcan.com";
	//ajaxUrl = location.href.indexOf("dev2") > -1 ? "http://idp.dev2.wizarcan.com" : "http://idpdev.wizarcan.com";
	ajaxUrl = org;

	var Report = (function (_Ajax) {
	    _inherits(Report, _Ajax);

	    function Report(option) {
	        _classCallCheck(this, Report);

	        //TODO 生产上暂时没有布置反馈的接口  因此暂时注释掉
	        //super(ajaxUrl,"/stats/idp/");

	        option = option || {};

	        _get(Object.getPrototypeOf(Report.prototype), "constructor", this).call(this, ajaxUrl, "/stats/");
	        this.appId = option.appid; // 设置上报用的appid
	        this.openId = option.openid; // 设置上报用的openid
	        this.enterType = option.enterType;
	        this.init();
	    }

	    _createClass(Report, [{
	        key: "init",
	        value: function init() {
	            //this.appId = getQueryString("appid") || getQueryString("appId") || localStorage.appid || 'wx032d0135e9a5652e';
	            //this.openId = getQueryString("openid") || localStorage.openid || 'opSM1wXkK4OJVcly8BlgJVfmd5iA';
	            //localStorage.appid = this.appId;
	            //localStorage.openid = this.openId;

	            this.buildingId = +(getQueryString("buildingId") || getQueryString("buildingid")) || 22;
	            this.floorid = +(getQueryString("floorId") || getQueryString("floorid")) || -1;
	            this.platform = ua.os;
	            this.platformVersion = ua.osVersion;
	            this.ua = ua.ua;
	            this.appVersion = appVersion;
	        }
	    }, {
	        key: "createAnalysisData",
	        value: function createAnalysisData(data, mapName) {
	            data = data || {};
	            data.weixinOpenId = this.openId;
	            data.weixinAppId = this.appId;
	            data.buildingId = this.buildingId;

	            data.platform = this.platform;
	            data.platformVersion = this.platformVersion;
	            data.ua = this.ua;
	            data.appVersion = this.appVersion;
	            data.enterType = this.enterType;

	            var newData = {};
	            $.each(data, function (k, v) {
	                if (v === '' || typeof v === 'undefined') {
	                    return true;
	                }
	                //newData[mapName + "."+k] = v;//接口调整  不再需要前面的xxxxFormMap了
	                newData[k] = v;
	            });
	            return newData;
	        }

	        //卡券统计……  你没看错，coupon是卡券，link是活动！……晕死。
	    }, {
	        key: "saveCoupon",
	        value: function saveCoupon(couponId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];

	            var data = {
	                floorId: floorId.split("F").join(""),
	                couponId: couponId
	            };
	            var newData = this.createAnalysisData(data, "statsCouponFormMap");
	            return this.post(newData, "saveCoupon.shtml");
	        }

	        //活动统计……
	    }, {
	        key: "saveLink",
	        value: function saveLink(linkId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];

	            var data = {
	                floorId: floorId.split("F").join(""),
	                linkId: linkId
	            };
	            var newData = this.createAnalysisData(data, "statsLinkFormMap");
	            return this.post(newData, "saveLink.shtml");
	        }

	        // action字段已经废弃,被enterType取代?
	    }, {
	        key: "saveVisit",
	        value: function saveVisit(floorId, action) {
	            if (floorId === undefined) floorId = this.floorid;

	            floorId = floorId ? ("" + floorId).split("F").join("") : 0;

	            return this.post(this.createAnalysisData({ floorId: floorId }, "statsSearchFormMap"), "saveVisit.shtml");
	        }
	    }, {
	        key: "saveAdvert",
	        value: function saveAdvert(cityId, advertId) {
	            var newData = this.createAnalysisData({
	                cityId: cityId, advertId: advertId
	            }, "");
	            return this.post(newData, "saveAdvert.shtml");
	        }
	    }, {
	        key: "saveInfrastruc",
	        value: function saveInfrastruc(name) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.showingFloor : arguments[1];

	            if (!floorId) {
	                floorId = "0";
	            }
	            var newData = this.createAnalysisData({
	                name: name, floorId: floorId
	            }, "");
	            return this.post(newData, "saveInfrastruc.shtml");
	        }

	        // 统计分享接口
	    }, {
	        key: "saveLocation",
	        value: function saveLocation(mapArea, x, y) {
	            var floorId = arguments.length <= 3 || arguments[3] === undefined ? this.floorid : arguments[3];

	            if (!floorId) {
	                floorId = "0";
	            }
	            var data = {
	                floorId: floorId.split("F").join(""),
	                mapArea: mapArea,
	                x: Math.round(x),
	                y: Math.round(y)
	            };
	            var newData = this.createAnalysisData(data, "statsLocationFormMap");
	            return this.post(newData, "saveLocation.shtml");
	        }

	        // savePark(floorId = this.floorid, parkPoint, behaviour = 0) {//parkPoint 停车找车地点  behaviour 停车找车标识；0：停车，1：找车
	        //     let data = {
	        //         floorId, parkPoint, behaviour
	        //     }
	        //     let newData = this.createAnalysisData(data, "");
	        //     return this.post(newData, "savePark.shtml");
	        // }

	    }, {
	        key: "savePoi",
	        value: function savePoi(poiId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];
	            var action = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

	            var data = {
	                floorId: ('' + floorId).split("F").join(""),
	                poiId: poiId,
	                action: action
	            };

	            var newData = this.createAnalysisData(data, "statsPoiFormMap");
	            return this.post(newData, "savePoi.shtml");
	        }
	    }, {
	        key: "saveSkin",
	        value: function saveSkin(name) {
	            var data = {
	                name: name
	            };
	            var newData = this.createAnalysisData(data, "statsSkinFormMap");
	            return this.post(newData, "saveSkin.shtml");
	        }
	    }, {
	        key: "saveSearch",
	        value: function saveSearch(brand) {
	            var data = {
	                brand: brand
	            };
	            var newData = this.createAnalysisData(data, "statsSearchFormMap");
	            return this.post(newData, "saveSearch.shtml");
	        }
	    }, {
	        key: "feedback",
	        value: function feedback(comment) {
	            var data = { comment: comment };
	            var newData = this.createAnalysisData(data, "statsSkinFormMap");
	            // delete newData.buildingId;
	            return this.post(newData, {
	                midPath: "/client/",
	                url: "feedback.shtml"
	            });
	        }

	        /** Begin append by weibin. */
	        /**
	         * 上报浮层点击量统计接口
	         * @param {number} floatLayerId
	         * @returns {*}
	         */
	    }, {
	        key: "saveWelcomePagePV",
	        value: function saveWelcomePagePV(floatLayerId) {
	            return this.post(this.createAnalysisData({ floatLayerId: floatLayerId }), 'floatLayer.shtml');
	        }

	        /**
	         * 上报数据到服务器端,用于日志分析或调试
	         * @param data
	         * @returns {*}
	         */
	    }, {
	        key: "saveDataToServer",
	        value: function saveDataToServer(data) {
	            var reportData = {
	                weixinOpenId: this.openId,
	                data: data
	            };
	            return this.post({ datas: JSON.stringify(reportData) }, 'saveBeacons.shtml');
	        }

	        /**
	         * 上报数据到服务器端,用于日志分析或调试 (该方法是zhenyang实现的)
	         * @param data
	         * @returns {*}
	         */
	    }, {
	        key: "saveDataToServerForYZY",
	        value: function saveDataToServerForYZY(data) {
	            //return this.post(data, 'saveBeacons2.shtml');

	            data = typeof data === 'object' ? JSON.stringify(data) : data;
	            log.w('[saveDataToServerForYZY]', data);

	            $.ajax({
	                method: 'POST',
	                url: '//idp.dev2.wizarcan.com/rpm/TestApi/saveBeaconScan',
	                contentType: 'application/json',
	                data: data,
	                dataType: 'json'
	            }).done(function (resp) {
	                log.w('[saveDataToServerForYZY] success', resp);
	            }).fail(function (xhrOrResp) {
	                log.w('[saveDataToServerForYZY] fail', xhrOrResp);
	            });
	        }

	        /**
	         * 上报点击事件
	         * @author weibin
	         * @param {number} action 动作的code值
	         * @param {number} floorId 楼层id
	         */
	    }, {
	        key: "saveClick",
	        value: function saveClick(action, floorId) {
	            return this.post(this.createAnalysisData({ action: action, floorId: floorId }), 'saveButton.shtml');
	        }

	        /**
	         * 上报导航操作 主要包括起止点坐标(x,y)和poiId
	         * @author weibin
	         * @param {object} data 需要上报的数据对象
	         * @returns {*} 返回一个promise对象
	         * @private 私有方法
	         */
	    }, {
	        key: "_saveNavigate",
	        value: function _saveNavigate(data) {
	            data.startPoi = data.startPoiId === 'undefined' ? 0 : data.startPoiId || 0;
	            data.endPoi = data.endPoiId === 'undefined' ? 0 : data.endPoiId || 0;
	            data.action = data.action || 1;

	            // 移除不必要的字段
	            delete data.startPoiId;
	            delete data.endPoiId;
	            data = this.createAnalysisData(data);

	            return this.post(data, 'saveNavigation.shtml');
	        }

	        /**
	         * 开始导航上报
	         * @author weibin
	         * @param {object} data 开始导航时的特有数据
	         * @returns {*} 返回一个promise对象
	         */
	    }, {
	        key: "startNavigate",
	        value: function startNavigate(data) {
	            data.type = 1; // 开启导航时,type对应指定为1

	            log.i('[startNavigate] data', data);
	            return this._saveNavigate(data);
	        }

	        /**
	         * 停止导航上报,分以下几种情况: 1.正常结束; 2.中途取消
	         * @author weibin
	         * @param {object} data 停止导航时的特有数据
	         * @returns {*} 返回一个promise对象
	         */
	    }, {
	        key: "stopNavigate",
	        value: function stopNavigate(data) {
	            data.type = 2; // 结束导航时,type对应指定为2

	            log.i('[stopNavigate] data', data);
	            return this._saveNavigate(data);
	        }

	        /** End append by weibin. */
	    }]);

	    return Report;
	})(Ajax);

	module.exports = Report;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//var $ = require("./jquery");
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _require = __webpack_require__(9);

	var ENV = _require.ENV;

	var Ajax = (function () {
	    function Ajax() {
	        var origin = arguments.length <= 0 || arguments[0] === undefined ? location.origin : arguments[0];
	        var midPath = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

	        _classCallCheck(this, Ajax);

	        //this.apiOrigin = origin;
	        this.apiOrigin = gTools.origin;
	        this.midPath = midPath;
	    }

	    _createClass(Ajax, [{
	        key: 'get',
	        value: function get() {
	            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	            var op = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (typeof op === 'string') {
	                op = {
	                    url: op
	                };
	            }
	            return this.act(data, 'get', op);
	        }
	    }, {
	        key: 'post',
	        value: function post() {
	            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	            var op = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (typeof op === 'string') {
	                op = {
	                    url: op
	                };
	            }
	            return this.act(data, 'post', op);
	        }
	    }, {
	        key: 'act',
	        value: function act() {
	            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	            var method = arguments.length <= 1 || arguments[1] === undefined ? 'get' : arguments[1];
	            var opt = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var origin = this.apiOrigin,

	            //, _this = this
	            midPath = opt.midPath || this.midPath,
	                dtd = $.Deferred();

	            // 以下数组中的接口路径为/client/
	            //if ($.inArray(opt.url, ['floatLayer.shtml']) > -1) {
	            //    midPath = '/client/';
	            //} else
	            if ($.inArray(opt.url, ['saveBeacons.shtml']) > -1) {
	                // 新的上报数据接口为/test/saveBeacons.shtml
	                if (location.hostname.includes('idp.wizarcan')) {
	                    // idp平台上暂时还没有此接口
	                    return dtd.resolve();
	                }

	                //origin = '//jbh.wizarcan.com';
	                midPath = '/test/';
	            }

	            opt.url = origin + midPath + opt.url;
	            log.i(['report api', opt.url]);
	            //_this.showLoading();
	            var defaultOpt = {
	                data: data,
	                async: true,
	                method: method,
	                beforeSend: function beforeSend(jqxhr, settings) {
	                    if (settings.url.indexOf('?') > -1) {
	                        settings.url += '&sign=' + Math.random();
	                    } else {
	                        settings.url += '?sign=' + Math.random();
	                    }
	                }
	            };
	            opt = $.extend(true, {}, defaultOpt, opt);
	            //if (url.indexOf('getBuildingInfoByBeaconArray') > -1) {
	            //    opt.contentType = "text/plain;charset=UTF-8";
	            //}
	            $.ajax(opt).done(function (res) {
	                if (typeof res === 'string') {
	                    // 返回的是非JSON字符串,比如页面code,不做解析
	                    if (res.indexOf('<head>') > -1) {
	                        console.error('返回数据格式不正确:', res);
	                        return;
	                    }

	                    res = JSON.parse(res);
	                }

	                dtd.resolve(res);
	            }).fail(function () {
	                dtd.reject();
	            });

	            return dtd.promise();
	        }
	    }]);

	    return Ajax;
	})();

	exports['default'] = Ajax;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	// import Ajax from "./ajax";
	// var $ = require("./jquery");
	// class BI extend Ajax {
	//   constructor() {
	//     this.defaultParams = {
	//
	//     };
	//   }
	//   createAnalysisData(_data,mapName){
	//     let newData = {};
	//     let data = $.extend(true,{},this.defaultParams_data);
	//     for(var k in data){
	//       if(data[k] === '' || typeof data[k] === 'undefined'){return true}
	//       //newData[mapName + "."+k] = v;//接口调整  不再需要前面的xxxxFormMap了
	//       newData[k] = data[k];
	//     }
	//     return newData;
	//   }
	//
	//
	// }
	//

	/**
	 * 获取字符在页面上显示所占的宽度。除了部分需求特殊的功能，该函数没啥用……
	 * @param  {string} str 字符串
	 * @return {number}     字符串在页面占据的宽度
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	exports.getBytesWidth = getBytesWidth;
	exports.getQueryString = getQueryString;
	exports.analysisUrl = analysisUrl;
	exports.getSortFun = getSortFun;
	exports.setHash = setHash;
	exports.padStart = padStart;
	exports.padEnd = padEnd;
	exports.detectEnv = detectEnv;
	exports.setImgUrlFromOurServer = setImgUrlFromOurServer;
	exports.removeProtocolOfLink = removeProtocolOfLink;
	exports.getElementById = getElementById;
	exports.getOrigin = getOrigin;
	exports.stopPropagation = stopPropagation;
	exports.preventDefault = preventDefault;
	exports.stopPropagationAndPreventDefault = stopPropagationAndPreventDefault;
	exports.setOrigin = setOrigin;
	exports.isArray = isArray;
	exports.parseToNum = parseToNum;

	function getBytesWidth(str) {
	    var span = document.createElement('span'),
	        txt = document.createTextNode(str),
	        w = 1;
	    span.appendChild(txt);
	    document.body.appendChild(span);
	    w = span.offsetWidth;
	    document.body.removeChild(span);
	    return w;
	}

	/**
	 * 获取url的$_GET参数。没啥好说的
	 * @param  {string} name 参数名
	 * @return {object}      参数值
	 */

	function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURIComponent(r[2]);
	    return null;
	}

	/**
	 * 分析url，返回类似location对象类似的结构
	 * @param  {string}  url 缺省为当前页面路径
	 * @return {object}      返回对象格式，类似全局变量location。拆分了$_GET并将之放置于params属性下。
	 */

	function analysisUrl() {
	    var url = arguments.length <= 0 || arguments[0] === undefined ? location.href : arguments[0];
	    // http(s)://asd.com:123/zxc/index.html?a=1&b=2#hash
	    var href = url;

	    var _url$split = url.split("#");

	    var _url$split2 = _slicedToArray(_url$split, 2);

	    var _u0 = _url$split2[0];
	    var hash = _url$split2[1]; // http(s)://asd.com:123/zxc/index.html?a=1&b=2    #    hash
	    var _originIndex = _u0.indexOf("/", location.protocol.indexOf('s') > -1 ? 8 : 7); // http(s)://asd.com:123    /zxc/index.html?a=1&b=2    #    hash
	    var origin = _u0.slice(0, _originIndex);
	    var _u0$slice$split = _u0.slice(_originIndex).split("?");

	    var _u0$slice$split2 = _slicedToArray(_u0$slice$split, 2);

	    var path = _u0$slice$split2[0];
	    // http(s)://asd.com:123
	    var search = _u0$slice$split2[1];
	    var _origin$split = origin.split("://");

	    var _origin$split2 = _slicedToArray(_origin$split, 2);

	    var protocol = _origin$split2[0];
	    // /zxc/index.html      a=1&b=2
	    var host = _origin$split2[1];
	    var _host$split = host.split(":");

	    var _host$split2 = _slicedToArray(_host$split, 2);

	    var hostname = _host$split2[0];
	    // http(s)   asd.com:123
	    var port = _host$split2[1]; // asd.com   123
	    var params = {};

	    protocol += ":";
	    port = port || "";
	    hash = typeof hash === 'undefined' ? "" : hash === "" ? hash : "#" + hash;
	    search = typeof search === 'undefined' ? "" : search;
	    var _s = search.split("&");

	    _s.forEach(function (v, i) {
	        var _v$split = v.split("=");

	        var _v$split2 = _slicedToArray(_v$split, 2);

	        var name = _v$split2[0];
	        var val = _v$split2[1];

	        params[name] = val;
	    });

	    search = search === "" ? "" : "?" + search;
	    return {
	        href: href,
	        hash: hash,
	        origin: origin,
	        path: path,
	        search: search,
	        protocol: protocol,
	        host: host,
	        hostname: hostname,
	        port: port,
	        params: params
	    };
	}

	/**
	 * [].sort(getSortFun("desc","id"));
	 * @param  {[type]} order  [description]
	 * @param  {[type]} sortBy [description]
	 * @return {[type]}        [description]
	 */

	function getSortFun(order, sortBy) {
	    var ordAlpha = order == 'asc' ? '>' : '<';
	    var sortFun = new Function('a', 'b', 'return Number(a.' + sortBy + ')' + ordAlpha + ' Number(b.' + sortBy + ') ? 1 : -1');
	    return sortFun;
	}

	/**
	 * hash替换
	 * @param {string}  hash
	 * @param {Boolean} isReplace 是否替换，即是否不计入history
	 * 考虑这样的情况：#list列出，#list-id显示指定项，#dosth 比如领取之类的东东
	 * #list到#list-id计入history，#list-id 到 #dosth 不计入history
	 * 于是在#dosth返回时返回到#list，但#list再前进，希望到#list-id  如何搞呢……
	 */

	function setHash() {
	    var hash = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var isReplace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    if (isReplace) {
	        location.replace("#" + hash);
	    } else {
	        location.hash = hash;
	    }
	}

	var include = function include(s1, s2) {
	    return s1.indexOf(s2) > -1;
	};

	var uaCurrying = function uaCurrying() {
	    var _ua = navigator.userAgent || navigator.appVersion,
	        isAndroid = !!_ua.match(/(Android)\s+([\d.]+)/),
	        isIpad = !!_ua.match(/(iPad).*OS\s([\d_]+)/),
	        isIphone = !!(!isIpad && _ua.match(/(iPhone\sOS)\s([\d_]+)/)),
	        os = isAndroid ? "Android" : isIpad || isIphone ? "iOS" : "other OS",
	        _osVersion = _ua.match(/Version\/([\d\.]+)/i),
	        osVersion = _osVersion ? _osVersion.pop() : 0;
	    var ua = _ua;
	    console.log(ua);
	    //console.log("该文件被多次引用，但这句话也只会出现一次？\n然后用js判断手机型号神马的……也是醉了。老衲的手机型号在两个专门检测型号的网站上愣是没检测出来")
	    return {
	        ua: ua, isAndroid: isAndroid, isIpad: isIpad, isIphone: isIphone, os: os, osVersion: osVersion
	    };
	};
	var ua = uaCurrying();

	exports.ua = ua;
	var pad = function pad() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];
	    var appendPosition = arguments.length <= 3 || arguments[3] === undefined ? "first" : arguments[3];

	    typeof string !== "string" ? string = String(string) : "";
	    typeof appendString !== "string" ? appendString = String(appendString) : "";
	    typeof number !== 'number' ? number = Number(number) : "";
	    var l = number - string.length;
	    if (l <= 0) {
	        return string;
	    } else if (appendPosition === "first") {
	        return appendString.repeat(l) + string;
	    } else {
	        return string + appendString.repeat(l);
	    }
	};

	/**
	 * 仿es7的padStart自动补足 http://es6.ruanyifeng.com/#docs/string#padStart，padEnd
	 * @param  {[type]} string       "a"
	 * @param  {[type]} number       5
	 * @param  {[type]} appendString "1"
	 * @return {[type]}              "1111a"
	 */

	function padStart() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];

	    return pad(string, number, appendString, "first");
	}

	/**
	 * 仿es7的padEnd自动补足 http://es6.ruanyifeng.com/#docs/string#padStart，padEnd
	 * @param  {[type]} string       "a"
	 * @param  {[type]} number       5
	 * @param  {[type]} appendString "1"
	 * @return {[type]}              "a1111"
	 */

	function padEnd() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];

	    return pad(string, number, appendString, "last");
	}

	/** Begin append by weibin. */

	function detectEnv(host) {
	    host = host || location.host;
	    var env = {
	        local: false,
	        dev: false,
	        uat: false,
	        pro: false
	    };

	    if (host.indexOf('local') > -1 || host.indexOf('192.168.') > -1 || host.indexOf('127.0.') > -1 || host.indexOf('172.16.') > -1) {
	        env.local = true;
	    } else if (host.indexOf('dev') > -1) {
	        env.dev = true;
	    } else if (host.indexOf('uat') > -1) {
	        env.uat = true;
	    } else {
	        env.pro = true;
	    }

	    return env;
	}

	var env = detectEnv();
	var ENV = {
	    LOCAL: env.local,
	    DEV: env.dev,
	    UAT: env.uat,
	    PRO: env.pro
	};

	exports.ENV = ENV;

	function setImgUrlFromOurServer(imgPath) {
	    return ENV.LOCAL ? '//idp.dev2.wizarcan.com' + imgPath : imgPath;
	}

	function removeProtocolOfLink(link) {
	    return link.indexOf('http') > -1 ? link.substr(link.indexOf('//')) : link;
	}

	function getElementById(eleId) {
	    return document.getElementById(eleId);
	}

	function getOrigin() {
	    return env.local ? '//' + (location.search.indexOf('taiguli') > -1 ? 'taiguli' : 'idp') + (location.href.indexOf('dev') > -1 ? '.dev2.' : '') + '.wizarcan.com' : location.origin;
	}

	var urlParams = parseUrlParams();
	exports.urlParams = urlParams;
	console.log('Url params:', urlParams);

	function stopPropagation(evt) {
	    evt = evt || window.event;
	    evt.stopPropagation();
	}

	function preventDefault(evt) {
	    evt = evt || window.event;
	    evt.preventDefault();
	}

	function stopPropagationAndPreventDefault(evt) {
	    evt = evt || window.event;
	    evt.stopPropagation();
	    evt.preventDefault();
	}

	function setOrigin() {
	    // 本地模拟不同环境的origin
	    if (ENV.LOCAL) {
	        var search = location.search;
	        // 生产环境
	        if (search.includes('env=pro')) {
	            if (search.includes('scene=taiguli')) {
	                return '//taiguli.wizarcan.com';
	            }
	            if (search.includes('scene=home_expo') || search.includes('scene=feile')) {
	                return '//jbh.wizarcan.com';
	            }

	            return '//idp.wizarcan.com';
	        }

	        // uat环境
	        if (search.includes('env=uat')) {
	            return '//idpuat.wizarcan.com';
	        }

	        // dev环境
	        return '//idp.dev2.wizarcan.com';
	    }

	    return location.origin;
	}

	/**
	 * 判断是否是数组
	 * @author weibin
	 * @param obj 待判断类型的对象
	 * @returns {boolean}
	 */

	function isArray(obj) {
	    return toString.call(obj) === '[object Array]';
	}

	/**
	 * 将字符串数字转化成数值数字
	 * @author weibin
	 * @param {Array|*} argv
	 * @returns {*}
	 */

	function parseToNum(argv) {
	    if (isArray(argv)) {
	        for (var i = 0, len = argv.length; i < len; i++) {
	            argv[i] = +argv[i];
	        }
	    } else {
	        argv = +argv;
	    }

	    return argv;
	}

	// Begin private methods.
	function parseUrlParams() {
	    var params = {};

	    var searchStr = decodeURIComponent(location.search.substr(1)),
	        paramArr = searchStr.split('&'),
	        keyValuePair = [],
	        value;

	    // 如果url不带参数直接返回
	    if (!searchStr.trim()) {
	        return params;
	    }

	    for (var i = 0, len = paramArr.length; i < len; i++) {
	        keyValuePair = paramArr[i].split('=');

	        // url参数应该规范的使用键值对方式,不建议包含json对象格式,但是此处还是加入了对json对象的解析,以增强函数处理能力.
	        value = keyValuePair[1];
	        params[keyValuePair[0]] = value ? value.indexOf('":') >= 0 ? JSON.parse(value) : value : undefined;
	    }

	    return params;
	}
	// End private methods.
	/** End append by weibin. */

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var appVersion = '3.0.0';
	exports.appVersion = appVersion;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var analysisUrl = __webpack_require__(12).analysisUrl
	    , urlObj = analysisUrl()
	    , params = urlObj.params
		, href = location.href;

	// 特别说明url参数中指定的appid和openid只是用于数据统计,跟获取微信签名没有关系,获取微信签名用的appid,前后端都是写死的,为wx54d8b65ca288f8f3
	params.appid = params.appid || params.appId;        // 兼容appid的设置
	params.openid = params.openid || params.openId;     // 兼容openid的设置

	var CONF = {
	    APPID           :   (params.appid && params.appid !== 'undefined') ? params.appid : 'wx032d0135e9a5652e',                           // 注意大小写, 新版appid, 兼容旧版appId。 1.'wx032d0135e9a5652e'是微肯导航公众号(从"导航猫"或"购物猫"菜单进入),也是默认取值;  2.'wxbae35f0d1acf5840':太古里appid; 3.'wx54d8b65ca288f8f3'是导航公众号appid--万猫智慧城,该appid是用于获取微信签名和配置微信jssdk; 疑问:太古里的场景为什么用的是微肯导航的公众号?
	    OPENID          :   (params.openid && params.openid !== 'undefined') ? params.openid : 'opSM1wXkK4OJVcly8BlgJVfmd5iA',            // 'opSM1wXkK4OJVcly8BlgJVfmd5iA': 默认的openid;
	    ENTERTYPE       :   params.enterType == 0 ? 0 : parseInt(params.enterType) || (href.indexOf('main0.html') > -1 && href.indexOf('model=1') > -1 ? 0 : 6),    // href中包含字段'main0.html'和'model=1',表示是从导航猫打开的; 2:从分享链接访问; 6:从普通链接访问
	    ACTION          :   params.action,
	    MODEL           :   parseInt(params.model) || 1,
	    BUILDINGID      :   parseInt(params.buildingid || params.buildingId) || (location.hostname.indexOf('taiguli') > -1 ? 33 : 0),
	    FLOORID         :   parseInt(params.floorid || params.floorId),
	    X               :   parseInt(params.x) || 0,
	    Y               :   parseInt(params.y) || 0,
	    UX              :   parseInt(params.ux) || 0,
	    UY              :   parseInt(params.uy) || 0,
	    DEBUG           :   parseInt(params.debug) === 1,
	    UAREA           :   params.uarea || null,
	    BLUETEACH       :   parseInt(params.blueTeach),		// 先不能设置默认值为0,因为app.js中有对undefined的判断
	    POINT           :   params.point || null,
	    AJAXURL         :   "http://idp.wizarcan.com/",
	    ORIGIN          :   urlObj.origin,
	    FLOORIDOFL1     :   "68",
	    FLOORIDOFL2     :   "140",
	    FLOORIDOFM      :   "69",
	    FLOORIDOFB2     :   "70",
	    FLOORIDOFB3     :   "138",
	    YUZHIOFL1WHENINL2   :   -70,
	    APP             :   {
	        VERSION: '3.0.0'
	    },
	    EXTEND_RSL_CODE :   parseInt(params.rsl),           // 指定默认展开推荐店铺的列表
	    NEARBY_RANGE    :   +params.nearby_r,               // 指定判断附近是否有外链的误差范围,浮点型
	    NAV_RANGE       :   +params.nav_r,                  // 指定是否到达终点附近的误差范围,浮点型
	    IS_CLEAR_SIGN_CACHE :   +params.clear_sign === 1,   // 指定是否清空缓存
	    IS_USE_GPS_LOCATE   :   +params.gps === 1,          // 当gps等于1时,表示指定用gps进行定位
	    CURSOR_ROTATE_ANGLE_OFFSET  :   +params.crao || 0,  // 游标需要矫正的旋转角度,默认值为0
	    UNIGNOREBEACONS	:	{
	        "68":{
	            "37958":1,
	            "37835":1,
	            "37992":1,
	            "37868":1,
	            "37627":1,
	            "38084":1,
	            "37826":1,
	            "37837":1,
	            "37867":1,
	            "38079":1,
	            "37604":1,"37674":1,"37869":1,"37639":1,
	            "37897":1,"37879":1,"37856":1,"37615":1,"37870":1,
	            "37668":1,"37635":1,"37853":1,
	            "38130":1,"38110":1,"38107":1,"38012":1,"38136":1,
	            "37655":1,"37607":1,"37874":1,"37745":1,"38091":1,"38683":1,//"38201":1,"37663":1,"38248":1,"37884":1,"37675":1,
	            "37860":1,"38557":1,"38618":1,"37880":1,"38684":1,
	            "37886":1,"37942":1,"37906":1,"37937":1,"37811":1,"37843":1,"37892":1,"38031":1,
	            "37939":1,"37933":1,"38189":1,"38152":1,
	            "38162":1,"38195":1,"38151":1,"37929":1,"37908":1,"37903":1,
	            "38155":1,"37949":1,"37777":1,"37775":1,
	            "38300":1,"38351":1,"38306":1,"38334":1,"38286":1,
	            "37720":1,"37793":1,"37622":1,"37900":1,"37727":1,"37669":1,"38315":1,"37673":1,"37617":1,"37721":1,"38059":1,"37779":1,"37834":1,"38294":1,"38027":1,
	            "37670":1,"37963":1,"37845":1,"37600":1,"37850":1,"37806":1,
	            "37944":1,"37786":1,"37662":1,"37649":1,"37785":1,"37871":1,
	            "37956":1,"37844":1,"37883":1,"37796":1,"37610":1,"37977":1,"37840":1,"38304":1,
	            "37609":1,"37634":1,"37623":1,"37707":1,"37681":1,"37987":1,"37694":1,
	            "37821":1,"37825":1,"38251":1,"37898":1
	        },
	        "140":{},
	        "69":{},
	        "70":{},
	        "138":{}
	    }
	};

	log.v('CONFIG', CONF);
	// 缓存信息
	CONF.APPID !== localStorage.appid && (localStorage.appid = CONF.APPID);             // 如果不一致,则更新appId
	CONF.OPENID !== localStorage.openid && (localStorage.openid = CONF.OPENID);         // 如果不一致,则更新openid

	module.exports = CONF;


/***/ },
/* 12 */
/***/ function(module, exports) {

	// import Ajax from "./ajax";
	// var $ = require("./jquery");
	// class BI extend Ajax {
	//   constructor() {
	//     this.defaultParams = {
	//
	//     };
	//   }
	//   createAnalysisData(_data,mapName){
	//     let newData = {};
	//     let data = $.extend(true,{},this.defaultParams_data);
	//     for(var k in data){
	//       if(data[k] === '' || typeof data[k] === 'undefined'){return true}
	//       //newData[mapName + "."+k] = v;//接口调整  不再需要前面的xxxxFormMap了
	//       newData[k] = data[k];
	//     }
	//     return newData;
	//   }
	//
	//
	// }
	//

	/**
	 * 获取字符在页面上显示所占的宽度。除了部分需求特殊的功能，该函数没啥用……
	 * @param  {string} str 字符串
	 * @return {number}     字符串在页面占据的宽度
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	exports.getBytesWidth = getBytesWidth;
	exports.getQueryString = getQueryString;
	exports.analysisUrl = analysisUrl;
	exports.getSortFun = getSortFun;
	exports.setHash = setHash;
	exports.padStart = padStart;
	exports.padEnd = padEnd;
	exports.detectEnv = detectEnv;
	exports.setImgUrlFromOurServer = setImgUrlFromOurServer;
	exports.removeProtocolOfLink = removeProtocolOfLink;
	exports.getElementById = getElementById;
	exports.getOrigin = getOrigin;
	exports.stopPropagation = stopPropagation;
	exports.preventDefault = preventDefault;
	exports.stopPropagationAndPreventDefault = stopPropagationAndPreventDefault;
	exports.setOrigin = setOrigin;
	exports.isArray = isArray;
	exports.parseToNum = parseToNum;

	function getBytesWidth(str) {
	    var span = document.createElement('span'),
	        txt = document.createTextNode(str),
	        w = 1;
	    span.appendChild(txt);
	    document.body.appendChild(span);
	    w = span.offsetWidth;
	    document.body.removeChild(span);
	    return w;
	}

	/**
	 * 获取url的$_GET参数。没啥好说的
	 * @param  {string} name 参数名
	 * @return {object}      参数值
	 */

	function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURIComponent(r[2]);
	    return null;
	}

	/**
	 * 分析url，返回类似location对象类似的结构
	 * @param  {string}  url 缺省为当前页面路径
	 * @return {object}      返回对象格式，类似全局变量location。拆分了$_GET并将之放置于params属性下。
	 */

	function analysisUrl() {
	    var url = arguments.length <= 0 || arguments[0] === undefined ? location.href : arguments[0];
	    // http(s)://asd.com:123/zxc/index.html?a=1&b=2#hash
	    var href = url;

	    var _url$split = url.split("#");

	    var _url$split2 = _slicedToArray(_url$split, 2);

	    var _u0 = _url$split2[0];
	    var hash = _url$split2[1]; // http(s)://asd.com:123/zxc/index.html?a=1&b=2    #    hash
	    var _originIndex = _u0.indexOf("/", location.protocol.indexOf('s') > -1 ? 8 : 7); // http(s)://asd.com:123    /zxc/index.html?a=1&b=2    #    hash
	    var origin = _u0.slice(0, _originIndex);
	    var _u0$slice$split = _u0.slice(_originIndex).split("?");

	    var _u0$slice$split2 = _slicedToArray(_u0$slice$split, 2);

	    var path = _u0$slice$split2[0];
	    // http(s)://asd.com:123
	    var search = _u0$slice$split2[1];
	    var _origin$split = origin.split("://");

	    var _origin$split2 = _slicedToArray(_origin$split, 2);

	    var protocol = _origin$split2[0];
	    // /zxc/index.html      a=1&b=2
	    var host = _origin$split2[1];
	    var _host$split = host.split(":");

	    var _host$split2 = _slicedToArray(_host$split, 2);

	    var hostname = _host$split2[0];
	    // http(s)   asd.com:123
	    var port = _host$split2[1]; // asd.com   123
	    var params = {};

	    protocol += ":";
	    port = port || "";
	    hash = typeof hash === 'undefined' ? "" : hash === "" ? hash : "#" + hash;
	    search = typeof search === 'undefined' ? "" : search;
	    var _s = search.split("&");

	    _s.forEach(function (v, i) {
	        var _v$split = v.split("=");

	        var _v$split2 = _slicedToArray(_v$split, 2);

	        var name = _v$split2[0];
	        var val = _v$split2[1];

	        params[name] = val;
	    });

	    search = search === "" ? "" : "?" + search;
	    return {
	        href: href,
	        hash: hash,
	        origin: origin,
	        path: path,
	        search: search,
	        protocol: protocol,
	        host: host,
	        hostname: hostname,
	        port: port,
	        params: params
	    };
	}

	/**
	 * [].sort(getSortFun("desc","id"));
	 * @param  {[type]} order  [description]
	 * @param  {[type]} sortBy [description]
	 * @return {[type]}        [description]
	 */

	function getSortFun(order, sortBy) {
	    var ordAlpha = order == 'asc' ? '>' : '<';
	    var sortFun = new Function('a', 'b', 'return Number(a.' + sortBy + ')' + ordAlpha + ' Number(b.' + sortBy + ') ? 1 : -1');
	    return sortFun;
	}

	/**
	 * hash替换
	 * @param {string}  hash
	 * @param {Boolean} isReplace 是否替换，即是否不计入history
	 * 考虑这样的情况：#list列出，#list-id显示指定项，#dosth 比如领取之类的东东
	 * #list到#list-id计入history，#list-id 到 #dosth 不计入history
	 * 于是在#dosth返回时返回到#list，但#list再前进，希望到#list-id  如何搞呢……
	 */

	function setHash() {
	    var hash = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var isReplace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    if (isReplace) {
	        location.replace("#" + hash);
	    } else {
	        location.hash = hash;
	    }
	}

	var include = function include(s1, s2) {
	    return s1.indexOf(s2) > -1;
	};

	var uaCurrying = function uaCurrying() {
	    var _ua = navigator.userAgent || navigator.appVersion,
	        isAndroid = !!_ua.match(/(Android)\s+([\d.]+)/),
	        isIpad = !!_ua.match(/(iPad).*OS\s([\d_]+)/),
	        isIphone = !!(!isIpad && _ua.match(/(iPhone\sOS)\s([\d_]+)/)),
	        os = isAndroid ? "Android" : isIpad || isIphone ? "iOS" : "other OS",
	        _osVersion = _ua.match(/Version\/([\d\.]+)/i),
	        osVersion = _osVersion ? _osVersion.pop() : 0;
	    var ua = _ua;
	    //console.log('userAgent:', ua);
	    //console.log("该文件被多次引用，但这句话也只会出现一次？\n然后用js判断手机型号神马的……也是醉了。老衲的手机型号在两个专门检测型号的网站上愣是没检测出来")
	    return {
	        ua: ua, isAndroid: isAndroid, isIpad: isIpad, isIphone: isIphone, os: os, osVersion: osVersion
	    };
	};
	var ua = uaCurrying();

	exports.ua = ua;
	var pad = function pad() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];
	    var appendPosition = arguments.length <= 3 || arguments[3] === undefined ? "first" : arguments[3];

	    typeof string !== "string" ? string = String(string) : "";
	    typeof appendString !== "string" ? appendString = String(appendString) : "";
	    typeof number !== 'number' ? number = Number(number) : "";
	    var l = number - string.length;
	    if (l <= 0) {
	        return string;
	    } else if (appendPosition === "first") {
	        return appendString.repeat(l) + string;
	    } else {
	        return string + appendString.repeat(l);
	    }
	};

	/**
	 * 仿es7的padStart自动补足 http://es6.ruanyifeng.com/#docs/string#padStart，padEnd
	 * @param  {[type]} string       "a"
	 * @param  {[type]} number       5
	 * @param  {[type]} appendString "1"
	 * @return {[type]}              "1111a"
	 */

	function padStart() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];

	    return pad(string, number, appendString, "first");
	}

	/**
	 * 仿es7的padEnd自动补足 http://es6.ruanyifeng.com/#docs/string#padStart，padEnd
	 * @param  {[type]} string       "a"
	 * @param  {[type]} number       5
	 * @param  {[type]} appendString "1"
	 * @return {[type]}              "a1111"
	 */

	function padEnd() {
	    var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	    var number = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var appendString = arguments.length <= 2 || arguments[2] === undefined ? " " : arguments[2];

	    return pad(string, number, appendString, "last");
	}

	/** Begin append by weibin. */

	function detectEnv(host) {
	    host = host || location.host;
	    var env = {
	        local: false,
	        dev: false,
	        uat: false,
	        pro: false
	    };

	    if (host.indexOf('local') > -1 || host.indexOf('192.168.') > -1 || host.indexOf('127.0.') > -1 || host.indexOf('172.16.') > -1) {
	        env.local = true;
	    } else if (host.indexOf('dev') > -1) {
	        env.dev = true;
	    } else if (host.indexOf('uat') > -1) {
	        env.uat = true;
	    } else {
	        env.pro = true;
	    }

	    return env;
	}

	var env = detectEnv();
	var ENV = {
	    LOCAL: env.local,
	    DEV: env.dev,
	    UAT: env.uat,
	    PRO: env.pro
	};

	exports.ENV = ENV;

	function setImgUrlFromOurServer(imgPath) {
	    return ENV.LOCAL ? '//idp.dev2.wizarcan.com' + imgPath : imgPath;
	}

	function removeProtocolOfLink(link) {
	    return link.indexOf('http') > -1 ? link.substr(link.indexOf('//')) : link;
	}

	function getElementById(eleId) {
	    return document.getElementById(eleId);
	}

	function getOrigin() {
	    return env.local ? '//' + (location.search.indexOf('taiguli') > -1 ? 'taiguli' : 'idp') + (location.href.indexOf('dev') > -1 ? '.dev2.' : '') + '.wizarcan.com' : location.origin;
	}

	var urlParams = parseUrlParams();
	exports.urlParams = urlParams;
	//console.log('Url params:', urlParams);

	function stopPropagation(evt) {
	    evt = evt || window.event;
	    evt.stopPropagation();
	}

	function preventDefault(evt) {
	    evt = evt || window.event;
	    evt.preventDefault();
	}

	function stopPropagationAndPreventDefault(evt) {
	    evt = evt || window.event;
	    evt.stopPropagation();
	    evt.preventDefault();
	}

	function setOrigin() {
	    // 本地模拟不同环境的origin
	    if (ENV.LOCAL) {
	        var search = location.search;
	        // 生产环境
	        if (search.includes('env=pro')) {
	            if (search.includes('scene=taiguli')) {
	                return '//taiguli.wizarcan.com';
	            }
	            if (search.includes('scene=home_expo') || search.includes('scene=feile')) {
	                return '//jbh.wizarcan.com';
	            }

	            return '//idp.wizarcan.com';
	        }

	        // uat环境
	        if (search.includes('env=uat')) {
	            return '//idpuat.wizarcan.com';
	        }

	        // dev环境
	        return '//idp.dev2.wizarcan.com';
	    }

	    return location.origin;
	}

	/**
	 * 判断是否是数组
	 * @author weibin
	 * @param obj 待判断类型的对象
	 * @returns {boolean}
	 */

	function isArray(obj) {
	    return toString.call(obj) === '[object Array]';
	}

	/**
	 * 将字符串数字转化成数值数字
	 * @author weibin
	 * @param {Array|*} argv
	 * @returns {*}
	 */

	function parseToNum(argv) {
	    if (isArray(argv)) {
	        for (var i = 0, len = argv.length; i < len; i++) {
	            argv[i] = +argv[i];
	        }
	    } else {
	        argv = +argv;
	    }

	    return argv;
	}

	// Begin private methods.
	function parseUrlParams() {
	    var params = {};

	    var searchStr = decodeURIComponent(location.search.substr(1)),
	        paramArr = searchStr.split('&'),
	        keyValuePair = [],
	        value;

	    // 如果url不带参数直接返回
	    if (!searchStr.trim()) {
	        return params;
	    }

	    for (var i = 0, len = paramArr.length; i < len; i++) {
	        keyValuePair = paramArr[i].split('=');

	        // url参数应该规范的使用键值对方式,不建议包含json对象格式,但是此处还是加入了对json对象的解析,以增强函数处理能力.
	        value = keyValuePair[1];
	        params[keyValuePair[0]] = value ? value.indexOf('":') >= 0 ? JSON.parse(value) : value : undefined;
	    }

	    return params;
	}
	// End private methods.
	/** End append by weibin. */

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license jquery.panzoom.js v2.0.5
	 * Updated: Mon Feb 01 2016
	 * Add pan and zoom functionality to any element
	 * Copyright (c) timmy willison
	 * Released under the MIT license
	 * https://github.com/timmywil/jquery.panzoom/blob/master/MIT-License.txt
	 */

	(function (global, factory) {
	    // AMD
	    // if (typeof define === 'function' && define.amd) {
	    // 	define([ 'jquery' ], function(jQuery) {
	    // 		return factory(global, jQuery);
	    // 	});
	    // // CommonJS/Browserify
	    // } else
	    if (true) {
	        factory(global, __webpack_require__(5));
	        // Global
	    } else {
	        factory(global, global.jQuery);
	    }
	}(typeof window !== 'undefined' ? window : this, function (window, $) {
	    'use strict';

	    // Common properties to lift for touch or pointer events
	    var list = 'over out down up move enter leave cancel'.split(' ');
	    var hook = $.extend({}, $.event.mouseHooks);
	    var events = {};

	    // Support pointer events in IE11+ if available
	    if (window.PointerEvent) {
	        $.each(list, function (i, name) {
	            // Add event name to events property and add fixHook
	            $.event.fixHooks[
	                (events[name] = 'pointer' + name)
	                ] = hook;
	        });
	    } else {
	        var mouseProps = hook.props;
	        // Add touch properties for the touch hook
	        hook.props = mouseProps.concat(['touches', 'changedTouches', 'targetTouches', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']);

	        /**
	         * Support: Android
	         * Android sets pageX/Y to 0 for any touch event
	         * Attach first touch's pageX/pageY and clientX/clientY if not set correctly
	         */
	        hook.filter = function (event, originalEvent) {
	            var touch;
	            var i = mouseProps.length;
	            if (!originalEvent.pageX && originalEvent.touches && (touch = originalEvent.touches[0])) {
	                // Copy over all mouse properties
	                while (i--) {
	                    event[mouseProps[i]] = touch[mouseProps[i]];
	                }
	            }
	            return event;
	        };

	        $.each(list, function (i, name) {
	            // No equivalent touch events for over and out
	            if (i < 2) {
	                events[name] = 'mouse' + name;
	            } else {
	                var touch = 'touch' +
	                    (name === 'down' ? 'start' : name === 'up' ? 'end' : name);
	                // Add fixHook
	                $.event.fixHooks[touch] = hook;
	                // Add event names to events property
	                events[name] = touch + ' mouse' + name;
	            }
	        });
	    }

	    $.pointertouch = events;

	    var document = window.document;
	    var datakey = '__pz__';
	    var slice = Array.prototype.slice;
	    var pointerEvents = !!window.PointerEvent;
	    var supportsInputEvent = (function () {
	        var input = document.createElement('input');
	        input.setAttribute('oninput', 'return');
	        return typeof input.oninput === 'function';
	    })();

	    // Regex
	    var rupper = /([A-Z])/g;
	    var rsvg = /^http:[\w\.\/]+svg$/;
	    var rinline = /^inline/;

	    var floating = '(\\-?[\\d\\.e]+)';
	    var commaSpace = '\\,?\\s*';
	    var rmatrix = new RegExp(
	        '^matrix\\(' +
	        floating + commaSpace +
	        floating + commaSpace +
	        floating + commaSpace +
	        floating + commaSpace +
	        floating + commaSpace +
	        floating + '\\)$'
	    );

	    /**
	     * Utility for determing transform matrix equality
	     * Checks backwards to test translation first
	     * @param {Array} first
	     * @param {Array} second
	     */
	    function matrixEquals(first, second) {
	        var i = first.length;
	        while (--i) {
	            if (+first[i] !== +second[i]) {
	                return false;
	            }
	        }
	        return true;
	    }

	    /**
	     * Creates the options object for reset functions
	     * @param {Boolean|Object} opts See reset methods
	     * @returns {Object} Returns the newly-created options object
	     */
	    function createResetOptions(opts) {
	        var options = {range: true, animate: true};
	        if (typeof opts === 'boolean') {
	            options.animate = opts;
	        } else {
	            $.extend(options, opts);
	        }
	        return options;
	    }

	    /**
	     * Represent a transformation matrix with a 3x3 matrix for calculations
	     * Matrix functions adapted from Louis Remi's jQuery.transform (https://github.com/louisremi/jquery.transform.js)
	     * @param {Array|Number} a An array of six values representing a 2d transformation matrix
	     */
	    function Matrix(a, b, c, d, e, f, g, h, i) {
	        if ($.type(a) === 'array') {
	            this.elements = [
	                +a[0], +a[2], +a[4],
	                +a[1], +a[3], +a[5],
	                0, 0, 1
	            ];
	        } else {
	            this.elements = [
	                a, b, c,
	                d, e, f,
	                g || 0, h || 0, i || 1
	            ];
	        }
	    }

	    Matrix.prototype = {
	        /**
	         * Multiply a 3x3 matrix by a similar matrix or a vector
	         * @param {Matrix|Vector} matrix
	         * @return {Matrix|Vector} Returns a vector if multiplying by a vector
	         */
	        x: function (matrix) {
	            var isVector = matrix instanceof Vector;

	            var a = this.elements,
	                b = matrix.elements;

	            if (isVector && b.length === 3) {
	                // b is actually a vector
	                return new Vector(
	                    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
	                    a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
	                    a[6] * b[0] + a[7] * b[1] + a[8] * b[2]
	                );
	            } else if (b.length === a.length) {
	                // b is a 3x3 matrix
	                return new Matrix(
	                    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
	                    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
	                    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

	                    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
	                    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
	                    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

	                    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
	                    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
	                    a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
	                );
	            }
	            return false; // fail
	        },
	        /**
	         * Generates an inverse of the current matrix
	         * @returns {Matrix}
	         */
	        inverse: function () {
	            var d = 1 / this.determinant(),
	                a = this.elements;
	            return new Matrix(
	                d * ( a[8] * a[4] - a[7] * a[5]),
	                d * (-(a[8] * a[1] - a[7] * a[2])),
	                d * ( a[5] * a[1] - a[4] * a[2]),

	                d * (-(a[8] * a[3] - a[6] * a[5])),
	                d * ( a[8] * a[0] - a[6] * a[2]),
	                d * (-(a[5] * a[0] - a[3] * a[2])),

	                d * ( a[7] * a[3] - a[6] * a[4]),
	                d * (-(a[7] * a[0] - a[6] * a[1])),
	                d * ( a[4] * a[0] - a[3] * a[1])
	            );
	        },
	        /**
	         * Calculates the determinant of the current matrix
	         * @returns {Number}
	         */
	        determinant: function () {
	            var a = this.elements;
	            return a[0] * (a[8] * a[4] - a[7] * a[5]) - a[3] * (a[8] * a[1] - a[7] * a[2]) + a[6] * (a[5] * a[1] - a[4] * a[2]);
	        }
	    };

	    /**
	     * Create a vector containing three values
	     */
	    function Vector(x, y, z) {
	        this.elements = [x, y, z];
	    }

	    /**
	     * Get the element at zero-indexed index i
	     * @param {Number} i
	     */
	    Vector.prototype.e = Matrix.prototype.e = function (i) {
	        return this.elements[i];
	    };

	    /**
	     * Create a Panzoom object for a given element
	     * @constructor
	     * @param {Element} elem - Element to use pan and zoom
	     * @param {Object} [options] - An object literal containing options to override default options
	     *  (See Panzoom.defaults for ones not listed below)
	     * @param {jQuery} [options.$zoomIn] - zoom in buttons/links collection (you can also bind these yourself
	     *  e.g. $button.on('click', function(e) { e.preventDefault(); $elem.panzoom('zoomIn'); });)
	     * @param {jQuery} [options.$zoomOut] - zoom out buttons/links collection on which to bind zoomOut
	     * @param {jQuery} [options.$zoomRange] - zoom in/out with this range control
	     * @param {jQuery} [options.$reset] - Reset buttons/links collection on which to bind the reset method
	     * @param {Function} [options.on[Start|Change|Zoom|Pan|End|Reset] - Optional callbacks for panzoom events
	     */
	    function Panzoom(elem, options) {

	        // Allow instantiation without `new` keyword
	        if (!(this instanceof Panzoom)) {
	            return new Panzoom(elem, options);
	        }

	        // Sanity checks
	        if (elem.nodeType !== 1) {
	            $.error('Panzoom called on non-Element node');
	        }
	        if (!$.contains(document, elem)) {
	            $.error('Panzoom element must be attached to the document');
	        }

	        // Don't remake
	        var d = $.data(elem, datakey);
	        if (d) {
	            return d;
	        }

	        // Extend default with given object literal
	        // Each instance gets its own options
	        this.options = options = $.extend({}, Panzoom.defaults, options);
	        this.elem = elem;
	        var $elem = this.$elem = $(elem);
	        this.$set = options.$set && options.$set.length ? options.$set : $elem;
	        this.$doc = $(elem.ownerDocument || document);
	        this.$parent = $elem.parent();

	        // This is SVG if the namespace is SVG
	        // However, while <svg> elements are SVG, we want to treat those like other elements

	        var $sx_elem = $elem, sx_elem = $sx_elem[0];
	        if (this.options.target) {
	            $sx_elem = $elem.find(this.options.target);
	            sx_elem = $sx_elem[0];
	        }
	        //var viewBox = this.$parent.find("svg")[0].getAttribute("viewBox").split(" ")
	        // this.viewX = viewBox[2];
	        // this.viewY = viewBox[3];
	        this.isSVG = rsvg.test(sx_elem.namespaceURI) && sx_elem.nodeName.toLowerCase() !== 'svg';


	        this.panning = false;

	        // Save the original transform value
	        // Save the prefixed transform style key
	        // Set the starting transform
	        this._buildTransform();

	        // Build the appropriately-prefixed transform style property name
	        // De-camelcase
	        this._transform = !this.isSVG && $.cssProps.transform.replace(rupper, '-$1').toLowerCase();

	        // Build the transition value
	        this._buildTransition();

	        // Build containment dimensions
	        this.resetDimensions();

	        // Add zoom and reset buttons to `this`
	        var $empty = $();
	        var self = this;
	        $.each(['$zoomIn', '$zoomOut', '$zoomRange', '$reset'], function (i, name) {
	            self[name] = options[name] || $empty;
	        });

	        this.enable();

	        // Save the instance
	        $.data(elem, datakey, this);
	    }

	    // Attach regex for possible use (immutable)
	    Panzoom.rmatrix = rmatrix;

	    // Container for event names
	    Panzoom.events = $.pointertouch;

	    Panzoom.defaults = {
	        // Should always be non-empty
	        // Used to bind jQuery events without collisions
	        // A guid is not added here as different instantiations/versions of panzoom
	        // on the same element is not supported, so don't do it.
	        eventNamespace: '.panzoom',

	        // Whether or not to transition the scale
	        transition: true,

	        // Default cursor style for the element
	        cursor: 'move',

	        // There may be some use cases for zooming without panning or vice versa
	        disablePan: false,
	        disableZoom: false,

	        // The increment at which to zoom
	        // adds/subtracts to the scale each time zoomIn/Out is called
	        increment: 0.3,

	        minScale: 0.4,
	        maxScale: 5,

	        // The default step for the range input
	        // Precendence: default < HTML attribute < option setting
	        rangeStep: 0.05,

	        // Animation duration (ms)
	        duration: 200,
	        // CSS easing used for scale transition
	        easing: 'ease-in-out',

	        // Indicate that the element should be contained within it's parent when panning
	        // Note: this does not affect zooming outside of the parent
	        // Set this value to 'invert' to only allow panning outside of the parent element (basically the opposite of the normal use of contain)
	        // 'invert' is useful for a large panzoom element where you don't want to show anything behind it
	        contain: false
	    };

	    Panzoom.prototype = {
	        constructor: Panzoom,

	        /**
	         * @returns {Panzoom} Returns the instance
	         */
	        instance: function () {
	            return this;
	        },

	        /**
	         * Enable or re-enable the panzoom instance
	         */
	        enable: function () {
	            // Unbind first
	            this._initStyle();
	            this._bind();
	            this.disabled = false;
	        },

	        /**
	         * Disable panzoom
	         */
	        disable: function () {
	            this.disabled = true;
	            this._resetStyle();
	            this._unbind();
	        },

	        /**
	         * @returns {Boolean} Returns whether the current panzoom instance is disabled
	         */
	        isDisabled: function () {
	            return this.disabled;
	        },

	        /**
	         * Destroy the panzoom instance
	         */
	        destroy: function () {
	            this.disable();
	            $.removeData(this.elem, datakey);
	        },

	        /**
	         * Builds the restricing dimensions from the containment element
	         * Also used with focal points
	         * Call this method whenever the dimensions of the element or parent are changed
	         */
	        resetDimensions: function () {
	            // Reset container properties
	            var $parent = this.$parent;
	            this.container = {
	                width: $parent.innerWidth(),
	                height: $parent.innerHeight()
	            };
	            var po = $parent.offset();
	            var elem = this.elem;
	            var $elem = this.$elem;
	            var dims;
	            if (this.isSVG) {
	                dims = elem.getBoundingClientRect();
	                dims = {
	                    left: dims.left - po.left,
	                    top: dims.top - po.top,
	                    width: dims.width,
	                    height: dims.height,
	                    margin: {left: 0, top: 0}
	                };
	            } else {
	                dims = {
	                    left: $.css(elem, 'left', true) || 0,
	                    top: $.css(elem, 'top', true) || 0,
	                    width: $elem.innerWidth(),
	                    height: $elem.innerHeight(),
	                    margin: {
	                        top: $.css(elem, 'marginTop', true) || 0,
	                        left: $.css(elem, 'marginLeft', true) || 0
	                    }
	                };
	            }
	            dims.widthBorder = ($.css(elem, 'borderLeftWidth', true) + $.css(elem, 'borderRightWidth', true)) || 0;
	            dims.heightBorder = ($.css(elem, 'borderTopWidth', true) + $.css(elem, 'borderBottomWidth', true)) || 0;
	            this.dimensions = dims;
	        },

	        /**
	         * Return the element to it's original transform matrix
	         * @param {Boolean} [options] If a boolean is passed, animate the reset (default: true). If an options object is passed, simply pass that along to setMatrix.
	         * @param {Boolean} [options.silent] Silence the reset event
	         */
	        reset: function (options) {
	            options = createResetOptions(options);
	            // Reset the transform to its original value
	            var matrix = this.setMatrix(this._origTransform, options);
	            if (!options.silent) {
	                this._trigger('reset', matrix);
	            }
	        },

	        /**
	         * Only resets zoom level
	         * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to zoom()
	         */
	        resetZoom: function (options) {
	            options = createResetOptions(options);
	            var origMatrix = this.getMatrix(this._origTransform);
	            options.dValue = origMatrix[3];
	            this.zoom(origMatrix[0], options);
	        },

	        /**
	         * Only reset panning
	         * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to pan()
	         */
	        resetPan: function (options) {
	            var origMatrix = this.getMatrix(this._origTransform);
	            this.pan(origMatrix[4], origMatrix[5], createResetOptions(options));
	        },

	        /**
	         * Sets a transform on the $set
	         * @param {String} transform
	         */
	        setTransform: function (transform) {
	            var method = this.isSVG ? 'attr' : 'style';
	            var $set = this.$set;
	            if (this.options.target) {
	                $set = $set.find(this.options.target);
	            }
	            var i = $set.length;
	            while (i--) {
	                $[method]($set[i], 'transform', transform);
	            }
	        },

	        /**
	         * Retrieving the transform is different for SVG
	         *  (unless a style transform is already present)
	         * Uses the $set collection for retrieving the transform
	         * @param {String} [transform] Pass in an transform value (like 'scale(1.1)')
	         *  to have it formatted into matrix format for use by Panzoom
	         * @returns {String} Returns the current transform value of the element
	         */
	        getTransform: function (transform) {
	            var $set = this.$set;
	            if (this.options.target) {
	                $set = $set.find(this.options.target);
	            }
	            var transformElem = $set[0];
	            if (transform) {
	                this.setTransform(transform);
	            } else {
	                // Retrieve the transform
	                transform = $[this.isSVG ? 'attr' : 'style'](transformElem, 'transform');
	            }

	            // Convert any transforms set by the user to matrix format
	            // by setting to computed
	            if (transform !== 'none' && !rmatrix.test(transform) && $.css(transformElem, 'transform') !== "none") {
	                // Get computed and set for next time
	                this.setTransform(transform = $.css(transformElem, 'transform'));
	            }

	            return transform || 'none';
	        },

	        /**
	         * Retrieve the current transform matrix for $elem (or turn a transform into it's array values)
	         * @param {String} [transform] matrix-formatted transform value
	         * @returns {Array} Returns the current transform matrix split up into it's parts, or a default matrix
	         */
	        getMatrix: function (transform) {
	            var matrix = rmatrix.exec(transform || this.getTransform());
	            if (matrix) {
	                matrix.shift();
	            }
	            return matrix || [1, 0, 0, 1, 0, 0];
	        },

	        /**
	         * Given a matrix object, quickly set the current matrix of the element
	         * @param {Array|String} matrix
	         * @param {Boolean} [animate] Whether to animate the transform change
	         * @param {Object} [options]
	         * @param {Boolean|String} [options.animate] Whether to animate the transform change, or 'skip' indicating that it is unnecessary to set
	         * @param {Boolean} [options.contain] Override the global contain option
	         * @param {Boolean} [options.range] If true, $zoomRange's value will be updated.
	         * @param {Boolean} [options.silent] If true, the change event will not be triggered
	         * @returns {Array} Returns the newly-set matrix
	         */
	        setMatrix: function (matrix, options) {
	            if (this.disabled) {
	                return;
	            }
	            if (!options) {
	                options = {};
	            }
	            // Convert to array
	            if (typeof matrix === 'string') {
	                matrix = this.getMatrix(matrix);
	            }
	            var dims, container, marginW, marginH, diffW, diffH, left, top, width, height;
	            var scale = +matrix[0];
	            var $parent = this.$parent;
	            var contain = typeof options.contain !== 'undefined' ? options.contain : this.options.contain;

	            // Apply containment
	            if (contain) {
	                dims = this._checkDims();
	                container = this.container;
	                width = dims.width + dims.widthBorder;
	                height = dims.height + dims.heightBorder;
	                // Use absolute value of scale here as negative scale doesn't mean even smaller
	                marginW = (width * Math.abs(scale)) > container.width ? ((width * Math.abs(scale)) - container.width) / 2 : 0;
	                marginH = (height * Math.abs(scale)) > container.height ? ((height * Math.abs(scale)) - container.height) / 2 : 0;
	                left = dims.left + dims.margin.left;
	                top = dims.top + dims.margin.top;
	                if (contain === 'invert') {
	                    diffW = width > container.width ? width - container.width : 0;
	                    diffH = height > container.height ? height - container.height : 0;
	                    marginW += (container.width - width) / 2;
	                    marginH += (container.height - height) / 2;
	                    matrix[4] = Math.max(Math.min(matrix[4], marginW - left), -marginW - left - diffW);
	                    matrix[5] = Math.max(Math.min(matrix[5], marginH - top), -marginH - top - diffH + dims.heightBorder);
	                } else {
	                    // marginW += dims.widthBorder / 2;
	                    marginH += dims.heightBorder / 2;
	                    diffW = container.width > width ? container.width - width : 0;
	                    diffH = container.height > height ? container.height - height : 0;
	                    // If the element is not naturally centered, assume full margin right
	                    if ($parent.css('textAlign') !== 'center' || !rinline.test($.css(this.elem, 'display'))) {
	                        marginW = marginH = 0;
	                    } else {
	                        diffW = 0;
	                    }
	                    matrix[4] = Math.min(
	                        Math.max(matrix[4], marginW - left),
	                        -marginW - left + diffW
	                    );
	                    matrix[5] = Math.min(
	                        Math.max(matrix[5], marginH - top),
	                        -marginH - top + diffH
	                    );
	                }
	            }
	            if (options.animate !== 'skip') {
	                // Set transition
	                this.transition(!options.animate);
	            }
	            // Update range
	            if (options.range) {
	                this.$zoomRange.val(scale);
	            }

	            // Set the matrix on this.$set
	            this.setTransform('matrix(' + matrix.join(',') + ')');

	            if (!options.silent) {
	                this._trigger('change', matrix);
	            }

	            return matrix;
	        },

	        /**
	         * @returns {Boolean} Returns whether the panzoom element is currently being dragged
	         */
	        isPanning: function () {
	            return this.panning;
	        },

	        /**
	         * Apply the current transition to the element, if allowed
	         * @param {Boolean} [off] Indicates that the transition should be turned off
	         */
	        transition: function (off) {
	            if (!this._transition) {
	                return;
	            }
	            var transition = off || !this.options.transition ? 'none' : this._transition;
	            var $set = this.$set;
	            if (this.options.target) {
	                $set = $set.find(this.options.target);
	            }
	            var i = $set.length;
	            while (i--) {
	                // Avoid reflows when zooming
	                if ($.style($set[i], 'transition') !== transition) {
	                    $.style($set[i], 'transition', transition);
	                }
	            }
	        },

	        /**
	         * Pan the element to the specified translation X and Y
	         * Note: this is not the same as setting jQuery#offset() or jQuery#position()
	         * @param {Number} x
	         * @param {Number} y
	         * @param {Object} [options] These options are passed along to setMatrix
	         * @param {Array} [options.matrix] The matrix being manipulated (if already known so it doesn't have to be retrieved again)
	         * @param {Boolean} [options.silent] Silence the pan event. Note that this will also silence the setMatrix change event.
	         * @param {Boolean} [options.relative] Make the x and y values relative to the existing matrix
	         */
	        pan: function (x, y, options) {
	            if (this.options.disablePan) {
	                return;
	            }
	            if (!options) {
	                options = {};
	            }
	            var matrix = options.matrix;
	            if (!matrix) {
	                matrix = this.getMatrix();
	            }
	            // Cast existing matrix values to numbers
	            if (options.relative) {
	                x += +matrix[4];
	                y += +matrix[5];
	            }
	            matrix[4] = x;
	            matrix[5] = y;
	            this.setMatrix(matrix, options);
	            if (!options.silent) {
	                this._trigger('pan', matrix[4], matrix[5]);
	            }
	        },

	        /**
	         * Zoom in/out the element using the scale properties of a transform matrix
	         * @param {Number|Boolean} [scale] The scale to which to zoom or a boolean indicating to transition a zoom out
	         * @param {Object} [opts] All global options can be overwritten by this options object. For example, override the default increment.
	         * @param {Boolean} [opts.noSetRange] Specify that the method should not set the $zoomRange value (as is the case when $zoomRange is calling zoom on change)
	         * @param {jQuery.Event|Object} [opts.focal] A focal point on the panzoom element on which to zoom.
	         *  If an object, set the clientX and clientY properties to the position relative to the parent
	         * @param {Boolean} [opts.animate] Whether to animate the zoom (defaults to true if scale is not a number, false otherwise)
	         * @param {Boolean} [opts.silent] Silence the zoom event
	         * @param {Array} [opts.matrix] Optionally pass the current matrix so it doesn't need to be retrieved
	         * @param {Number} [opts.dValue] Think of a transform matrix as four values a, b, c, d
	         *  where a/d are the horizontal/vertical scale values and b/c are the skew values
	         *  (5 and 6 of matrix array are the tx/ty transform values).
	         *  Normally, the scale is set to both the a and d values of the matrix.
	         *  This option allows you to specify a different d value for the zoom.
	         *  For instance, to flip vertically, you could set -1 as the dValue.
	         */
	        zoom: function (scale, opts) {
	            // Shuffle arguments
	            if (typeof scale === 'object') {
	                opts = scale;
	                scale = null;
	            } else if (!opts) {
	                opts = {};
	            }
	            var options = $.extend({}, this.options, opts);
	            // Check if disabled
	            if (options.disableZoom) {
	                return;
	            }
	            var animate = false;
	            var matrix = options.matrix || this.getMatrix();

	            // Calculate zoom based on increment
	            if (typeof scale !== 'number') {
	                scale = +matrix[0] + (options.increment * (scale ? -1 : 1));
	                animate = true;
	            }

	            // Constrain scale
	            if (scale > options.maxScale) {
	                scale = options.maxScale;
	            } else if (scale < options.minScale) {
	                scale = options.minScale;
	            }

	            // Calculate focal point based on scale
	            var focal = options.focal;
	            if (focal && !options.disablePan) {
	                // Adapted from code by Florian Günther
	                // https://github.com/florianguenther/zui53
	                var dims = this._checkDims();
	                var clientX = focal.clientX;
	                var clientY = focal.clientY;
	                // Adjust the focal point for default transform-origin => 50% 50%
	                if (!this.isSVG) {
	                    clientX -= (dims.width + dims.widthBorder) / 2;
	                    clientY -= (dims.height + dims.heightBorder) / 2;
	                }
	                var clientV = new Vector(clientX, clientY, 1);
	                var surfaceM = new Matrix(matrix);
	                // Supply an offset manually if necessary
	                var o = this.parentOffset || this.$parent.offset();
	                var offsetM = new Matrix(1, 0, o.left - this.$doc.scrollLeft(), 0, 1, o.top - this.$doc.scrollTop());
	                var surfaceV = surfaceM.inverse().x(offsetM.inverse().x(clientV));
	                var scaleBy = scale / matrix[0];
	                surfaceM = surfaceM.x(new Matrix([scaleBy, 0, 0, scaleBy, 0, 0]));
	                clientV = offsetM.x(surfaceM.x(surfaceV));
	                matrix[4] = +matrix[4] + (clientX - clientV.e(0));
	                matrix[5] = +matrix[5] + (clientY - clientV.e(1));
	            }

	            // if(0 && options.sx_zoom && !options.disablePan && this.isSVG){
	            // 	var	sx_w	=	this.container.width,
	            // 		sx_h	=	this.container.height,
	            // 		sx_mx4	=	Number(matrix[4]),
	            // 		sx_mx5	=	Number(matrix[5]),
	            // 		sx_ox	=	- sx_w / 2 + 2 * sx_mx4 ,//+ sx_w / 2,
	            // 		sx_oy	=	- sx_h / 2 - 2 * sx_mx5 ;//+ sx_h / 2;
	            // 	matrix[4] = sx_ox;
	            // 	matrix[5] = sx_oy;
	            // }
	            // if(0 && options.sx_zoom && !options.disablePan && this.isSVG){
	            // 	var	sx_svg	=	this.$parent[0],
	            // 		sx_viewBox	=	sx_svg.getAttribute("viewBox").split(" "),
	            // 		sx_mx4	=	Number(matrix[4]),
	            // 		sx_mx5	=	Number(matrix[5]);
	            // 	sx_viewBox[0] = sx_viewBox[0] - sx_mx4;
	            // 	sx_viewBox[1] = sx_viewBox[1] - sx_mx5;
	            // 	matrix[4] = 0;
	            // 	matrix[5] = 0;
	            // 	sx_svg.setAttribute("viewBox",sx_viewBox.join(" "));
	            // }
	            if (options.sx_zoom /*&& !options.disablePan*/ && this.isSVG) {
	                var viewBox = this.$elem.children('svg')[0].getAttribute("viewBox").split(" ")
	                var sx_w = viewBox[2],
	                    sx_h = viewBox[3],
	                    sx_mx4 = Number(matrix[4]),
	                    sx_mx5 = Number(matrix[5]),
	                    sx_old_scale = Number(matrix[0]),
	                    sx_ox = sx_w / 2 - (-sx_mx4 + sx_w / 2) / sx_old_scale * scale,
	                    sx_oy = sx_h / 2 - (-sx_mx5 + sx_h / 2) / sx_old_scale * scale;

	                //console.log(0,JSON.stringify(matrix),sx_w,sx_h,sx_mx4,sx_mx5,sx_ox,sx_oy);
	                matrix[4] = sx_ox;
	                matrix[5] = sx_oy;
	                //console.log(1,JSON.stringify(matrix));
	            }

	            // Set the scale
	            matrix[0] = scale;
	            matrix[3] = typeof options.dValue === 'number' ? options.dValue : scale;

	            // Calling zoom may still pan the element
	            this.setMatrix(matrix, {
	                animate: typeof options.animate === 'boolean' ? options.animate : animate,
	                // Set the zoomRange value
	                range: !options.noSetRange
	            });

	            // Trigger zoom event
	            if (!options.silent) {
	                this._trigger('zoom', matrix[0], options);
	            }
	        },

	        /**
	         * Get/set option on an existing instance
	         * @returns {Array|undefined} If getting, returns an array of all values
	         *   on each instance for a given key. If setting, continue chaining by returning undefined.
	         */
	        option: function (key, value) {
	            var options;
	            if (!key) {
	                // Avoids returning direct reference
	                return $.extend({}, this.options);
	            }

	            if (typeof key === 'string') {
	                if (arguments.length === 1) {
	                    return this.options[key] !== undefined ?
	                        this.options[key] :
	                        null;
	                }
	                options = {};
	                options[key] = value;
	            } else {
	                options = key;
	            }

	            this._setOptions(options);
	        },

	        /**
	         * Internally sets options
	         * @param {Object} options - An object literal of options to set
	         */
	        _setOptions: function (options) {
	            $.each(options, $.proxy(function (key, value) {
	                switch (key) {
	                    case 'disablePan':
	                        this._resetStyle();
	                    /* falls through */
	                    case '$zoomIn':
	                    case '$zoomOut':
	                    case '$zoomRange':
	                    case '$reset':
	                    case 'disableZoom':
	                    case 'onStart':
	                    case 'onChange':
	                    case 'onZoom':
	                    case 'onPan':
	                    case 'onEnd':
	                    case 'onReset':
	                    case 'eventNamespace':
	                        this._unbind();
	                }
	                this.options[key] = value;
	                switch (key) {
	                    case 'disablePan':
	                        this._initStyle();
	                    /* falls through */
	                    case '$zoomIn':
	                    case '$zoomOut':
	                    case '$zoomRange':
	                    case '$reset':
	                        // Set these on the instance
	                        this[key] = value;
	                    /* falls through */
	                    case 'disableZoom':
	                    case 'onStart':
	                    case 'onChange':
	                    case 'onZoom':
	                    case 'onPan':
	                    case 'onEnd':
	                    case 'onReset':
	                    case 'eventNamespace':
	                        this._bind();
	                        break;
	                    case 'cursor':
	                        $.style(this.elem, 'cursor', value);
	                        break;
	                    case 'minScale':
	                        this.$zoomRange.attr('min', value);
	                        break;
	                    case 'maxScale':
	                        this.$zoomRange.attr('max', value);
	                        break;
	                    case 'rangeStep':
	                        this.$zoomRange.attr('step', value);
	                        break;
	                    case 'startTransform':
	                        this._buildTransform();
	                        break;
	                    case 'duration':
	                    case 'easing':
	                        this._buildTransition();
	                    /* falls through */
	                    case 'transition':
	                        this.transition();
	                        break;
	                    case '$set':
	                        if (value instanceof $ && value.length) {
	                            this.$set = value;
	                            // Reset styles
	                            this._initStyle();
	                            this._buildTransform();
	                        }
	                }
	            }, this));
	        },

	        /**
	         * Initialize base styles for the element and its parent
	         */
	        _initStyle: function () {
	            var styles = {
	                // Promote the element to it's own compositor layer
	                'backface-visibility': 'hidden',
	                // Set to defaults for the namespace
	                'transform-origin': this.isSVG ? '0 0' : '50% 50%'
	            };
	            // Set elem styles
	            if (!this.options.disablePan) {
	                styles.cursor = this.options.cursor;
	            }
	            this.$set.css(styles);

	            // Set parent to relative if set to static
	            var $parent = this.$parent;
	            // No need to add styles to the body
	            if ($parent.length && !$.nodeName($parent[0], 'body')) {
	                styles = {
	                    overflow: 'hidden'
	                };
	                if ($parent.css('position') === 'static') {
	                    styles.position = 'relative';
	                }
	                $parent.css(styles);
	            }
	        },

	        /**
	         * Undo any styles attached in this plugin
	         */
	        _resetStyle: function () {
	            this.$elem.css({
	                'cursor': '',
	                'transition': ''
	            });
	            this.$parent.css({
	                'overflow': '',
	                'position': ''
	            });
	        },

	        /**
	         * Binds all necessary events
	         */
	        _bind: function () {
	            var self = this;
	            var options = this.options;
	            var ns = options.eventNamespace;
	            var str_start = pointerEvents ? 'pointerdown' + ns : ('touchstart' + ns + ' mousedown' + ns);
	            var str_click = pointerEvents ? 'pointerup' + ns : ('touchend' + ns + ' click' + ns);
	            var events = {};
	            var $reset = this.$reset;
	            var $zoomRange = this.$zoomRange;

	            // Bind panzoom events from options
	            $.each(['Start', 'Change', 'Zoom', 'Pan', 'End', 'Reset'], function () {
	                var m = options['on' + this];
	                if ($.isFunction(m)) {
	                    events['panzoom' + this.toLowerCase() + ns] = m;
	                }
	            });

	            // Bind $elem drag and click/touchdown events
	            // Bind touchstart if either panning or zooming is enabled
	            if (!options.disablePan || !options.disableZoom) {
	                events[str_start] = function (e) {
	                    var touches;
	                    if (e.type === 'touchstart' ?
	                            // Touch
	                        (touches = e.touches) &&
	                        ((touches.length === 1 && !options.disablePan) || touches.length === 2) :
	                            // Mouse/Pointer: Ignore right click
	                        !options.disablePan && e.which === 1) {

	                        e.preventDefault();
	                        e.stopPropagation();
	                        self._startMove(e, touches);
	                    }
	                };
	            }
	            this.$elem.on(events);

	            // Bind reset
	            if ($reset.length) {
	                $reset.on(str_click, function (e) {
	                    e.preventDefault();
	                    self.reset();
	                });
	            }

	            // Set default attributes for the range input
	            if ($zoomRange.length) {
	                $zoomRange.attr({
	                    // Only set the range step if explicit or
	                    // set the default if there is no attribute present
	                    step: options.rangeStep === Panzoom.defaults.rangeStep &&
	                    $zoomRange.attr('step') ||
	                    options.rangeStep,
	                    min: options.minScale,
	                    max: options.maxScale
	                }).prop({
	                    value: this.getMatrix()[0]
	                });
	            }

	            // No bindings if zooming is disabled
	            if (options.disableZoom) {
	                return;
	            }

	            var $zoomIn = this.$zoomIn;
	            var $zoomOut = this.$zoomOut;

	            // Bind zoom in/out
	            // Don't bind one without the other
	            if ($zoomIn.length && $zoomOut.length) {
	                // preventDefault cancels future mouse events on touch events
	                $zoomIn.on(str_click, function (e) {
	                    e.preventDefault();
	                    self.zoom(undefined, {sx_zoom: true});
	                });
	                $zoomOut.on(str_click, function (e) {
	                    e.preventDefault();
	                    self.zoom(true, {sx_zoom: true});
	                });
	            }

	            if ($zoomRange.length) {
	                events = {};
	                // Cannot prevent default action here, just use pointerdown/mousedown
	                events[(pointerEvents ? 'pointerdown' : 'mousedown') + ns] = function () {
	                    self.transition(true);
	                };
	                // Zoom on input events if available and change events
	                // See https://github.com/timmywil/jquery.panzoom/issues/90
	                events[(supportsInputEvent ? 'input' : 'change') + ns] = function () {
	                    self.zoom(+this.value, {noSetRange: true});
	                };
	                $zoomRange.on(events);
	            }
	        },

	        /**
	         * Unbind all events
	         */
	        _unbind: function () {
	            this.$elem
	                .add(this.$zoomIn)
	                .add(this.$zoomOut)
	                .add(this.$reset)
	                .off(this.options.eventNamespace);
	        },

	        /**
	         * Builds the original transform value
	         */
	        _buildTransform: function () {
	            // Save the original transform
	            // Retrieving this also adds the correct prefixed style name
	            // to jQuery's internal $.cssProps
	            return this._origTransform = this.getTransform(this.options.startTransform);
	        },

	        /**
	         * Set transition property for later use when zooming
	         * If SVG, create necessary animations elements for translations and scaling
	         */
	        _buildTransition: function () {
	            if (this._transform) {
	                var options = this.options;
	                this._transition = this._transform + ' ' + options.duration + 'ms ' + options.easing;
	            }
	        },

	        /**
	         * Checks dimensions to make sure they don't need to be re-calculated
	         */
	        _checkDims: function () {
	            var dims = this.dimensions;
	            // Rebuild if width or height is still 0
	            if (!dims.width || !dims.height) {
	                this.resetDimensions();
	            }
	            return this.dimensions;
	        },

	        /**
	         * Calculates the distance between two touch points
	         * Remember pythagorean?
	         * @param {Array} touches
	         * @returns {Number} Returns the distance
	         */
	        _getDistance: function (touches) {
	            var touch1 = touches[0];
	            var touch2 = touches[1];
	            return Math.sqrt(Math.pow(Math.abs(touch2.clientX - touch1.clientX), 2) + Math.pow(Math.abs(touch2.clientY - touch1.clientY), 2));
	        },

	        /**
	         * Constructs an approximated point in the middle of two touch points
	         * @returns {Object} Returns an object containing pageX and pageY
	         */
	        _getMiddle: function (touches) {
	            var touch1 = touches[0];
	            var touch2 = touches[1];
	            return {
	                clientX: ((touch2.clientX - touch1.clientX) / 2) + touch1.clientX,
	                clientY: ((touch2.clientY - touch1.clientY) / 2) + touch1.clientY
	            };
	        },

	        /**
	         * Trigger a panzoom event on our element
	         * The event is passed the Panzoom instance
	         * @param {String|jQuery.Event} event
	         * @param {Mixed} arg1[, arg2, arg3, ...] Arguments to append to the trigger
	         */
	        _trigger: function (event) {
	            if (typeof event === 'string') {
	                event = 'panzoom' + event;
	            }
	            this.$elem.triggerHandler(event, [this].concat(slice.call(arguments, 1)));
	        },

	        /**
	         * Starts the pan
	         * This is bound to mouse/touchmove on the element
	         * @param {jQuery.Event} event An event with pageX, pageY, and possibly the touches list
	         * @param {TouchList} [touches] The touches list if present
	         */
	        _startMove: function (event, touches) {
	            var move, moveEvent, endEvent,
	                startDistance, startScale, startMiddle,
	                startPageX, startPageY;
	            var self = this;
	            var options = this.options;
	            var ns = options.eventNamespace;
	            var matrix = this.getMatrix();
	            var original = matrix.slice(0);
	            var origPageX = +original[4];
	            var origPageY = +original[5];
	            var panOptions = {matrix: matrix, animate: 'skip'};

	            // Use proper events
	            if (pointerEvents) {
	                moveEvent = 'pointermove';
	                endEvent = 'pointerup';
	            } else if (event.type === 'touchstart') {
	                moveEvent = 'touchmove';
	                endEvent = 'touchend';
	            } else {
	                moveEvent = 'mousemove';
	                endEvent = 'mouseup';
	            }

	            // Add namespace
	            moveEvent += ns;
	            endEvent += ns;

	            // Remove any transitions happening
	            this.transition(true);

	            // Indicate that we are currently panning
	            this.panning = true;

	            // Trigger start event
	            this._trigger('start', event, touches);

	            if (touches && touches.length === 2) {
	                startDistance = this._getDistance(touches);
	                startScale = +matrix[0];
	                startMiddle = this._getMiddle(touches);
	                move = function (e) {
	                    e.preventDefault();

	                    // Calculate move on middle point
	                    var middle = self._getMiddle(touches = e.touches);
	                    var diff = self._getDistance(touches) - startDistance;

	                    // Set zoom
	                    self.zoom(diff * (options.increment / 100) + startScale, {
	                        focal: middle,
	                        matrix: matrix,
	                        animate: false
	                    });

	                    // Set pan
	                    self.pan(
	                        +matrix[4] + middle.clientX - startMiddle.clientX,
	                        +matrix[5] + middle.clientY - startMiddle.clientY,
	                        panOptions
	                    );
	                    startMiddle = middle;
	                };
	            } else {
	                startPageX = event.pageX;
	                startPageY = event.pageY;

	                /**
	                 * Mousemove/touchmove function to pan the element
	                 * @param {Object} e Event object
	                 */
	                move = function (e) {
	                    e.preventDefault();
	                    var opt = panOptions;
	                    if (self.options.target) {
	                        opt = $.extend({}, panOptions, {
	                            sx_pan: true,
	                            origPageX: origPageX,
	                            origPageY: origPageY,
	                            px: e.pageX,
	                            py: e.pageY,
	                            startPageX: startPageX,
	                            startPageY: startPageY,
	                            dx: e.pageX - startPageX,
	                            dy: e.pageY - startPageY
	                        });
	                    }
	                    self.pan(
	                        origPageX + e.pageX - startPageX,
	                        origPageY + e.pageY - startPageY,
	                        opt
	                    );
	                };
	            }

	            // Bind the handlers
	            $(document)
	                .off(ns)
	                .on(moveEvent, move)
	                .on(endEvent, function (e) {
	                    e.preventDefault();
	                    // Unbind all document events
	                    $(this).off(ns);
	                    self.panning = false;
	                    // Trigger our end event
	                    // Simply set the type to "panzoomend" to pass through all end properties
	                    // jQuery's `not` is used here to compare Array equality
	                    e.type = 'panzoomend';
	                    self._trigger(e, matrix, !matrixEquals(matrix, original));
	                });
	        }
	    };

	    // Add Panzoom as a static property
	    $.Panzoom = Panzoom;

	    /**
	     * Extend jQuery
	     * @param {Object|String} options - The name of a method to call on the prototype
	     *  or an object literal of options
	     * @returns {jQuery|Mixed} jQuery instance for regular chaining or the return value(s) of a panzoom method call
	     */
	    $.fn.panzoom = function (options) {
	        var instance, args, m, ret;

	        // Call methods widget-style
	        if (typeof options === 'string') {
	            ret = [];
	            args = slice.call(arguments, 1);
	            this.each(function () {
	                instance = $.data(this, datakey);

	                if (!instance) {
	                    ret.push(undefined);

	                    // Ignore methods beginning with `_`
	                } else if (options.charAt(0) !== '_' &&
	                    typeof (m = instance[options]) === 'function' &&
	                        // If nothing is returned, do not add to return values
	                    (m = m.apply(instance, args)) !== undefined) {

	                    ret.push(m);
	                }
	            });

	            // Return an array of values for the jQuery instances
	            // Or the value itself if there is only one
	            // Or keep chaining
	            return ret.length ?
	                (ret.length === 1 ? ret[0] : ret) :
	                this;
	        }

	        return this.each(function () {
	            new Panzoom(this, options);
	        });
	    };

	    return Panzoom;
	}));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function ($) {
	    'use strict';

	    var defaults = {
	            'maps': [{
	                'path': 'floorplan.svg',
	                'id': 'map.1'
	            }],
	            'path': {
	                color: 'red',
	                radius: 10,
	                speed: 999,
	                width: 3
	            },
	            'startpoint': function () {
	                return 'startpoint';
	            },
	            'endpoint': false,
	            'accessibleRoute': false,
	            'defaultMap': function () {
	                return 'map.1';
	            },
	            'loadMessage': 'Loading',
	            'dataStoreCache': null,
	            'showLocation': false,
	            'locationIndicator': {
	                fill: 'red',
	                height: 40
	            },
	            'pinchToZoom': !!$.fn.tap, // requires jquery.panzoom
	            'zoomToRoute': true,
	            'zoomPadding': 25,
	            'floorChangeAnimationDelay': 1250,
	            "turnningNotify": !0,
	            'buildDataStore': false,
	        },
	        dataStore,
	        dataStoreCache;
	    var isFistBuild = true,
	        isGetingJson = false;

	    /**
	     * $('#myMaps').wayfinding('startpoint', $(this).val());
	     * @param action
	     * @param options
	     * @param options2
	     * @param callback
	     * @returns {*}
	     */
	    $.fn.wayfinding = function (action, options, options2, callback) {

	        var passed = options,
	            obj,
	            maps,
	            defaultMap,
	            startpoint,
	            portalSegments = [],
	            solution,
	            result,
	            drawing;
	        var passed2 = options2;
	        var shake = 0;
	        var shakecount = 0;
	        var realPath;


	        /**
	         * 特殊字符的转义
	         * @param sel
	         * @returns {XML|void|string}
	         */
	        function escapeSelector(sel) {
	            return sel.replace(/(:|\.|\[|\])/g, '\\$1');
	        }


	        /**
	         * 判断点是否在线段上
	         * @param {number} px 点的x坐标
	         * @param {number} py 点的y坐标
	         * @param {object} line 线段,包含起止点(x, y)和(m, n)
	         * @returns {boolean}
	         */
	        function isPointOnLine(px, py, line) {
	            // 转化成数值
	            px = +px;
	            py = +py;
	            line.x = +line.x, line.m = +line.m;
	            line.y = +line.y, line.n = +line.n;

	            var Xmax = line.x > line.m ? line.x : line.m,
	                Xmin = line.x < line.m ? line.x : line.m,
	                Ymax = line.y > line.n ? line.y : line.n,
	                Ymin = line.y < line.n ? line.y : line.n,
	                deltaDist;

	            if (px >= Xmin && px <= Xmax && py >= Ymin && py <= Ymax) {
	                deltaDist = Math.abs(direction(px, py, line));
	                log.v('判断点是否在线上的结算误差值', deltaDist);
	                if (deltaDist <= 0.5) {
	                    return true;
	                }
	            }

	            return false;
	        }

	        /**
	         * 判断向量相等
	         * @param {number} px 点的x坐标
	         * @param {number} py 点的y坐标
	         * @param {object} line 线段,包含起止点(x, y)和(m, n)
	         * @returns {number}
	         */
	        function direction(px, py, line) {
	            // 转化成数值
	            px = +px;
	            py = +py;
	            line.x = +line.x, line.m = +line.m;
	            line.y = +line.y, line.n = +line.n;

	            return Math.abs((line.y - py) * (px - line.m)) - Math.abs((py - line.n) * (line.x - px));
	        }

	        /**
	         * 楼层切换
	         * @param  {string} floor        [description]
	         * @param  {object} el           [description]
	         * @param  {boolean} ifNotTrigger 是否触发floorChange事件，针对规划路径时的导航
	         * @return {*}              [description]
	         */
	        function switchFloor(floor, el, ifNotTrigger) {
	            // if (typeof gTools == 'object' && gTools.node && $('div:visible', obj).prop('id') == floor) {
	            //     //return
	            // }
		    
	            var height = $(el).height();

	            $(el).height(height); // preserve height as I'm not yet set switching


	            if (!drawing) {
	                $('div', el).hide();
	                $('#' + floor, el).show(0, function () {
	                    if (!ifNotTrigger) {
	                        $(el).trigger('wayfinding:floorChanged', {
	                            mapId: floor
	                        });
	                    }
	                });
	            }


	            var i, level, mapNum, pathLength;

	            if (drawing) {
	                mapNum = -1;
	                for (i = 0; i < maps.length; i++) {
	                    if (maps[i] === floor) {
	                        mapNum = i;
	                        break;
	                    }
	                }
	                level = -1;
	                for (i = 0; i < drawing.length; i++) {
	                    if (drawing[i].floor === mapNum) {
	                        level = i;
	                        break;
	                    }
	                }
	                if (level !== -1) {
	                    pathLength = drawing[level].routeLength;
	                    // these next three are potentially redundant now
	                    $(drawing[level].path, el).attr('stroke-dasharray', [pathLength, pathLength]);
	                    $(drawing[level].path, el).attr('stroke-dashoffset', pathLength);
	                    $(drawing[level].path, el).attr('pathLength', pathLength);
	                    $(drawing[level].path, el).attr('stroke-dashoffset', pathLength);

	                    $(drawing[level].path, el).animate({
	                        svgStrokeDashOffset: 0
	                    }, pathLength * options.path.speed); //or move minPath to global variable?
	                }
	            }
	        }


	        /**
	         * 设置options 根据提供的action 和 defaults
	         * 初始化 maps defaultMap startpoint
	         * @param el
	         */
	        function getOptions(el) {
	            //jquery.data() 向元素附加数据，或者取数据：
	            var optionsPrior = el.data('wayfinding:options');
	            drawing = el.data('wayfinding:drawing');
	            //此时的options 是action给到的值 defaults是初始定义的
	            options = $.extend(true, {}, defaults, options);
	            if (optionsPrior !== undefined) {
	                options = optionsPrior;
	            }
	            options = $.metadata ? $.extend(true, {}, options, el.metadata()) : options;
	            maps = options.maps;
	            if (typeof options.defaultMap === 'function') {
	                defaultMap = options.defaultMap();
	            } else {
	                defaultMap = options.defaultMap;
	            }
	            if (typeof options.startpoint === 'function') {
	                startpoint = options.startpoint();
	            } else {
	                startpoint = options.startpoint;
	            }
	        }

	        /**
	         * 设置 el $('myMaps') 的一些数据
	         * @param el
	         */
	        function setOptions(el) {
	            el.data('wayfinding:options', options);
	            el.data('wayfinding:drawing', drawing);
	            el.data('wayfinding:data', dataStore);
	        }

	        /**
	         * el $('#myMaps')
	         * @param el
	         * 检查maps是否存在相同的ID，defaultMap ID是否正确
	         */
	        function checkIds(el) {
	            var mapNum,
	                checkNum,
	                reassign = false,
	                defaultMapValid = false,
	                status;

	            status = $(el).find('div').hide().end().append('<div id="WayfindingStatus" style="">' + options.loadMessage + '</div>');
	            if (maps.length > 0) {
	                for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                    for (checkNum = mapNum; checkNum < maps.length; checkNum++) {
	                        if (mapNum !== checkNum && maps[mapNum].id === maps[checkNum].id) {
	                            reassign = true;
	                        }
	                    }
	                }
	                if (reassign === true) {
	                    $(status).text("存在相同的mapID");
	                }
	                for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                    if (maps[mapNum].id === defaultMap) {
	                        defaultMapValid = true;
	                    }
	                }
	                if (defaultMapValid === false) {
	                    $(status).text("defaultMap ID 不存在");
	                }
	            } else {
	                $(status).text("maps是空的！");
	            }
	        }

	        /**
	         * 设置广告类型的poi= =
	         * @param {[type]} point [description]
	         * @param {[type]} type  [description]
	         * @param {[type]} el    [description]
	         */
	        function setPoiPoint(point, type, el) {
	            var end,
	                attachPinLocation,
	                x,
	                y,
	                pin;

	            //clears locationIndicators from the maps
	            //$('g.destinationPin', el).remove();

	            console.log(`wayfinding.js => setPoiPoint() => roomId:${escapeSelector(point)}`);
	            if (options.showLocation) {
	                end = $('#Doors #' + escapeSelector(point), el);

	                attachPinLocation = $('svg').has('#Rooms a[id="' + escapeSelector(point) + '"]').find("#cursorBox");
	                if (end.length) {
	                    if (typeof point == 'object') {
	                        x = point.x;
	                        y = point.y;
	                    } else {
	                        x = (Number(end.attr('x1')) + Number(end.attr('x2'))) / 2;
	                        y = (Number(end.attr('y1')) + Number(end.attr('y2'))) / 2;
	                    }

	                    if (type == "couponPin") {
	                        pin = makePin2(x, y, type);
	                        //卡券挡住游标   bug处理
	                        attachPinLocation.find("#Links").append(pin);
	                        return;
	                    } else {
	                        pin = makePin(x, y, type);
	                    }

	                    attachPinLocation.before(pin);
	                    // if (typeof gTools === 'object' && gTools.cursorScale) {
	                    //   $(pin).children().css("transform", 'scale(' + gTools.cursorScale + ')');
	                    // }

	                } else {
	                    return; //end point does not exist
	                }
	            }
	        } //function setPoiPoint
	        function clearPoiPoint(el, type) {
	            type = type ? type : "poiPin";
	            $('g.' + type, el).remove();
	        }

	        /**
	         * 设置停车
	         * @param {[type]} endPoint [description]
	         * @param {[type]} el       [description]
	         */
	        function setParkPoint(endPoint, el) {
	            var end,
	                attachPinLocation,
	                x,
	                y,
	                pin;

	            //clears locationIndicators from the maps
	            $('g.destinationPin', el).remove();

	            if (options.showLocation) {
	                end = $('#Doors #' + escapeSelector(endPoint), el);

	                attachPinLocation = $('svg').has('#Rooms a[id="' + escapeSelector(endPoint) + '"]').find("#cursorBox");
	                if (end.length) {
	                    x = (Number(end.attr('x1')) + Number(end.attr('x2'))) / 2;
	                    y = (Number(end.attr('y1')) + Number(end.attr('y2'))) / 2;

	                    pin = makePin(x, y, 'parkPin');

	                    attachPinLocation.before(pin);
	                    // if(typeof gTools === 'object' && gTools.cursorScale){
	                    // 	$(pin).children().css("transform",'scale('+gTools.cursorScale+')');
	                    // }

	                } else {
	                    return; //end point does not exist
	                }
	            }
	        }


	        function newMakePin(x, y, $pinSvgBox, type, data) {
	            var indicator,
	                pin,
	                circle,
	                height = options.locationIndicator.height, // add error checking?
	                symbolPath,
	                img;
	            type = type || "";
	            var _img = 'pub';
	            if (type !== "") {
	                _img = type.split("public ").join("");
	            }
	            if ($.inArray(_img, ["Bathroom", "Elevator", "Zig", "Childroom", "ATM", "Membercenter", "Exit", "Subway", "Server", "Pay"]) < 0) {
	                _img = "pub";
	            }
	            _img += "Pin";
	            _img = 'pinPoint';
	            type += ' pin setPin';
	            indicator = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	            $(indicator).attr('class', type);
	            $.each(data, function (i, v) {
	                $(indicator).attr("data-" + i, v);
	            });

	            var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	            img.href.baseVal = "//oex38ct5y.qnssl.com/img/" + _img + ".png"
	            img.setAttribute("x", "0");
	            img.setAttribute("y", "-2");
	            img.setAttribute("width", "20");
	            img.setAttribute("height", "30");

	            img.setAttribute("preserveAspectRatio", "none");
	            img.setAttribute("fill", "#FFFFFF");
	            img.setAttribute("stroke", "#000");
	            img.setAttribute("position", "relative");
	            // if(typeof gTools === 'object' && gTools.cursorScale){
	            // 	$(img).css("transform",'scale('+gTools.cursorScale+')');
	            // }

	            // typeof gTools === "object" && (img.setAttribute('transform','scale('+(gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio))+')'))
	            indicator.appendChild(img);
	            typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'))
	            // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	            // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') ');
	            indicator.setAttribute('transform', 'translate(' + (x - 10) + ' ' + (y - 25 - 10 * (height / 200)) + ') ');
	            $pinSvgBox.find("#jz").find("g#poiBox").append(indicator);
	        }

	        /**
	         * 创建起点和终点的标注
	         * @param x
	         * @param y
	         * @param type
	         * @returns {Element|*}
	         */
	        function makePin(x, y, _type) {
	            var indicator,
	                pin,
	                circle,
	                height = options.locationIndicator.height, // add error checking?
	                symbolPath;
	            var text;
	            indicator = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	            var type = _type + ' pin';
	            $(indicator).attr('class', type);

	            pin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	            circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	            if (false) {
	                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	                symbolPath = "M48.023,0c5.26,2.067,10.842,3.563,15.721,6.304    c14.997,8.419,26.594,30.144,16.391,51.384c-8.197,17.053-19.348,32.037-31.186,46.603c-2.03,2.495-4.19,4.89-6.313,7.311    c-0.166,0.187-0.507,0.222-1.266,0.524c-3.428-4.12-7.29-8.134-10.422-12.65C22.369,87.106,13.002,75.109,5.939,61.9    C-8.584,34.749,4.501,7.823,34.603,0.661C34.999,0.566,35.336,0.224,35.7,0C39.807,0,43.914,0,48.023,0z M70.008,42.256    c0.009-15.547-12.693-28.214-28.243-28.171c-15.352,0.041-27.967,12.597-28.06,27.925C13.609,57.575,26.252,70.38,41.736,70.397    C57.338,70.414,70.001,57.808,70.008,42.256z";
	                pin.setAttribute('d', symbolPath);
	                pin.setAttribute('fill', '#E41517');

	                circle.setAttribute('cx', '41.999');
	                circle.setAttribute('cy', '42.194');
	                circle.setAttribute('r', '27.585');
	                circle.setAttribute('fill', '#FFF');
	                text.setAttribute("transform", "matrix(1 0 0 1 27.3678 53.0808)");
	                text.setAttribute("font-size", "29.2617");
	                text.setAttribute("fill", "#000000");
	                text.innerHTML = "起";
	                indicator.appendChild(pin);
	                indicator.appendChild(circle);
	                indicator.appendChild(text);
	                indicator.setAttribute('transform', 'translate(' + (x - 10) + ' ' + (y - 20 - 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	            } else if (_type === "startPin") {
	                var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	                img.href.baseVal = "//oex38ct5y.qnssl.com/img/startPoint.png";
	                // img.setAttribute("x","-15");
	                // img.setAttribute("y","-20");
	                // img.setAttribute("width","123");
	                // img.setAttribute("height","156");
	                img.setAttribute("x", "0");
	                img.setAttribute("y", "-4");
	                img.setAttribute("width", "26");
	                img.setAttribute("height", "30");

	                img.setAttribute("preserveAspectRatio", "none");
	                img.setAttribute("fill", "#FFFFFF");
	                img.setAttribute("stroke", "#000");
	                img.setAttribute("position", "relative");
	                indicator.appendChild(img);
	                typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'))
	                // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	                indicator.setAttribute('transform', 'translate(' + (x - 12) + ' ' + (y - 24 - 10 * (height / 200)) + ')');

	            } else if ("parkPin" === _type) {
	                var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	                img.href.baseVal = "//oex38ct5y.qnssl.com/img/parkpoint.png?_=1";
	                img.setAttribute("x", "0");
	                img.setAttribute("y", "-4");
	                img.setAttribute("width", "26");
	                img.setAttribute("height", "30");

	                img.setAttribute("preserveAspectRatio", "none");
	                img.setAttribute("fill", "#FFFFFF");
	                img.setAttribute("stroke", "#000");
	                img.setAttribute("position", "relative");

	                indicator.appendChild(img);
	                typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'))
	                // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	                indicator.setAttribute('transform', 'translate(' + (x - 12) + ' ' + (y - 24 - 10 * (height / 200)) + ') ');
	                return indicator;
	            } else if ("destinationPin" === _type) {
	                var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	                img.href.baseVal = "//oex38ct5y.qnssl.com/img/endPoint.png?_=1";
	                // img.setAttribute("x","-15");
	                // img.setAttribute("y","-20");
	                // img.setAttribute("width","123");
	                // img.setAttribute("height","156");

	                img.setAttribute("x", "0");
	                img.setAttribute("y", "-4");
	                img.setAttribute("width", "26");
	                img.setAttribute("height", "30");

	                img.setAttribute("preserveAspectRatio", "none");
	                img.setAttribute("fill", "#FFFFFF");
	                img.setAttribute("stroke", "#000");
	                img.setAttribute("position", "relative");
	                // $(img).css("transform", 'scale(' + gTools.cursorScale + ')')
	                // typeof gTools === "object" && (img.setAttribute('transform','scale('+(gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio))+')'))
	                indicator.appendChild(img);
	                typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'))
	                // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	                indicator.setAttribute('transform', 'translate(' + (x - 12) + ' ' + (y - 24 - 10 * (height / 200)) + ') ');


	                return indicator;
	                //原来猫爪版的end
	                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	                symbolPath = "M112.386,38.319c-4.185-10.642-13.699-12.827-13.842-12.857c-6.751-0.7-6.927-5.526-6.931-5.732      l-0.017-0.119c-0.411-3.825-2.359-7.649-2.374-7.693l-0.054-0.113C83.955,3.972,77.998,0,71.462,0      c-6.08,0-10.313,3.504-10.494,3.656c-1.138,0.984-2.393,1.481-3.732,1.481c-2.051,0-3.621-1.184-3.66-1.212      c-3.867-2.587-7.693-3.901-11.375-3.901c-10.761,0-16.855,11.253-16.893,11.328c-1.877,2.832-2.666,7.73-2.703,7.972      c-0.408,5.141-6.185,6.03-6.479,6.077c-12.86,3.345-15.26,15.59-15.278,15.693c-3.415,14.796,4.59,25.571,4.727,25.739      c10.046,9.195,10.364,14.831,10.367,14.895c0.445,9.374,2.241,11.759,2.27,11.781c5.948,11.648,18.384,14.661,18.488,14.684      c6.712,1.912,13.619,2.879,20.525,2.879c14.052,0,23.511-4.061,23.549-4.082c9.028-2.579,14.12-11.207,14.34-11.588      c3.351-6.286,3.172-12.328,3.163-12.548c0.213-6.047,4.981-10.324,5.043-10.379c3.778-3.615,6.418-8.033,6.453-8.094      C116.821,51.328,112.437,38.463,112.386,38.319z";
	                var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
	                    symbolPath2 = "M105.472,40.464c-3.663-9.316-11.992-11.229-12.117-11.255c-5.91-0.613-6.585-6.648-6.589-6.829      c0,0-3.585-15.461-17.119-15.461c-5.323,0-9.029,3.068-9.187,3.201c-0.997,0.861-2.095,1.297-3.267,1.297      c-1.796,0-3.17-1.037-3.204-1.061C50.603,8.09,47.254,6.94,44.03,6.94c-9.42,0-14.755,9.851-14.788,9.917      c-1.643,2.479-2.334,6.767-2.366,6.979c-0.358,4.5-5.415,5.279-5.672,5.32C9.945,32.083,7.844,42.803,7.828,42.893      c-2.99,12.953,4.018,22.386,4.138,22.533c8.795,8.05,9.073,12.983,9.076,13.039c0.39,8.206,1.962,10.294,1.988,10.314      c5.207,10.197,16.094,12.835,16.185,12.855c5.876,1.673,11.923,2.521,17.968,2.521c12.301,0,20.582-3.555,20.615-3.574      c7.903-2.257,12.361-9.811,12.554-10.145c2.933-5.503,2.777-10.792,2.769-10.985c0.187-5.294,4.36-9.038,4.415-9.086      c3.307-3.165,5.619-7.032,5.649-7.085C109.355,51.853,105.517,40.59,105.472,40.464z";
	                var iss = [{
	                    fill: "#56B69C",
	                    cx: "41.893",
	                    cy: "24.99",
	                    rx: "8.089",
	                    ry: "12.912"
	                }, {
	                    fill: "#56B69C",
	                    cx: "17.338",
	                    cy: "50.964",
	                    rx: "8.089",
	                    ry: "12.912"
	                }, {
	                    fill: "#56B69C",
	                    cx: "71.359",
	                    cy: "24.99",
	                    rx: "8.089",
	                    ry: "12.912"
	                }, {
	                    fill: "#56B69C",
	                    cx: "95.77",
	                    cy: "48.099",
	                    rx: "8.089",
	                    ry: "12.912"
	                }];

	                pin.setAttribute('d', symbolPath);
	                pin.setAttribute('fill', '#005048');
	                path2.setAttribute("d", symbolPath2);
	                path2.setAttribute('fill', '#FCFDFD');
	                indicator.appendChild(pin);
	                indicator.appendChild(path2);
	                for (var i = 0; i < 4; i++) {
	                    var paw = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
	                    paw.setAttribute("fill", iss[i].fill);
	                    paw.setAttribute("cx", iss[i].cx);
	                    paw.setAttribute("cy", iss[i].cy);
	                    paw.setAttribute("rx", iss[i].rx);
	                    paw.setAttribute("ry", iss[i].ry);
	                    indicator.appendChild(paw);
	                }

	                circle.setAttribute("fill", "#56B69C");
	                circle.setAttribute('cx', '56.503');
	                circle.setAttribute('cy', '70.793');
	                circle.setAttribute('r', '28.155');
	                text.setAttribute("transform", "matrix(1 0 0 1 42.6071 81.1283)");
	                text.setAttribute("font-size", "28.6959");
	                text.innerHTML = "终";
	                indicator.appendChild(circle);
	                indicator.appendChild(text);
	                indicator.setAttribute('transform', 'translate(' + (x - 8) + ' ' + (y - 18 - 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	            } else if (_type === "poiPin") {
	                var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	                img.href.baseVal = "//oex38ct5y.qnssl.com/img/pinPoint.png";
	                img.setAttribute("x", "0");
	                img.setAttribute("y", "-2");
	                img.setAttribute("width", "20");
	                img.setAttribute("height", "30");

	                img.setAttribute("preserveAspectRatio", "none");
	                img.setAttribute("fill", "#FFFFFF");
	                img.setAttribute("stroke", "#000");
	                img.setAttribute("position", "relative");

	                indicator.appendChild(img);
	                typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'));

	                // $(img).css("transform", 'scale(' + gTools.cursorScale + ')');
	                // indicator.setAttribute('transform', 'translate(' + (x-12) + ' ' + (y -24- 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	                indicator.setAttribute('transform', 'translate(' + (x - 12) + ' ' + (y - 24 - 10 * (height / 200)) + ') ');
	                return indicator;
	            } else {
	                symbolPath = 'M0.075,0';
	                symbolPath += 'c-2.079-10.207-5.745-18.703-10.186-26.576c-3.295-5.84-7.111-11.23-10.642-16.894c-1.179-1.891-2.196-3.888-3.327-5.85';
	                symbolPath += 'c-2.266-3.924-4.102-8.472-3.984-14.372c0.113-5.766,1.781-10.391,4.186-14.172c3.954-6.219,10.578-11.317,19.465-12.657';
	                symbolPath += 'c7.268-1.095,14.08,0.756,18.911,3.58c3.948,2.31,7.005,5.394,9.329,9.027c2.426,3.793,4.096,8.274,4.236,14.12';
	                symbolPath += 'c0.072,2.995-0.418,5.769-1.109,8.069c-0.699,2.328-1.823,4.274-2.824,6.353c-1.953,4.06-4.4,7.777-6.857,11.498';
	                symbolPath += 'C9.954,-26.789,3.083,-15.486,0.075,0z';

	                pin.setAttribute('d', symbolPath);
	                pin.setAttribute('fill', '#E81E25');
	                pin.setAttribute('stroke', '#000000');
	                pin.setAttribute('stroke-width', '3.7');
	                pin.setAttribute('stroke-miterlimit', '10');

	                circle.setAttribute('cx', '0');
	                circle.setAttribute('cy', '-63.757');
	                circle.setAttribute('r', '9.834');
	                indicator.appendChild(pin);
	                indicator.appendChild(circle);
	                indicator.setAttribute('transform', 'translate(' + x + ' ' + (y - 10 * (height / 200)) + ') scale(' + height / 200 + ')');
	            }

	            return indicator;

	        } //function makePin

	        function makePin2(x, y, type) {
	            var indicator,
	                pin,
	                circle,
	                height = options.locationIndicator.height, // add error checking?
	                symbolPath,
	                img;

	            indicator = document.createElementNS('http://www.w3.org/2000/svg', 'g');

	            $(indicator).attr('class', type);

	            //pin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	            //circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	            /*symbolPath = 'M0.075,0';
	             symbolPath += 'c-2.079-10.207-5.745-18.703-10.186-26.576c-3.295-5.84-7.111-11.23-10.642-16.894c-1.179-1.891-2.196-3.888-3.327-5.85';
	             symbolPath += 'c-2.266-3.924-4.102-8.472-3.984-14.372c0.113-5.766,1.781-10.391,4.186-14.172c3.954-6.219,10.578-11.317,19.465-12.657';
	             symbolPath += 'c7.268-1.095,14.08,0.756,18.911,3.58c3.948,2.31,7.005,5.394,9.329,9.027c2.426,3.793,4.096,8.274,4.236,14.12';
	             symbolPath += 'c0.072,2.995-0.418,5.769-1.109,8.069c-0.699,2.328-1.823,4.274-2.824,6.353c-1.953,4.06-4.4,7.777-6.857,11.498';
	             symbolPath += 'C9.954,-26.789,3.083,-15.486,0.075,0z';*/

	            /*pin.setAttribute('d', symbolPath);
	             pin.setAttribute('fill', '#E81E25');
	             pin.setAttribute('stroke', '#000000');
	             pin.setAttribute('stroke-width', '3.7');
	             pin.setAttribute('stroke-miterlimit', '10');*/

	            /*circle.setAttribute('cx', '0');
	             circle.setAttribute('cy', '-63.757');
	             circle.setAttribute('r', '9.834');*/
	            img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	            img.href.baseVal = "//oex38ct5y.qnssl.com/img/kq.png";
	            img.setAttribute("x", "-3");
	            img.setAttribute("y", "-3");
	            img.setAttribute("width", "6");
	            img.setAttribute("height", "6");
	            img.setAttribute("preserveAspectRatio", "none");
	            img.setAttribute("fill", "#FFFFFF");
	            img.setAttribute("stroke", "#000");
	            img.setAttribute("position", "relative");

	            /*indicator.appendChild(pin);
	             indicator.appendChild(circle);*/
	            indicator.appendChild(img);
	            typeof gTools === "object" && ($(img).css('transform', 'scale(' + (gTools.cursorScale * gTools.initialRatio / Number(gTools.ratio)) + ')'));

	            //indicator.setAttribute('transform', 'translate(' + x + ' ' + (y - 10 * (height / 125)) + ') scale(' + height / 125 + ')');
	            indicator.setAttribute('transform', 'translate(' + x + ' ' + (y - 10 * (height / 200)) + ')');
	            return indicator;

	        }

	        /**
	         * 根据起点ID 标注起点
	         * @param point
	         * @param el
	         */
	        function setStartPoint(point, el) {
	            var start,
	                attachPinLocation,
	                x,
	                y,
	                pin;

	            $('g.startPin', el).remove();

	            options.startpoint = point;

	            if (typeof options.startpoint === 'function') {
	                startpoint = options.startpoint();
	            } else {
	                startpoint = options.startpoint;
	            }

	            if (options.showLocation) {
	                start = $('#Doors #' + escapeSelector(startpoint), el);
	                var startMap = el.children().has($('#' + escapeSelector(startpoint)));
	                attachPinLocation = $('svg', startMap).find("#cursorBox");

	                if (start.length) {
	                    x = (Number(start.attr('x1')) + Number(start.attr('x2'))) / 2;
	                    y = (Number(start.attr('y1')) + Number(start.attr('y2'))) / 2;
	                    pin = makePin(x, y, 'startPin');
	                    attachPinLocation.before(pin);
	                    // if (typeof gTools === 'object' && gTools.cursorScale) {
	                    //     $(pin).children().css("transform", 'scale(' + gTools.cursorScale + ')');
	                    // }

	                }
	            }
	        }

	        /**
	         *
	         * @param endPoint
	         * @param el
	         */
	        function setEndPoint(endPoint, el) {
	            var end,
	                attachPinLocation,
	                x,
	                y,
	                pin;

	            $('g.destinationPin', el).remove();

	            options.endpoint = endPoint;

	            if (options.showLocation) {
	                end = $('#Doors #' + escapeSelector(endPoint), el);
	                attachPinLocation = $('svg').has('#Rooms a[id="' + escapeSelector(endPoint) + '"]').find("#cursorBox");
	                if (end.length) {
	                    x = (Number(end.attr('x1')) + Number(end.attr('x2'))) / 2;
	                    y = (Number(end.attr('y1')) + Number(end.attr('y2'))) / 2;

	                    pin = makePin(x, y, 'destinationPin');

	                    attachPinLocation.before(pin);
	                    // if (typeof gTools === 'object' && gTools.cursorScale) {
	                    //     $(pin).children().css("transform", 'scale(' + gTools.cursorScale + ')');
	                    // }
	                } else {
	                    return;
	                }
	            }
	        }

	        /**
	         * 移除加载Loading
	         * 显示默认楼层地图
	         * @param el
	         */
	        function replaceLoadScreen(el) {
	            var displayNum,
	                mapNum;
	            $('#WayfindingStatus').remove();
	            displayNum = 0;
	            for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                if (defaultMap === maps[mapNum].id) {
	                    displayNum = mapNum;
	                }
	            }

	            $('#' + maps[displayNum].id, el).show();
	        }

	        /**
	         * #path line #Doors line #portals line
	         * @param mapNum
	         * @param map
	         * @param el
	         */
	        function buildDataStore(mapNum, map, el) {
	            var path,
	                doorId,
	                x1,
	                y1,
	                x2,
	                y2,
	                matches,
	                portal,
	                portalId;

	            dataStore.p[mapNum] = [];

	            $('#Paths line', el).each(function () {
	                path = {};
	                path.floor = map.id;
	                path.r = 999999; //Infinity;
	                path.p = -1;

	                path.x = $(this).attr('x1');
	                path.y = $(this).attr('y1');
	                path.d = [];
	                path.m = $(this).attr('x2');
	                path.n = $(this).attr('y2');
	                path.e = [];

	                path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));

	                path.c = [];
	                path.q = [];

	                path.recursive = false;

	                dataStore.p[mapNum].push(path);
	            });

	            $('#Doors line', el).each(function () {
	                x1 = $(this).attr('x1');
	                y1 = $(this).attr('y1');
	                x2 = $(this).attr('x2');
	                y2 = $(this).attr('y2');
	                doorId = $(this).attr('id');

	                $.each(dataStore.p[mapNum], function (index, segment) {
	                    if (map.id === segment.floor && ((segment.x === x1 && segment.y === y1) || (segment.x === x2 && segment.y === y2))) {
	                        segment.d.push(doorId);
	                    } else if (segment.floor === map.id && ((segment.m === x1 && segment.n === y1) || (segment.m === x2 && segment.n === y2))) {
	                        segment.e.push(doorId);
	                    }
	                });
	            });

	            // Portals line 是对 Doors line 的复制
	            $('#Portals line', el).each(function () {
	                portal = {};
	                portalId = $(this).attr('id');

	                if (portalId && portalId.indexOf('_') > -1) {
	                    portalId = portalId.slice(0, portalId.indexOf('_'));
	                }

	                portal.id = portalId;
	                //Elev Stair
	                portal.type = portalId.split('.')[0];
	                portal.floor = map.id;
	                //Elev.1.F本层
	                portal.mate = portalId.split('.').slice(0, 2).join('.') + '.' + map.id;
	                portal.mapNum = mapNum;

	                portal.matched = false;

	                x1 = $(this).attr('x1');
	                y1 = $(this).attr('y1');
	                x2 = $(this).attr('x2');
	                y2 = $(this).attr('y2');

	                //判断portal的哪端跟辅路相连
	                matches = $.grep(dataStore.p[mapNum], function (n) {
	                    return ((x1 === n.x && y1 === n.y) || (x1 === n.m && y1 === n.n));
	                });
	                if (matches.length !== 0) {
	                    portal.x = x1;
	                    portal.y = y1;
	                } else {
	                    portal.x = x2;
	                    portal.y = y2;
	                }

	                portal.l = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) + 30; // hack 跨楼层不是最短长度，用来防止导航路径规划时上去下来上去下来……

	                portalSegments.push(portal);
	            });
	        }

	        /**
	         * 把相连的portal 连成一个portal
	         */
	        function buildPortals() {
	            var segmentOuterNum,
	                segmentInnerNum,
	                outerSegment,
	                innerSegment,
	                portal;

	            for (segmentOuterNum = 0; segmentOuterNum < portalSegments.length; segmentOuterNum++) {
	                outerSegment = portalSegments[segmentOuterNum];
	                if (outerSegment.matched === false) {
	                    for (segmentInnerNum = segmentOuterNum; segmentInnerNum < portalSegments.length; segmentInnerNum++) {
	                        if (portalSegments[segmentInnerNum].id === outerSegment.mate && portalSegments[segmentInnerNum].mate === outerSegment.id) {

	                            innerSegment = portalSegments[segmentInnerNum];

	                            portal = {};

	                            outerSegment.matched = true;
	                            innerSegment.matched = true;

	                            portal.t = outerSegment.type;
	                            portal.a = (portal.t === 'Elev' || portal.t === 'Stair') ? true : false;

	                            portal.f = outerSegment.floor;
	                            portal.g = outerSegment.mapNum;
	                            portal.x = outerSegment.x;
	                            portal.y = outerSegment.y;
	                            portal.c = [];

	                            portal.j = innerSegment.floor;
	                            portal.k = innerSegment.mapNum;
	                            portal.m = innerSegment.x;
	                            portal.n = innerSegment.y;
	                            portal.d = [];

	                            portal.l = outerSegment.l + innerSegment.l;

	                            portal.r = 999999; //Infinity;
	                            portal.p = -1;

	                            dataStore.q.push(portal);
	                        }
	                    }
	                }
	            }
	        }

	        /**
	         * 初始化的时候build 生成dataStore
	         * 此时的主辅路没有分离
	         */
	        function build() {
	            dataStore = {
	                'p': [],
	                'q': []
	            };

	            portalSegments = [];

	            $.each(maps, function (i, map) {
	                buildDataStore(i, map, map.el);
	            });

	            buildPortals();
	            dataStoreCache = JSON.stringify(dataStore);//$.extend(true, {}, dataStore);
	            return dataStore;
	        }

	        /**
	         * build dataStore function
	         * finished build callback function
	         * @param onReadyCallback
	         */
	        function establishDataStore(onReadyCallback) {
	            // if (typeof gTools == 'object' && gTools.node) {
	            //     if (typeof onReadyCallback === 'function') {
	            //         onReadyCallback();
	            //     }
	            //     return;
	            // }
		    
	            if (options.dataStoreCache) {
	                if (typeof options.dataStoreCache === 'object') {
	                    dataStore = options.dataStoreCache;
	                    if (typeof onReadyCallback === 'function') {
	                        onReadyCallback();
	                    }
	                }

	            } else {
	                if (typeof gTools == 'object' && gTools.dataStoreAddress) {
	                    if (!isFistBuild) {
	                        //dataStore = $.extend(true, {}, dataStoreCache);
	                        dataStore = JSON.parse(dataStoreCache);
	                        if (typeof onReadyCallback === 'function') {
	                            onReadyCallback();
	                        }
	                        return;
	                    }
	                    if (isGetingJson) {
	                        return;
	                    }
	                    isGetingJson = true;
	                    var succfun = function (response) {
	                        if (typeof response !== 'object') {
	                            response = JSON.parse(response);
	                        }
	                        delete localStorage[localStorage.dataStoreAddress];
	                        delete localStorage.dataStoreAddress;
	                        localStorage.dataStoreAddress = gTools.dataStoreAddress;
	                        localStorage[localStorage.dataStoreAddress] = JSON.stringify(response);
	                        isFistBuild = false;
	                        isGetingJson = false;
	                        dataStore = response;
	                        dataStoreCache = JSON.stringify(dataStore)//$.extend(true, {}, dataStore);
	                        if (typeof onReadyCallback === 'function') {
	                            onReadyCallback();
	                        }
	                    };
	                    if (localStorage.dataStoreAddress === gTools.dataStoreAddress && localStorage[localStorage.dataStoreAddress]) {
	                        succfun(JSON.parse(localStorage[localStorage.dataStoreAddress]));
	                        return;
	                    }
	                    $.getJSON(gTools.origin + gTools.dataStoreAddress, succfun).fail(function () {
	                        dataStore = build();
	                        isGetingJson = false;
	                        if (typeof onReadyCallback === 'function') {
	                            onReadyCallback();
	                        }
	                    });
	                    return;
	                }

	                dataStore = build();

	                if (typeof onReadyCallback === 'function') {
	                    onReadyCallback();

	                }
	            }
	        }

	        /**
	         * myMap 加入svgDiv
	         * 增加Rooms a标签的点击事件
	         * @param el
	         * @param svgDiv
	         */
	        function activateSVG(el, svgDiv) {
	            $(svgDiv).hide();
	            $('#Paths line', svgDiv).attr('stroke-opacity', 0);
	            $('#Doors line', svgDiv).attr('stroke-opacity', 0);
	            $('#Portals line', svgDiv).attr('stroke-opacity', 0);       // Portals line 是对 Doors line 的复制
	            // var $dataGroup = $('#Paths', svgDiv).parent();
	            // if($dataGroup.is('g')) {
	            // 	$dataGroup.attr('opacity', 0).attr('display', 'inline');
	            // }

	            // 房间一定要被a标签包裹 点击地图上的房间
	            if (!$.fn.tap) {
	                $('#Rooms a', svgDiv).on('click', function (event, category) {
	                    $(el).trigger('wayfinding:roomClicked', [{roomId: $(this).attr('id'), category: category}]);
	                    //$(el).wayfinding('routeTo', $(this).prop('id'));
	                    log.v(`wayfinding:roomClicked ==> roomId:${$(this).attr('id')} => category:${category}`);
	                    event.preventDefault();
	                });
	            } else {
	                $('#Rooms a', svgDiv).on('tap', function (event, category) {
	                    $(el).trigger('wayfinding:roomClicked', [{roomId: $(this).attr('id'), category: category}]);
	                    //$(el).wayfinding('routeTo', $(this).prop('id'));
	                    log.v(`wayfinding:roomClicked ==> roomId:${$(this).attr('id')} => category:${category}`);
	                    event.preventDefault();
	                });
	            }

	            $(el).append(svgDiv);
	        }

	        /**
	         * 清除Rooms a标签 ID 和 Door ID下划线
	         * @param el
	         */
	        function cleanupSVG(el) {
	            var svg = $(el).find('svg'),
	                height = parseInt($(svg).attr('height').replace('px', '').split('.')[0], 10),
	                width = parseInt($(svg).attr('width').replace('px', '').split('.')[0], 10);

	            height = Math.ceil(height / 2) * 2;
	            width = Math.ceil(width / 2) * 2;

	            // $(el).css('padding-bottom', (100 * (height / width)) + '%');
	            svg.attr('height', '100%').attr('width', '100%').attr('preserveAspectRatio', 'xMinYMin meet');

	            $('#Rooms a, #Doors line', el).each(function () {
	                if ($(this).prop('id') && $(this).prop('id').indexOf('_') > 0) {
	                    var oldID = $(this).prop('id');
	                    $(this).prop('id', oldID.slice(0, oldID.indexOf('_')));
	                }
	            });
	        }

	        /**
	         *
	         * @param el
	         * @param callback
	         */
	        function initialize(el, callback) {
	            var mapsProcessed = 0;

	            $('div:not("#WayfindingStatus")', el).remove();

	            $.each(maps, function (i, map) {
	                var svgDiv = $('<div id="' + map.id + '"><\/div>');
	                svgDiv.load(
	                    map.path,
	                    function (svg, status) {
	                        if (status === 'error') {
	                            svgDiv.html('<p class="text-center text-danger">Map ' + i + ' Was not found at ' +
	                                map.path + '<br />Please upload it in the administration section</p>');
	                            maps[i].el = svgDiv;
	                        } else {
	                            maps[i].svgHandle = svg;
	                            maps[i].el = svgDiv;
	                            cleanupSVG(maps[i].el);

	                            activateSVG(el, svgDiv);
	                            mapsProcessed += 1;
	                        }
	                        //maps load over
	                        if (mapsProcessed === maps.length) {

	                            establishDataStore(function () {
	                                setStartPoint(startpoint, el);

	                                setOptions(el);

	                                replaceLoadScreen(el);

	                                if (typeof callback === 'function') {
	                                    callback();
	                                }
	                            });

	                        }
	                        initialize2(el, callback);

	                    }
	                );
	            });
	        }

	        function initialize2(el, cb) {
	            // Load SVGs off the network
	            var mapsProcessed = 0;
	            //$('div:not("#WayfindingStatus")', el).remove();
	            var flag = 0;
	            localStorage.mapPath = localStorage.mapPath || "";
	            $.each(maps, function (i, v) {
	                if (!localStorage.mapPath.includes(v.path)) {
	                    flag = 1;
	                    return false;
	                }
	            });
	            if (flag) {
	                var arr = localStorage.mapPath.split("#").filter(function (v, i) {
	                    return v !== "";
	                });
	                $.each(arr, function (i, v) {
	                    delete localStorage[v];
	                });
	                localStorage.mapPath = "";
	            }
	            $.each(maps, function (i, map) {
	                if ($("#" + map.id).length) {
	                    mapsProcessed++;
	                    return true;
	                }
	                var svgDiv = $('<div id="' + map.id + '"></div>');
	                var callbackfn = function (svg, status) {
	                    if (!localStorage.mapPath.includes(map.path) || !localStorage[map.path]) {
	                        localStorage[map.path] = svg;
	                        localStorage.mapPath += "#" + map.path;
	                    }
	                    if (status === 'error') {
	                        svgDiv.html('<p class="text-center text-danger">Map ' + i + ' Was not found at ' +
	                            map.path + '<br />Please upload it in the administration section</p>');
	                        maps[i].el = svgDiv;
	                    } else {
	                        if (!svgDiv.find("g#transArea").length) { //如果不存在svg的外围transform标签
	                            var _svg = svgDiv.find("svg"),
	                                _html = _svg.html();
	                            var _g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	                            _g.setAttribute("id", "transArea");
	                            _g.setAttribute("transform", "matrix(1,0,0,1,0,0)");
	                            _g.innerHTML = _html;
	                            _svg.empty().append(_g);
	                        }
	                        maps[i].svgHandle = svg;
	                        maps[i].el = svgDiv;
	                        cleanupSVG(maps[i].el);
	                        activateSVG(el, svgDiv);
	                        //rattleimage(el,svgDiv);
	                        mapsProcessed += 1;
	                    }

	                    if (mapsProcessed == 1 || mapsProcessed === maps.length) {
	                        // All SVGs have finished loading

	                        establishDataStore(function () {
	                            // SVGs are loaded, dataStore is set, ready the DOM
	                            setStartPoint(startpoint, el);
	                            setOptions(el);
	                            replaceLoadScreen(el);
	                            if (typeof cb === 'function') {
	                                if (mapsProcessed == 1 && mapsProcessed !== maps.length) {
	                                    if (typeof gTools == 'object' && gTools.dataStoreAddress) {
	                                        return;
	                                    }
	                                    cb();
	                                    return;
	                                }
	                                cb("all");
	                            }
	                        });
	                    }
	                };
	                //create svg in that div

	                if (localStorage.mapPath && localStorage.mapPath.includes(map.path) && localStorage[map.path]) {
	                    svgDiv.append(localStorage[map.path]);
	                    callbackfn(localStorage[map.path], "succ");
	                } else {
	                    svgDiv.load(map.path, callbackfn);
	                }

	            });
	        }   // function initialize2

	        function interpolateValue(oldValue, newValue, i, steps) {
	            return (((steps - i) / steps) * oldValue) + ((i / steps) * newValue);
	        }


	        function animatePath(drawingSegment) {
	            var path,
	                svg,
	                pathRect,
	                drawLength,
	                oldViewBox,
	                animationDuration,
	                pad = options.zoomPadding,
	                steps = -1, //35,¾ÍÊÇÑ°ÕÒÂ·¾¶µÄËõ·Å¶¯»­£¬Ä¬ÈÏ35´Î¶¯»­¡­¡­ÉèÎª²»Ëõ·Å
	                duration = 650, // Zoom animation in milliseconds
	                oldView = {},
	                newView = {},
	                step;

	            function adjustIn(current, old, target, count, speed) {
	                setTimeout(function () {
	                    var zoomIn = {};
	                    zoomIn.X = interpolateValue(old.X, target.X, current, count);
	                    zoomIn.Y = interpolateValue(old.Y, target.Y, current, count);
	                    zoomIn.W = interpolateValue(old.W, target.W, current, count);
	                    zoomIn.H = interpolateValue(old.H, target.H, current, count);

	                    if (options.pinchToZoom) {
	                        // Use CSS 3-based zooming
	                        panzoomWithViewBoxCoords($(svg).parent()[0], svg, zoomIn.X, zoomIn.Y, zoomIn.W, zoomIn.H);
	                    } else {
	                        // Use SVG viewBox-based zooming
	                        svg.setAttribute('viewBox', zoomIn.X + ' ' + zoomIn.Y + ' ' + zoomIn.W + ' ' + zoomIn.H);
	                    }
	                }, current * (speed / count));
	            }

	            function adjustOut(current, old, target, count, speed) {
	                setTimeout(function () {
	                    var zoom = {};
	                    zoom.X = interpolateValue(target.X, old.X, current, count);
	                    zoom.Y = interpolateValue(target.Y, old.Y, current, count);
	                    zoom.W = interpolateValue(target.W, old.W, current, count);
	                    zoom.H = interpolateValue(target.H, old.H, current, count);

	                    if (options.pinchToZoom) {
	                        // Use CSS 3-based zooming
	                        panzoomWithViewBoxCoords($(svg).parent()[0], svg, zoom.X, zoom.Y, zoom.W, zoom.H);
	                    } else {
	                        svg.setAttribute('viewBox', zoom.X + ' ' + zoom.Y + ' ' + zoom.W + ' ' + zoom.H);
	                    }

	                    if (current === count) {
	                        if (drawingSegment === drawing.length) {
	                            $(obj).trigger('wayfinding:animationComplete');
	                        }
	                    }
	                }, current * (speed / count));
	            }

	            if (options.repeat && drawingSegment >= drawing.length) {
	                // if repeat is set, then delay and rerun display from first.
	                // Don't implement, until we have click to cancel out of this
	                setTimeout(function () {
	                        animatePath(0);
	                    },
	                    5000);
	            } else if (drawingSegment >= drawing.length) {
	                //finished, stop recursion.
	                $(obj).trigger('wayfinding:routeToOver');
	                return;
	            }

	            var mapIdx = drawing[drawingSegment][0].floor;
	            // if (typeof gTools == 'object' && gTools.node) {
	            //
	            //     mapIdx = gTools.floorIndex[gTools.floorid];
	            // }
	            // console.error(maps[mapIdx].id,mapIdx);
	            svg = $('#' + maps[mapIdx].id + ' svg')[0];
	            drawLength = drawing[drawingSegment].routeLength;
	            drawLength = drawLength ? drawLength : 200;
	            animationDuration = drawLength * options.path.speed;
	            animationDuration = isNaN(animationDuration) ? 3000 : animationDuration;
	            switchFloor(maps[mapIdx].id, obj, true);
	            // Get the complete path for this particular floor-route
	            path = $('#' + maps[mapIdx].id + ' .directionPath' + drawingSegment)[0];

	            // Animate using CSS transitions
	            // SVG animation technique from http://jakearchibald.com/2013/animated-line-drawing-svg/
	            path.style.stroke = options.path.color;
	            // TODO 路径粗细
	            // path.style.strokeWidth = options.path.width;


	            path.style.transition = path.style.WebkitTransition = 'none';
	            path.style.strokeDasharray = drawLength + ' ' + drawLength;
	            path.style.strokeDashoffset = drawLength;
	            pathRect = path.getBBox();
	            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + animationDuration + 'ms linear';
	            path.style.strokeDashoffset = '0';

	            // If this is the last segment, trigger the 'wayfinding:animationComplete' event
	            // when it finishes drawing.
	            // If we're using zoomToRoute however, don't trigger here, trigger when zoomOut is complete (see below)
	            if (options.zoomToRoute === false) {
	                if (drawingSegment === (drawing.length - 1)) {
	                    $(path).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
	                        $(obj).trigger('wayfinding:animationComplete');
	                    });
	                }
	            } else {
	                // Zooming logic...
	                // Store the original SVG viewBox in order to zoom out back to it after path animation
	                oldViewBox = svg.getAttribute('viewBox');
	                oldView.X = parseFloat(oldViewBox.split(/\s+|,/)[0]); // viewBox is [x, y, w, h], x == [0]
	                oldView.Y = parseFloat(oldViewBox.split(/\s+|,/)[1]);
	                oldView.W = parseFloat(oldViewBox.split(/\s+|,/)[2]);
	                oldView.H = parseFloat(oldViewBox.split(/\s+|,/)[3]);

	                // Calculate single step size from each direction
	                newView.X = ((pathRect.x - pad) > 0) ? (pathRect.x - pad) : 0;
	                newView.Y = ((pathRect.y - pad) > 0) ? (pathRect.y - pad) : 0;
	                newView.H = pathRect.height + (2 * pad);
	                newView.W = pathRect.width + (2 * pad);
	                // Loop the specified number of steps to create the zoom in animation
	                for (step = 0; step <= steps; step++) {
	                    adjustIn(step, oldView, newView, steps, duration);
	                }
	            }


	            // Call animatePath after 'animationDuration' milliseconds to animate the next segment of the path,
	            // if any.
	            // Note: This is not tiny path 'segments' which form the lines curving around
	            //       hallways but rather the other 'paths' needed on other floors, if any.
	            setTimeout(function () {
	                animatePath(++drawingSegment);

	                if (options.zoomToRoute) {
	                    // Loop the specified number of steps to create the zoom out animation
	                    // or set step = steps to force the zoom out immediately (used on floors
	                    // no longer visible to the user due to floor changes)

	                    // Animate zoom out if we're on the last drawing segment, else
	                    // we can just reset the zoom out (improves performance, user will never notice)
	                    if ((drawing.length === 1) || ((drawing.length > 1) && (drawingSegment === drawing.length))) {
	                        step = 0; // apply full animation
	                    } else {
	                        step = steps; // effectively removes animation and resets the zoom out (only triggered on floors where the user
	                    }

	                    for (; step <= steps; step++) {
	                        adjustOut(step, oldView, newView, steps, duration);
	                    }
	                }
	            }, animationDuration + options.floorChangeAnimationDelay);
	        } //function animatePath

	        /**
	         * 从store中提取路径规划楼层切换
	         * @param  {object} info datastore存储的当前楼层信息
	         * @param  {object} from 起点楼层
	         * @param  {object} to    终点楼层
	         * @return 没。最终数据丢进gTools.navTips里面。
	         */
	        var navTips = navTips || [];
	        var makeNavTips = function (info, from, to) {
	            // if (typeof gTools !== 'object') {
	            //     return;
	            // };
	            //gTools.navTips = gTools.navTips || [];
	            var p1 = getNavXY(info, from.id),
	                p2 = getNavXY(info, to.id);
	            navTips.push({
	                floor: to.id, //所在楼层
	                x: p2.x, //x位置
	                y: p2.y, //y位置
	                type: info.t, //楼梯|直梯
	                from: from.id, //上下楼或
	                to: to.id
	            });
	            navTips.push({
	                floor: from.id, //所在楼层
	                x: p1.x, //x位置
	                y: p1.y, //y位置
	                type: info.t, //楼梯|直梯
	                from: from.id, //上下楼或
	                to: to.id
	            });
	        };
	        /**
	         * 从datastore中找到切换楼层时所在的 x/y
	         * @param  {object} info  info
	         * @param  {string} floor 楼层 F60
	         * @return {x:123,y:123}  坐标咯。就是楼梯/扶梯在svg中的位置坐标
	         */
	        var getNavXY = function (info, floor) {
	            if (info.f !== floor) {
	                return {
	                    x: info.m,
	                    y: info.n
	                };
	            } else {
	                return {
	                    x: info.x,
	                    y: info.y
	                };
	            }
	        };


	        var realPh;
	        var shortPaths;

	        function GetPointDistance(x1, y1, x2, y2) {
	            var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	            return distance;
	        }

	        function initRealPaths(paths, el) {
	            realPh = paths;
	            shortPaths = [];
	            var P1 = {},
	                P2 = {},
	                P3 = {};
	            for (var level = 0; level < realPh.length; level++) {
	                for (var i = 0; i < realPh[level].length - 2; i++) {
	                    P1.x = parseFloat(realPh[level][i].x);
	                    P1.y = parseFloat(realPh[level][i].y);
	                    P2.x = parseFloat(realPh[level][i + 1].x);
	                    P2.y = parseFloat(realPh[level][i + 1].y);
	                    P3.x = parseFloat(realPh[level][i + 2].x);
	                    P3.y = parseFloat(realPh[level][i + 2].y);
	                    var d = GetPointDistance(P1.x, P1.y, P2.x, P2.y) * 0.55;
	                    var d1 = GetPointDistance(P2.x, P2.y, P3.x, P3.y) * 0.55;
	                    var shouldNotify = 0;
	                    if (d > 5.0 && d1 > 5.0) {
	                        shouldNotify = 1;
	                    }
	                    var path = {
	                        startPoint: realPh[level][i],
	                        endPoint: realPh[level][i + 1],
	                        pathLength: d,
	                        shouldNotify: shouldNotify,
	                        isNotified: 0,
	                    }
	                    shortPaths.push(path);
	                }
	            }
	            el.data('wayfinding:shortPaths', shortPaths);
	        }

	        var tempDataStore,
	            startAssistPath,
	            endAssistPath,
	            startConnection,
	            endConnection;

	        function routeTo(el) {

	            var draw = {},
	                portalsEntered = 0,
	                lastStep,
	                level,
	                ax,
	                ay,
	                bx,
	                by,
	                aDX,
	                aDY,
	                bDX,
	                bDY,
	                cx,
	                cy,
	                px,
	                py,
	                curve,
	                nx,
	                ny,
	                thisPath,
	                pick;
	            tempDataStore = {
	                'p': []
	            };
	            navTips = [];
	            var t = {};

	            function time(s) {
	                t[s] = t[s] || new Date();
	            }

	            function timeEnd(s) {
	                L("time " + s + ":" + (new Date() - t[s]));
	            }

	            /*console.*/
	            time("dataStore");
	            //dataStore = $.extend(true, {}, dataStoreCache);
	            dataStore = JSON.parse(dataStoreCache);
	            /*console.*/
	            timeEnd("dataStore");
	            // build();
	            // console.info(JSON.stringify(c))
	            // console.log(JSON.stringify(dataStore))
	            //找到连接的辅路和去掉不需要的辅路  填充tempDataStore
	            /*console.*/
	            time("findAssistPaths");//耗时450ms
	            findAssistPaths(options.startpoint, options.endpoint);
	            /*console.*/
	            timeEnd("findAssistPaths");
	            //找到连接辅路和主路的节点之后  找出在tempDataStore中的mainPath index. 跨楼层导航注意事项: 跨楼层的portal连接到主路,主路在连接点处必须断开,才能保证规划处跨楼层路径
	            if (startConnection.x != 0 && endConnection.x != 0) {
	                /*console.*/
	                time("findMainPaths");
	                findMainPaths(startConnection, endConnection);
	                /*console.*/
	                timeEnd("findMainPaths");
	            } else {
	                // 没有找到辅路和主路的连接点有可能是因为地图和路径地图的roomId或doorId不一致造成的.比如说: 地图上某个门的id为L1S5,但路径地图上该门的id为L1S3
	                console.error('没有找到辅路和主路连接点');
	                return;
	            }

	            if (startMainIndex.index === -1 || endMainIndex.index === -1) {
	                // 可能的原因是计算点在线上的阈值还是太小了. 已经从之前的0.1改为现在的0.5了
	                console.error('没有找到连接的主路');
	                return;
	            }
	            /*console.*/
	            time("createNewDataStore");
	            createNewDataStore();
	            /*console.*/
	            timeEnd("createNewDataStore");

	            /*console.*/
	            time("buildNewDataStore");
	            buildNewDataStore();//耗时250ms
	            /*console.*/
	            timeEnd("buildNewDataStore");

	            //根据起点遍历到所有地方的最短路径
	            /*console.*/
	            time("generateRoutes");
	            generateRoutes();//耗时451ms
	            /*console.*/
	            timeEnd("generateRoutes");

	            $('[class^=directionPath]', obj).remove();
	            $('#Rooms *.wayfindingRoom', obj).removeAttr('class');

	            solution = [];

	            //根据终点，找出最短路径的index
	            try {
	                /*console.*/
	                time("solution");
	                solution = getShortestRoute();
	                /*console.*/
	                timeEnd("solution");

	            } catch (e) {
	                L(e)
	            } finally {

	            }
	            L("solution = " + solution.length);
	            //console.log(JSON.stringify(solution))
	            // Count number of portal trips
	            for (i = 0; i < solution.length; i++) {
	                if (solution[i].type === 'po') {
	                    portalsEntered++;
	                }
	            }

	            //break this into a new function?
	            drawing = new Array(portalsEntered); // Problem at line 707 character 40: Use the array literal notation [].
	            drawing[0] = [];

	            if (dataStore.p[solution[0].floor][solution[0].segment].d[0] === startpoint) {
	                draw = {};
	                draw.floor = solution[0].floor;
	                draw.type = 'M';
	                draw.x = dataStore.p[solution[0].floor][solution[0].segment].x;
	                draw.y = dataStore.p[solution[0].floor][solution[0].segment].y;
	                draw.length = 0;
	                drawing[0].push(draw);
	                draw = {};
	                draw.type = 'L';
	                draw.floor = solution[0].floor;
	                draw.x = dataStore.p[solution[0].floor][solution[0].segment].m;
	                draw.y = dataStore.p[solution[0].floor][solution[0].segment].n;
	                draw.length = dataStore.p[solution[0].floor][solution[0].segment].l;
	                drawing[0].push(draw);
	                drawing[0].routeLength = draw.length;
	            } else if (dataStore.p[solution[0].floor][solution[0].segment].e[0] === startpoint) {
	                draw = {};
	                draw.type = 'M';
	                draw.floor = solution[0].floor;
	                draw.x = dataStore.p[solution[0].floor][solution[0].segment].m;
	                draw.y = dataStore.p[solution[0].floor][solution[0].segment].n;
	                draw.length = 0;
	                drawing[0].push(draw);
	                draw = {};
	                draw.type = 'L';
	                draw.floor = solution[0].floor;
	                draw.x = dataStore.p[solution[0].floor][solution[0].segment].x;
	                draw.y = dataStore.p[solution[0].floor][solution[0].segment].y;
	                draw.length = dataStore.p[solution[0].floor][solution[0].segment].l;
	                drawing[0].push(draw);
	                drawing[0].routeLength = draw.length;
	            }
	            lastStep = 1;

	            // for each floor that we have to deal with
	            for (var i = 0; i < portalsEntered + 1; i++) {
	                for (var stepNum = lastStep; stepNum < solution.length; stepNum++) {
	                    if (solution[stepNum].type === 'pa') {
	                        ax = dataStore.p[solution[stepNum].floor][solution[stepNum].segment].x;
	                        ay = dataStore.p[solution[stepNum].floor][solution[stepNum].segment].y;
	                        bx = dataStore.p[solution[stepNum].floor][solution[stepNum].segment].m;
	                        by = dataStore.p[solution[stepNum].floor][solution[stepNum].segment].n;

	                        draw = {};
	                        draw.floor = solution[stepNum].floor;
	                        if (drawing[i].slice(-1)[0].x === ax && drawing[i].slice(-1)[0].y === ay) {
	                            draw.x = bx;
	                            draw.y = by;
	                        } else {
	                            draw.x = ax;
	                            draw.y = ay;
	                        }
	                        draw.length = dataStore.p[solution[stepNum].floor][solution[stepNum].segment].l;
	                        draw.type = 'L';
	                        drawing[i].push(draw);
	                        drawing[i].routeLength += draw.length;
	                    }
	                    if (solution[stepNum].type === 'po') {
	                        drawing[i + 1] = [];
	                        drawing[i + 1].routeLength = 0;
	                        // push the first object on
	                        // check for more than just floor number here....
	                        pick = '';
	                        if (dataStore.q[solution[stepNum].segment].g === dataStore.q[solution[stepNum].segment].k) {
	                            if (dataStore.q[solution[stepNum].segment].x === draw.x && dataStore.q[solution[stepNum].segment].y === draw.y) {
	                                pick = 'B';
	                            } else {
	                                pick = 'A';
	                            }
	                        } else {
	                            if (dataStore.q[solution[stepNum].segment].g === solution[stepNum].floor) {
	                                pick = 'A';
	                            } else if (dataStore.q[solution[stepNum].segment].k === solution[stepNum].floor) {
	                                pick = 'B';
	                            }
	                        }
	                        if (pick === 'A') {
	                            draw = {};
	                            draw.floor = solution[stepNum].floor;
	                            draw.type = 'M';
	                            draw.x = dataStore.q[solution[stepNum].segment].x;
	                            draw.y = dataStore.q[solution[stepNum].segment].y;
	                            draw.length = 0;
	                            drawing[i + 1].push(draw);
	                            drawing[i + 1].routeLength = draw.length;
	                        } else if (pick === 'B') {
	                            draw = {};
	                            draw.floor = solution[stepNum].floor;
	                            draw.type = 'M';
	                            draw.x = dataStore.q[solution[stepNum].segment].m;
	                            draw.y = dataStore.q[solution[stepNum].segment].n;
	                            draw.length = 0;
	                            drawing[i + 1].push(draw);
	                            drawing[i + 1].routeLength = draw.length;
	                        }
	                        lastStep = stepNum;
	                        lastStep++;
	                        stepNum = solution.length;
	                    }
	                }
	            }
	            /**
	             *删除数组指定下标或指定对象
	             */
	            Array.prototype.remove = function (obj) {
	                for (var i = 0; i < this.length; i++) {
	                    var temp = this[i];
	                    if (!isNaN(obj)) {
	                        temp = i;
	                    }
	                    if (temp.x == obj.x && temp.y == obj.y) {
	                        for (var j = i; j < this.length; j++) {
	                            this[j] = this[j + 1];
	                        }
	                        this.length = this.length - 1;
	                    }
	                }
	            };
	            var mObjects = [];

	            realPath = new Array(drawing.length);
	            for (i = 0; i < drawing.length; i++) {
	                realPath[i] = $.extend(true, [], drawing[i]);
	            }
	            for (level = 0; level < drawing.length; level++) {

	                if (drawing[level].length >= 3) {
	                    var lpath1 = drawing[level][0];
	                    var lpath2 = drawing[level][1];

	                    for (i = 2; i < drawing[level].length - 1; i++) {
	                        if ((drawing[level][i].x - lpath1.x) * (lpath2.y - lpath1.y) == (drawing[level][i].y - lpath1.y) * (lpath2.x - lpath1.x)) {
	                            mObjects.push(drawing[level][i - 1]);
	                            lpath2 = drawing[level][i];
	                        } else {
	                            lpath1 = drawing[level][i - 1];
	                            lpath2 = drawing[level][i];
	                        }
	                    }
	                    if (mObjects.length > 0) {
	                        for (i = 0; i < mObjects.length; i++) {
	                            realPath[level].remove(mObjects[i]);
	                        }
	                    }
	                }

	            }
	            for (level = 0; level < realPath.length - 1; level++) {
	                for (i = level + 1; i < realPath.length; i++) {
	                    if (realPath[i][0].floor == realPath[level][0].floor) {
	                        realPath[level] = realPath[level].concat(realPath[i]);
	                        realPath.splice(i, 1);
	                    }
	                }
	            }
	            el.data('wayfinding:realPath', realPath);
	            if (options.turnningNotify) {
	                initRealPaths(realPath, el);
	            }
	            //go back through the drawing and insert curves if requested
	            //consolidate colinear line segments?
	            if (options.path.radius > 0) {
	                for (level = 0; level < drawing.length; level++) {
	                    for (i = 1; i < drawing[level].length - 1; i++) {
	                        if (drawing[level][i].type === 'L' && drawing[level][i].type === 'L') {
	                            // check for colinear here and remove first segment, and add its length to second
	                            aDX = (drawing[level][i - 1].x - drawing[level][i].x);
	                            aDY = (drawing[level][i - 1].y - drawing[level][i].y);
	                            bDX = (drawing[level][i].x - drawing[level][i + 1].x);
	                            bDY = (drawing[level][i].y - drawing[level][i + 1].y);
	                            // if the change in Y for both is Zero
	                            if ((aDY === 0 && bDY === 0) || (aDX === 0 && bDX === 0) || ((aDX / aDY) === (bDX / bDY) && !(aDX === 0 && aDY === 0 && bDX === 0 && bDY === 0))) {
	                                drawing[level][i + 1].length = drawing[level][i].length + drawing[level][i + 1].length;
	                                //                                      drawing[level][i+1].type = "L";
	                                drawing[level].splice(i, 1);
	                                i = 1;
	                            }
	                        }
	                    }
	                    for (i = 1; i < drawing[level].length - 1; i++) {
	                        // locate possible curves based on both line segments being longer than options.path.radius
	                        if (drawing[level][i].type === 'L' && drawing[level][i].type === 'L' && drawing[level][i].length > options.path.radius && drawing[level][i + 1].length > options.path.radius) {
	                            //save old end point
	                            cx = drawing[level][i].x;
	                            cy = drawing[level][i].y;
	                            // change x,y and change length
	                            px = drawing[level][i - 1].x;
	                            py = drawing[level][i - 1].y;
	                            //new=prior + ((center-prior) * ((length-radius)/length))
	                            drawing[level][i].x = (Number(px) + ((cx - px) * ((drawing[level][i].length - options.path.radius) / drawing[level][i].length)));
	                            drawing[level][i].y = (Number(py) + ((cy - py) * ((drawing[level][i].length - options.path.radius) / drawing[level][i].length)));
	                            //shorten current line
	                            drawing[level][i].length = drawing[level][i].length - options.path.radius;
	                            curve = {};
	                            //curve center is old end point
	                            curve.cx = cx;
	                            curve.cy = cy;
	                            //curve end point is based on next line
	                            nx = drawing[level][i + 1].x;
	                            ny = drawing[level][i + 1].y;
	                            curve.x = (Number(cx) + ((nx - cx) * ((options.path.radius) / drawing[level][i + 1].length)));
	                            curve.y = (Number(cy) + ((ny - cy) * ((options.path.radius) / drawing[level][i + 1].length)));
	                            //change length of next segment now that it has a new starting point
	                            drawing[level][i + 1].length = drawing[level][i + 1].length - options.path.radius;
	                            curve.type = 'Q';
	                            curve.floor = drawing[level][i].floor;
	                            // insert curve element
	                            // splice function on arrays allows insertion
	                            //   array.splice(start, delete count, value, value)
	                            // drawing[level].splice(current line, 0, curve element object);

	                            drawing[level].splice(i + 1, 0, curve);

	                        } // both possible segments long enough
	                    } // drawing segment
	                } // level
	            } // if we are doing curves at all

	            try {
	                var sx_start = drawing[0][0],
	                    sx_end = drawing.slice(-1)[0].slice(-1)[0];

	                var startMap = el.children().has($('#' + escapeSelector(options.startpoint))),
	                    endMap = el.children().has($('#' + escapeSelector(options.endpoint))),
	                    _sb = $('svg', startMap).find("#cursorBox"),
	                    _eb = $('svg', endMap).find("#cursorBox"),
	                    spin = makePin(sx_start.x, sx_start.y, 'startPin'),
	                    epin = makePin(sx_end.x, sx_end.y, 'destinationPin');

	                $('g.startPin', el).remove();
	                $('g.destinationPin', el).remove();
	                _sb.before(spin);
	                _eb.before(epin);
	            } catch (e) {

	            } finally {

	            }

	            $.each(drawing, function (j, map) {
	                var path = '',
	                    newPath;
	                var sx_pathArr = [];

	                //var dis = GetPointDistance(st.x,st.y，ed.x,ed.y);
	                /*
	                 基于start 与 end点 每 _d = 30 单位截取一段path  用以设置路径箭头
	                 过滤小于5的path，防止拐弯处箭头过于密集
	                 */
	                function splitPath(s, e) {
	                    s.x = Number(s.x)
	                    s.y = Number(s.y)
	                    e.x = Number(e.x)
	                    e.y = Number(e.y)
	                    var _d = 30;
	                    var d_x = s.x - e.x,
	                        d_y = s.y - e.y,
	                        dis_x = Math.abs(d_x),
	                        dis_y = Math.abs(d_y);
	                    if (dis_x > _d || dis_y > _d) {
	                        if (dis_x > dis_y) {
	                            var t = dis_x / _d;
	                            for (var i = 1; i <= t; i++) {
	                                var _mx = s.x - plusminus(d_x) * _d * (i - 0.5),
	                                    _my = s.y + d_y / d_x * _d * (i - 0.5),
	                                    _mx2 = s.x - plusminus(d_x) * _d * i,
	                                    _my2 = s.y + d_y / d_x * _d * i;
	                                // console.log("M" + _mx+","+ _my + "L" + _mx2 + ',' + _my2)
	                                sx_pathArr.push("M" + _mx + "," + _my + "L" + _mx2 + ',' + _my2)
	                            }
	                        } else {
	                            var t = dis_y / _d;
	                            for (var i = 1; i <= t; i++) {
	                                var _my = s.y - plusminus(d_y) * _d * (i - 0.5),
	                                    _mx = s.x + d_x / d_y * _d * (i - 0.5),
	                                    _my2 = s.y - plusminus(d_y) * _d * i,
	                                    _mx2 = s.x + d_x / d_y * _d * i;
	                                // console.log("M" + _mx+","+ _my + "L" + _mx2 + ',' + _my2)
	                                sx_pathArr.push("M" + _mx + "," + _my + "L" + _mx2 + ',' + _my2)
	                            }
	                        }
	                    } else {
	                        //过滤掉长度极小的path
	                        if (dis_x < 5 && dis_y < 5) {
	                            return;
	                        }
	                        var mid = {
	                            x: (s.x + Number(e.x) ) / 2,
	                            y: (s.y + Number(e.y) ) / 2
	                        }
	                        //console.log("M" + mid.x+","+ mid.y + "L" + e.x + ',' + e.y)
	                        sx_pathArr.push("M" + mid.x + "," + mid.y + "L" + e.x + ',' + e.y);
	                    }
	                }

	                function plusminus(num) {
	                    return num > 0 ? 1 : -1
	                }

	                $.each(map, function (k, stroke) {
	                    switch (stroke.type) {
	                        case 'M':
	                            path = 'M' + stroke.x + ',' + stroke.y;
	                            break;
	                        case 'L':
	                            path += 'L' + stroke.x + ',' + stroke.y;

	                            // 使用marker设置箭头  分割path
	                            // splitPath(map[k-1],stroke);

	                            // var mid = {
	                            //   x:(Number(map[k-1].x )+ Number(stroke.x) ) / 2,
	                            //   y:(Number(map[k-1].y )+ Number(stroke.y) ) / 2
	                            // }
	                            // var sx_path = "M" + mid.x+","+ mid.y + "L" + stroke.x + ',' + stroke.y;
	                            // sx_pathArr.push(sx_path)
	                            break;
	                        case 'Q':
	                            path += 'Q' + stroke.cx + ',' + stroke.cy + ' ' + stroke.x + ',' + stroke.y;
	                            break;
	                    }
	                });

	                newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	                newPath.setAttribute('d', path);
	                newPath.style.fill = 'none';

	                if (newPath.classList) {
	                    newPath.classList.add('directionPath' + j);
	                } else {
	                    newPath.setAttribute('class', 'directionPath' + j);
	                }
	                newPath.id = "directionPath" + j;


	                // Attach the newpath to the startpin or endpin if they exist on this floor
	                var attachPointSvg = $('#' + maps[map[0].floor].id + ' svg');

	                //TODO
	                // var _w = (pageToSvg(6,0).x - pageToSvg(0,0).x) / gTools.ratio;
	                // _w = Math.ceil(_w)
	                // newPath.style.strokeWidth = _w

	                var transArea = $("g#transArea", attachPointSvg)
	                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
	                var textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
	                // text.setAttribute('dy',_w/2);
	                text.setAttribute("class", "directionPath_")
	                text.classList.add("textarrow")
	                // text.setAttribute("font-size",_w * 1.7)
	                textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + newPath.id);
	                textPath.appendChild(document.createTextNode("＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞"));
	                $(text).append(textPath);


	                // 老版本使用marker设置箭头
	                //       if(! transArea.children("marker#arrow").length){
	                //         var  marker  =  document.createElementNS('http://www.w3.org/2000/svg', 'marker')
	                //         marker.setAttribute("id","arrow")
	                //         marker.setAttribute("viewBox","0 0 10 10")
	                //         marker.setAttribute("refX","1")
	                //         marker.setAttribute("refY","5")
	                //         marker.setAttribute("markerWidth","6")
	                //         marker.setAttribute("markerHeight","6")
	                //         marker.setAttribute("orient","auto")
	                //         var arrow = document.createElementNS("http://www.w3.org/2000/svg","path");
	                //         arrow.setAttribute("d","M 0 0 L 10 5 L 0 10 z")
	                //
	                //         //TODO  暂时不添加箭头
	                // //marker.appendChild(arrow)
	                //         //transArea.prepend(marker)
	                //       }

	                //TODO
	                // $("#transArea",attachPointSvg).prepend('<marker id="arrow" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">\
	                //     <path d=""></path>\
	                //   </marker>')


	                var startPin = $('.startPin', attachPointSvg);
	                var destinationPin = $('.destinationPin', attachPointSvg);

	                if (startPin.length) {
	                    startPin.before(newPath);
	                } else if (destinationPin.length) {
	                    destinationPin.before(newPath);
	                } else {
	                    attachPointSvg.children("g#transArea").append(newPath);
	                }
	                $(newPath).after(text);


	                // sx_pathArr.forEach(function(v,i){
	                //   var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	                //   p.setAttribute('d',v);
	                //   p.setAttribute("class","directionPath_")
	                //
	                //   // TODO
	                //   p.setAttribute('marker-start',"url(#arrow)");
	                //   // p.setAttribute('marker-mid',"url(#arrow)")
	                //   // p.setAttribute('marker-end',"url(#arrow)")
	                //   $(newPath).after(p);
	                // })

	                thisPath = $('#' + maps[map[0].floor].id + ' svg .directionPath' + j);

	                drawing[j].path = thisPath;

	            });
	            $(el).trigger("wayfinding:routeTo");
	            if (typeof gTools === 'object') {
	                gTools.navTips = $.extend(true, [], navTips);
	            }
	            animatePath(0);

	            // console.log(solution);
	        }

	        function createNewDataStore() {
	            dataStore.p = [];   // 重置

	            var index = 0, dataStoreFloorPaths, tmpPath;

	            if (startConnection.floor === endConnection.floor) {
	                if (startConnection.x === endConnection.x && startConnection.y === endConnection.y) {
	                    index = 1;
	                } else if (startMainIndex.index === endMainIndex.index) {
	                    index = 2;
	                } else {
	                    index = 3;
	                }
	            } else {
	                index = 3;
	            }

	            switch (index) {
	                case 1:
	                    $.each(tempDataStore.p, function (mapNum, pathArr) {
	                        dataStore.p[mapNum] = [];
	                        if (startAssistPath.floor === mapNum) {
	                            dataStore.p[mapNum].push(startAssistPath.path);
	                        }
	                        if (endAssistPath.floor === mapNum) {
	                            dataStore.p[mapNum].push(endAssistPath.path);
	                        }
	                        //for(var i=0; i<pathArr.length; i++){
	                        //    dataStore.p[mapNum].push(pathArr[i]);
	                        //}
	                    });
	                    break;
	                case 2:
	                    $.each(tempDataStore.p, function (mapNum, pathArr) {
	                        dataStore.p[mapNum] = [];

	                        if (startAssistPath.floor === mapNum) {
	                            dataStore.p[mapNum].push(startAssistPath.path);

	                            dataStore.p[mapNum].push(endAssistPath.path);

	                            var path = {};
	                            path.floor = startAssistPath.path.floor;
	                            path.r = 999999; //Infinity;
	                            path.p = -1;

	                            path.x = startConnection.x;
	                            path.y = startConnection.y;
	                            path.d = [];
	                            path.m = endConnection.x;
	                            path.n = endConnection.y;
	                            path.e = [];

	                            path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));

	                            path.c = [];
	                            path.q = [];

	                            path.recursive = false;

	                            dataStore.p[mapNum].push(path);
	                        }
	                    });
	                    break;
	                case 3:
	                    //此时的tempDataStore.p 只包含主路的连接portal的辅路
	                    $.each(tempDataStore.p, function (mapNum, pathArr) {
	                        dataStore.p[mapNum] = [];
	                        dataStoreFloorPaths = dataStore.p[mapNum];

	                        if (startAssistPath.floor === mapNum) {
	                            dataStoreFloorPaths.push(startAssistPath.path);
	                        }
	                        if (endAssistPath.floor === mapNum) {
	                            dataStoreFloorPaths.push(endAssistPath.path);
	                        }

	                        for (var i = 0; i < pathArr.length; i++) {
	                            tmpPath = pathArr[i];

	                            if (startMainIndex.floor === mapNum && startMainIndex.index === i) {
	                                if ((tmpPath.x === startConnection.x && tmpPath.y === startConnection.y) || (tmpPath.m === startConnection.x && tmpPath.n === startConnection.y)) {
	                                    dataStoreFloorPaths.push(tmpPath);
	                                } else {
	                                    var path = {};
	                                    path.floor = tmpPath.floor;
	                                    path.r = 999999; //Infinity;    // 路径长度?
	                                    path.p = -1;                    // Portal?

	                                    path.x = tmpPath.x;
	                                    path.y = tmpPath.y;
	                                    path.d = [];                    // door的mapArea(起点或终点)
	                                    path.m = startConnection.x;
	                                    path.n = startConnection.y;
	                                    path.e = [];                    // door的mapArea(起点或终点)

	                                    path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));    // 路径长度

	                                    path.c = [];                    // 相连路径的索引集合
	                                    path.q = [];

	                                    path.recursive = false;         // 是否进行递归调用标志位

	                                    dataStore.p[mapNum].push(path);

	                                    var path = {};
	                                    path.floor = tmpPath.floor;
	                                    path.r = 999999; //Infinity;
	                                    path.p = -1;

	                                    path.x = startConnection.x;
	                                    path.y = startConnection.y;
	                                    path.d = [];
	                                    path.m = tmpPath.m;
	                                    path.n = tmpPath.n;
	                                    path.e = [];

	                                    path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));

	                                    path.c = [];
	                                    path.q = [];

	                                    path.recursive = false;

	                                    dataStore.p[mapNum].push(path);
	                                }
	                            } else if (endMainIndex.floor === mapNum && endMainIndex.index === i) {
	                                if ((tmpPath.x === endConnection.x && tmpPath.y === endConnection.y) || (tmpPath.m === endConnection.x && tmpPath.n === endConnection.y)) {
	                                    dataStore.p[mapNum].push(tmpPath);
	                                } else {
	                                    var path = {};
	                                    path.floor = tmpPath.floor;
	                                    path.r = 999999; //Infinity;
	                                    path.p = -1;

	                                    path.x = tmpPath.x;
	                                    path.y = tmpPath.y;
	                                    path.d = [];
	                                    path.m = endConnection.x;
	                                    path.n = endConnection.y;
	                                    path.e = [];

	                                    path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));

	                                    path.c = [];
	                                    path.q = [];

	                                    path.recursive = false;

	                                    dataStore.p[mapNum].push(path);

	                                    var path = {};
	                                    path.floor = tmpPath.floor;
	                                    path.r = 999999; //Infinity;
	                                    path.p = -1;

	                                    path.x = endConnection.x;
	                                    path.y = endConnection.y;
	                                    path.d = [];
	                                    path.m = tmpPath.m;
	                                    path.n = tmpPath.n;
	                                    path.e = [];

	                                    path.l = Math.sqrt(Math.pow(path.x - path.m, 2) + Math.pow(path.y - path.n, 2));

	                                    path.c = [];
	                                    path.q = [];

	                                    path.recursive = false;

	                                    dataStore.p[mapNum].push(path);
	                                }
	                            } else {
	                                dataStore.p[mapNum].push(tmpPath);
	                            }
	                        }
	                    });
	                    break;
	                default:

	                    break;
	            }
	        }

	        function generateRoutes() {
	            var sourceInfo,
	                mapNum,
	                sourcemapNum,
	                tmpPath;

	            sourceInfo = getDoorPaths(startpoint);

	            for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                if (maps[mapNum].id === sourceInfo.floor) {
	                    sourcemapNum = mapNum;
	                    break;
	                }
	            }

	            $.each(sourceInfo.paths, function (i, pathId) {
	                tmpPath = dataStore.p[sourcemapNum][pathId];
	                tmpPath.r = tmpPath.l;
	                tmpPath.p = 'door';
	                recursiveSearch('pa', sourcemapNum, pathId, tmpPath.l); // 计算并设置r值
	            });
	        }

	        function recursiveSearch(segmentType, segmentFloor, segment, length) {
	            //log.v('[recursiveSearch]...Into...type', segmentType, 'floor', segmentFloor, 'segment', segment, 'length', length);

	            var tmpSegmentFloor = dataStore.p[segmentFloor], tmpSegmentC = tmpSegmentFloor[segment].c, tmpTryPath;
	            try {
	                $.each(tmpSegmentC, function (i, tryPath) {
	                    tmpTryPath = tmpSegmentFloor[tryPath];

	                    if (length + tmpTryPath.l < tmpTryPath.r) {
	                        tmpTryPath.r = length + tmpTryPath.l;
	                        tmpTryPath.p = segment;
	                        tmpTryPath.o = segmentType;

	                        tmpTryPath.recursive = true;
	                        //recursiveSearch('pa', segmentFloor, tryPath, dataStore.p[segmentFloor][tryPath].r);
	                        //log.v('[recursiveSearch]....1-1');
	                    }
	                });

	                $.each(tmpSegmentC, function (i, tryPath) {
	                    tmpTryPath = tmpSegmentFloor[tryPath];

	                    if (tmpTryPath.recursive === true) {

	                        tmpTryPath.recursive = false;

	                        //log.v('[recursiveSearch]....1-2');

	                        recursiveSearch('pa', segmentFloor, tryPath, tmpTryPath.r);
	                    }
	                });
	            } catch (e) {
	                console.error("sth is wrong", e);
	            } finally {

	            }

	            // if the current path is connected to any portals
	            var tmpSegmentQ = tmpSegmentFloor[segment].q, tmpPortal, tmpPortalK, tmpPortalG, tmpTryPath2;
	            //log.v('tmpSegmentFloor === tmpSegmentFloor2', tmpSegmentFloor === tmpSegmentFloor2);

	            if (tmpSegmentQ.length > 0) {
	                //log.v('[recursiveSearch]....Into...branch2, floor', segmentFloor, 'segment', segment);

	                $.each(tmpSegmentQ, function (i, tryPortal) {
	                    tmpPortal = dataStore.q[tryPortal];

	                    if (length + tmpPortal.l < tmpPortal.r && (options.accessibleRoute === false || (options.accessibleRoute === true && tmpPortal.a))) {
	                        tmpPortal.r = length + tmpPortal.l;
	                        tmpPortal.p = segment;
	                        tmpPortal.q = segmentFloor;
	                        tmpPortal.o = segmentType;

	                        if ($.inArray(segment, tmpPortal.c) !== -1) {
	                            $.each(tmpPortal.d, function (ia, tryPath) {
	                                //log.i('[recursiveSearch]....2-1');
	                                tmpPortalK = tmpPortal.k;
	                                tmpTryPath2 = dataStore.p[tmpPortalK][tryPath];

	                                if (length + tmpPortal.l + tmpTryPath2.l < tmpTryPath2.r) {
	                                    //log.i('[recursiveSearch]....2-1-1');
	                                    tmpTryPath2.r = tmpPortal.r + tmpTryPath2.l;
	                                    tmpTryPath2.p = tryPortal;
	                                    tmpTryPath2.o = 'po';
	                                    recursiveSearch('pa', tmpPortalK, tryPath, tmpTryPath2.r);
	                                }
	                            });
	                        } else {
	                            $.each(tmpPortal.c, function (ib, tryPath) {
	                                //log.i('[recursiveSearch]....2-2');
	                                tmpPortalG = tmpPortal.g;
	                                tmpTryPath2 = dataStore.p[tmpPortalG][tryPath];

	                                if (length + tmpPortal.l + tmpTryPath2.l < tmpTryPath2.r) {
	                                    //log.i('[recursiveSearch]....2-2-1');
	                                    tmpTryPath2.r = tmpPortal.r + tmpTryPath2.l;
	                                    tmpTryPath2.p = tryPortal;
	                                    tmpTryPath2.o = 'po';
	                                    recursiveSearch('pa', tmpPortalG, tryPath, tmpTryPath2.r);
	                                }
	                            });
	                        }
	                    }
	                });
	            }
	        }

	        function getShortestRoute() {
	            var destInfo,
	                mapNum,
	                destinationmapNum,
	                reversePathStart,
	                minPath,
	                i;

	            destInfo = getDoorPaths(options.endpoint);
	            for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                if (maps[mapNum].id === destInfo.floor) {
	                    destinationmapNum = mapNum;
	                    break;
	                }
	            }
	            minPath = 999999; //Infinity;
	            reversePathStart = -1;
	            for (i = 0; i < destInfo.paths.length; i++) {

	                if (dataStore.p[destinationmapNum][destInfo.paths[i]].r < minPath) {
	                    minPath = dataStore.p[destinationmapNum][destInfo.paths[i]].r;
	                    reversePathStart = destInfo.paths[i];
	                }
	            }
	            if (reversePathStart !== -1) {
	                solution = [];
	                backTrack('pa', destinationmapNum, reversePathStart);
	                solution.reverse();
	            }
	            return solution;
	        }

	        function backTrack(segmentType, segmentFloor, segment) {
	            var step;

	            if (segment !== 'door') {
	                step = {};
	                step.type = segmentType;
	                step.floor = segmentFloor;
	                step.segment = segment;
	                solution.push(step);

	                switch (segmentType) {
	                    case 'pa':
	                        backTrack(dataStore.p[segmentFloor][segment].o, segmentFloor, dataStore.p[segmentFloor][segment].p);
	                        break;
	                    case 'po':
	                        makeNavTips(dataStore.q[segment], maps[dataStore.q[segment].q], maps[segmentFloor]);
	                        backTrack(dataStore.q[segment].o, dataStore.q[segment].q, dataStore.q[segment].p);
	                        break;
	                }
	            }
	        }

	        function getDoorPaths(door) {
	            var mapNum,
	                pathNum,
	                doorANum,
	                doorBNum,
	                doorPaths = {
	                    'paths': [],
	                    'floor': null
	                },
	                tmpPaths,
	                tmpPath;

	            for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                tmpPaths = dataStore.p[mapNum];

	                for (pathNum = 0; pathNum < tmpPaths.length; pathNum++) {
	                    tmpPath = tmpPaths[pathNum];

	                    for (doorANum = 0; doorANum < tmpPath.d.length; doorANum++) {
	                        if (tmpPath.d[doorANum] === door) {
	                            doorPaths.paths.push(pathNum); // only pushing pathNum because starting on a single floor
	                            doorPaths.floor = tmpPath.floor;
	                        }
	                    }

	                    for (doorBNum = 0; doorBNum < tmpPath.e.length; doorBNum++) {
	                        if (tmpPath.e[doorBNum] === door) {
	                            doorPaths.paths.push(pathNum); // only pushing pathNum because starting on a single floor
	                            doorPaths.floor = tmpPath.floor;
	                        }
	                    }
	                }
	            }

	            return doorPaths;
	        }

	        /**
	         * 确定新的dataStore.p[] c q 和  dataStore.q[] c d
	         * 判断每条路径连接的路径
	         */
	        function buildNewDataStore() {
	            var mapNum,
	                pathOuterNum,
	                pathInnerNum,
	                portalNum,
	                pathNum,
	                // append for refine.
	                tmpFloorPaths,
	                tmpOuterCnt,
	                tmpInnerCnt,
	                tmpOuterPath,
	                tmpInnerPath;

	            for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                tmpFloorPaths = dataStore.p[mapNum];
	                tmpInnerCnt = tmpFloorPaths.length;
	                tmpOuterCnt = tmpInnerCnt - 1;

	                for (pathOuterNum = 0; pathOuterNum < tmpOuterCnt; pathOuterNum++) {
	                    for (pathInnerNum = pathOuterNum + 1; pathInnerNum < tmpInnerCnt; pathInnerNum++) {
	                        tmpOuterPath = tmpFloorPaths[pathOuterNum];
	                        tmpInnerPath = tmpFloorPaths[pathInnerNum];

	                        if (
	                            (tmpInnerPath.x === tmpOuterPath.x && tmpInnerPath.y === tmpOuterPath.y) ||
	                            (tmpInnerPath.m === tmpOuterPath.x && tmpInnerPath.n === tmpOuterPath.y) ||
	                            (tmpInnerPath.x === tmpOuterPath.m && tmpInnerPath.y === tmpOuterPath.n) ||
	                            (tmpInnerPath.m === tmpOuterPath.m && tmpInnerPath.n === tmpOuterPath.n)
	                        ) {
	                            // push onto connections
	                            tmpOuterPath.c.push(pathInnerNum);
	                            tmpInnerPath.c.push(pathOuterNum);
	                        }
	                    }
	                }
	            }

	            for (portalNum = 0; portalNum < dataStore.q.length; portalNum++) {
	                for (mapNum = 0; mapNum < maps.length; mapNum++) {
	                    for (pathNum = 0; pathNum < dataStore.p[mapNum].length; pathNum++) {
	                        if (dataStore.q[portalNum].f === dataStore.p[mapNum][pathNum].floor &&
	                            ((dataStore.q[portalNum].x === dataStore.p[mapNum][pathNum].x &&
	                            dataStore.q[portalNum].y === dataStore.p[mapNum][pathNum].y) ||
	                            (dataStore.q[portalNum].x === dataStore.p[mapNum][pathNum].m &&
	                            dataStore.q[portalNum].y === dataStore.p[mapNum][pathNum].n))) {
	                            dataStore.q[portalNum].c.push(pathNum);
	                            dataStore.p[mapNum][pathNum].q.push(portalNum);
	                        } else if (dataStore.q[portalNum].j === dataStore.p[mapNum][pathNum].floor &&
	                            ((dataStore.q[portalNum].m === dataStore.p[mapNum][pathNum].x &&
	                            dataStore.q[portalNum].n === dataStore.p[mapNum][pathNum].y) ||
	                            (dataStore.q[portalNum].m === dataStore.p[mapNum][pathNum].m &&
	                            dataStore.q[portalNum].n === dataStore.p[mapNum][pathNum].n))) {
	                            dataStore.q[portalNum].d.push(pathNum);
	                            dataStore.p[mapNum][pathNum].q.push(portalNum);
	                        }
	                    }
	                }
	            }
	        }

	        var startMainIndex,
	            endMainIndex;

	        /**
	         * 根据节点找到主路
	         * @param startConnection
	         * @param endConnection
	         */
	        function findMainPaths(startConnection, endConnection) {
	            var isStartConnectOnLine = false;
	            var isEndConnectOnLine = false;
	            startMainIndex = {
	                'floor': -1,
	                'index': -1
	            };
	            endMainIndex = {
	                'floor': -1,
	                'index': -1
	            };

	            var tmpPath;

	            $.each(tempDataStore.p, function (mapNum, pathArr) {
	                if (startConnection.floor === mapNum) {
	                    for (var i = 0; i < pathArr.length; i++) {
	                        tmpPath = pathArr[i];

	                        isStartConnectOnLine = isPointOnLine(+startConnection.x, +startConnection.y, {x: +tmpPath.x, y: +tmpPath.y, m: +tmpPath.m, n: +tmpPath.n});
	                        if (isStartConnectOnLine) {
	                            log.v('start point is on line...');
	                            
	                            startMainIndex.floor = mapNum;
	                            startMainIndex.index = i;
	                            startMainIndex.path = tmpPath;
	                            return false;
	                        }
	                    }
	                }
	            });


	            $.each(tempDataStore.p, function (mapNum, pathArr) {
	                if (endConnection.floor === mapNum) {
	                    for (var i = 0; i < pathArr.length; i++) {
	                        tmpPath = pathArr[i];

	                        isEndConnectOnLine = isPointOnLine(+endConnection.x, +endConnection.y, {x: +tmpPath.x, y: +tmpPath.y, m: +tmpPath.m, n: +tmpPath.n});
	                        if (isEndConnectOnLine) {
	                            log.v('end point is on line...');
	                            
	                            endMainIndex.floor = mapNum;
	                            endMainIndex.index = i;
	                            endMainIndex.path = tmpPath;
	                            return false;
	                        }
	                    }
	                }
	            });
	        }

	        /**
	         * 找出连接起点和终点的辅路
	         * 把所有主路push到tempDataStore
	         * @param startPoint
	         * @param endPoint
	         */
	        function findAssistPaths(startPoint, endPoint) {
	            startConnection = {
	                'floor': null,
	                'x': 0,
	                'y': 0
	            };
	            endConnection = {
	                'floor': null,
	                'x': 0,
	                'y': 0
	            };
	            startAssistPath = {     // 起点辅路
	                'floor': null,
	                'path': null
	            };
	            endAssistPath = {       // 终点辅路
	                'floor': null,
	                'path': null
	            };
	            //datastoreCache = $.extend({},dataStore)

	            var dataStoreFloorPaths, tmpPath, tmpPortal, d1, d2;
	            $.each(maps, function (mapNum) {
	                tempDataStore.p[mapNum] = [];   // tempDataStore缓存的是所有的主路跟连接到Portal的主路

	                dataStoreFloorPaths = dataStore.p[mapNum];
	                for (var i = 0; i < dataStoreFloorPaths.length; i++) {
	                    tmpPath = dataStoreFloorPaths[i];

	                    if (tmpPath.d == startPoint) {
	                        //tempDataStore.p[mapNum].push(tmpPath);
	                        if (window.X && startConnection.x) {
	                            d1 = Math.pow(startConnection.x - X, 2) + Math.pow(startConnection.y - Y, 2);
	                            d2 = Math.pow(tmpPath.m - X, 2) + Math.pow(tmpPath.n - Y, 2);

	                            if (d1 > d2) {
	                                startAssistPath.floor = mapNum;
	                                startAssistPath.path = tmpPath;

	                                startConnection.floor = mapNum;
	                                startConnection.x = tmpPath.m;
	                                startConnection.y = tmpPath.n;
	                            }
	                        } else {
	                            startAssistPath.floor = mapNum;
	                            startAssistPath.path = tmpPath;

	                            startConnection.floor = mapNum;
	                            startConnection.x = tmpPath.m;
	                            startConnection.y = tmpPath.n;
	                        }

	                    }

	                    if (tmpPath.e == startPoint) {
	                        if (window.X && startConnection.x) {
	                            d1 = Math.pow(startConnection.x - X, 2) + Math.pow(startConnection.y - Y, 2);
	                            d2 = Math.pow(tmpPath.x - X, 2) + Math.pow(tmpPath.y - Y, 2);

	                            if (d1 > d2) {
	                                startAssistPath.floor = mapNum;
	                                startAssistPath.path = tmpPath;

	                                startConnection.floor = mapNum;
	                                startConnection.x = tmpPath.x;
	                                startConnection.y = tmpPath.y;
	                            }
	                        } else {
	                            //tempDataStore.p[mapNum].push(tmpPath);
	                            startAssistPath.floor = mapNum;
	                            startAssistPath.path = tmpPath;

	                            startConnection.floor = mapNum;
	                            startConnection.x = tmpPath.x;
	                            startConnection.y = tmpPath.y;
	                        }
	                    }

	                    if (tmpPath.e == endPoint) {
	                        //tempDataStore.p[mapNum].push(tmpPath);
	                        endAssistPath.floor = mapNum;
	                        endAssistPath.path = tmpPath;

	                        endConnection.floor = mapNum;
	                        endConnection.x = tmpPath.x;
	                        endConnection.y = tmpPath.y;
	                    }

	                    if (tmpPath.d == endPoint) {
	                        //tempDataStore.p[mapNum].push(tmpPath);
	                        endAssistPath.floor = mapNum;
	                        endAssistPath.path = tmpPath;

	                        endConnection.floor = mapNum;
	                        endConnection.x = tmpPath.m;
	                        endConnection.y = tmpPath.n;
	                    }
	                    //tempDataStore.p[mapNum].push(tmpPath);

	                    // 把非Portal的辅路去掉
	                    if (tmpPath.d.length === 0 && tmpPath.e.length === 0) {
	                        tempDataStore.p[mapNum].push(tmpPath);
	                    } else {
	                        for (var j = 0; j < dataStore.q.length; j++) {
	                            // 如果辅路连接到的是一个Portal,则不去除该辅路
	                            tmpPortal = dataStore.q[j];

	                            if (
	                                (tmpPortal.x === tmpPath.x && tmpPortal.y === tmpPath.y) ||
	                                (tmpPortal.x === tmpPath.m && tmpPortal.y === tmpPath.n) ||
	                                (tmpPortal.m === tmpPath.x && tmpPortal.n === tmpPath.y) ||
	                                (tmpPortal.m === tmpPath.m && tmpPortal.n === tmpPath.n)
	                            ) {
	                                tempDataStore.p[mapNum].push(tmpPath);
	                            }
	                        }
	                    }
	                }
	            });
	        }

	        /**
	         * 路径吸附
	         * @param CP    Current Ponit: 当前位置点,还包含楼层编号,形如{x: 23.3, y: 40, floor: "F195"}
	         * @param el    div#myMaps: 地图容器元素,可包含多个地图
	         * @returns {*} 主路上离当前位置最近的点
	         */
	        function judgeCurrentLocation(CP, el) {
	            var i;
	            var minP;
	            var reslut;
	            var PP = {};
	            var minD = 100.0;
	            var curD;
	            var P1 = {},
	                P2 = {},
	                P3 = {};
	            var paths = [];

	            PP.x = CP.x;
	            PP.y = CP.y;
	            realPh = el.data('wayfinding:realPath');
	            shortPaths = el.data('wayfinding:shortPaths');

	            function xmult(x1, y1, x2, y2, x0, y0) {
	                return (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
	            }

	            function area_triangle(x1, y1, x2, y2, x3, y3) {
	                return Math.abs(xmult(x1, y1, x2, y2, x3, y3)) / 2;
	            }

	            function getTurnning(x1, y1, x2, y2, ex, ey) {
	                var A = y2 - y1;
	                var B = x1 - x2;
	                var C = x2 * y1 - x1 * y2;
	                var D = A * ex + B * ey + C;
	                return D; // D > 0 左转， D < 0 右转
	            }

	            function dis_ptoline(x1, y1, x2, y2, ex, ey) { //第一个点，第二个点，目标点  px py为答案点  返回距离
	                var k, b, dis, tem1, tem2, t1, t2, yd = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	                var P = {};
	                t2 = Math.sqrt((x2 - ex) * (x2 - ex) + (y2 - ey) * (y2 - ey));
	                t1 = Math.sqrt((x1 - ex) * (x1 - ex) + (y1 - ey) * (y1 - ey));
	                dis = area_triangle(x1, y1, x2, y2, ex, ey) * 2 / yd;
	                tem1 = Math.sqrt(t1 * t1 - dis * dis);
	                tem2 = Math.sqrt(t2 * t2 - dis * dis);

	                if (tem1 > yd || tem2 > yd) {
	                    if (t1 > t2) {
	                        P.x = x2;
	                        P.y = y2;
	                        return P;
	                    } else {
	                        P.x = x1;
	                        P.y = y1;
	                        return P;
	                    }
	                }
	                P.x = x1 + (x2 - x1) * tem1 / yd;
	                P.y = y1 + (y2 - y1) * tem1 / yd;
	                return P;
	            }

	            function shouldNotifyTurnning(start, end) {
	                for (var i = 0; i < shortPaths.length; i++) {
	                    if (shortPaths[i].startPoint === start && shortPaths[i].endPoint === end) {
	                        if (shortPaths[i].shouldNotify) {
	                            if (!shortPaths[i].isNotified) {
	                                //if(GetPointDistance(minP.x,minP.y,shortPaths[i].endPoint.x,shortPaths[i].endPoint.y)*0.55<= 12.0)
	                                {
	                                    shortPaths[i].isNotified = 1;

	                                    return 1;
	                                }
	                            }
	                        }
	                    }
	                }
	                return 0;
	            }

	            function getLevelByFloorid(fid) {
	                var floorIndex = -1;
	                for (var i = 0; i < dataStore.p.length - 1; i++) {
	                    if (!dataStore.p[i].length) {
	                        break;
	                    }
	                    if (dataStore.p[i][0].floor == fid) {
	                        floorIndex = i;
	                        break;
	                    }
	                }
	                for (var j = 0; j < realPh.length; j++) {
	                    if (realPh[j][0].floor == floorIndex) {
	                        return j;
	                    }
	                }
	                return -1;
	            }

	            if (realPh !== undefined) {
	                var levelIndex = 0,
	                    lineIndex = 0;
	                var level = getLevelByFloorid(CP.floor);
	                if (level < 0) {
	                    return {
	                        nearPoint: PP,
	                        currentPoint: PP,
	                        distance: 99999.0
	                    };
	                }
	                for (i = 0; i < realPh[level].length - 1; i++) {
	                    var dist;
	                    P1.x = parseFloat(realPh[level][i].x);
	                    P1.y = parseFloat(realPh[level][i].y);
	                    P2.x = parseFloat(realPh[level][i + 1].x);
	                    P2.y = parseFloat(realPh[level][i + 1].y);
	                    if (i == 0) {
	                        minP = dis_ptoline(P1.x, P1.y, P2.x, P2.y, PP.x, PP.y);
	                        dist = minP;
	                    } else {
	                        dist = dis_ptoline(P1.x, P1.y, P2.x, P2.y, PP.x, PP.y);
	                    }
	                    minD = GetPointDistance(minP.x, minP.y, PP.x, PP.y);
	                    curD = GetPointDistance(dist.x, dist.y, PP.x, PP.y);
	                    if (curD < minD) {
	                        minP = dist;
	                        levelIndex = level;
	                        lineIndex = i;
	                    }
	                }
	                var arrived = 0;
	                var destLevel = realPh.length - 1;
	                var destIndex = realPh[destLevel].length - 1;
	                //if(levelIndex == realPh.length-1&& lineIndex == realPh[levelIndex].length-2)//å¤æ­æ¯å¦å°è¾¾ç®çå°
	                {
	                    P1.x = parseFloat(realPh[destLevel][destIndex].x);
	                    P1.y = parseFloat(realPh[destLevel][destIndex].y);
	                    if (GetPointDistance(P1.x, P1.y, minP.x, minP.y) * 0.55 < 8.0) {
	                        // todo  楼层切换时会把path去掉  bug
	                        //
	                        // 我记得苏杭说这个bug已经改掉了的来着？咋又出现了……
	                        // arrived = 1;
	                        // $('path[class^=directionPath]', obj).remove();
	                        //
	                        // //clear all rooms
	                        // $('#Rooms *.wayfindingRoom', obj).removeAttr('class');
	                        //
	                        // $('g.destinationPin', el).remove();
	                        //
	                        // $('g.startPin', el).remove();
	                        //
	                        // el.removeData('wayfinding:realPath','wayfinding:shortPaths');
	                    }
	                }
	                var turnning = 0;
	                var dCross = 0;
	                if (lineIndex < realPh[levelIndex].length - 2) {

	                    P1.x = parseFloat(realPh[levelIndex][lineIndex].x);
	                    P1.y = parseFloat(realPh[levelIndex][lineIndex].y);
	                    P2.x = parseFloat(realPh[levelIndex][lineIndex + 1].x);
	                    P2.y = parseFloat(realPh[levelIndex][lineIndex + 1].y);
	                    P3.x = parseFloat(realPh[levelIndex][lineIndex + 2].x);
	                    P3.y = parseFloat(realPh[levelIndex][lineIndex + 2].y);
	                    if (shouldNotifyTurnning(realPh[levelIndex][lineIndex], realPh[levelIndex][lineIndex + 1])) {
	                        turnning = getTurnning(P1.x, P1.y, P2.x, P2.y, P3.x, P3.y);
	                        dCross = GetPointDistance(P2.x, P2.y, minP.x, minP.y) * 0.55;
	                    }

	                }
	                reslut = {
	                    nearPoint: minP,
	                    currentPoint: PP,
	                    toCrossDistance: dCross,
	                    distance: minD,
	                    turnning: turnning,
	                    arrived: arrived
	                };
	                return reslut;
	            }
	            reslut = {
	                nearPoint: PP,
	                currentPoint: PP,
	                distance: 99999.0
	            };

	            return reslut;
	        }


	        /**
	         * options is function ==>> callback
	         * action ==>> options;
	         * 'initialize' ==>> action
	         * 第一次action为object 执行
	         * action为string 不执行
	         * //function(action, options, options2, callback)
	         */
	        if (action && typeof(action) === 'object') {
	            if (typeof(options) === 'function') {
	                callback = options;
	            }
	            options = action;
	            passed = action;
	            action = 'initialize';
	        }

	        /**
	         * this ==>> $('#myMaps')
	         */
	        this.each(function () {
	            obj = $(this);
	            getOptions(obj);

	            //除去第一次之后 以后给的action都是string
	            if (action && typeof action === 'string') {
	                switch (action) {
	                    case "":
	                        break;
	                    case 'initialize':
	                        if (passed && passed.maps) {
	                            checkIds(obj);
	                            initialize2(obj, callback);
	                        }
	                        break;
	                    case 'routeTo':
	                        break;
	                    case 'startpoint':
	                        break;
	                    case 'endpoint':
	                        break;
	                    case "setPoiPoint":
	                        if (passed === undefined) {
	                            return;
	                        } else {
	                            passed2 = passed2 ? passed2 : "poiPin";
	                            setPoiPoint(passed, passed2, obj);
	                        }
	                        gTools.setPinScale();   // 目前仅太古里环境需要重新设置游标的缩放比例
	                        break;
	                    case "clearPoiPoint":
	                        clearPoiPoint(obj, passed);
	                        break;
	                    case "clearPath":
	                        // remove any prior paths from the current map set
	                        $('[class^=directionPath]', obj).remove();
	                        //clear all rooms
	                        $('#Rooms *.wayfindingRoom', obj).removeAttr('class');
	                        $('g.destinationPin', obj).remove();
	                        $('g.startPin', obj).remove();
	                        break;
	                    case "setPin":
	                        newMakePin(passed.x, passed.y, obj.find(passed.floor), passed.type, passed.data); //{x:x,y:y,floor:floor,type:"pintype"}
	                        break;
	                    case "setParkPin":
	                        if (passed === undefined) {
	                            return;
	                        } else {
	                            setParkPoint(passed, obj);
	                            //establishDataStore(callback);
	                        }
	                        break;
	                    case 'jugeLocation':
	                        result = judgeCurrentLocation(passed, obj);
	                        break;
	                    case 'startAndEnd':
	                        if (passed === passed2) {
	                            return;
	                        }
	                        setStartPoint(passed, obj);
	                        setEndPoint(passed2, obj);
	                        routeTo(obj);
	                        gTools.setPinScale();
	                        break;
	                    case 'currentMap':
	                        if (passed === undefined) {
	                            result = $('div:visible', obj).prop('id');
	                        } else {
	                            switchFloor(passed, obj);
	                        }
	                        break;
	                    case 'path':
	                        break;
	                    default:
	                        break;
	                }
	            }
	        });

	        if (result !== undefined) {
	            return result;
	        }

	        return this;
	    };

	}(jQuery));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(setImmediate) {/*! Amaze UI v2.4.2 | by Amaze UI Team | (c) 2015 AllMobilize, Inc. | Licensed under MIT | 2015-07-06T10:25:45+0800 */ 
	!function(t){if(true)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.AMUI=t()}}(function(){return function t(e,i,n){function s(a,r){if(!i[a]){if(!e[a]){var l="function"==typeof require&&require;if(!r&&l)return require(a,!0);if(o)return o(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var u=i[a]={exports:{}};e[a][0].call(u.exports,function(t){var i=e[a][1][t];return s(i?i:t)},u,u.exports,t,e,i,n)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;a<n.length;a++)s(n[a]);return s}({1:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2);t(30),t(3),t(4),t(5),t(6),t(7),t(8),t(9),t(10),t(11),t(12),t(13),t(14),t(15),t(16),t(17),t(18),t(19),t(20),t(21),t(22),t(23),t(24),t(25),t(26),t(27),t(28),t(29),t(31),t(32),t(33),t(34),t(35),t(36),t(37),t(38),t(39),t(40),t(41),t(42),t(43),t(44),t(45),t(46),t(47),t(48),t(49),t(50),t(51),t(52),e.exports=n.AMUI=s},{10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17,18:18,19:19,2:2,20:20,21:21,22:22,23:23,24:24,25:25,26:26,27:27,28:28,29:29,3:3,30:30,31:31,32:32,33:33,34:34,35:35,36:36,37:37,38:38,39:39,4:4,40:40,41:41,42:42,43:43,44:44,45:45,46:46,47:47,48:48,49:49,5:5,50:50,51:51,52:52,6:6,7:7,8:8,9:9}],2:[function(t,e,i){"use strict";var n=window.jQuery;if("undefined"==typeof n)throw new Error("Amaze UI 2.x requires jQuery :-(\n\u7231\u4e0a\u4e00\u5339\u91ce\u9a6c\uff0c\u53ef\u4f60\u7684\u5bb6\u91cc\u6ca1\u6709\u8349\u539f\u2026");var s=n.AMUI||{},o=n(window),a=window.document,r=n("html");s.VERSION="2.4.2",s.support={},s.support.transition=function(){var t=function(){var t=a.body||a.documentElement,e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(void 0!==t.style[i])return e[i]}();return t&&{end:t}}(),s.support.animation=function(){var t=function(){var t=a.body||a.documentElement,e={WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd oanimationend",animation:"animationend"};for(var i in e)if(void 0!==t.style[i])return e[i]}();return t&&{end:t}}(),s.support.touch="ontouchstart"in window&&navigator.userAgent.toLowerCase().match(/mobile|tablet/)||window.DocumentTouch&&document instanceof window.DocumentTouch||window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>0||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>0||!1,s.support.mutationobserver=window.MutationObserver||window.WebKitMutationObserver||null,s.support.formValidation="function"==typeof document.createElement("form").checkValidity,s.utils={},s.utils.debounce=function(t,e,i){var n;return function(){var s=this,o=arguments,a=function(){n=null,i||t.apply(s,o)},r=i&&!n;clearTimeout(n),n=setTimeout(a,e),r&&t.apply(s,o)}},s.utils.isInView=function(t,e){var i=n(t),s=!(!i.width()&&!i.height())&&"none"!==i.css("display");if(!s)return!1;var a=o.scrollLeft(),r=o.scrollTop(),l=i.offset(),c=l.left,u=l.top;return e=n.extend({topOffset:0,leftOffset:0},e),u+i.height()>=r&&u-e.topOffset<=r+o.height()&&c+i.width()>=a&&c-e.leftOffset<=a+o.width()},s.utils.parseOptions=s.utils.options=function(t){if(n.isPlainObject(t))return t;var e=t?t.indexOf("{"):-1,i={};if(-1!=e)try{i=new Function("","var json = "+t.substr(e)+"; return JSON.parse(JSON.stringify(json));")()}catch(s){}return i},s.utils.generateGUID=function(t){var e=t+"-"||"am-";do e+=Math.random().toString(36).substring(2,7);while(document.getElementById(e));return e},s.plugin=function(t,e,i){var o=n.fn[t];i=i||{},n.fn[t]=function(o){var a,r=Array.prototype.slice.call(arguments,0),l=r.slice(1),c=this.each(function(){var c=n(this),u="amui."+t,h=i.dataOptions||"data-am-"+t,d=c.data(u),p=n.extend({},s.utils.parseOptions(c.attr(h)),"object"==typeof o&&o);(d||"destroy"!==o)&&(d||c.data(u,d=new e(this,p)),i.methodCall?i.methodCall.call(c,r,d):(i.before&&i.before.call(c,r,d),"string"==typeof o&&(a="function"==typeof d[o]?d[o].apply(d,l):d[o]),i.after&&i.after.call(c,r,d)))});return void 0===a?c:a},n.fn[t].Constructor=e,n.fn[t].noConflict=function(){return n.fn[t]=o,console.log(this),this},s[t]=e},n.fn.emulateTransitionEnd=function(t){var e=!1,i=this;n(this).one(s.support.transition.end,function(){e=!0});var o=function(){e||n(i).trigger(s.support.transition.end),i.transitionEndTimmer=void 0};return this.transitionEndTimmer=setTimeout(o,t),this},n.fn.redraw=function(){return this.each(function(){this.offsetHeight})},n.fn.transitionEnd=function(t){function e(s){t.call(this,s),i&&n.off(i,e)}var i=s.support.transition.end,n=this;return t&&i&&n.on(i,e),this},n.fn.removeClassRegEx=function(){return this.each(function(t){var e=n(this).attr("class");if(!e||!t)return!1;var i=[];e=e.split(" ");for(var s=0,o=e.length;o>s;s++)e[s].match(t)||i.push(e[s]);n(this).attr("class",i.join(" "))})},n.fn.alterClass=function(t,e){var i=this;if(-1===t.indexOf("*"))return i.removeClass(t),e?i.addClass(e):i;var s=new RegExp("\\s"+t.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g");return i.each(function(t,e){for(var i=" "+e.className+" ";s.test(i);)i=i.replace(s," ");e.className=n.trim(i)}),e?i.addClass(e):i},s.utils.rAF=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),s.utils.cancelAF=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||function(t){window.clearTimeout(t)}}(),s.utils.measureScrollbar=function(){if(document.body.clientWidth>=window.innerWidth)return 0;var t=n('<div style="width: 100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;"></div>');n(document.body).append(t);var e=t[0].offsetWidth-t[0].clientWidth;return t.remove(),e},s.utils.imageLoader=function(t,e){function i(){e(t[0])}function n(){if(this.one("load",i),/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var t=this.attr("src"),e=t.match(/\?/)?"&":"?";e+="random="+(new Date).getTime(),this.attr("src",t+e)}}return t.attr("src")?void(t[0].complete||4===t[0].readyState?i():n.call(t)):void i()},s.template=function(t,e){var i=s.template;return i.cache[t]||(i.cache[t]=function(){var e=t,n=/^[\w\-]+$/.test(t)?i.get(t):(e="template(string)",t),s=1,o=("try { "+(i.variable?"var "+i.variable+" = this.stash;":"with (this.stash) { ")+"this.ret += '"+n.replace(/<%/g,"").replace(/%>/g,"").replace(/'(?![^\x11\x13]+?\x13)/g,"\\x27").replace(/^\s*|\s*$/g,"").replace(/\n/g,function(){return"';\nthis.line = "+ ++s+"; this.ret += '\\n"}).replace(/\x11-(.+?)\x13/g,"' + ($1) + '").replace(/\x11=(.+?)\x13/g,"' + this.escapeHTML($1) + '").replace(/\x11(.+?)\x13/g,"'; $1; this.ret += '")+"'; "+(i.variable?"":"}")+"return this.ret;} catch (e) { throw 'TemplateError: ' + e + ' (on "+e+"' + ' line ' + this.line + ')'; } //@ sourceURL="+e+"\n").replace(/this\.ret \+= '';/g,""),a=new Function(o),r={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#x22;","'":"&#x27;"},l=function(t){return(""+t).replace(/[&<>\'\"]/g,function(t){return r[t]})};return function(t){return a.call(i.context={escapeHTML:l,line:1,ret:"",stash:t})}}()),e?i.cache[t](e):i.cache[t]},s.template.cache={},s.template.get=function(t){if(t){var e=document.getElementById(t);return e&&e.innerHTML||""}},s.DOMWatchers=[],s.DOMReady=!1,s.ready=function(t){s.DOMWatchers.push(t),s.DOMReady&&t(document)},s.DOMObserve=function(t,e,i){var o=s.support.mutationobserver;o&&(e=n.isPlainObject(e)?e:{childList:!0,subtree:!0},i="function"==typeof i&&i||function(){},n(t).each(function(){var t=this,a=n(t);if(!a.data("am.observer"))try{var r=new o(s.utils.debounce(function(e,n){i.call(t,e,n),a.trigger("changed.dom.amui")},50));r.observe(t,e),a.data("am.observer",r)}catch(l){}}))},n.fn.DOMObserve=function(t,e){return this.each(function(){s.DOMObserve(this,t,e)})},s.support.touch&&r.addClass("am-touch"),n(document).on("changed.dom.amui",function(t){var e=t.target;n.each(s.DOMWatchers,function(t,i){i(e)})}),n(function(){var t=n("body");s.DOMReady=!0,n.each(s.DOMWatchers,function(t,e){e(document)}),s.DOMObserve("[data-am-observe]"),r.removeClass("no-js").addClass("js"),s.support.animation&&r.addClass("cssanimations"),window.navigator.standalone&&r.addClass("am-standalone"),n(".am-topbar-fixed-top").length&&t.addClass("am-with-topbar-fixed-top"),n(".am-topbar-fixed-bottom").length&&t.addClass("am-with-topbar-fixed-bottom");var e=n(".am-layout");e.find('[class*="md-block-grid"]').alterClass("md-block-grid-*"),e.find('[class*="lg-block-grid"]').alterClass("lg-block-grid"),n("[data-am-widget]").each(function(){var t=n(this);0===t.parents(".am-layout").length&&t.addClass("am-no-layout")})}),e.exports=s},{}],3:[function(t,e,i){"use strict";function n(){window.removeEventListener("load",n,!1),c=!0}function s(t){return u=u||new s.Class(t)}function o(t,e){for(var i in e)t[i]=e[i];return t}function a(){"#ath"==document.location.hash&&history.replaceState("",window.document.title,document.location.href.split("#")[0]),h.test(document.location.href)&&history.replaceState("",window.document.title,document.location.href.replace(h,"$1")),d.test(document.location.search)&&history.replaceState("",window.document.title,document.location.href.replace(d,"$2"))}var r=t(2),l="addEventListener"in window,c=!1;"complete"===document.readyState?c=!0:l&&window.addEventListener("load",n,!1);var u,h=/\/ath(\/)?$/,d=/([\?&]ath=[^&]*$|&ath=[^&]*(&))/;s.intl={en_us:{ios:"To add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.",android:'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'},zh_cn:{ios:"\u5982\u8981\u628a\u5e94\u7528\u7a0b\u5f0f\u52a0\u81f3\u4e3b\u5c4f\u5e55,\u8bf7\u70b9\u51fb%icon, \u7136\u540e<strong>\u52a0\u81f3\u4e3b\u5c4f\u5e55</strong>",android:'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'},zh_tw:{ios:"\u5982\u8981\u628a\u61c9\u7528\u7a0b\u5f0f\u52a0\u81f3\u4e3b\u5c4f\u5e55, \u8acb\u9ede\u64ca%icon, \u7136\u5f8c<strong>\u52a0\u81f3\u4e3b\u5c4f\u5e55</strong>.",android:'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'}};for(var p in s.intl)s.intl[p.substr(0,2)]=s.intl[p];s.defaults={appID:"org.cubiq.addtohome",fontSize:15,debug:!1,logging:!1,modal:!1,mandatory:!1,autostart:!0,skipFirstVisit:!1,startDelay:1,lifespan:15,displayPace:1440,maxDisplayCount:0,icon:!0,message:"",validLocation:[],onInit:null,onShow:null,onRemove:null,onAdd:null,onPrivate:null,privateModeOverride:!1,detectHomescreen:!1};var m=window.navigator.userAgent,f=window.navigator;o(s,{hasToken:"#ath"==document.location.hash||h.test(document.location.href)||d.test(document.location.search),isRetina:window.devicePixelRatio&&window.devicePixelRatio>1,isIDevice:/iphone|ipod|ipad/i.test(m),isMobileChrome:m.indexOf("Android")>-1&&/Chrome\/[.0-9]*/.test(m)&&-1==m.indexOf("Version"),isMobileIE:m.indexOf("Windows Phone")>-1,language:f.language&&f.language.toLowerCase().replace("-","_")||""}),s.language=s.language&&s.language in s.intl?s.language:"en_us",s.isMobileSafari=s.isIDevice&&m.indexOf("Safari")>-1&&m.indexOf("CriOS")<0,s.OS=s.isIDevice?"ios":s.isMobileChrome?"android":s.isMobileIE?"windows":"unsupported",s.OSVersion=m.match(/(OS|Android) (\d+[_\.]\d+)/),s.OSVersion=s.OSVersion&&s.OSVersion[2]?+s.OSVersion[2].replace("_","."):0,s.isStandalone="standalone"in window.navigator&&window.navigator.standalone,s.isTablet=s.isMobileSafari&&m.indexOf("iPad")>-1||s.isMobileChrome&&m.indexOf("Mobile")<0,s.isCompatible=s.isMobileSafari&&s.OSVersion>=6||s.isMobileChrome;var v={lastDisplayTime:0,returningVisitor:!1,displayCount:0,optedout:!1,added:!1};s.removeSession=function(t){try{if(!localStorage)throw new Error("localStorage is not defined");localStorage.removeItem(t||s.defaults.appID)}catch(e){}},s.doLog=function(t){this.options.logging&&console.log(t)},s.Class=function(t){if(this.doLog=s.doLog,this.options=o({},s.defaults),o(this.options,t),t.debug&&"undefined"==typeof t.logging&&(this.options.logging=!0),l){if(this.options.mandatory=this.options.mandatory&&("standalone"in window.navigator||this.options.debug),this.options.modal=this.options.modal||this.options.mandatory,this.options.mandatory&&(this.options.startDelay=-.5),this.options.detectHomescreen=this.options.detectHomescreen===!0?"hash":this.options.detectHomescreen,this.options.debug&&(s.isCompatible=!0,s.OS="string"==typeof this.options.debug?this.options.debug:"unsupported"==s.OS?"android":s.OS,s.OSVersion="ios"==s.OS?"8":"4"),this.container=document.documentElement,this.session=this.getItem(this.options.appID),this.session=this.session?JSON.parse(this.session):void 0,!s.hasToken||s.isCompatible&&this.session||(s.hasToken=!1,a()),!s.isCompatible)return void this.doLog("Add to homescreen: not displaying callout because device not supported");this.session=this.session||v;try{if(!localStorage)throw new Error("localStorage is not defined");localStorage.setItem(this.options.appID,JSON.stringify(this.session)),s.hasLocalStorage=!0}catch(e){s.hasLocalStorage=!1,this.options.onPrivate&&this.options.onPrivate.call(this)}for(var i=!this.options.validLocation.length,n=this.options.validLocation.length;n--;)if(this.options.validLocation[n].test(document.location.href)){i=!0;break}if(this.getItem("addToHome")&&this.optOut(),this.session.optedout)return void this.doLog("Add to homescreen: not displaying callout because user opted out");if(this.session.added)return void this.doLog("Add to homescreen: not displaying callout because already added to the homescreen");if(!i)return void this.doLog("Add to homescreen: not displaying callout because not a valid location");if(s.isStandalone)return this.session.added||(this.session.added=!0,this.updateSession(),this.options.onAdd&&s.hasLocalStorage&&this.options.onAdd.call(this)),void this.doLog("Add to homescreen: not displaying callout because in standalone mode");if(this.options.detectHomescreen){if(s.hasToken)return a(),this.session.added||(this.session.added=!0,this.updateSession(),this.options.onAdd&&s.hasLocalStorage&&this.options.onAdd.call(this)),void this.doLog("Add to homescreen: not displaying callout because URL has token, so we are likely coming from homescreen");"hash"==this.options.detectHomescreen?history.replaceState("",window.document.title,document.location.href+"#ath"):"smartURL"==this.options.detectHomescreen?history.replaceState("",window.document.title,document.location.href.replace(/(\/)?$/,"/ath$1")):history.replaceState("",window.document.title,document.location.href+(document.location.search?"&":"?")+"ath=")}if(!this.session.returningVisitor&&(this.session.returningVisitor=!0,this.updateSession(),this.options.skipFirstVisit))return void this.doLog("Add to homescreen: not displaying callout because skipping first visit");if(!this.options.privateModeOverride&&!s.hasLocalStorage)return void this.doLog("Add to homescreen: not displaying callout because browser is in private mode");this.ready=!0,this.options.onInit&&this.options.onInit.call(this),this.options.autostart&&(this.doLog("Add to homescreen: autostart displaying callout"),this.show())}},s.Class.prototype={events:{load:"_delayedShow",error:"_delayedShow",orientationchange:"resize",resize:"resize",scroll:"resize",click:"remove",touchmove:"_preventDefault",transitionend:"_removeElements",webkitTransitionEnd:"_removeElements",MSTransitionEnd:"_removeElements"},handleEvent:function(t){var e=this.events[t.type];e&&this[e](t)},show:function(t){if(this.options.autostart&&!c)return void setTimeout(this.show.bind(this),50);if(this.shown)return void this.doLog("Add to homescreen: not displaying callout because already shown on screen");var e=Date.now(),i=this.session.lastDisplayTime;if(t!==!0){if(!this.ready)return void this.doLog("Add to homescreen: not displaying callout because not ready");if(e-i<6e4*this.options.displayPace)return void this.doLog("Add to homescreen: not displaying callout because displayed recently");if(this.options.maxDisplayCount&&this.session.displayCount>=this.options.maxDisplayCount)return void this.doLog("Add to homescreen: not displaying callout because displayed too many times already")}this.shown=!0,this.session.lastDisplayTime=e,this.session.displayCount++,this.updateSession(),this.applicationIcon||(this.applicationIcon=document.querySelector("ios"==s.OS?'head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]':'head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]'));var n="";"object"==typeof this.options.message&&s.language in this.options.message?n=this.options.message[s.language][s.OS]:"object"==typeof this.options.message&&s.OS in this.options.message?n=this.options.message[s.OS]:this.options.message in s.intl?n=s.intl[this.options.message][s.OS]:""!==this.options.message?n=this.options.message:s.OS in s.intl[s.language]&&(n=s.intl[s.language][s.OS]),n="<p>"+n.replace("%icon",'<span class="ath-action-icon">icon</span>')+"</p>",this.viewport=document.createElement("div"),this.viewport.className="ath-viewport",this.options.modal&&(this.viewport.className+=" ath-modal"),this.options.mandatory&&(this.viewport.className+=" ath-mandatory"),this.viewport.style.position="absolute",this.element=document.createElement("div"),this.element.className="ath-container ath-"+s.OS+" ath-"+s.OS+(s.OSVersion+"").substr(0,1)+" ath-"+(s.isTablet?"tablet":"phone"),this.element.style.cssText="-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0s;-webkit-transition-timing-function:ease-out;transition-property:transform,opacity;transition-duration:0s;transition-timing-function:ease-out;",this.element.style.webkitTransform="translate3d(0,-"+window.innerHeight+"px,0)",this.element.style.transform="translate3d(0,-"+window.innerHeight+"px,0)",this.options.icon&&this.applicationIcon&&(this.element.className+=" ath-icon",this.img=document.createElement("img"),this.img.className="ath-application-icon",this.img.addEventListener("load",this,!1),this.img.addEventListener("error",this,!1),this.img.src=this.applicationIcon.href,this.element.appendChild(this.img)),this.element.innerHTML+=n,this.viewport.style.left="-99999em",this.viewport.appendChild(this.element),this.container.appendChild(this.viewport),this.img?this.doLog("Add to homescreen: not displaying callout because waiting for img to load"):this._delayedShow()},_delayedShow:function(t){setTimeout(this._show.bind(this),1e3*this.options.startDelay+500)},_show:function(){var t=this;this.updateViewport(),window.addEventListener("resize",this,!1),window.addEventListener("scroll",this,!1),window.addEventListener("orientationchange",this,!1),this.options.modal&&document.addEventListener("touchmove",this,!0),this.options.mandatory||setTimeout(function(){t.element.addEventListener("click",t,!0)},1e3),setTimeout(function(){t.element.style.webkitTransitionDuration="1.2s",t.element.style.transitionDuration="1.2s",t.element.style.webkitTransform="translate3d(0,0,0)",t.element.style.transform="translate3d(0,0,0)"},0),this.options.lifespan&&(this.removeTimer=setTimeout(this.remove.bind(this),1e3*this.options.lifespan)),this.options.onShow&&this.options.onShow.call(this)},remove:function(){clearTimeout(this.removeTimer),this.img&&(this.img.removeEventListener("load",this,!1),this.img.removeEventListener("error",this,!1)),window.removeEventListener("resize",this,!1),window.removeEventListener("scroll",this,!1),window.removeEventListener("orientationchange",this,!1),document.removeEventListener("touchmove",this,!0),this.element.removeEventListener("click",this,!0),this.element.addEventListener("transitionend",this,!1),this.element.addEventListener("webkitTransitionEnd",this,!1),this.element.addEventListener("MSTransitionEnd",this,!1),this.element.style.webkitTransitionDuration="0.3s",this.element.style.opacity="0"},_removeElements:function(){this.element.removeEventListener("transitionend",this,!1),this.element.removeEventListener("webkitTransitionEnd",this,!1),this.element.removeEventListener("MSTransitionEnd",this,!1),this.container.removeChild(this.viewport),this.shown=!1,this.options.onRemove&&this.options.onRemove.call(this)},updateViewport:function(){if(this.shown){this.viewport.style.width=window.innerWidth+"px",this.viewport.style.height=window.innerHeight+"px",this.viewport.style.left=window.scrollX+"px",this.viewport.style.top=window.scrollY+"px";var t=document.documentElement.clientWidth;this.orientation=t>document.documentElement.clientHeight?"landscape":"portrait";var e="ios"==s.OS?"portrait"==this.orientation?screen.width:screen.height:screen.width;this.scale=screen.width>t?1:e/window.innerWidth,this.element.style.fontSize=this.options.fontSize/this.scale+"px"}},resize:function(){clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(this.updateViewport.bind(this),100)},updateSession:function(){s.hasLocalStorage!==!1&&localStorage&&localStorage.setItem(this.options.appID,JSON.stringify(this.session))},clearSession:function(){this.session=v,this.updateSession()},getItem:function(t){try{if(!localStorage)throw new Error("localStorage is not defined");return localStorage.getItem(t)}catch(e){s.hasLocalStorage=!1}},optOut:function(){this.session.optedout=!0,this.updateSession()},optIn:function(){this.session.optedout=!1,this.updateSession()},clearDisplayCount:function(){this.session.displayCount=0,this.updateSession()},_preventDefault:function(t){t.preventDefault(),t.stopPropagation()}},s.VERSION="3.2.2",e.exports=r.addToHomescreen=s},{2:2}],4:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){var i=this;this.options=n.extend({},o.DEFAULTS,e),this.$element=n(t),this.$element.addClass("am-fade am-in").on("click.alert.amui",".am-close",function(){i.close()})};o.DEFAULTS={removeElement:!0},o.prototype.close=function(){function t(){e.trigger("closed.alert.amui").remove()}var e=this.$element;e.trigger("close.alert.amui").removeClass("am-in"),s.support.transition&&e.hasClass("am-fade")?e.one(s.support.transition.end,t).emulateTransitionEnd(200):t()},s.plugin("alert",o),n(document).on("click.alert.amui.data-api","[data-am-alert]",function(t){var e=n(t.target);e.is(".am-close")&&n(this).alert("close")}),e.exports=o},{2:2}],5:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){this.$element=n(t),this.options=n.extend({},o.DEFAULTS,e),this.isLoading=!1,this.hasSpinner=!1};o.DEFAULTS={loadingText:"loading...",disabledClassName:"am-disabled",spinner:void 0},o.prototype.setState=function(t,e){var i=this.$element,o="disabled",a=i.data(),r=this.options,l=i.is("input")?"val":"html",c="am-btn-"+t+" "+r.disabledClassName;t+="Text",r.resetText||(r.resetText=i[l]()),s.support.animation&&r.spinner&&"html"===l&&!this.hasSpinner&&(r.loadingText='<span class="am-icon-'+r.spinner+' am-icon-spin"></span>'+r.loadingText,this.hasSpinner=!0),e=e||(void 0===a[t]?r[t]:a[t]),i[l](e),setTimeout(n.proxy(function(){"loadingText"===t?(i.addClass(c).attr(o,o),this.isLoading=!0):this.isLoading&&(i.removeClass(c).removeAttr(o),this.isLoading=!1)},this),0)},o.prototype.toggle=function(){var t=!0,e=this.$element,i=this.$element.parent('[class*="am-btn-group"]');if(i.length){var n=this.$element.find("input");"radio"==n.prop("type")&&(n.prop("checked")&&e.hasClass("am-active")?t=!1:i.find(".am-active").removeClass("am-active")),t&&n.prop("checked",!e.hasClass("am-active")).trigger("change")}t&&(e.toggleClass("am-active"),e.hasClass("am-active")||e.blur())},s.plugin("button",o,{dataOptions:"data-am-loading",methodCall:function(t,e){"toggle"===t[0]?e.toggle():"string"==typeof t[0]&&e.setState.apply(e,t)}}),n(document).on("click.button.amui.data-api","[data-am-button]",function(t){t.preventDefault();var e=n(t.target);e.hasClass("am-btn")||(e=e.closest(".am-btn")),e.button("toggle")}),s.ready(function(t){n("[data-am-loading]",t).button()}),e.exports=s.button=o},{2:2}],6:[function(t,e,i){"use strict";function n(t){return this.each(function(){var e=s(this),i=e.data("amui.collapse"),n=s.extend({},a.DEFAULTS,o.utils.options(e.attr("data-am-collapse")),"object"==typeof t&&t);!i&&n.toggle&&"open"===t&&(t=!t),i||e.data("amui.collapse",i=new a(this,n)),"string"==typeof t&&i[t]()})}var s=window.jQuery,o=t(2),a=function(t,e){this.$element=s(t),this.options=s.extend({},a.DEFAULTS,e),this.transitioning=null,this.options.parent&&(this.$parent=s(this.options.parent)),this.options.toggle&&this.toggle()};a.DEFAULTS={toggle:!0},a.prototype.open=function(){if(!this.transitioning&&!this.$element.hasClass("am-in")){var t=s.Event("open.collapse.amui");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=this.$parent&&this.$parent.find("> .am-panel > .am-in");if(e&&e.length){var i=e.data("amui.collapse");if(i&&i.transitioning)return;n.call(e,"close"),i||e.data("amui.collapse",null)}this.$element.removeClass("am-collapse").addClass("am-collapsing").height(0),this.transitioning=1;var a=function(){this.$element.removeClass("am-collapsing").addClass("am-collapse am-in").height("").trigger("opened.collapse.amui"),this.transitioning=0};if(!o.support.transition)return a.call(this);var r=this.$element[0].scrollHeight;this.$element.one(o.support.transition.end,s.proxy(a,this)).emulateTransitionEnd(300).css({height:r})}}},a.prototype.close=function(){if(!this.transitioning&&this.$element.hasClass("am-in")){var t=s.Event("close.collapse.amui");if(this.$element.trigger(t),!t.isDefaultPrevented()){this.$element.height(this.$element.height()).redraw(),this.$element.addClass("am-collapsing").removeClass("am-collapse am-in"),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.trigger("closed.collapse.amui").removeClass("am-collapsing").addClass("am-collapse")};return o.support.transition?void this.$element.height(0).one(o.support.transition.end,s.proxy(e,this)).emulateTransitionEnd(300):e.call(this)}}},a.prototype.toggle=function(){this[this.$element.hasClass("am-in")?"close":"open"]()},s.fn.collapse=n,s(document).on("click.collapse.amui.data-api","[data-am-collapse]",function(t){var e,i=s(this),a=o.utils.options(i.attr("data-am-collapse")),r=a.target||t.preventDefault()||(e=i.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,""),l=s(r),c=l.data("amui.collapse"),u=c?"toggle":a,h=a.parent,d=h&&s(h);c&&c.transitioning||(d&&d.find("[data-am-collapse]").not(i).addClass("am-collapsed"),i[l.hasClass("am-in")?"addClass":"removeClass"]("am-collapsed")),n.call(l,u)}),e.exports=o.collapse=a},{2:2}],7:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=n(document),a=function(t,e){if(this.$element=n(t),this.options=n.extend({},a.DEFAULTS,e),this.format=r.parseFormat(this.options.format),this.$element.data("date",this.options.date),this.language=this.getLocale(this.options.locale),this.theme=this.options.theme,this.$picker=n(r.template).appendTo("body").on({click:n.proxy(this.click,this)}),this.isInput=this.$element.is("input"),this.component=this.$element.is(".am-datepicker-date")?this.$element.find(".am-datepicker-add-on"):!1,this.isInput?this.$element.on({"click.datepicker.amui":n.proxy(this.open,this),"keyup.datepicker.amui":n.proxy(this.update,this)}):this.component?this.component.on("click.datepicker.amui",n.proxy(this.open,this)):this.$element.on("click.datepicker.amui",n.proxy(this.open,this)),this.minViewMode=this.options.minViewMode,"string"==typeof this.minViewMode)switch(this.minViewMode){case"months":this.minViewMode=1;break;case"years":this.minViewMode=2;break;default:this.minViewMode=0}if(this.viewMode=this.options.viewMode,"string"==typeof this.viewMode)switch(this.viewMode){case"months":this.viewMode=1;break;case"years":this.viewMode=2;break;default:this.viewMode=0}this.startViewMode=this.viewMode,this.weekStart=(this.options.weekStart||a.locales[this.language].weekStart||0)%7,this.weekEnd=(this.weekStart+6)%7,this.onRender=this.options.onRender,this.setTheme(),this.fillDow(),this.fillMonths(),this.update(),this.showMode()};a.DEFAULTS={locale:"zh_CN",format:"yyyy-mm-dd",weekStart:void 0,viewMode:0,minViewMode:0,date:"",theme:"",autoClose:1,onRender:function(t){return""}},a.prototype.open=function(t){this.$picker.show(),this.height=this.component?this.component.outerHeight():this.$element.outerHeight(),this.place(),n(window).on("resize.datepicker.amui",n.proxy(this.place,this)),t&&(t.stopPropagation(),t.preventDefault());var e=this;o.on("mousedown.datapicker.amui touchstart.datepicker.amui",function(t){0===n(t.target).closest(".am-datepicker").length&&e.close()}),this.$element.trigger({type:"open.datepicker.amui",date:this.date})},a.prototype.close=function(){this.$picker.hide(),n(window).off("resize.datepicker.amui",this.place),this.viewMode=this.startViewMode,this.showMode(),this.isInput||n(document).off("mousedown.datapicker.amui touchstart.datepicker.amui",this.close),this.$element.trigger({type:"close.datepicker.amui",date:this.date})},a.prototype.set=function(){var t=r.formatDate(this.date,this.format);this.isInput?this.$element.prop("value",t):(this.component&&this.$element.find("input").prop("value",t),this.$element.data("date",t))},a.prototype.setValue=function(t){this.date="string"==typeof t?r.parseDate(t,this.format):new Date(t),this.set(),this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0),this.fill()},a.prototype.place=function(){var t=this.component?this.component.offset():this.$element.offset(),e=this.component?this.component.width():this.$element.width(),i=t.top+this.height,n=t.left,s=o.width()-t.left-e,a=this.isOutView();if(this.$picker.removeClass("am-datepicker-right"),this.$picker.removeClass("am-datepicker-up"),o.width()>640){if(a.outRight)return this.$picker.addClass("am-datepicker-right"),void this.$picker.css({top:i,left:"auto",right:s});a.outBottom&&(this.$picker.addClass("am-datepicker-up"),i=t.top-this.$picker.outerHeight(!0))}else n=0;this.$picker.css({top:i,left:n})},a.prototype.update=function(t){this.date=r.parseDate("string"==typeof t?t:this.isInput?this.$element.prop("value"):this.$element.data("date"),this.format),this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0),this.fill()},a.prototype.fillDow=function(){for(var t=this.weekStart,e="<tr>";t<this.weekStart+7;)e+='<th class="am-datepicker-dow">'+a.locales[this.language].daysMin[t++%7]+"</th>";e+="</tr>",this.$picker.find(".am-datepicker-days thead").append(e)},a.prototype.fillMonths=function(){for(var t="",e=0;12>e;)t+='<span class="am-datepicker-month">'+a.locales[this.language].monthsShort[e++]+"</span>";this.$picker.find(".am-datepicker-months td").append(t)},a.prototype.fill=function(){var t=new Date(this.viewDate),e=t.getFullYear(),i=t.getMonth(),n=this.date.valueOf(),s=new Date(e,i-1,28,0,0,0,0),o=r.getDaysInMonth(s.getFullYear(),s.getMonth()),l=this.$picker.find(".am-datepicker-days .am-datepicker-select");l.text("zh_CN"===this.language?e+a.locales[this.language].year[0]+" "+a.locales[this.language].months[i]:a.locales[this.language].months[i]+" "+e),
	s.setDate(o),s.setDate(o-(s.getDay()-this.weekStart+7)%7);var c=new Date(s);c.setDate(c.getDate()+42),c=c.valueOf();for(var u,h,d,p=[];s.valueOf()<c;)s.getDay()===this.weekStart&&p.push("<tr>"),u=this.onRender(s),h=s.getFullYear(),d=s.getMonth(),i>d&&h===e||e>h?u+=" am-datepicker-old":(d>i&&h===e||h>e)&&(u+=" am-datepicker-new"),s.valueOf()===n&&(u+=" am-active"),p.push('<td class="am-datepicker-day '+u+'">'+s.getDate()+"</td>"),s.getDay()===this.weekEnd&&p.push("</tr>"),s.setDate(s.getDate()+1);this.$picker.find(".am-datepicker-days tbody").empty().append(p.join(""));var m=this.date.getFullYear(),f=this.$picker.find(".am-datepicker-months").find(".am-datepicker-select").text(e);f=f.end().find("span").removeClass("am-active").removeClass("am-disabled");for(var v=0;12>v;)this.onRender(t.setFullYear(e,v))&&f.eq(v).addClass("am-disabled"),v++;m===e&&f.eq(this.date.getMonth()).removeClass("am-disabled").addClass("am-active"),p="",e=10*parseInt(e/10,10);var g,w=this.$picker.find(".am-datepicker-years").find(".am-datepicker-select").text(e+"-"+(e+9)).end().find("td");e-=1;for(var y=-1;11>y;y++)g=this.onRender(t.setFullYear(e)),p+='<span class="'+g+(-1===y||10===y?" am-datepicker-old":"")+(m===e?" am-active":"")+'">'+e+"</span>",e+=1;w.html(p)},a.prototype.click=function(t){t.stopPropagation(),t.preventDefault();var e,i,s=this.$picker.find(".am-datepicker-days").find(".am-active"),o=this.$picker.find(".am-datepicker-months"),a=o.find(".am-active").index(),l=n(t.target).closest("span, td, th");if(1===l.length)switch(l[0].nodeName.toLowerCase()){case"th":switch(l[0].className){case"am-datepicker-switch":this.showMode(1);break;case"am-datepicker-prev":case"am-datepicker-next":this.viewDate["set"+r.modes[this.viewMode].navFnc].call(this.viewDate,this.viewDate["get"+r.modes[this.viewMode].navFnc].call(this.viewDate)+r.modes[this.viewMode].navStep*("am-datepicker-prev"===l[0].className?-1:1)),this.fill(),this.set()}break;case"span":if(l.is(".am-disabled"))return;l.is(".am-datepicker-month")?(e=l.parent().find("span").index(l),l.is(".am-active")?this.viewDate.setMonth(e,s.text()):this.viewDate.setMonth(e)):(i=parseInt(l.text(),10)||0,l.is(".am-active")?this.viewDate.setFullYear(i,a,s.text()):this.viewDate.setFullYear(i)),0!==this.viewMode&&(this.date=new Date(this.viewDate),this.$element.trigger({type:"changeDate.datepicker.amui",date:this.date,viewMode:r.modes[this.viewMode].clsName})),this.showMode(-1),this.fill(),this.set();break;case"td":if(l.is(".am-datepicker-day")&&!l.is(".am-disabled")){var c=parseInt(l.text(),10)||1;e=this.viewDate.getMonth(),l.is(".am-datepicker-old")?e-=1:l.is(".am-datepicker-new")&&(e+=1),i=this.viewDate.getFullYear(),this.date=new Date(i,e,c,0,0,0,0),this.viewDate=new Date(i,e,Math.min(28,c),0,0,0,0),this.fill(),this.set(),this.$element.trigger({type:"changeDate.datepicker.amui",date:this.date,viewMode:r.modes[this.viewMode].clsName}),this.options.autoClose&&this.close()}}},a.prototype.mousedown=function(t){t.stopPropagation(),t.preventDefault()},a.prototype.showMode=function(t){t&&(this.viewMode=Math.max(this.minViewMode,Math.min(2,this.viewMode+t))),this.$picker.find(">div").hide().filter(".am-datepicker-"+r.modes[this.viewMode].clsName).show()},a.prototype.isOutView=function(){var t=this.component?this.component.offset():this.$element.offset(),e={outRight:!1,outBottom:!1},i=this.$picker,n=t.left+i.outerWidth(!0),s=t.top+i.outerHeight(!0)+this.$element.innerHeight();return n>o.width()&&(e.outRight=!0),s>o.height()&&(e.outBottom=!0),e},a.prototype.getLocale=function(t){return t||(t=navigator.language&&navigator.language.split("-"),t[1]=t[1].toUpperCase(),t=t.join("_")),a.locales[t]||(t="en_US"),t},a.prototype.setTheme=function(){this.theme&&this.$picker.addClass("am-datepicker-"+this.theme)},a.locales={en_US:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],weekStart:0},zh_CN:{days:["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],daysShort:["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],daysMin:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],months:["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],monthsShort:["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],weekStart:1,year:["\u5e74"]}};var r={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(t){return t%4===0&&t%100!==0||t%400===0},getDaysInMonth:function(t,e){return[31,r.isLeapYear(t)?29:28,31,30,31,30,31,31,30,31,30,31][e]},parseFormat:function(t){var e=t.match(/[.\/\-\s].*?/),i=t.split(/\W+/);if(!e||!i||0===i.length)throw new Error("Invalid date format.");return{separator:e,parts:i}},parseDate:function(t,e){var i,n=t.split(e.separator);if(t=new Date,t.setHours(0),t.setMinutes(0),t.setSeconds(0),t.setMilliseconds(0),n.length===e.parts.length){for(var s=t.getFullYear(),o=t.getDate(),a=t.getMonth(),r=0,l=e.parts.length;l>r;r++)switch(i=parseInt(n[r],10)||1,e.parts[r]){case"dd":case"d":o=i,t.setDate(i);break;case"mm":case"m":a=i-1,t.setMonth(i-1);break;case"yy":s=2e3+i,t.setFullYear(2e3+i);break;case"yyyy":s=i,t.setFullYear(i)}t=new Date(s,a,o,0,0,0)}return t},formatDate:function(t,e){var i={d:t.getDate(),m:t.getMonth()+1,yy:t.getFullYear().toString().substring(2),yyyy:t.getFullYear()},n=[];i.dd=(i.d<10?"0":"")+i.d,i.mm=(i.m<10?"0":"")+i.m;for(var s=0,o=e.parts.length;o>s;s++)n.push(i[e.parts[s]]);return n.join(e.separator)},headTemplate:'<thead><tr class="am-datepicker-header"><th class="am-datepicker-prev"><i class="am-datepicker-prev-icon"></i></th><th colspan="5" class="am-datepicker-switch"><div class="am-datepicker-select"></div></th><th class="am-datepicker-next"><i class="am-datepicker-next-icon"></i></th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>'};r.template='<div class="am-datepicker am-datepicker-dropdown"><div class="am-datepicker-caret"></div><div class="am-datepicker-days"><table class="am-datepicker-table">'+r.headTemplate+'<tbody></tbody></table></div><div class="am-datepicker-months"><table class="am-datepicker-table">'+r.headTemplate+r.contTemplate+'</table></div><div class="am-datepicker-years"><table class="am-datepicker-table">'+r.headTemplate+r.contTemplate+"</table></div></div>",s.plugin("datepicker",a),s.ready(function(t){n("[data-am-datepicker]").datepicker()}),e.exports=s.datepicker=a},{2:2}],8:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=n(document),a=s.support.transition,r=function(){this.id=s.utils.generateGUID("am-dimmer"),this.$element=n(r.DEFAULTS.tpl,{id:this.id}),this.inited=!1,this.scrollbarWidth=0,this.$used=n([])};r.DEFAULTS={tpl:'<div class="am-dimmer" data-am-dimmer></div>'},r.prototype.init=function(){return this.inited||(n(document.body).append(this.$element),this.inited=!0,o.trigger("init.dimmer.amui"),this.$element.on("touchmove.dimmer.amui",function(t){t.preventDefault()})),this},r.prototype.open=function(t){this.inited||this.init();var e=this.$element;return t&&(this.$used=this.$used.add(n(t))),this.checkScrollbar().setScrollbar(),e.show().trigger("open.dimmer.amui"),a&&e.off(a.end),setTimeout(function(){e.addClass("am-active")},0),this},r.prototype.close=function(t,e){function i(){s.hide(),this.resetScrollbar()}if(this.$used=this.$used.not(n(t)),!e&&this.$used.length)return this;var s=this.$element;return s.removeClass("am-active").trigger("close.dimmer.amui"),i.call(this),this},r.prototype.checkScrollbar=function(){return this.scrollbarWidth=s.utils.measureScrollbar(),this},r.prototype.setScrollbar=function(){var t=n(document.body),e=parseInt(t.css("padding-right")||0,10);return this.scrollbarWidth&&t.css("padding-right",e+this.scrollbarWidth),t.addClass("am-dimmer-active"),this},r.prototype.resetScrollbar=function(){return n(document.body).css("padding-right","").removeClass("am-dimmer-active"),this},e.exports=s.dimmer=new r},{2:2}],9:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=s.support.animation,a=function(t,e){this.options=n.extend({},a.DEFAULTS,e),e=this.options,this.$element=n(t),this.$toggle=this.$element.find(e.selector.toggle),this.$dropdown=this.$element.find(e.selector.dropdown),this.$boundary=e.boundary===window?n(window):this.$element.closest(e.boundary),this.$justify=e.justify&&n(e.justify).length&&n(e.justify)||void 0,!this.$boundary.length&&(this.$boundary=n(window)),this.active=this.$element.hasClass("am-active")?!0:!1,this.animating=null,this.events()};a.DEFAULTS={animation:"am-animation-slide-top-fixed",boundary:window,justify:void 0,selector:{dropdown:".am-dropdown-content",toggle:".am-dropdown-toggle"},trigger:"click"},a.prototype.toggle=function(){this.clear(),this.animating||this[this.active?"close":"open"]()},a.prototype.open=function(t){var e=this.$toggle,i=this.$element,s=this.$dropdown;if(!e.is(".am-disabled, :disabled")&&!this.active){i.trigger("open.dropdown.amui").addClass("am-active"),e.trigger("focus"),this.checkDimensions();var a=n.proxy(function(){i.trigger("opened.dropdown.amui"),this.active=!0,this.animating=0},this);o?(this.animating=1,s.addClass(this.options.animation).on(o.end+".open.dropdown.amui",n.proxy(function(){a(),s.removeClass(this.options.animation)},this))):a()}},a.prototype.close=function(){if(this.active){var t="am-dropdown-animation",e=this.$element,i=this.$dropdown;e.trigger("close.dropdown.amui");var s=n.proxy(function(){e.removeClass("am-active").trigger("closed.dropdown.amui"),this.active=!1,this.animating=0,this.$toggle.blur()},this);o?(i.removeClass(this.options.animation),i.addClass(t),this.animating=1,i.one(o.end+".close.dropdown.amui",function(){i.removeClass(t),s()})):s()}},a.prototype.checkDimensions=function(){if(this.$dropdown.length){var t=this.$dropdown,e=t.offset(),i=t.outerWidth(),s=this.$boundary.width(),o=n.isWindow(this.boundary)&&this.$boundary.offset()?this.$boundary.offset().left:0;this.$justify&&t.css({"min-width":this.$justify.css("width")}),i+(e.left-o)>s&&this.$element.addClass("am-dropdown-flip")}},a.prototype.clear=function(){n("[data-am-dropdown]").not(this.$element).each(function(){var t=n(this).data("amui.dropdown");t&&t.close()})},a.prototype.events=function(){var t="dropdown.amui",e=this.$toggle;e.on("click."+t,n.proxy(function(t){t.preventDefault(),this.toggle()},this)),n(document).on("keydown.dropdown.amui",n.proxy(function(t){27===t.keyCode&&this.active&&this.close()},this)).on("click.outer.dropdown.amui",n.proxy(function(t){!this.active||this.$element[0]!==t.target&&this.$element.find(t.target).length||this.close()},this))},s.plugin("dropdown",a),s.ready(function(t){n("[data-am-dropdown]",t).dropdown()}),n(document).on("click.dropdown.amui.data-api",".am-dropdown form",function(t){t.stopPropagation()}),e.exports=s.dropdown=a},{2:2}],10:[function(t,e,i){var n=window.jQuery,s=t(2);n.flexslider=function(t,e){var i=n(t);i.vars=n.extend({},n.flexslider.defaults,e);var s,o=i.vars.namespace,a=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,r=("ontouchstart"in window||a||window.DocumentTouch&&document instanceof DocumentTouch)&&i.vars.touch,l="click touchend MSPointerUp keyup",c="",u="vertical"===i.vars.direction,h=i.vars.reverse,d=i.vars.itemWidth>0,p="fade"===i.vars.animation,m=""!==i.vars.asNavFor,f={},v=!0;n.data(t,"flexslider",i),f={init:function(){i.animating=!1,i.currentSlide=parseInt(i.vars.startAt?i.vars.startAt:0,10),isNaN(i.currentSlide)&&(i.currentSlide=0),i.animatingTo=i.currentSlide,i.atEnd=0===i.currentSlide||i.currentSlide===i.last,i.containerSelector=i.vars.selector.substr(0,i.vars.selector.search(" ")),i.slides=n(i.vars.selector,i),i.container=n(i.containerSelector,i),i.count=i.slides.length,i.syncExists=n(i.vars.sync).length>0,"slide"===i.vars.animation&&(i.vars.animation="swing"),i.prop=u?"top":"marginLeft",i.args={},i.manualPause=!1,i.stopped=!1,i.started=!1,i.startTimeout=null,i.transitions=!i.vars.video&&!p&&i.vars.useCSS&&function(){var t=document.createElement("div"),e=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in e)if(void 0!==t.style[e[n]])return i.pfx=e[n].replace("Perspective","").toLowerCase(),i.prop="-"+i.pfx+"-transform",!0;return!1}(),i.ensureAnimationEnd="",""!==i.vars.controlsContainer&&(i.controlsContainer=n(i.vars.controlsContainer).length>0&&n(i.vars.controlsContainer)),""!==i.vars.manualControls&&(i.manualControls=n(i.vars.manualControls).length>0&&n(i.vars.manualControls)),i.vars.randomize&&(i.slides.sort(function(){return Math.round(Math.random())-.5}),i.container.empty().append(i.slides)),i.doMath(),i.setup("init"),i.vars.controlNav&&f.controlNav.setup(),i.vars.directionNav&&f.directionNav.setup(),i.vars.keyboard&&(1===n(i.containerSelector).length||i.vars.multipleKeyboard)&&n(document).bind("keyup",function(t){var e=t.keyCode;if(!i.animating&&(39===e||37===e)){var n=39===e?i.getTarget("next"):37===e?i.getTarget("prev"):!1;i.flexAnimate(n,i.vars.pauseOnAction)}}),i.vars.mousewheel&&i.bind("mousewheel",function(t,e,n,s){t.preventDefault();var o=i.getTarget(0>e?"next":"prev");i.flexAnimate(o,i.vars.pauseOnAction)}),i.vars.pausePlay&&f.pausePlay.setup(),i.vars.slideshow&&i.vars.pauseInvisible&&f.pauseInvisible.init(),i.vars.slideshow&&(i.vars.pauseOnHover&&i.hover(function(){i.manualPlay||i.manualPause||i.pause()},function(){i.manualPause||i.manualPlay||i.stopped||i.play()}),i.vars.pauseInvisible&&f.pauseInvisible.isHidden()||(i.vars.initDelay>0?i.startTimeout=setTimeout(i.play,i.vars.initDelay):i.play())),m&&f.asNav.setup(),r&&i.vars.touch&&f.touch(),(!p||p&&i.vars.smoothHeight)&&n(window).bind("resize orientationchange focus",f.resize),i.find("img").attr("draggable","false"),setTimeout(function(){i.vars.start(i)},200)},asNav:{setup:function(){i.asNav=!0,i.animatingTo=Math.floor(i.currentSlide/i.move),i.currentItem=i.currentSlide,i.slides.removeClass(o+"active-slide").eq(i.currentItem).addClass(o+"active-slide"),a?(t._slider=i,i.slides.each(function(){var t=this;t._gesture=new MSGesture,t._gesture.target=t,t.addEventListener("MSPointerDown",function(t){t.preventDefault(),t.currentTarget._gesture&&t.currentTarget._gesture.addPointer(t.pointerId)},!1),t.addEventListener("MSGestureTap",function(t){t.preventDefault();var e=n(this),s=e.index();n(i.vars.asNavFor).data("flexslider").animating||e.hasClass("active")||(i.direction=i.currentItem<s?"next":"prev",i.flexAnimate(s,i.vars.pauseOnAction,!1,!0,!0))})})):i.slides.on(l,function(t){t.preventDefault();var e=n(this),s=e.index(),a=e.offset().left-n(i).scrollLeft();0>=a&&e.hasClass(o+"active-slide")?i.flexAnimate(i.getTarget("prev"),!0):n(i.vars.asNavFor).data("flexslider").animating||e.hasClass(o+"active-slide")||(i.direction=i.currentItem<s?"next":"prev",i.flexAnimate(s,i.vars.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){i.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()},setupPaging:function(){var t,e,s="thumbnails"===i.vars.controlNav?"control-thumbs":"control-paging",a=1;if(i.controlNavScaffold=n('<ol class="'+o+"control-nav "+o+s+'"></ol>'),i.pagingCount>1)for(var r=0;r<i.pagingCount;r++){if(e=i.slides.eq(r),t="thumbnails"===i.vars.controlNav?'<img src="'+e.attr("data-thumb")+'"/>':"<a>"+a+"</a>","thumbnails"===i.vars.controlNav&&!0===i.vars.thumbCaptions){var u=e.attr("data-thumbcaption");""!=u&&void 0!=u&&(t+='<span class="'+o+'caption">'+u+"</span>")}i.controlNavScaffold.append("<li>"+t+"<i></i></li>"),a++}i.controlsContainer?n(i.controlsContainer).append(i.controlNavScaffold):i.append(i.controlNavScaffold),f.controlNav.set(),f.controlNav.active(),i.controlNavScaffold.delegate("a, img",l,function(t){if(t.preventDefault(),""===c||c===t.type){var e=n(this),s=i.controlNav.index(e);e.hasClass(o+"active")||(i.direction=s>i.currentSlide?"next":"prev",i.flexAnimate(s,i.vars.pauseOnAction))}""===c&&(c=t.type),f.setToClearWatchedEvent()})},setupManual:function(){i.controlNav=i.manualControls,f.controlNav.active(),i.controlNav.bind(l,function(t){if(t.preventDefault(),""===c||c===t.type){var e=n(this),s=i.controlNav.index(e);e.hasClass(o+"active")||(i.direction=s>i.currentSlide?"next":"prev",i.flexAnimate(s,i.vars.pauseOnAction))}""===c&&(c=t.type),f.setToClearWatchedEvent()})},set:function(){var t="thumbnails"===i.vars.controlNav?"img":"a";i.controlNav=n("."+o+"control-nav li "+t,i.controlsContainer?i.controlsContainer:i)},active:function(){i.controlNav.removeClass(o+"active").eq(i.animatingTo).addClass(o+"active")},update:function(t,e){i.pagingCount>1&&"add"===t?i.controlNavScaffold.append(n("<li><a>"+i.count+"</a></li>")):1===i.pagingCount?i.controlNavScaffold.find("li").remove():i.controlNav.eq(e).closest("li").remove(),f.controlNav.set(),i.pagingCount>1&&i.pagingCount!==i.controlNav.length?i.update(e,t):f.controlNav.active()}},directionNav:{setup:function(){var t=n('<ul class="'+o+'direction-nav"><li class="'+o+'nav-prev"><a class="'+o+'prev" href="#">'+i.vars.prevText+'</a></li><li class="'+o+'nav-next"><a class="'+o+'next" href="#">'+i.vars.nextText+"</a></li></ul>");i.controlsContainer?(n(i.controlsContainer).append(t),i.directionNav=n("."+o+"direction-nav li a",i.controlsContainer)):(i.append(t),i.directionNav=n("."+o+"direction-nav li a",i)),f.directionNav.update(),i.directionNav.bind(l,function(t){t.preventDefault();var e;(""===c||c===t.type)&&(e=i.getTarget(n(this).hasClass(o+"next")?"next":"prev"),i.flexAnimate(e,i.vars.pauseOnAction)),""===c&&(c=t.type),f.setToClearWatchedEvent()})},update:function(){var t=o+"disabled";1===i.pagingCount?i.directionNav.addClass(t).attr("tabindex","-1"):i.vars.animationLoop?i.directionNav.removeClass(t).removeAttr("tabindex"):0===i.animatingTo?i.directionNav.removeClass(t).filter("."+o+"prev").addClass(t).attr("tabindex","-1"):i.animatingTo===i.last?i.directionNav.removeClass(t).filter("."+o+"next").addClass(t).attr("tabindex","-1"):i.directionNav.removeClass(t).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=n('<div class="'+o+'pauseplay"><a></a></div>');i.controlsContainer?(i.controlsContainer.append(t),i.pausePlay=n("."+o+"pauseplay a",i.controlsContainer)):(i.append(t),i.pausePlay=n("."+o+"pauseplay a",i)),f.pausePlay.update(i.vars.slideshow?o+"pause":o+"play"),i.pausePlay.bind(l,function(t){t.preventDefault(),(""===c||c===t.type)&&(n(this).hasClass(o+"pause")?(i.manualPause=!0,i.manualPlay=!1,i.pause()):(i.manualPause=!1,i.manualPlay=!0,i.play())),""===c&&(c=t.type),f.setToClearWatchedEvent()})},update:function(t){"play"===t?i.pausePlay.removeClass(o+"pause").addClass(o+"play").html(i.vars.playText):i.pausePlay.removeClass(o+"play").addClass(o+"pause").html(i.vars.pauseText)}},touch:function(){function e(e){i.animating?e.preventDefault():(window.navigator.msPointerEnabled||1===e.touches.length)&&(i.pause(),v=u?i.h:i.w,w=Number(new Date),b=e.touches[0].pageX,T=e.touches[0].pageY,f=d&&h&&i.animatingTo===i.last?0:d&&h?i.limit-(i.itemW+i.vars.itemMargin)*i.move*i.animatingTo:d&&i.currentSlide===i.last?i.limit:d?(i.itemW+i.vars.itemMargin)*i.move*i.currentSlide:h?(i.last-i.currentSlide+i.cloneOffset)*v:(i.currentSlide+i.cloneOffset)*v,c=u?T:b,m=u?b:T,t.addEventListener("touchmove",n,!1),t.addEventListener("touchend",s,!1))}function n(t){b=t.touches[0].pageX,T=t.touches[0].pageY,g=u?c-T:c-b,y=u?Math.abs(g)<Math.abs(b-m):Math.abs(g)<Math.abs(T-m);var e=500;(!y||Number(new Date)-w>e)&&(t.preventDefault(),!p&&i.transitions&&(i.vars.animationLoop||(g/=0===i.currentSlide&&0>g||i.currentSlide===i.last&&g>0?Math.abs(g)/v+2:1),i.setProps(f+g,"setTouch")))}function s(e){if(t.removeEventListener("touchmove",n,!1),i.animatingTo===i.currentSlide&&!y&&null!==g){var o=h?-g:g,a=i.getTarget(o>0?"next":"prev");i.canAdvance(a)&&(Number(new Date)-w<550&&Math.abs(o)>50||Math.abs(o)>v/2)?i.flexAnimate(a,i.vars.pauseOnAction):p||i.flexAnimate(i.currentSlide,i.vars.pauseOnAction,!0)}t.removeEventListener("touchend",s,!1),c=null,m=null,g=null,f=null}function o(e){e.stopPropagation(),i.animating?e.preventDefault():(i.pause(),t._gesture.addPointer(e.pointerId),x=0,v=u?i.h:i.w,w=Number(new Date),f=d&&h&&i.animatingTo===i.last?0:d&&h?i.limit-(i.itemW+i.vars.itemMargin)*i.move*i.animatingTo:d&&i.currentSlide===i.last?i.limit:d?(i.itemW+i.vars.itemMargin)*i.move*i.currentSlide:h?(i.last-i.currentSlide+i.cloneOffset)*v:(i.currentSlide+i.cloneOffset)*v)}function r(e){e.stopPropagation();var i=e.target._slider;if(i){var n=-e.translationX,s=-e.translationY;return x+=u?s:n,g=x,y=u?Math.abs(x)<Math.abs(-n):Math.abs(x)<Math.abs(-s),e.detail===e.MSGESTURE_FLAG_INERTIA?void setImmediate(function(){t._gesture.stop()}):void((!y||Number(new Date)-w>500)&&(e.preventDefault(),!p&&i.transitions&&(i.vars.animationLoop||(g=x/(0===i.currentSlide&&0>x||i.currentSlide===i.last&&x>0?Math.abs(x)/v+2:1)),i.setProps(f+g,"setTouch"))))}}function l(t){t.stopPropagation();var e=t.target._slider;if(e){if(e.animatingTo===e.currentSlide&&!y&&null!==g){var i=h?-g:g,n=e.getTarget(i>0?"next":"prev");e.canAdvance(n)&&(Number(new Date)-w<550&&Math.abs(i)>50||Math.abs(i)>v/2)?e.flexAnimate(n,e.vars.pauseOnAction):p||e.flexAnimate(e.currentSlide,e.vars.pauseOnAction,!0)}c=null,m=null,g=null,f=null,x=0}}var c,m,f,v,g,w,y=!1,b=0,T=0,x=0;a?(t.style.msTouchAction="none",t._gesture=new MSGesture,t._gesture.target=t,t.addEventListener("MSPointerDown",o,!1),t._slider=i,t.addEventListener("MSGestureChange",r,!1),t.addEventListener("MSGestureEnd",l,!1)):t.addEventListener("touchstart",e,!1)},resize:function(){!i.animating&&i.is(":visible")&&(d||i.doMath(),p?f.smoothHeight():d?(i.slides.width(i.computedW),i.update(i.pagingCount),i.setProps()):u?(i.viewport.height(i.h),i.setProps(i.h,"setTotal")):(i.vars.smoothHeight&&f.smoothHeight(),i.newSlides.width(i.computedW),i.setProps(i.computedW,"setTotal")))},smoothHeight:function(t){if(!u||p){var e=p?i:i.viewport;t?e.animate({height:i.slides.eq(i.animatingTo).height()},t):e.height(i.slides.eq(i.animatingTo).height())}},sync:function(t){var e=n(i.vars.sync).data("flexslider"),s=i.animatingTo;switch(t){case"animate":e.flexAnimate(s,i.vars.pauseOnAction,!1,!0);break;case"play":e.playing||e.asNav||e.play();break;case"pause":e.pause()}},uniqueID:function(t){return t.filter("[id]").add(t.find("[id]")).each(function(){var t=n(this);t.attr("id",t.attr("id")+"_clone")}),t},pauseInvisible:{visProp:null,init:function(){var t=f.pauseInvisible.getHiddenProp();if(t){var e=t.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(e,function(){f.pauseInvisible.isHidden()?i.startTimeout?clearTimeout(i.startTimeout):i.pause():i.started?i.play():i.vars.initDelay>0?setTimeout(i.play,i.vars.initDelay):i.play()})}},isHidden:function(){var t=f.pauseInvisible.getHiddenProp();return t?document[t]:!1},getHiddenProp:function(){var t=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var e=0;e<t.length;e++)if(t[e]+"Hidden"in document)return t[e]+"Hidden";return null}},setToClearWatchedEvent:function(){clearTimeout(s),s=setTimeout(function(){c=""},3e3)}},i.flexAnimate=function(t,e,s,a,l){if(i.vars.animationLoop||t===i.currentSlide||(i.direction=t>i.currentSlide?"next":"prev"),m&&1===i.pagingCount&&(i.direction=i.currentItem<t?"next":"prev"),!i.animating&&(i.canAdvance(t,l)||s)&&i.is(":visible")){if(m&&a){var c=n(i.vars.asNavFor).data("flexslider");if(i.atEnd=0===t||t===i.count-1,c.flexAnimate(t,!0,!1,!0,l),i.direction=i.currentItem<t?"next":"prev",c.direction=i.direction,Math.ceil((t+1)/i.visible)-1===i.currentSlide||0===t)return i.currentItem=t,i.slides.removeClass(o+"active-slide").eq(t).addClass(o+"active-slide"),!1;i.currentItem=t,i.slides.removeClass(o+"active-slide").eq(t).addClass(o+"active-slide"),t=Math.floor(t/i.visible)}if(i.animating=!0,i.animatingTo=t,e&&i.pause(),i.vars.before(i),i.syncExists&&!l&&f.sync("animate"),i.vars.controlNav&&f.controlNav.active(),d||i.slides.removeClass(o+"active-slide").eq(t).addClass(o+"active-slide"),i.atEnd=0===t||t===i.last,i.vars.directionNav&&f.directionNav.update(),t===i.last&&(i.vars.end(i),i.vars.animationLoop||i.pause()),p)r?(i.slides.eq(i.currentSlide).css({opacity:0,zIndex:1}),i.slides.eq(t).css({opacity:1,zIndex:2}),i.wrapup(y)):(i.slides.eq(i.currentSlide).css({zIndex:1}).animate({opacity:0},i.vars.animationSpeed,i.vars.easing),i.slides.eq(t).css({zIndex:2}).animate({opacity:1},i.vars.animationSpeed,i.vars.easing,i.wrapup));else{var v,g,w,y=u?i.slides.filter(":first").height():i.computedW;d?(v=i.vars.itemMargin,w=(i.itemW+v)*i.move*i.animatingTo,g=w>i.limit&&1!==i.visible?i.limit:w):g=0===i.currentSlide&&t===i.count-1&&i.vars.animationLoop&&"next"!==i.direction?h?(i.count+i.cloneOffset)*y:0:i.currentSlide===i.last&&0===t&&i.vars.animationLoop&&"prev"!==i.direction?h?0:(i.count+1)*y:h?(i.count-1-t+i.cloneOffset)*y:(t+i.cloneOffset)*y,i.setProps(g,"",i.vars.animationSpeed),i.transitions?(i.vars.animationLoop&&i.atEnd||(i.animating=!1,i.currentSlide=i.animatingTo),i.container.unbind("webkitTransitionEnd transitionend"),i.container.bind("webkitTransitionEnd transitionend",function(){clearTimeout(i.ensureAnimationEnd),i.wrapup(y)}),clearTimeout(i.ensureAnimationEnd),i.ensureAnimationEnd=setTimeout(function(){i.wrapup(y)},i.vars.animationSpeed+100)):i.container.animate(i.args,i.vars.animationSpeed,i.vars.easing,function(){i.wrapup(y)})}i.vars.smoothHeight&&f.smoothHeight(i.vars.animationSpeed)}},i.wrapup=function(t){p||d||(0===i.currentSlide&&i.animatingTo===i.last&&i.vars.animationLoop?i.setProps(t,"jumpEnd"):i.currentSlide===i.last&&0===i.animatingTo&&i.vars.animationLoop&&i.setProps(t,"jumpStart")),i.animating=!1,i.currentSlide=i.animatingTo,i.vars.after(i)},i.animateSlides=function(){!i.animating&&v&&i.flexAnimate(i.getTarget("next"))},i.pause=function(){clearInterval(i.animatedSlides),i.animatedSlides=null,i.playing=!1,i.vars.pausePlay&&f.pausePlay.update("play"),i.syncExists&&f.sync("pause")},i.play=function(){i.playing&&clearInterval(i.animatedSlides),i.animatedSlides=i.animatedSlides||setInterval(i.animateSlides,i.vars.slideshowSpeed),i.started=i.playing=!0,i.vars.pausePlay&&f.pausePlay.update("pause"),i.syncExists&&f.sync("play")},i.stop=function(){i.pause(),i.stopped=!0},i.canAdvance=function(t,e){var n=m?i.pagingCount-1:i.last;return e?!0:m&&i.currentItem===i.count-1&&0===t&&"prev"===i.direction?!0:m&&0===i.currentItem&&t===i.pagingCount-1&&"next"!==i.direction?!1:t!==i.currentSlide||m?i.vars.animationLoop?!0:i.atEnd&&0===i.currentSlide&&t===n&&"next"!==i.direction?!1:i.atEnd&&i.currentSlide===n&&0===t&&"next"===i.direction?!1:!0:!1},i.getTarget=function(t){return i.direction=t,"next"===t?i.currentSlide===i.last?0:i.currentSlide+1:0===i.currentSlide?i.last:i.currentSlide-1},i.setProps=function(t,e,n){var s=function(){var n=t?t:(i.itemW+i.vars.itemMargin)*i.move*i.animatingTo,s=function(){if(d)return"setTouch"===e?t:h&&i.animatingTo===i.last?0:h?i.limit-(i.itemW+i.vars.itemMargin)*i.move*i.animatingTo:i.animatingTo===i.last?i.limit:n;switch(e){case"setTotal":return h?(i.count-1-i.currentSlide+i.cloneOffset)*t:(i.currentSlide+i.cloneOffset)*t;case"setTouch":return h?t:t;case"jumpEnd":return h?t:i.count*t;case"jumpStart":return h?i.count*t:t;default:return t}}();return-1*s+"px"}();i.transitions&&(s=u?"translate3d(0,"+s+",0)":"translate3d("+s+",0,0)",n=void 0!==n?n/1e3+"s":"0s",i.container.css("-"+i.pfx+"-transition-duration",n),i.container.css("transition-duration",n)),i.args[i.prop]=s,(i.transitions||void 0===n)&&i.container.css(i.args),i.container.css("transform",s)},i.setup=function(t){if(p)i.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"}),"init"===t&&(r?i.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+i.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(i.currentSlide).css({opacity:1,zIndex:2}):0==i.vars.fadeFirstSlide?i.slides.css({opacity:0,display:"block",zIndex:1}).eq(i.currentSlide).css({zIndex:2}).css({opacity:1}):i.slides.css({opacity:0,display:"block",zIndex:1}).eq(i.currentSlide).css({zIndex:2}).animate({opacity:1},i.vars.animationSpeed,i.vars.easing)),i.vars.smoothHeight&&f.smoothHeight();else{var e,s;"init"===t&&(i.viewport=n('<div class="'+o+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(i).append(i.container),i.cloneCount=0,i.cloneOffset=0,h&&(s=n.makeArray(i.slides).reverse(),i.slides=n(s),i.container.empty().append(i.slides))),i.vars.animationLoop&&!d&&(i.cloneCount=2,i.cloneOffset=1,"init"!==t&&i.container.find(".clone").remove(),i.container.append(f.uniqueID(i.slides.first().clone().addClass("clone")).attr("aria-hidden","true")).prepend(f.uniqueID(i.slides.last().clone().addClass("clone")).attr("aria-hidden","true"))),i.newSlides=n(i.vars.selector,i),e=h?i.count-1-i.currentSlide+i.cloneOffset:i.currentSlide+i.cloneOffset,u&&!d?(i.container.height(200*(i.count+i.cloneCount)+"%").css("position","absolute").width("100%"),setTimeout(function(){i.newSlides.css({display:"block"}),i.doMath(),i.viewport.height(i.h),i.setProps(e*i.h,"init")},"init"===t?100:0)):(i.container.width(200*(i.count+i.cloneCount)+"%"),i.setProps(e*i.computedW,"init"),setTimeout(function(){i.doMath(),i.newSlides.css({width:i.computedW,"float":"left",display:"block"}),i.vars.smoothHeight&&f.smoothHeight()},"init"===t?100:0))}d||i.slides.removeClass(o+"active-slide").eq(i.currentSlide).addClass(o+"active-slide"),i.vars.init(i)},i.doMath=function(){var t=i.slides.first(),e=i.vars.itemMargin,n=i.vars.minItems,s=i.vars.maxItems;i.w=void 0===i.viewport?i.width():i.viewport.width(),i.h=t.height(),i.boxPadding=t.outerWidth()-t.width(),d?(i.itemT=i.vars.itemWidth+e,i.minW=n?n*i.itemT:i.w,i.maxW=s?s*i.itemT-e:i.w,i.itemW=i.minW>i.w?(i.w-e*(n-1))/n:i.maxW<i.w?(i.w-e*(s-1))/s:i.vars.itemWidth>i.w?i.w:i.vars.itemWidth,i.visible=Math.floor(i.w/i.itemW),i.move=i.vars.move>0&&i.vars.move<i.visible?i.vars.move:i.visible,i.pagingCount=Math.ceil((i.count-i.visible)/i.move+1),i.last=i.pagingCount-1,i.limit=1===i.pagingCount?0:i.vars.itemWidth>i.w?i.itemW*(i.count-1)+e*(i.count-1):(i.itemW+e)*i.count-i.w-e):(i.itemW=i.w,i.pagingCount=i.count,i.last=i.count-1),i.computedW=i.itemW-i.boxPadding},i.update=function(t,e){i.doMath(),d||(t<i.currentSlide?i.currentSlide+=1:t<=i.currentSlide&&0!==t&&(i.currentSlide-=1),i.animatingTo=i.currentSlide),i.vars.controlNav&&!i.manualControls&&("add"===e&&!d||i.pagingCount>i.controlNav.length?f.controlNav.update("add"):("remove"===e&&!d||i.pagingCount<i.controlNav.length)&&(d&&i.currentSlide>i.last&&(i.currentSlide-=1,i.animatingTo-=1),f.controlNav.update("remove",i.last))),i.vars.directionNav&&f.directionNav.update()},i.addSlide=function(t,e){var s=n(t);i.count+=1,i.last=i.count-1,u&&h?void 0!==e?i.slides.eq(i.count-e).after(s):i.container.prepend(s):void 0!==e?i.slides.eq(e).before(s):i.container.append(s),i.update(e,"add"),i.slides=n(i.vars.selector+":not(.clone)",i),i.setup(),i.vars.added(i)},i.removeSlide=function(t){var e=isNaN(t)?i.slides.index(n(t)):t;i.count-=1,i.last=i.count-1,isNaN(t)?n(t,i.slides).remove():u&&h?i.slides.eq(i.last).remove():i.slides.eq(t).remove(),i.doMath(),i.update(e,"remove"),i.slides=n(i.vars.selector+":not(.clone)",i),i.setup(),i.vars.removed(i)},f.init()},n(window).blur(function(t){focused=!1}).focus(function(t){focused=!0}),n.flexslider.defaults={namespace:"am-",selector:".am-slides > li",animation:"slide",easing:"swing",direction:"horizontal",reverse:!1,
	animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:5e3,animationSpeed:600,initDelay:0,randomize:!1,fadeFirstSlide:!0,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:" ",nextText:" ",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){},init:function(){}},n.fn.flexslider=function(t){var e=Array.prototype.slice.call(arguments,1);if(void 0===t&&(t={}),"object"==typeof t)return this.each(function(){var e=n(this),i=t.selector?t.selector:".am-slides > li",s=e.find(i);1===s.length&&t.allowOneSlide===!0||0===s.length?(s.fadeIn(400),t.start&&t.start(e)):void 0===e.data("flexslider")&&new n.flexslider(this,t)});var i,s=n(this).data("flexslider");switch(t){case"next":s.flexAnimate(s.getTarget("next"),!0);break;case"prev":case"previous":s.flexAnimate(s.getTarget("prev"),!0);break;default:"number"==typeof t?s.flexAnimate(t,!0):"string"==typeof t&&(i="function"==typeof s[t]?s[t].apply(s,e):s[t])}return void 0===i?this:i},s.ready(function(t){n("[data-am-flexslider]",t).each(function(t,e){var i=n(e),o=s.utils.parseOptions(i.data("amFlexslider"));o.before=function(t){t._pausedTimer&&(window.clearTimeout(t._pausedTimer),t._pausedTimer=null)},o.after=function(t){var e=t.vars.playAfterPaused;!e||isNaN(e)||t.playing||t.manualPause||t.manualPlay||t.stopped||(t._pausedTimer=window.setTimeout(function(){t.play()},e))},i.flexslider(o)})}),e.exports=n.flexslider},{2:2}],11:[function(t,e,i){"use strict";function n(t,e){this.wrapper="string"==typeof t?document.querySelector(t):t,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:!0,useTransition:!0,useTransform:!0};for(var i in e)this.options[i]=e[i];this.translateZ=this.options.HWCompositing&&a.hasPerspective?" translateZ(0)":"",this.options.useTransition=a.hasTransition&&this.options.useTransition,this.options.useTransform=a.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"==this.options.eventPassthrough?!1:this.options.scrollY,this.options.scrollX="horizontal"==this.options.eventPassthrough?!1:this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?a.ease[this.options.bounceEasing]||a.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),this.x=0,this.y=0,this.directionX=0,this.directionY=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}var s=(window.jQuery,t(2)),o=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)},a=function(){function t(t){return n===!1?!1:""===n?t:n+t.charAt(0).toUpperCase()+t.substr(1)}var e={},i=document.createElement("div").style,n=function(){for(var t,e=["t","webkitT","MozT","msT","OT"],n=0,s=e.length;s>n;n++)if(t=e[n]+"ransform",t in i)return e[n].substr(0,e[n].length-1);return!1}();e.getTime=Date.now||function(){return(new Date).getTime()},e.extend=function(t,e){for(var i in e)t[i]=e[i]},e.addEvent=function(t,e,i,n){t.addEventListener(e,i,!!n)},e.removeEvent=function(t,e,i,n){t.removeEventListener(e,i,!!n)},e.prefixPointerEvent=function(t){return window.MSPointerEvent?"MSPointer"+t.charAt(9).toUpperCase()+t.substr(10):t},e.momentum=function(t,e,i,n,s,o){var a,r,l=t-e,c=Math.abs(l)/i;return o=void 0===o?6e-4:o,a=t+c*c/(2*o)*(0>l?-1:1),r=c/o,n>a?(a=s?n-s/2.5*(c/8):n,l=Math.abs(a-t),r=l/c):a>0&&(a=s?s/2.5*(c/8):0,l=Math.abs(t)+a,r=l/c),{destination:Math.round(a),duration:r}};var s=t("transform");return e.extend(e,{hasTransform:s!==!1,hasPerspective:t("perspective")in i,hasTouch:"ontouchstart"in window,hasPointer:window.PointerEvent||window.MSPointerEvent,hasTransition:t("transition")in i}),e.isBadAndroid=/Android /.test(window.navigator.appVersion)&&!/Chrome\/\d/.test(window.navigator.appVersion),e.extend(e.style={},{transform:s,transitionTimingFunction:t("transitionTimingFunction"),transitionDuration:t("transitionDuration"),transitionDelay:t("transitionDelay"),transformOrigin:t("transformOrigin")}),e.hasClass=function(t,e){var i=new RegExp("(^|\\s)"+e+"(\\s|$)");return i.test(t.className)},e.addClass=function(t,i){if(!e.hasClass(t,i)){var n=t.className.split(" ");n.push(i),t.className=n.join(" ")}},e.removeClass=function(t,i){if(e.hasClass(t,i)){var n=new RegExp("(^|\\s)"+i+"(\\s|$)","g");t.className=t.className.replace(n," ")}},e.offset=function(t){for(var e=-t.offsetLeft,i=-t.offsetTop;t=t.offsetParent;)e-=t.offsetLeft,i-=t.offsetTop;return{left:e,top:i}},e.preventDefaultException=function(t,e){for(var i in e)if(e[i].test(t[i]))return!0;return!1},e.extend(e.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),e.extend(e.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(t){return t*(2-t)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(t){return Math.sqrt(1- --t*t)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(t){var e=4;return(t-=1)*t*((e+1)*t+e)+1}},bounce:{style:"",fn:function(t){return(t/=1)<1/2.75?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},elastic:{style:"",fn:function(t){var e=.22,i=.4;return 0===t?0:1==t?1:i*Math.pow(2,-10*t)*Math.sin(2*(t-e/4)*Math.PI/e)+1}}}),e.tap=function(t,e){var i=document.createEvent("Event");i.initEvent(e,!0,!0),i.pageX=t.pageX,i.pageY=t.pageY,t.target.dispatchEvent(i)},e.click=function(t){var e,i=t.target;/(SELECT|INPUT|TEXTAREA)/i.test(i.tagName)||(e=document.createEvent("MouseEvents"),e.initMouseEvent("click",!0,!0,t.view,1,i.screenX,i.screenY,i.clientX,i.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,0,null),e._constructed=!0,i.dispatchEvent(e))},e}();n.prototype={version:"5.1.3",_init:function(){this._initEvents()},destroy:function(){this._initEvents(!0),this._execEvent("destroy")},_transitionEnd:function(t){t.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(t){if(!(1!=a.eventType[t.type]&&0!==t.button||!this.enabled||this.initiated&&a.eventType[t.type]!==this.initiated)){!this.options.preventDefault||a.isBadAndroid||a.preventDefaultException(t.target,this.options.preventDefaultException)||t.preventDefault();var e,i=t.touches?t.touches[0]:t;this.initiated=a.eventType[t.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this._transitionTime(),this.startTime=a.getTime(),this.options.useTransition&&this.isInTransition?(this.isInTransition=!1,e=this.getComputedPosition(),this._translate(Math.round(e.x),Math.round(e.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=i.pageX,this.pointY=i.pageY,this._execEvent("beforeScrollStart")}},_move:function(t){if(this.enabled&&a.eventType[t.type]===this.initiated){this.options.preventDefault&&t.preventDefault();var e,i,n,s,o=t.touches?t.touches[0]:t,r=o.pageX-this.pointX,l=o.pageY-this.pointY,c=a.getTime();if(this.pointX=o.pageX,this.pointY=o.pageY,this.distX+=r,this.distY+=l,n=Math.abs(this.distX),s=Math.abs(this.distY),!(c-this.endTime>300&&10>n&&10>s)){if(this.directionLocked||this.options.freeScroll||(this.directionLocked=n>s+this.options.directionLockThreshold?"h":s>=n+this.options.directionLockThreshold?"v":"n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)t.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);l=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)t.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);r=0}r=this.hasHorizontalScroll?r:0,l=this.hasVerticalScroll?l:0,e=this.x+r,i=this.y+l,(e>0||e<this.maxScrollX)&&(e=this.options.bounce?this.x+r/3:e>0?0:this.maxScrollX),(i>0||i<this.maxScrollY)&&(i=this.options.bounce?this.y+l/3:i>0?0:this.maxScrollY),this.directionX=r>0?-1:0>r?1:0,this.directionY=l>0?-1:0>l?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(e,i),c-this.startTime>300&&(this.startTime=c,this.startX=this.x,this.startY=this.y)}}},_end:function(t){if(this.enabled&&a.eventType[t.type]===this.initiated){this.options.preventDefault&&!a.preventDefaultException(t.target,this.options.preventDefaultException)&&t.preventDefault();var e,i,n=(t.changedTouches?t.changedTouches[0]:t,a.getTime()-this.startTime),s=Math.round(this.x),o=Math.round(this.y),r=Math.abs(s-this.startX),l=Math.abs(o-this.startY),c=0,u="";if(this.isInTransition=0,this.initiated=0,this.endTime=a.getTime(),!this.resetPosition(this.options.bounceTime))return this.scrollTo(s,o),this.moved?this._events.flick&&200>n&&100>r&&100>l?void this._execEvent("flick"):(this.options.momentum&&300>n&&(e=this.hasHorizontalScroll?a.momentum(this.x,this.startX,n,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:s,duration:0},i=this.hasVerticalScroll?a.momentum(this.y,this.startY,n,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:o,duration:0},s=e.destination,o=i.destination,c=Math.max(e.duration,i.duration),this.isInTransition=1),s!=this.x||o!=this.y?((s>0||s<this.maxScrollX||o>0||o<this.maxScrollY)&&(u=a.ease.quadratic),void this.scrollTo(s,o,c,u)):void this._execEvent("scrollEnd")):(this.options.tap&&a.tap(t,this.options.tap),this.options.click&&a.click(t),void this._execEvent("scrollCancel"))}},_resize:function(){var t=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){t.refresh()},this.options.resizePolling)},resetPosition:function(t){var e=this.x,i=this.y;return t=t||0,!this.hasHorizontalScroll||this.x>0?e=0:this.x<this.maxScrollX&&(e=this.maxScrollX),!this.hasVerticalScroll||this.y>0?i=0:this.y<this.maxScrollY&&(i=this.maxScrollY),e==this.x&&i==this.y?!1:(this.scrollTo(e,i,t,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,this.wrapperOffset=a.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(t,e){this._events[t]||(this._events[t]=[]),this._events[t].push(e)},off:function(t,e){if(this._events[t]){var i=this._events[t].indexOf(e);i>-1&&this._events[t].splice(i,1)}},_execEvent:function(t){if(this._events[t]){var e=0,i=this._events[t].length;if(i)for(;i>e;e++)this._events[t][e].apply(this,[].slice.call(arguments,1))}},scrollBy:function(t,e,i,n){t=this.x+t,e=this.y+e,i=i||0,this.scrollTo(t,e,i,n)},scrollTo:function(t,e,i,n){n=n||a.ease.circular,this.isInTransition=this.options.useTransition&&i>0,!i||this.options.useTransition&&n.style?(this._transitionTimingFunction(n.style),this._transitionTime(i),this._translate(t,e)):this._animate(t,e,i,n.fn)},scrollToElement:function(t,e,i,n,s){if(t=t.nodeType?t:this.scroller.querySelector(t)){var o=a.offset(t);o.left-=this.wrapperOffset.left,o.top-=this.wrapperOffset.top,i===!0&&(i=Math.round(t.offsetWidth/2-this.wrapper.offsetWidth/2)),n===!0&&(n=Math.round(t.offsetHeight/2-this.wrapper.offsetHeight/2)),o.left-=i||0,o.top-=n||0,o.left=o.left>0?0:o.left<this.maxScrollX?this.maxScrollX:o.left,o.top=o.top>0?0:o.top<this.maxScrollY?this.maxScrollY:o.top,e=void 0===e||null===e||"auto"===e?Math.max(Math.abs(this.x-o.left),Math.abs(this.y-o.top)):e,this.scrollTo(o.left,o.top,e,s)}},_transitionTime:function(t){t=t||0,this.scrollerStyle[a.style.transitionDuration]=t+"ms",!t&&a.isBadAndroid&&(this.scrollerStyle[a.style.transitionDuration]="0.001s")},_transitionTimingFunction:function(t){this.scrollerStyle[a.style.transitionTimingFunction]=t},_translate:function(t,e){this.options.useTransform?this.scrollerStyle[a.style.transform]="translate("+t+"px,"+e+"px)"+this.translateZ:(t=Math.round(t),e=Math.round(e),this.scrollerStyle.left=t+"px",this.scrollerStyle.top=e+"px"),this.x=t,this.y=e},_initEvents:function(t){var e=t?a.removeEvent:a.addEvent,i=this.options.bindToWrapper?this.wrapper:window;e(window,"orientationchange",this),e(window,"resize",this),this.options.click&&e(this.wrapper,"click",this,!0),this.options.disableMouse||(e(this.wrapper,"mousedown",this),e(i,"mousemove",this),e(i,"mousecancel",this),e(i,"mouseup",this)),a.hasPointer&&!this.options.disablePointer&&(e(this.wrapper,a.prefixPointerEvent("pointerdown"),this),e(i,a.prefixPointerEvent("pointermove"),this),e(i,a.prefixPointerEvent("pointercancel"),this),e(i,a.prefixPointerEvent("pointerup"),this)),a.hasTouch&&!this.options.disableTouch&&(e(this.wrapper,"touchstart",this),e(i,"touchmove",this),e(i,"touchcancel",this),e(i,"touchend",this)),e(this.scroller,"transitionend",this),e(this.scroller,"webkitTransitionEnd",this),e(this.scroller,"oTransitionEnd",this),e(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var t,e,i=window.getComputedStyle(this.scroller,null);return this.options.useTransform?(i=i[a.style.transform].split(")")[0].split(", "),t=+(i[12]||i[4]),e=+(i[13]||i[5])):(t=+i.left.replace(/[^-\d.]/g,""),e=+i.top.replace(/[^-\d.]/g,"")),{x:t,y:e}},_animate:function(t,e,i,n){function s(){var d,p,m,f=a.getTime();return f>=h?(r.isAnimating=!1,r._translate(t,e),void(r.resetPosition(r.options.bounceTime)||r._execEvent("scrollEnd"))):(f=(f-u)/i,m=n(f),d=(t-l)*m+l,p=(e-c)*m+c,r._translate(d,p),void(r.isAnimating&&o(s)))}var r=this,l=this.x,c=this.y,u=a.getTime(),h=u+i;this.isAnimating=!0,s()},handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(t);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(t);break;case"keydown":this._key(t);break;case"click":t._constructed||(t.preventDefault(),t.stopPropagation())}}},n.utils=a,e.exports=s.iScroll=n},{2:2}],12:[function(t,e,i){"use strict";function n(t,e){return this.each(function(){var i=s(this),n=i.data("amui.modal"),o="object"==typeof t&&t;n||i.data("amui.modal",n=new c(this,o)),"string"==typeof t?n[t]&&n[t](e):n.toggle(t&&t.relatedTarget||void 0)})}var s=window.jQuery,o=t(2),a=t(8),r=s(document),l=o.support.transition,c=function(t,e){this.options=s.extend({},c.DEFAULTS,e||{}),this.$element=s(t),this.$dialog=this.$element.find(".am-modal-dialog"),this.$element.attr("id")||this.$element.attr("id",o.utils.generateGUID("am-modal")),this.isPopup=this.$element.hasClass("am-popup"),this.isActions=this.$element.hasClass("am-modal-actions"),this.isPrompt=this.$element.hasClass("am-modal-prompt"),this.isLoading=this.$element.hasClass("am-modal-loading"),this.active=this.transitioning=this.relatedTarget=null,this.events()};c.DEFAULTS={className:{active:"am-modal-active",out:"am-modal-out"},selector:{modal:".am-modal",active:".am-modal-active"},closeViaDimmer:!0,cancelable:!0,onConfirm:function(){},onCancel:function(){},closeOnCancel:!0,closeOnConfirm:!0,height:void 0,width:void 0,duration:300,transitionEnd:l&&l.end+".modal.amui"},c.prototype.toggle=function(t){return this.active?this.close():this.open(t)},c.prototype.open=function(t){var e=this.$element,i=this.options,n=this.isPopup,o=i.width,r=i.height,c={};if(!this.active&&this.$element.length){t&&(this.relatedTarget=t),this.transitioning&&(clearTimeout(e.transitionEndTimmer),e.transitionEndTimmer=null,e.trigger(i.transitionEnd).off(i.transitionEnd)),n&&this.$element.show(),this.active=!0,e.trigger(s.Event("open.modal.amui",{relatedTarget:t})),a.open(e),e.show().redraw(),n||this.isActions||(o&&(o=parseInt(o,10),c.width=o+"px",c.marginLeft=-parseInt(o/2)+"px"),r?(r=parseInt(r,10),c.marginTop=-parseInt(r/2)+"px",this.$dialog.css({height:r+"px"})):c.marginTop=-parseInt(e.height()/2,10)+"px",e.css(c)),e.removeClass(i.className.out).addClass(i.className.active),this.transitioning=1;var u=function(){e.trigger(s.Event("opened.modal.amui",{relatedTarget:t})),this.transitioning=0,this.isPrompt&&this.$dialog.find("input").eq(0).focus()};return l?void e.one(i.transitionEnd,s.proxy(u,this)).emulateTransitionEnd(i.duration):u.call(this)}},c.prototype.close=function(t){if(this.active){var e=this.$element,i=this.options,n=this.isPopup;this.transitioning&&(clearTimeout(e.transitionEndTimmer),e.transitionEndTimmer=null,e.trigger(i.transitionEnd).off(i.transitionEnd),a.close(e,!0)),this.$element.trigger(s.Event("close.modal.amui",{relatedTarget:t})),this.transitioning=1;var o=function(){e.trigger("closed.modal.amui"),n&&e.removeClass(i.className.out),e.hide(),this.transitioning=0,a.close(e,!1),this.active=!1};return e.removeClass(i.className.active).addClass(i.className.out),l?void e.one(i.transitionEnd,s.proxy(o,this)).emulateTransitionEnd(i.duration):o.call(this)}},c.prototype.events=function(){var t=this.options,e=this,i=this.$element,n=i.find(".am-modal-prompt-input"),o=i.find("[data-am-modal-confirm]"),r=i.find("[data-am-modal-cancel]"),l=function(){var t=[];return n.each(function(){t.push(s(this).val())}),0===t.length?void 0:1===t.length?t[0]:t};this.options.cancelable&&i.on("keyup.modal.amui",function(t){e.active&&27===t.which&&(i.trigger("cancel.modal.amui"),e.close())}),this.options.closeViaDimmer&&!this.isLoading&&a.$element.on("click.dimmer.modal.amui",function(t){e.close()}),i.find("[data-am-modal-close], .am-modal-btn").on("click.close.modal.amui",function(i){i.preventDefault();var n=s(this);n.is(o)?(console.log("sdafdf"),t.closeOnConfirm&&e.close()):n.is(r)?t.closeOnCancel&&e.close():e.close()}),o.on("click.confirm.modal.amui",function(){i.trigger(s.Event("confirm.modal.amui",{trigger:this}))}),r.on("click.cancel.modal.amui",function(){i.trigger(s.Event("cancel.modal.amui",{trigger:this}))}),i.on("confirm.modal.amui",function(t){t.data=l(),e.options.onConfirm.call(e,t)}).on("cancel.modal.amui",function(t){t.data=l(),e.options.onCancel.call(e,t)})},s.fn.modal=n,r.on("click.modal.amui.data-api","[data-am-modal]",function(){var t=s(this),e=o.utils.parseOptions(t.attr("data-am-modal")),i=s(e.target||this.href&&this.href.replace(/.*(?=#[^\s]+$)/,"")),a=i.data("amui.modal")?"toggle":e;n.call(i,a,this)}),e.exports=o.modal=c},{2:2,8:8}],13:[function(t,e,i){"use strict";function n(t,e){var i=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=s(this),o=n.data("amui.offcanvas"),a=s.extend({},"object"==typeof t&&t);o||(n.data("amui.offcanvas",o=new c(this,a)),(!t||"object"==typeof t)&&o.open(e)),"string"==typeof t&&o[t]&&o[t].apply(o,i)})}var s=window.jQuery,o=t(2);t(30);var a,r=s(window),l=s(document),c=function(t,e){this.$element=s(t),this.options=s.extend({},c.DEFAULTS,e),this.active=null,this.bindEvents()};c.DEFAULTS={duration:300,effect:"overlay"},c.prototype.open=function(t){var e=this,i=this.$element;if(i.length&&!i.hasClass("am-active")){var n=this.options.effect,o=s("html"),l=s("body"),c=i.find(".am-offcanvas-bar").first(),u=c.hasClass("am-offcanvas-bar-flip")?-1:1;c.addClass("am-offcanvas-bar-"+n),a={x:window.scrollX,y:window.scrollY},i.addClass("am-active"),l.css({width:window.innerWidth,height:r.height()}).addClass("am-offcanvas-page"),"overlay"!==n&&l.css({"margin-left":c.outerWidth()*u}).width(),o.css("margin-top",-1*a.y),setTimeout(function(){c.addClass("am-offcanvas-bar-active").width()},0),i.trigger("open.offcanvas.amui"),this.active=1,i.on("click.offcanvas.amui",function(t){var i=s(t.target);i.hasClass("am-offcanvas-bar")||i.parents(".am-offcanvas-bar").first().length||(t.stopImmediatePropagation(),e.close())}),o.on("keydown.offcanvas.amui",function(t){27===t.keyCode&&e.close()})}},c.prototype.close=function(t){function e(){r.removeClass("am-offcanvas-page").css({width:"",height:"","margin-left":"","margin-right":""}),l.removeClass("am-active"),c.removeClass("am-offcanvas-bar-active"),n.css("margin-top",""),window.scrollTo(a.x,a.y),l.trigger("closed.offcanvas.amui"),i.active=0}var i=this,n=s("html"),r=s("body"),l=this.$element,c=l.find(".am-offcanvas-bar").first();l.length&&this.active&&l.hasClass("am-active")&&(l.trigger("close.offcanvas.amui"),o.support.transition?(setTimeout(function(){c.removeClass("am-offcanvas-bar-active")},0),r.css("margin-left","").one(o.support.transition.end,function(){e()}).emulateTransitionEnd(this.options.duration)):e(),l.off("click.offcanvas.amui"),n.off(".offcanvas.amui"))},c.prototype.bindEvents=function(){var t=this;return l.on("click.offcanvas.amui",'[data-am-dismiss="offcanvas"]',function(e){e.preventDefault(),t.close()}),r.on("resize.offcanvas.amui orientationchange.offcanvas.amui",function(){t.active&&t.close()}),this.$element.hammer().on("swipeleft swipeleft",function(e){e.preventDefault(),t.close()}),this},s.fn.offCanvas=n,l.on("click.offcanvas.amui","[data-am-offcanvas]",function(t){t.preventDefault();var e=s(this),i=o.utils.parseOptions(e.data("amOffcanvas")),a=s(i.target||this.href&&this.href.replace(/.*(?=#[^\s]+$)/,"")),r=a.data("amui.offcanvas")?"open":i;n.call(a,r,this)}),e.exports=o.offcanvas=c},{2:2,30:30}],14:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t){var e=function(e,i){this.el=t(e),this.zoomFactor=1,this.lastScale=1,this.offset={x:0,y:0},this.options=t.extend({},this.defaults,i),this.setupMarkup(),this.bindEvents(),this.update(),this.enable()},i=function(t,e){return t+e},n=function(t,e){return t>e-.01&&e+.01>t};e.prototype={defaults:{tapZoomFactor:2,zoomOutFactor:1.3,animationDuration:300,animationInterval:5,maxZoom:5,minZoom:.5,lockDragAxis:!1,use2d:!1,zoomStartEventName:"pz_zoomstart",zoomEndEventName:"pz_zoomend",dragStartEventName:"pz_dragstart",dragEndEventName:"pz_dragend",doubleTapEventName:"pz_doubletap"},handleDragStart:function(t){this.el.trigger(this.options.dragStartEventName),this.stopAnimation(),this.lastDragPosition=!1,this.hasInteraction=!0,this.handleDrag(t)},handleDrag:function(t){if(this.zoomFactor>1){var e=this.getTouches(t)[0];this.drag(e,this.lastDragPosition),this.offset=this.sanitizeOffset(this.offset),this.lastDragPosition=e}},handleDragEnd:function(){this.el.trigger(this.options.dragEndEventName),this.end()},handleZoomStart:function(t){this.el.trigger(this.options.zoomStartEventName),this.stopAnimation(),this.lastScale=1,this.nthZoom=0,this.lastZoomCenter=!1,this.hasInteraction=!0},handleZoom:function(t,e){var i=this.getTouchCenter(this.getTouches(t)),n=e/this.lastScale;this.lastScale=e,this.nthZoom+=1,this.nthZoom>3&&(this.scale(n,i),this.drag(i,this.lastZoomCenter)),this.lastZoomCenter=i},handleZoomEnd:function(){this.el.trigger(this.options.zoomEndEventName),this.end()},handleDoubleTap:function(t){var e=this.getTouches(t)[0],i=this.zoomFactor>1?1:this.options.tapZoomFactor,n=this.zoomFactor,s=function(t){this.scaleTo(n+t*(i-n),e)}.bind(this);this.hasInteraction||(n>i&&(e=this.getCurrentZoomCenter()),this.animate(this.options.animationDuration,this.options.animationInterval,s,this.swing),this.el.trigger(this.options.doubleTapEventName))},sanitizeOffset:function(t){var e=(this.zoomFactor-1)*this.getContainerX(),i=(this.zoomFactor-1)*this.getContainerY(),n=Math.max(e,0),s=Math.max(i,0),o=Math.min(e,0),a=Math.min(i,0);return{x:Math.min(Math.max(t.x,o),n),y:Math.min(Math.max(t.y,a),s)}},scaleTo:function(t,e){this.scale(t/this.zoomFactor,e)},scale:function(t,e){t=this.scaleZoomFactor(t),this.addOffset({x:(t-1)*(e.x+this.offset.x),y:(t-1)*(e.y+this.offset.y)})},scaleZoomFactor:function(t){var e=this.zoomFactor;return this.zoomFactor*=t,this.zoomFactor=Math.min(this.options.maxZoom,Math.max(this.zoomFactor,this.options.minZoom)),this.zoomFactor/e},drag:function(t,e){e&&this.addOffset(this.options.lockDragAxis?Math.abs(t.x-e.x)>Math.abs(t.y-e.y)?{x:-(t.x-e.x),y:0}:{y:-(t.y-e.y),x:0}:{y:-(t.y-e.y),x:-(t.x-e.x)})},getTouchCenter:function(t){return this.getVectorAvg(t)},getVectorAvg:function(t){return{x:t.map(function(t){return t.x}).reduce(i)/t.length,y:t.map(function(t){return t.y}).reduce(i)/t.length}},addOffset:function(t){this.offset={x:this.offset.x+t.x,y:this.offset.y+t.y}},sanitize:function(){this.zoomFactor<this.options.zoomOutFactor?this.zoomOutAnimation():this.isInsaneOffset(this.offset)&&this.sanitizeOffsetAnimation()},isInsaneOffset:function(t){var e=this.sanitizeOffset(t);return e.x!==t.x||e.y!==t.y},sanitizeOffsetAnimation:function(){var t=this.sanitizeOffset(this.offset),e={x:this.offset.x,y:this.offset.y},i=function(i){this.offset.x=e.x+i*(t.x-e.x),this.offset.y=e.y+i*(t.y-e.y),this.update()}.bind(this);this.animate(this.options.animationDuration,this.options.animationInterval,i,this.swing)},zoomOutAnimation:function(){var t=this.zoomFactor,e=1,i=this.getCurrentZoomCenter(),n=function(n){this.scaleTo(t+n*(e-t),i)}.bind(this);this.animate(this.options.animationDuration,this.options.animationInterval,n,this.swing)},updateAspectRatio:function(){this.setContainerY()},getInitialZoomFactor:function(){return this.container[0].offsetWidth/this.el[0].offsetWidth},getAspectRatio:function(){return this.el[0].offsetWidth/this.el[0].offsetHeight},getCurrentZoomCenter:function(){var t=this.container[0].offsetWidth*this.zoomFactor,e=this.offset.x,i=t-e-this.container[0].offsetWidth,n=e/i,s=n*this.container[0].offsetWidth/(n+1),o=this.container[0].offsetHeight*this.zoomFactor,a=this.offset.y,r=o-a-this.container[0].offsetHeight,l=a/r,c=l*this.container[0].offsetHeight/(l+1);return 0===i&&(s=this.container[0].offsetWidth),0===r&&(c=this.container[0].offsetHeight),{x:s,y:c}},canDrag:function(){return!n(this.zoomFactor,1)},getTouches:function(t){var e=this.container.offset();return Array.prototype.slice.call(t.touches).map(function(t){return{x:t.pageX-e.left,y:t.pageY-e.top}})},animate:function(t,e,i,n,s){var o=(new Date).getTime(),a=function(){if(this.inAnimation){var r=(new Date).getTime()-o,l=r/t;r>=t?(i(1),s&&s(),this.update(),this.stopAnimation(),this.update()):(n&&(l=n(l)),i(l),this.update(),setTimeout(a,e))}}.bind(this);this.inAnimation=!0,a()},stopAnimation:function(){this.inAnimation=!1},swing:function(t){return-Math.cos(t*Math.PI)/2+.5},getContainerX:function(){return window.innerWidth},getContainerY:function(){return window.innerHeight},setContainerY:function(t){var e=window.innerHeight;return this.el.css({height:e}),this.container.height(e)},setupMarkup:function(){this.container=t('<div class="pinch-zoom-container"></div>'),this.el.before(this.container),this.container.append(this.el),this.container.css({overflow:"hidden",position:"relative"}),this.el.css({"-webkit-transform-origin":"0% 0%","-moz-transform-origin":"0% 0%","-ms-transform-origin":"0% 0%","-o-transform-origin":"0% 0%","transform-origin":"0% 0%",position:"absolute"})},end:function(){this.hasInteraction=!1,this.sanitize(),this.update()},bindEvents:function(){s(this.container.get(0),this),t(window).on("resize",this.update.bind(this)),t(this.el).find("img").on("load",this.update.bind(this))},update:function(){this.updatePlaned||(this.updatePlaned=!0,setTimeout(function(){this.updatePlaned=!1,this.updateAspectRatio();var t=this.getInitialZoomFactor()*this.zoomFactor,e=-this.offset.x/t,i=-this.offset.y/t,n="scale3d("+t+", "+t+",1) translate3d("+e+"px,"+i+"px,0px)",s="scale("+t+", "+t+") translate("+e+"px,"+i+"px)",o=function(){this.clone&&(this.clone.remove(),delete this.clone)}.bind(this);!this.options.use2d||this.hasInteraction||this.inAnimation?(this.is3d=!0,o(),this.el.css({"-webkit-transform":n,"-o-transform":s,"-ms-transform":s,"-moz-transform":s,transform:n})):(this.is3d&&(this.clone=this.el.clone(),this.clone.css("pointer-events","none"),this.clone.appendTo(this.container),setTimeout(o,200)),this.el.css({"-webkit-transform":s,"-o-transform":s,"-ms-transform":s,"-moz-transform":s,transform:s}),this.is3d=!1)}.bind(this),0))},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1}};var s=function(t,e){var i=null,n=0,s=null,o=null,a=function(t,n){if(i!==t){if(i&&!t)switch(i){case"zoom":e.handleZoomEnd(n);break;case"drag":e.handleDragEnd(n)}switch(t){case"zoom":e.handleZoomStart(n);break;case"drag":e.handleDragStart(n)}}i=t},r=function(t){2===n?a("zoom"):1===n&&e.canDrag()?a("drag",t):a(null,t)},l=function(t){return Array.prototype.slice.call(t).map(function(t){return{x:t.pageX,y:t.pageY}})},c=function(t,e){var i,n;return i=t.x-e.x,n=t.y-e.y,Math.sqrt(i*i+n*n)},u=function(t,e){var i=c(t[0],t[1]),n=c(e[0],e[1]);return n/i},h=function(t){t.stopPropagation(),t.preventDefault()},d=function(t){var o=(new Date).getTime();if(n>1&&(s=null),300>o-s)switch(h(t),e.handleDoubleTap(t),i){case"zoom":e.handleZoomEnd(t);break;case"drag":e.handleDragEnd(t)}1===n&&(s=o)},p=!0;t.addEventListener("touchstart",function(t){e.enabled&&(p=!0,n=t.touches.length,d(t))}),t.addEventListener("touchmove",function(t){if(e.enabled){if(p)r(t),i&&h(t),o=l(t.touches);else{switch(i){case"zoom":e.handleZoom(t,u(o,l(t.touches)));break;case"drag":e.handleDrag(t)}i&&(h(t),e.update())}p=!1}}),t.addEventListener("touchend",function(t){e.enabled&&(n=t.touches.length,r(t))})};return e};e.exports=s.pichzoom=o(n)},{2:2}],15:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=n(window),a=function(t,e){this.options=n.extend({},a.DEFAULTS,e),this.$element=n(t),this.active=null,this.$popover=this.options.target&&n(this.options.target)||null,this.init(),this._bindEvents()};a.DEFAULTS={theme:void 0,trigger:"click",content:"",open:!1,target:void 0,tpl:'<div class="am-popover"><div class="am-popover-inner"></div><div class="am-popover-caret"></div></div>'},a.prototype.init=function(){function t(){i.sizePopover()}var e,i=this,o=this.$element;this.options.target||(this.$popover=this.getPopover(),this.setContent()),e=this.$popover,e.appendTo(n("body")),this.sizePopover(),o.on("open.popover.amui",function(){n(window).on("resize.popover.amui",s.utils.debounce(t,50))}),o.on("close.popover.amui",function(){
	n(window).off("resize.popover.amui",t)}),this.options.open&&this.open()},a.prototype.sizePopover=function(){var t=this.$element,e=this.$popover;if(e&&e.length){var i=e.outerWidth(),n=e.outerHeight(),s=e.find(".am-popover-caret"),a=s.outerWidth()/2||8,r=n+8,l=t.outerWidth(),c=t.outerHeight(),u=t.offset(),h=t[0].getBoundingClientRect(),d=o.height(),p=o.width(),m=0,f=0,v=0,g=2,w="top";e.css({left:"",top:""}).removeClass("am-popover-left am-popover-right am-popover-top am-popover-bottom"),r-g<h.top+g?m=u.top-r-g:r<d-h.top-h.height?(w="bottom",m=u.top+c+a+g):(w="middle",m=c/2+u.top-n/2),"top"===w||"bottom"===w?(f=l/2+u.left-i/2,v=f,5>f&&(f=5),f+i>p&&(f=p-i-20),"top"===w&&e.addClass("am-popover-top"),"bottom"===w&&e.addClass("am-popover-bottom"),v-=f):"middle"===w&&(f=u.left-i-a,e.addClass("am-popover-left"),5>f&&(f=u.left+l+a,e.removeClass("am-popover-left").addClass("am-popover-right")),f+i>p&&(f=p-i-5,e.removeClass("am-popover-left").addClass("am-popover-right"))),e.css({top:m+"px",left:f+"px"})}},a.prototype.toggle=function(){return this[this.active?"close":"open"]()},a.prototype.open=function(){var t=this.$popover;this.$element.trigger("open.popover.amui"),this.sizePopover(),t.show().addClass("am-active"),this.active=!0},a.prototype.close=function(){var t=this.$popover;this.$element.trigger("close.popover.amui"),t.removeClass("am-active").trigger("closed.popover.amui").hide(),this.active=!1},a.prototype.getPopover=function(){var t=s.utils.generateGUID("am-popover"),e=[];return this.options.theme&&n.each(this.options.theme.split(","),function(t,i){e.push("am-popover-"+n.trim(i))}),n(this.options.tpl).attr("id",t).addClass(e.join(" "))},a.prototype.setContent=function(t){t=t||this.options.content,this.$popover&&this.$popover.find(".am-popover-inner").empty().html(t)},a.prototype._bindEvents=function(){for(var t="popover.amui",e=this.options.trigger.split(" "),i=e.length;i--;){var s=e[i];if("click"===s)this.$element.on("click."+t,n.proxy(this.toggle,this));else{var o="hover"==s?"mouseenter":"focusin",a="hover"==s?"mouseleave":"focusout";this.$element.on(o+"."+t,n.proxy(this.open,this)),this.$element.on(a+"."+t,n.proxy(this.close,this))}}},s.plugin("popover",a),s.ready(function(t){n("[data-am-popover]",t).popover()}),e.exports=a},{2:2}],16:[function(t,e,i){"use strict";var n=(window.jQuery,t(2)),s=function(){function t(t,e,i){return e>t?e:t>i?i:t}function e(t){return 100*(-1+t)}function i(t,i,n){var s;return s="translate3d"===c.positionUsing?{transform:"translate3d("+e(t)+"%,0,0)"}:"translate"===c.positionUsing?{transform:"translate("+e(t)+"%,0)"}:{"margin-left":e(t)+"%"},s.transition="all "+i+"ms "+n,s}function n(t,e){var i="string"==typeof t?t:a(t);return i.indexOf(" "+e+" ")>=0}function s(t,e){var i=a(t),s=i+e;n(i,e)||(t.className=s.substring(1))}function o(t,e){var i,s=a(t);n(t,e)&&(i=s.replace(" "+e+" "," "),t.className=i.substring(1,i.length-1))}function a(t){return(" "+(t.className||"")+" ").replace(/\s+/gi," ")}function r(t){t&&t.parentNode&&t.parentNode.removeChild(t)}var l={};l.version="0.2.0";var c=l.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,parent:"body",barSelector:'[role="nprogress-bar"]',spinnerSelector:'[role="nprogress-spinner"]',template:'<div class="nprogress-bar" role="nprogress-bar"><div class="nprogress-peg"></div></div><div class="nprogress-spinner" role="nprogress-spinner"><div class="nprogress-spinner-icon"></div></div>'};l.configure=function(t){var e,i;for(e in t)i=t[e],void 0!==i&&t.hasOwnProperty(e)&&(c[e]=i);return this},l.status=null,l.set=function(e){var n=l.isStarted();e=t(e,c.minimum,1),l.status=1===e?null:e;var s=l.render(!n),o=s.querySelector(c.barSelector),a=c.speed,r=c.easing;return s.offsetWidth,u(function(t){""===c.positionUsing&&(c.positionUsing=l.getPositioningCSS()),h(o,i(e,a,r)),1===e?(h(s,{transition:"none",opacity:1}),s.offsetWidth,setTimeout(function(){h(s,{transition:"all "+a+"ms linear",opacity:0}),setTimeout(function(){l.remove(),t()},a)},a)):setTimeout(t,a)}),this},l.isStarted=function(){return"number"==typeof l.status},l.start=function(){l.status||l.set(0);var t=function(){setTimeout(function(){l.status&&(l.trickle(),t())},c.trickleSpeed)};return c.trickle&&t(),this},l.done=function(t){return t||l.status?l.inc(.3+.5*Math.random()).set(1):this},l.inc=function(e){var i=l.status;return i?("number"!=typeof e&&(e=(1-i)*t(Math.random()*i,.1,.95)),i=t(i+e,0,.994),l.set(i)):l.start()},l.trickle=function(){return l.inc(Math.random()*c.trickleRate)},function(){var t=0,e=0;l.promise=function(i){return i&&"resolved"!==i.state()?(0===e&&l.start(),t++,e++,i.always(function(){e--,0===e?(t=0,l.done()):l.set((t-e)/t)}),this):this}}(),l.render=function(t){if(l.isRendered())return document.getElementById("nprogress");s(document.documentElement,"nprogress-busy");var i=document.createElement("div");i.id="nprogress",i.innerHTML=c.template;var n,o=i.querySelector(c.barSelector),a=t?"-100":e(l.status||0),u=document.querySelector(c.parent);return h(o,{transition:"all 0 linear",transform:"translate3d("+a+"%,0,0)"}),c.showSpinner||(n=i.querySelector(c.spinnerSelector),n&&r(n)),u!=document.body&&s(u,"nprogress-custom-parent"),u.appendChild(i),i},l.remove=function(){o(document.documentElement,"nprogress-busy"),o(document.querySelector(c.parent),"nprogress-custom-parent");var t=document.getElementById("nprogress");t&&r(t)},l.isRendered=function(){return!!document.getElementById("nprogress")},l.getPositioningCSS=function(){var t=document.body.style,e="WebkitTransform"in t?"Webkit":"MozTransform"in t?"Moz":"msTransform"in t?"ms":"OTransform"in t?"O":"";return e+"Perspective"in t?"translate3d":e+"Transform"in t?"translate":"margin"};var u=function(){function t(){var i=e.shift();i&&i(t)}var e=[];return function(i){e.push(i),1==e.length&&t()}}(),h=function(){function t(t){return t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(t,e){return e.toUpperCase()})}function e(t){var e=document.body.style;if(t in e)return t;for(var i,n=s.length,o=t.charAt(0).toUpperCase()+t.slice(1);n--;)if(i=s[n]+o,i in e)return i;return t}function i(i){return i=t(i),o[i]||(o[i]=e(i))}function n(t,e,n){e=i(e),t.style[e]=n}var s=["Webkit","O","Moz","ms"],o={};return function(t,e){var i,s,o=arguments;if(2==o.length)for(i in e)s=e[i],void 0!==s&&e.hasOwnProperty(i)&&n(t,i,s);else n(t,o[1],o[2])}}();return l}();e.exports=n.progress=s},{2:2}],17:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=t(14),a=t(30),r=s.support.animation,l=s.support.transition,c=function(t,e){this.$element=n(t),this.$body=n(document.body),this.options=n.extend({},c.DEFAULTS,e),this.$pureview=n(this.options.tpl).attr("id",s.utils.generateGUID("am-pureview")),this.$slides=null,this.transitioning=null,this.scrollbarWidth=0,this.init()};c.DEFAULTS={tpl:'<div class="am-pureview am-pureview-bar-active"><ul class="am-pureview-slider"></ul><ul class="am-pureview-direction"><li class="am-pureview-prev"><a href=""></a></li><li class="am-pureview-next"><a href=""></a></li></ul><ol class="am-pureview-nav"></ol><div class="am-pureview-bar am-active"><span class="am-pureview-title"></span><div class="am-pureview-counter"><span class="am-pureview-current"></span> / <span class="am-pureview-total"></span></div></div><div class="am-pureview-actions am-active"><a href="javascript: void(0)" class="am-icon-chevron-left" data-am-close="pureview"></a></div></div>',className:{prevSlide:"am-pureview-slide-prev",nextSlide:"am-pureview-slide-next",onlyOne:"am-pureview-only",active:"am-active",barActive:"am-pureview-bar-active",activeBody:"am-pureview-active"},selector:{slider:".am-pureview-slider",close:'[data-am-close="pureview"]',total:".am-pureview-total",current:".am-pureview-current",title:".am-pureview-title",actions:".am-pureview-actions",bar:".am-pureview-bar",pinchZoom:".am-pinch-zoom",nav:".am-pureview-nav"},shareBtn:!1,toggleToolbar:!0,target:"img",weChatImagePreview:!0},c.prototype.init=function(){var t=this,e=this.options,i=this.$element,s=this.$pureview;this.refreshSlides(),n("body").append(s),this.$title=s.find(e.selector.title),this.$current=s.find(e.selector.current),this.$bar=s.find(e.selector.bar),this.$actions=s.find(e.selector.actions),e.shareBtn&&this.$actions.append('<a href="javascript: void(0)" class="am-icon-share-square-o" data-am-toggle="share"></a>'),this.$element.on("click.pureview.amui",e.target,function(i){i.preventDefault();var n=t.$images.index(this);e.weChatImagePreview&&window.WeixinJSBridge?window.WeixinJSBridge.invoke("imagePreview",{current:t.imgUrls[n],urls:t.imgUrls}):t.open(n)}),s.find(".am-pureview-direction").on("click.direction.pureview.amui","li",function(e){e.preventDefault(),n(this).is(".am-pureview-prev")?t.prevSlide():t.nextSlide()}),s.find(e.selector.nav).on("click.nav.pureview.amui","li",function(){var e=t.$navItems.index(n(this));t.activate(t.$slides.eq(e))}),s.find(e.selector.close).on("click.close.pureview.amui",function(e){e.preventDefault(),t.close()}),this.$slider.hammer().on("swipeleft.pureview.amui",function(e){e.preventDefault(),t.nextSlide()}).on("swiperight.pureview.amui",function(e){e.preventDefault(),t.prevSlide()}).on("press.pureview.amui",function(i){i.preventDefault(),e.toggleToolbar&&t.toggleToolBar()}),this.$slider.data("hammer").get("swipe").set({direction:a.DIRECTION_HORIZONTAL,velocity:.35}),i.DOMObserve({childList:!0,subtree:!0},function(t,e){}),i.on("changed.dom.amui",function(e){e.stopPropagation(),t.refreshSlides()}),n(document).on("keydown.pureview.amui",n.proxy(function(t){var e=t.keyCode;37==e?this.prevSlide():39==e?this.nextSlide():27==e&&this.close()},this))},c.prototype.refreshSlides=function(){this.$images=this.$element.find(this.options.target);var t=this,e=this.options,i=this.$pureview,s=n([]),o=n([]),a=this.$images,r=a.length;this.$slider=i.find(e.selector.slider),this.$nav=i.find(e.selector.nav);var l="data-am-pureviewed";this.imgUrls=this.imgUrls||[],r&&(1===r&&i.addClass(e.className.onlyOne),a.not("["+l+"]").each(function(e,i){var a,r;"A"===i.nodeName?(a=i.href,r=i.title||""):(a=n(i).data("rel")||i.src,r=n(i).attr("alt")||""),i.setAttribute(l,"1"),t.imgUrls.push(a),s=s.add(n('<li data-src="'+a+'" data-title="'+r+'"></li>')),o=o.add(n("<li>"+(e+1)+"</li>"))}),i.find(e.selector.total).text(r),this.$slider.append(s),this.$nav.append(o),this.$navItems=this.$nav.find("li"),this.$slides=this.$slider.find("li"))},c.prototype.loadImage=function(t,e){var i="image-appended";if(!t.data(i)){var s=n("<img>",{src:t.data("src"),alt:t.data("title")});t.html(s).wrapInner('<div class="am-pinch-zoom"></div>').redraw();var a=t.find(this.options.selector.pinchZoom);a.data("amui.pinchzoom",new o(a[0],{})),t.data("image-appended",!0)}e&&e.call(this)},c.prototype.activate=function(t){var e=this.options,i=this.$slides,o=i.index(t),a=t.data("title")||"",r=e.className.active;i.find("."+r).is(t)||this.transitioning||(this.loadImage(t,function(){s.utils.imageLoader(t.find("img"),function(e){t.find(".am-pinch-zoom").addClass("am-pureview-loaded"),n(e).addClass("am-img-loaded")})}),this.transitioning=1,this.$title.text(a),this.$current.text(o+1),i.removeClass(),t.addClass(r),i.eq(o-1).addClass(e.className.prevSlide),i.eq(o+1).addClass(e.className.nextSlide),this.$navItems.removeClass().eq(o).addClass(e.className.active),l?t.one(l.end,n.proxy(function(){this.transitioning=0},this)).emulateTransitionEnd(300):this.transitioning=0)},c.prototype.nextSlide=function(){if(1!==this.$slides.length){var t=this.$slides,e=t.filter(".am-active"),i=t.index(e),n="am-animation-right-spring";i+1>=t.length?r&&e.addClass(n).on(r.end,function(){e.removeClass(n)}):this.activate(t.eq(i+1))}},c.prototype.prevSlide=function(){if(1!==this.$slides.length){var t=this.$slides,e=t.filter(".am-active"),i=this.$slides.index(e),n="am-animation-left-spring";0===i?r&&e.addClass(n).on(r.end,function(){e.removeClass(n)}):this.activate(t.eq(i-1))}},c.prototype.toggleToolBar=function(){this.$pureview.toggleClass(this.options.className.barActive)},c.prototype.open=function(t){var e=t||0;this.checkScrollbar(),this.setScrollbar(),this.activate(this.$slides.eq(e)),this.$pureview.show().redraw().addClass(this.options.className.active),this.$body.addClass(this.options.className.activeBody)},c.prototype.close=function(){function t(){this.$pureview.hide(),this.$body.removeClass(e.className.activeBody),this.resetScrollbar()}var e=this.options;this.$pureview.removeClass(e.className.active),this.$slides.removeClass(),l?this.$pureview.one(l.end,n.proxy(t,this)).emulateTransitionEnd(300):t.call(this)},c.prototype.checkScrollbar=function(){this.scrollbarWidth=s.utils.measureScrollbar()},c.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",t+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},s.plugin("pureview",c),s.ready(function(t){n("[data-am-pureview]",t).pureview()}),e.exports=c},{14:14,2:2,30:30}],18:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){if(s.support.animation){this.options=n.extend({},o.DEFAULTS,e),this.$element=n(t);var i=function(){s.utils.rAF.call(window,n.proxy(this.checkView,this))}.bind(this);this.$window=n(window).on("scroll.scrollspy.amui",i).on("resize.scrollspy.amui orientationchange.scrollspy.amui",s.utils.debounce(i,50)),this.timer=this.inViewState=this.initInView=null,i()}};o.DEFAULTS={animation:"fade",className:{inView:"am-scrollspy-inview",init:"am-scrollspy-init"},repeat:!0,delay:0,topOffset:0,leftOffset:0},o.prototype.checkView=function(){var t=this.$element,e=this.options,i=s.utils.isInView(t,e),n=e.animation?" am-animation-"+e.animation:"";i&&!this.inViewState&&(this.timer&&clearTimeout(this.timer),this.initInView||(t.addClass(e.className.init),this.offset=t.offset(),this.initInView=!0,t.trigger("init.scrollspy.amui")),this.timer=setTimeout(function(){i&&t.addClass(e.className.inView+n).width()},e.delay),this.inViewState=!0,t.trigger("inview.scrollspy.amui")),!i&&this.inViewState&&e.repeat&&(t.removeClass(e.className.inView+n),this.inViewState=!1,t.trigger("outview.scrollspy.amui"))},o.prototype.check=function(){s.utils.rAF.call(window,n.proxy(this.checkView,this))},s.plugin("scrollspy",o),s.ready(function(t){n("[data-am-scrollspy]",t).scrollspy()}),e.exports=o},{2:2}],19:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2);t(22);var o=function(t,e){this.options=n.extend({},o.DEFAULTS,e),this.$element=n(t),this.anchors=[],this.$links=this.$element.find('a[href^="#"]').each(function(t,e){this.anchors.push(n(e).attr("href"))}.bind(this)),this.$targets=n(this.anchors.join(", "));var i=function(){s.utils.rAF.call(window,n.proxy(this.process,this))}.bind(this);this.$window=n(window).on("scroll.scrollspynav.amui",i).on("resize.scrollspynav.amui orientationchange.scrollspynav.amui",s.utils.debounce(i,50)),i(),this.scrollProcess()};o.DEFAULTS={className:{active:"am-active"},closest:!1,smooth:!0,offsetTop:0},o.prototype.process=function(){var t=this.$window.scrollTop(),e=this.options,i=[],o=this.$links,a=this.$targets;if(a.each(function(t,n){s.utils.isInView(n,e)&&i.push(n)}),i.length){var r;if(n.each(i,function(e,i){return n(i).offset().top>=t?(r=n(i),!1):void 0}),!r)return;e.closest?(o.closest(e.closest).removeClass(e.className.active),o.filter('a[href="#'+r.attr("id")+'"]').closest(e.closest).addClass(e.className.active)):o.removeClass(e.className.active).filter('a[href="#'+r.attr("id")+'"]').addClass(e.className.active)}},o.prototype.scrollProcess=function(){var t=this.$links,e=this.options;e.smooth&&n.fn.smoothScroll&&t.on("click",function(t){t.preventDefault();var i=n(this),s=n(i.attr("href"));if(s){var o=e.offsetTop&&!isNaN(parseInt(e.offsetTop))&&parseInt(e.offsetTop)||0;n(window).smoothScroll({position:s.offset().top-o})}})},s.plugin("scrollspynav",o),s.ready(function(t){n("[data-am-scrollspy-nav]",t).scrollspynav()}),e.exports=o},{2:2,22:22}],20:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2);n.expr[":"].containsNC=function(t,e,i,n){return(t.textContent||t.innerText||"").toLowerCase().indexOf((i[3]||"").toLowerCase())>=0};var o=function(t,e){this.$element=n(t),this.options=n.extend({},o.DEFAULTS,e),this.$originalOptions=this.$element.find("option"),this.multiple=t.multiple,this.$selector=null,this.initialized=!1,this.init()};o.DEFAULTS={btnWidth:null,btnSize:null,btnStyle:"default",dropUp:0,maxHeight:null,placeholder:"\u70b9\u51fb\u9009\u62e9...",selectedClass:"am-checked",disabledClass:"am-disabled",searchBox:!1,tpl:'<div class="am-selected am-dropdown <%= dropUp ? \'am-dropdown-up\': \'\' %>" id="<%= id %>" data-am-dropdown>  <button type="button" class="am-selected-btn am-btn am-dropdown-toggle">    <span class="am-selected-status am-fl"></span>    <i class="am-selected-icon am-icon-caret-<%= dropUp ? \'up\' : \'down\' %>"></i>  </button>  <div class="am-selected-content am-dropdown-content">    <h2 class="am-selected-header"><span class="am-icon-chevron-left">\u8fd4\u56de</span></h2>   <% if (searchBox) { %>   <div class="am-selected-search">     <input autocomplete="off" class="am-form-field am-input-sm" />   </div>   <% } %>    <ul class="am-selected-list">      <% for (var i = 0; i < options.length; i++) { %>       <% var option = options[i] %>       <% if (option.header) { %>  <li data-group="<%= option.group %>" class="am-selected-list-header">       <%= option.text %></li>       <% } else { %>       <li class="<%= option.classNames%>"          data-index="<%= option.index %>"          data-group="<%= option.group || 0 %>"          data-value="<%= option.value %>" >         <span class="am-selected-text"><%= option.text %></span>         <i class="am-icon-check"></i></li>      <% } %>      <% } %>    </ul>    <div class="am-selected-hint"></div>  </div></div>',listTpl:'<% for (var i = 0; i < options.length; i++) { %>       <% var option = options[i] %>       <% if (option.header) { %>  <li data-group="<%= option.group %>" class="am-selected-list-header">       <%= option.text %></li>       <% } else { %>       <li class="<%= option.classNames %>"          data-index="<%= option.index %>"          data-group="<%= option.group || 0 %>"          data-value="<%= option.value %>" >         <span class="am-selected-text"><%= option.text %></span>         <i class="am-icon-check"></i></li>      <% } %>      <% } %>'},o.prototype.init=function(){var t=this,e=this.$element,i=this.options;e.hide();var o={id:s.utils.generateGUID("am-selected"),multiple:this.multiple,options:[],searchBox:i.searchBox,dropUp:i.dropUp,placeholder:i.placeholder};this.$selector=n(s.template(this.options.tpl,o)),this.$selector.css({width:this.options.btnWidth}),this.$list=this.$selector.find(".am-selected-list"),this.$searchField=this.$selector.find(".am-selected-search input"),this.$hint=this.$selector.find(".am-selected-hint");var a=this.$selector.find(".am-selected-btn"),r=[];i.btnSize&&r.push("am-btn-"+i.btnSize),i.btnStyle&&r.push("am-btn-"+i.btnStyle),a.addClass(r.join(" ")),this.$selector.dropdown({justify:a}),i.maxHeight&&this.$selector.find(".am-selected-list").css({"max-height":i.maxHeight,"overflow-y":"scroll"});var l=[],c=e.attr("minchecked"),u=e.attr("maxchecked");e[0].required&&l.push("\u5fc5\u9009"),(c||u)&&(c&&l.push("\u81f3\u5c11\u9009\u62e9 "+c+" \u9879"),u&&l.push("\u81f3\u591a\u9009\u62e9 "+u+" \u9879")),this.$hint.text(l.join("\uff0c")),this.renderOptions(),this.$element.after(this.$selector),this.dropdown=this.$selector.data("amui.dropdown"),this.$status=this.$selector.find(".am-selected-status"),setTimeout(function(){t.syncData(),t.initialized=!0},0),this.bindEvents()},o.prototype.renderOptions=function(){function t(t,e,s){var o="";e.disabled&&(o+=i.disabledClass),!e.disabled&&e.selected&&(o+=i.selectedClass),n.push({group:s,index:t,classNames:o,text:e.text,value:e.value})}var e=this.$element,i=this.options,n=[],o=e.find("optgroup");this.$originalOptions=this.$element.find("option"),this.multiple||null!==e.val()||this.$originalOptions.length&&(this.$originalOptions.get(0).selected=!0),o.length?o.each(function(e){n.push({header:!0,group:e+1,text:this.label}),o.eq(e).find("option").each(function(i,n){t(i,n,e)})}):this.$originalOptions.each(function(e,i){t(e,i,null)}),this.$list.html(s.template(i.listTpl,{options:n})),this.$shadowOptions=this.$list.find("> li").not(".am-selected-list-header")},o.prototype.setChecked=function(t){var e=this.options,i=n(t),s=i.hasClass(e.selectedClass);if(!this.multiple){if(s)return;this.dropdown.close(),this.$shadowOptions.not(i).removeClass(e.selectedClass)}i.toggleClass(e.selectedClass),this.syncData(t)},o.prototype.syncData=function(t){var e=this,i=this.options,s=[],o=n([]);if(this.$shadowOptions.filter("."+i.selectedClass).each(function(){var i=n(this);s.push(i.find(".am-selected-text").text()),t||(o=o.add(e.$originalOptions.filter('[value="'+i.data("value")+'"]').prop("selected",!0)))}),t){var a=n(t);this.$originalOptions.filter('[value="'+a.data("value")+'"]').prop("selected",a.hasClass(i.selectedClass))}else this.$originalOptions.not(o).prop("selected",!1);this.$element.val()||(s=[i.placeholder]),this.$status.text(s.join(", ")),this.initialized&&this.$element.trigger("change")},o.prototype.bindEvents=function(){var t=this,e="am-selected-list-header",i=s.utils.debounce(function(i){t.$shadowOptions.not("."+e).hide().filter(':containsNC("'+i.target.value+'")').show()},100);this.$list.on("click","> li",function(i){var s=n(this);!s.hasClass(t.options.disabledClass)&&!s.hasClass(e)&&t.setChecked(this)}),this.$searchField.on("keyup.selected.amui",i),this.$selector.on("closed.dropdown.amui",function(){t.$searchField.val(""),t.$shadowOptions.css({display:""})}),s.support.mutationobserver&&(this.observer=new s.support.mutationobserver(function(){t.$element.trigger("changed.selected.amui")}),this.observer.observe(this.$element[0],{childList:!0,attributes:!0,subtree:!0,characterData:!0})),this.$element.on("changed.selected.amui",function(){t.renderOptions(),t.syncData()})},o.prototype.destroy=function(){this.$element.removeData("amui.selected").show(),this.$selector.remove()},s.plugin("selected",o),s.ready(function(t){n("[data-am-selected]",t).selected()}),e.exports=o},{2:2}],21:[function(t,e,i){"use strict";t(12);var n=window.jQuery,s=t(2),o=t(31),a=document,r=n(a),l=function(t){this.options=n.extend({},l.DEFAULTS,t||{}),this.$element=null,this.$wechatQr=null,this.pics=null,this.inited=!1,this.active=!1};l.DEFAULTS={sns:["weibo","qq","qzone","tqq","wechat","renren"],title:"\u5206\u4eab\u5230",cancel:"\u53d6\u6d88",closeOnShare:!0,id:s.utils.generateGUID("am-share"),desc:"Hi\uff0c\u5b64\u591c\u89c2\u5929\u8c61\uff0c\u53d1\u73b0\u4e00\u4e2a\u4e0d\u9519\u7684\u897f\u897f\uff0c\u5206\u4eab\u4e00\u4e0b\u4e0b ;-)",via:"Amaze UI",tpl:'<div class="am-share am-modal-actions" id="<%= id %>"><h3 class="am-share-title"><%= title %></h3><ul class="am-share-sns am-avg-sm-3"><% for(var i = 0; i < sns.length; i++) {%><li><a href="<%= sns[i].shareUrl %>" data-am-share-to="<%= sns[i].id %>" ><i class="am-icon-<%= sns[i].icon %>"></i><span><%= sns[i].title %></span></a></li><% } %></ul><div class="am-share-footer"><button class="am-btn am-btn-default am-btn-block" data-am-share-close><%= cancel %></button></div></div>'},l.SNS={weibo:{title:"\u65b0\u6d6a\u5fae\u535a",url:"http://service.weibo.com/share/share.php",width:620,height:450,icon:"weibo"},qq:{title:"QQ \u597d\u53cb",url:"http://connect.qq.com/widget/shareqq/index.html",icon:"qq"},qzone:{title:"QQ \u7a7a\u95f4",url:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",icon:"star"},tqq:{title:"\u817e\u8baf\u5fae\u535a",url:"http://v.t.qq.com/share/share.php",icon:"tencent-weibo"},wechat:{title:"\u5fae\u4fe1",url:"[qrcode]",icon:"wechat"},renren:{title:"\u4eba\u4eba\u7f51",url:"http://widget.renren.com/dialog/share",icon:"renren"},douban:{title:"\u8c46\u74e3",url:"http://www.douban.com/recommend/",icon:"share-alt"},mail:{title:"\u90ae\u4ef6\u5206\u4eab",url:"mailto:",icon:"envelope-o"},sms:{title:"\u77ed\u4fe1\u5206\u4eab",url:"sms:",icon:"comment"}},l.prototype.render=function(){var t=this.options,e=[],i=encodeURIComponent(a.title),o=encodeURIComponent(a.location),r="?body="+i+o;return t.sns.forEach(function(n,s){if(l.SNS[n]){var a,c=l.SNS[n];c.id=n,a="mail"===n?r+"&subject="+t.desc:"sms"===n?r:"?url="+o+"&title="+i,c.shareUrl=c.url+a,e.push(c)}}),s.template(t.tpl,n.extend({},t,{sns:e}))},l.prototype.init=function(){if(!this.inited){var t=this,e="[data-am-share-to]";r.ready(n.proxy(function(){n("body").append(this.render()),this.$element=n("#"+this.options.id),this.$element.find("[data-am-share-close]").on("click.share.amui",function(){t.close()})},this)),r.on("click.share.amui",e,n.proxy(function(t){var i=n(t.target),s=i.is(e)&&i||i.parent(e),o=s.attr("data-am-share-to");"mail"!==o&&"sms"!==o&&(t.preventDefault(),this.shareTo(o,this.setData(o))),this.close()},this)),this.inited=!0}},l.prototype.open=function(){!this.inited&&this.init(),this.$element&&this.$element.modal("open"),this.$element.trigger("open.share.amui"),this.active=!0},l.prototype.close=function(){this.$element&&this.$element.modal("close"),this.$element.trigger("close.share.amui"),this.active=!1},l.prototype.toggle=function(){this.active?this.close():this.open()},l.prototype.setData=function(t){if(t){var e={url:a.location,title:a.title},i=this.options.desc,n=this.pics||[],s=/^(qzone|qq|tqq)$/;if(s.test(t)&&!n.length){for(var o=a.images,r=0;r<o.length&&10>r;r++)!!o[r].src&&n.push(encodeURIComponent(o[r].src));this.pics=n}switch(t){case"qzone":e.desc=i,e.site=this.options.via,e.pics=n.join("|");break;case"qq":e.desc=i,e.site=this.options.via,e.pics=n[0];break;case"tqq":e.pic=n.join("|")}return e}},l.prototype.shareTo=function(t,e){var i=l.SNS[t];if(i){if("wechat"===t||"weixin"===t)return this.wechatQr();var n=[];for(var s in e)e[s]&&n.push(s.toString()+"="+("pic"===s||"pics"===s?e[s]:encodeURIComponent(e[s])));window.open(i.url+"?"+n.join("&"))}},l.prototype.wechatQr=function(){if(!this.$wechatQr){var t=s.utils.generateGUID("am-share-wechat"),e=n('<div class="am-modal am-modal-no-btn am-share-wechat-qr"><div class="am-modal-dialog"><div class="am-modal-hd">\u5206\u4eab\u5230\u5fae\u4fe1 <a href="" class="am-close am-close-spin" data-am-modal-close>&times;</a> </div><div class="am-modal-bd"><div class="am-share-wx-qr"></div><div class="am-share-wechat-tip">\u6253\u5f00\u5fae\u4fe1\uff0c\u70b9\u51fb\u5e95\u90e8\u7684<em>\u53d1\u73b0</em>\uff0c<br/> \u4f7f\u7528<em>\u626b\u4e00\u626b</em>\u5c06\u7f51\u9875\u5206\u4eab\u81f3\u670b\u53cb\u5708</div></div></div></div>');e.attr("id",t);var i=new o({render:"canvas",correctLevel:0,text:a.location.href,width:180,height:180,background:"#fff",foreground:"#000"});e.find(".am-share-wx-qr").html(i),e.appendTo(n("body")),this.$wechatQr=n("#"+t)}this.$wechatQr.modal("open")};var c=new l;r.on("click.share.amui.data-api",'[data-am-toggle="share"]',function(t){t.preventDefault(),c.toggle()}),e.exports=s.share=c},{12:12,2:2,31:31}],22:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=s.utils.rAF,a=s.utils.cancelAF,r=!1,l=function(t,e){function i(t){return(t/=.5)<1?.5*Math.pow(t,5):.5*(Math.pow(t-2,5)+2)}function s(){p.off("touchstart.smoothscroll.amui",y),r=!1}function c(t){r&&(u||(u=t),h=Math.min(1,Math.max((t-u)/w,0)),d=Math.round(f+g*i(h)),g>0&&d>m&&(d=m),0>g&&m>d&&(d=m),v!=d&&p.scrollTop(d),v=d,d!==m?(a(b),b=o(c)):(a(b),s()))}e=e||{};var u,h,d,p=n(t),m=parseInt(e.position)||l.DEFAULTS.position,f=p.scrollTop(),v=f,g=m-f,w=e.speed||Math.min(750,Math.min(1500,Math.abs(f-m))),y=function(){s()};if(!r&&0!==g){p.on("touchstart.smoothscroll.amui",y),r=!0;var b=o(c)}};l.DEFAULTS={position:0},n.fn.smoothScroll=function(t){return this.each(function(){new l(this,t)})},n(document).on("click.smoothScroll.amui.data-api","[data-am-smooth-scroll]",function(t){t.preventDefault();var e=s.utils.parseOptions(n(this).data("amSmoothScroll"));n(window).smoothScroll(e)}),e.exports=l},{2:2}],23:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){var i=this;this.options=n.extend({},o.DEFAULTS,e),this.$element=n(t),this.sticked=null,this.inited=null,this.$holder=void 0,this.$window=n(window).on("scroll.sticky.amui",s.utils.debounce(n.proxy(this.checkPosition,this),10)).on("resize.sticky.amui orientationchange.sticky.amui",s.utils.debounce(function(){i.reset(!0,function(){i.checkPosition()})},50)).on("load.sticky.amui",n.proxy(this.checkPosition,this)),this.offset=this.$element.offset(),this.init()};o.DEFAULTS={top:0,bottom:0,animation:"",className:{sticky:"am-sticky",resetting:"am-sticky-resetting",stickyBtm:"am-sticky-bottom",animationRev:"am-animation-reverse"}},o.prototype.init=function(){var t=this.check();if(!t)return!1;var e=this.$element,i="";n.each(e.css(["marginTop","marginRight","marginBottom","marginLeft"]),function(t,e){return i+=" "+e});var s=n('<div class="am-sticky-placeholder"></div>').css({height:"absolute"!==e.css("position")?e.outerHeight():"","float":"none"!=e.css("float")?e.css("float"):"",margin:i});return this.$holder=e.css("margin",0).wrap(s).parent(),this.inited=1,!0},o.prototype.reset=function(t,e){var i=this.options,n=this.$element,o=i.animation?" am-animation-"+i.animation:"",a=function(){n.css({position:"",top:"",width:"",left:"",margin:0}),n.removeClass([o,i.className.animationRev,i.className.sticky,i.className.resetting].join(" ")),this.animating=!1,this.sticked=!1,this.offset=n.offset(),e&&e()}.bind(this);n.addClass(i.className.resetting),!t&&i.animation&&s.support.animation?(this.animating=!0,n.removeClass(o).one(s.support.animation.end,function(){a()}).width(),n.addClass(o+" "+i.className.animationRev)):a()},o.prototype.check=function(){if(!this.$element.is(":visible"))return!1;var t=this.options.media;if(t)switch(typeof t){case"number":if(window.innerWidth<t)return!1;break;case"string":if(window.matchMedia&&!window.matchMedia(t).matches)return!1}return!0},o.prototype.checkPosition=function(){if(!this.inited){var t=this.init();if(!t)return}var e=this.options,i=this.$window.scrollTop(),n=e.top,s=e.bottom,o=this.$element,a=e.animation?" am-animation-"+e.animation:"",r=[e.className.sticky,a].join(" ");"function"==typeof s&&(s=s(this.$element));var l=i>this.$holder.offset().top;!this.sticked&&l?o.addClass(r):this.sticked&&!l&&this.reset(),this.$holder.css({height:o.is(":visible")&&"absolute"!==o.css("position")?o.outerHeight():""}),l&&o.css({top:n,left:this.$holder.offset().left,width:this.$holder.width()}),this.sticked=l},s.plugin("sticky",o),n(window).on("load",function(){n("[data-am-sticky]").sticky()}),e.exports=o},{2:2}],24:[function(t,e,i){"use strict";function n(t){var e,i=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=s(this),a=n.is(".am-tabs")&&n||n.closest(".am-tabs"),r=a.data("amui.tabs"),l=s.extend({},o.utils.parseOptions(n.data("amTabs")),s.isPlainObject(t)&&t);r||a.data("amui.tabs",r=new c(a[0],l)),"string"==typeof t&&("open"===t&&n.is(".am-tabs-nav a")?r.open(n):e="function"==typeof r[t]?r[t].apply(r,i):r[t])}),void 0===e?this:e}var s=window.jQuery,o=t(2),a=t(30),r=o.support.transition,l=o.support.animation,c=function(t,e){this.$element=s(t),this.options=s.extend({},c.DEFAULTS,e||{}),this.transitioning=this.activeIndex=null,this.refresh(),this.init()};c.DEFAULTS={selector:{nav:"> .am-tabs-nav",content:"> .am-tabs-bd",panel:"> .am-tab-panel"},activeClass:"am-active"},c.prototype.refresh=function(){var t=this.options.selector;this.$tabNav=this.$element.find(t.nav),this.$navs=this.$tabNav.find("a"),this.$content=this.$element.find(t.content),this.$tabPanels=this.$content.find(t.panel);var e=this.$tabNav.find("> ."+this.options.activeClass);1!==e.length?this.open(0):this.activeIndex=this.$navs.index(e.children("a"))},c.prototype.init=function(){var t=this,e=this.options;if(this.$element.on("click.tabs.amui",e.selector.nav+" a",function(e){e.preventDefault(),t.open(s(this))}),!e.noSwipe){if(!this.$content.length)return this;

	var i=new a.Manager(this.$content[0]),n=new a.Swipe({direction:a.DIRECTION_HORIZONTAL});i.add(n),i.on("swipeleft",o.utils.debounce(function(e){e.preventDefault(),t.goTo("next")},100)),i.on("swiperight",o.utils.debounce(function(e){e.preventDefault(),t.goTo("prev")},100)),this._hammer=i}},c.prototype.open=function(t){var e=this.options.activeClass,i="number"==typeof t?t:this.$navs.index(s(t));if(t="number"==typeof t?this.$navs.eq(i):s(t),t&&t.length&&!this.transitioning&&!t.parent("li").hasClass(e)){var n=this.$tabNav,o=t.attr("href"),a=/^#.+$/,r=a.test(o)&&this.$content.find(o)||this.$tabPanels.eq(i),l=n.find("."+e+" a")[0],c=s.Event("open.tabs.amui",{relatedTarget:l});t.trigger(c),c.isDefaultPrevented()||(this.activate(t.closest("li"),n),this.activate(r,this.$content,function(){t.trigger({type:"opened.tabs.amui",relatedTarget:l})}),this.activeIndex=i)}},c.prototype.activate=function(t,e,i){this.transitioning=!0;var n=this.options.activeClass,o=e.find("> ."+n),a=i&&r&&!!o.length;o.removeClass(n+" am-in"),t.addClass(n),a?(t.redraw(),t.addClass("am-in")):t.removeClass("am-fade");var l=s.proxy(function(){i&&i(),this.transitioning=!1},this);a?o.one(r.end,l):l()},c.prototype.goTo=function(t){var e=this.activeIndex,i="next"===t,n=i?"am-animation-right-spring":"am-animation-left-spring";if(i&&e+1>=this.$navs.length||!i&&0===e){var s=this.$tabPanels.eq(e);l&&s.addClass(n).on(l.end,function(){s.removeClass(n)})}else this.open(i?e+1:e-1)},c.prototype.destroy=function(){this.$element.off(".tabs.amui"),a.off(this.$content[0],"swipeleft swiperight"),this._hammer&&this._hammer.destroy(),s.removeData(this.$element,"amui.tabs")},s.fn.tabs=n,o.ready(function(t){s("[data-am-tabs]",t).tabs()}),s(document).on("click.tabs.amui.data-api","[data-am-tabs] .am-tabs-nav a",function(t){t.preventDefault(),n.call(s(this),"open")}),e.exports=o.tabs=c},{2:2,30:30}],25:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){this.options=n.extend({},o.DEFAULTS,e),this.$element=n(t),this.init()};o.DEFAULTS={checkboxClass:"am-ucheck-checkbox",radioClass:"am-ucheck-radio",checkboxTpl:'<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>',radioTpl:'<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>'},o.prototype.init=function(){var t=this.$element,e=t[0],i=this.options;"checkbox"===e.type?t.addClass(i.checkboxClass).after(i.checkboxTpl):"radio"===e.type&&t.addClass(i.radioClass).after(i.radioTpl)},o.prototype.check=function(){this.$element.prop("checked",!0).trigger("change.ucheck.amui").trigger("checked.ucheck.amui")},o.prototype.uncheck=function(){this.$element.prop("checked",!1).trigger("change.ucheck.amui").trigger("unchecked.ucheck.amui")},o.prototype.toggle=function(){this.$element.prop("checked",function(t,e){return!e}).trigger("change.ucheck.amui").trigger("toggled.ucheck.amui")},o.prototype.disable=function(){this.$element.prop("disabled",!0).trigger("change.ucheck.amui").trigger("disabled.ucheck.amui")},o.prototype.enable=function(){this.$element.prop("disabled",!1),this.$element.trigger("change.ucheck.amui").trigger("enabled.ucheck.amui")},o.prototype.destroy=function(){this.$element.removeData("amui.ucheck").removeClass(this.options.checkboxClass+" "+this.options.radioClass).next(".am-ucheck-icons").remove().end().trigger("destroyed.ucheck.amui")},s.plugin("uCheck",o,{after:function(){s.support.touch&&this.parent().hover(function(){this.addClass("am-nohover")},function(){this.removeClass("am-nohover")})}}),s.ready(function(t){n("[data-am-ucheck]",t).uCheck()}),e.exports=o},{2:2}],26:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=function(t,e){this.options=n.extend({},o.DEFAULTS,e),this.options.patterns=n.extend({},o.patterns,this.options.patterns);var i=this.options.locales;!o.validationMessages[i]&&(this.options.locales="zh_CN"),this.$element=n(t),this.init()};o.DEFAULTS={debug:!1,locales:"zh_CN",H5validation:!1,H5inputType:["email","url","number"],patterns:{},patternClassPrefix:"js-pattern-",activeClass:"am-active",inValidClass:"am-field-error",validClass:"am-field-valid",validateOnSubmit:!0,allFields:":input:visible:not(:submit, :button, :disabled, .am-novalidate)",customEvents:"validate",keyboardFields:":input:not(:submit, :button, :disabled, .am-novalidate)",keyboardEvents:"focusout, change",activeKeyup:!1,textareaMaxlenthKeyup:!0,pointerFields:'input[type="range"]:not(:disabled, .am-novalidate), input[type="radio"]:not(:disabled, .am-novalidate), input[type="checkbox"]:not(:disabled, .am-novalidate), select:not(:disabled, .am-novalidate), option:not(:disabled, .am-novalidate)',pointerEvents:"click",onValid:function(t){},onInValid:function(t){},markValid:function(t){var e=this.options,i=n(t.field),s=i.closest(".am-form-group");i.addClass(e.validClass).removeClass(e.inValidClass),s.addClass("am-form-success").removeClass("am-form-error"),e.onValid.call(this,t)},markInValid:function(t){var e=this.options,i=n(t.field),s=i.closest(".am-form-group");i.addClass(e.inValidClass+" "+e.activeClass).removeClass(e.validClass),s.addClass("am-form-error").removeClass("am-form-success"),e.onInValid.call(this,t)},validate:function(t){},submit:null},o.VERSION="2.4.1",o.patterns={email:/^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,url:/^(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,dateISO:/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,integer:/^-?\d+$/},o.validationMessages={zh_CN:{valueMissing:"\u8bf7\u586b\u5199\uff08\u9009\u62e9\uff09\u6b64\u5b57\u6bb5",customError:{tooShort:"\u81f3\u5c11\u586b\u5199 %s \u4e2a\u5b57\u7b26",checkedOverflow:"\u81f3\u591a\u9009\u62e9 %s \u9879",checkedUnderflow:"\u81f3\u5c11\u9009\u62e9 %s \u9879"},patternMismatch:"\u8bf7\u6309\u7167\u8981\u6c42\u7684\u683c\u5f0f\u586b\u5199",rangeOverflow:"\u8bf7\u586b\u5199\u5c0f\u4e8e\u7b49\u4e8e %s \u7684\u503c",rangeUnderflow:"\u8bf7\u586b\u5199\u5927\u4e8e\u7b49\u4e8e %s \u7684\u503c",stepMismatch:"",tooLong:"\u81f3\u591a\u586b\u5199 %s \u4e2a\u5b57\u7b26",typeMismatch:"\u8bf7\u6309\u7167\u8981\u6c42\u7684\u7c7b\u578b\u586b\u5199"}},o.ERROR_MAP={tooShort:"minlength",checkedOverflow:"maxchecked",checkedUnderflow:"minchecked",rangeOverflow:"max",rangeUnderflow:"min",tooLong:"maxlength"},o.prototype.init=function(){function t(t){var e=t.toString();return e.substring(1,e.length-1)}function e(t,e,a){var r=e.split(","),l=function(t){i.validate(this)};a&&(l=s.utils.debounce(l,a)),n.each(r,function(e,i){o.on(i+".validator.amui",t,l)})}var i=this,o=this.$element,a=this.options;return a.H5validation&&s.support.formValidation?!1:(o.attr("novalidate","novalidate"),n.each(a.H5inputType,function(e,i){var n=o.find("input[type="+i+"]");n.attr("pattern")||n.is("[class*="+a.patternClassPrefix+"]")||n.attr("pattern",t(a.patterns[i]))}),n.each(a.patterns,function(e,i){var n=o.find("."+a.patternClassPrefix+e);!n.attr("pattern")&&n.attr("pattern",t(i))}),o.submit(function(t){if("function"==typeof a.submit)return a.submit.call(i,t);if(a.validateOnSubmit){var e=i.isFormValid();return"boolean"===n.type(e)?e:o.data("amui.checked")?!0:(n.when(e).then(function(){o.data("amui.checked",!0).submit()},function(){o.data("amui.checked",!1).find("."+a.inValidClass).eq(0).focus()}),!1)}}),e(":input",a.customEvents),e(a.keyboardFields,a.keyboardEvents),e(a.pointerFields,a.pointerEvents),a.textareaMaxlenthKeyup&&e("textarea[maxlength]","keyup",50),void(a.activeKeyup&&e(".am-active","keyup",50)))},o.prototype.isValid=function(t){var e=n(t);return void 0===e.data("validity")&&this.validate(t),e.data("validity")&&e.data("validity").valid},o.prototype.validate=function(t){var e=this,i=this.$element,s=this.options,o=n(t),a=o.data("equalTo");a&&o.attr("pattern","^"+i.find(a).val()+"$");var r=o.attr("pattern")||!1,l=new RegExp(r),c=null,u=null,h=o.is("[type=checkbox]")?(u=i.find('input[name="'+t.name+'"]')).filter(":checked").length:o.is("[type=radio]")?(c=this.$element.find('input[name="'+t.name+'"]')).filter(":checked").length>0:o.val();o=u&&u.length?u.first():o;var d=void 0!==o.attr("required")&&"false"!==o.attr("required"),p=parseInt(o.attr("maxlength"),10),m=parseInt(o.attr("minlength"),10),f=Number(o.attr("min")),v=Number(o.attr("max")),g=this.createValidity({field:o[0],valid:!0});if(s.debug&&window.console&&(console.log("Validate: value -> ["+h+", regex -> ["+l+"], required -> "+d),console.log("Regex test: "+l.test(h)+", Pattern: "+r)),!isNaN(p)&&h.length>p&&(g.valid=!1,g.tooLong=!0),!isNaN(m)&&h.length<m&&(g.valid=!1,g.customError="tooShort"),!isNaN(f)&&Number(h)<f&&(g.valid=!1,g.rangeUnderflow=!0),!isNaN(v)&&Number(h)>v&&(g.valid=!1,g.rangeOverflow=!0),d&&!h)g.valid=!1,g.valueMissing=!0;else if((u||o.is('select[multiple="multiple"]'))&&h){h=u?h:h.length;var w=parseInt(o.attr("minchecked"),10),y=parseInt(o.attr("maxchecked"),10);!isNaN(w)&&w>h&&(g.valid=!1,g.customError="checkedUnderflow"),!isNaN(y)&&h>y&&(g.valid=!1,g.customError="checkedOverflow")}else r&&!l.test(h)&&h&&(g.valid=!1,g.patternMismatch=!0);var b,T=function(t){this.markField(t),o.trigger("validated.field.validator.amui",t).data("validity",t);var i=c||u;return i&&i.not(o).data("validity",t).each(function(){t.field=this,e.markField(t)}),t};if("function"==typeof s.validate&&(b=s.validate.call(this,g)),b){var x=new n.Deferred;return o.data("amui.dfdValidity",x.promise()),n.when(b).always(function(t){x[t.valid?"resolve":"reject"](t),T.call(e,t)})}T.call(this,g)},o.prototype.markField=function(t){var e=this.options,i="mark"+(t.valid?"":"In")+"Valid";e[i]&&e[i].call(this,t)},o.prototype.validateForm=function(){var t=this,e=this.$element,i=this.options,s=e.find(i.allFields),o=[],a=!0,r=[],l=n([]),c=[],u=!1;e.trigger("validate.form.validator.amui");var h=s.filter(function(t){var e;if("INPUT"===this.tagName&&"radio"===this.type){if(e=this.name,o[e]===!0)return!1;o[e]=!0}return!0});h.each(function(){var i=n(this),s=t.isValid(this),o=i.data("validity");a=!!s&&a,r.push(o),s||(l=l.add(n(this),e));var h=i.data("amui.dfdValidity");if(h)c.push(h),u=!0;else{var d=new n.Deferred;c.push(d.promise()),d[s?"resolve":"reject"](o)}});var d={valid:a,$invalidFields:l,validity:r,promises:c,async:u};return e.trigger("validated.form.validator.amui",d),d},o.prototype.isFormValid=function(){var t=this,e=this.validateForm(),i=function(e){t.$element.trigger(e+".validator.amui")};if(e.async){var s=new n.Deferred;return n.when.apply(null,e.promises).then(function(){s.resolve(),i("valid")},function(){s.reject(),i("invalid")}),s.promise()}return e.valid?(i("valid"),!0):(e.$invalidFields.first().focus(),i("invalid"),!1)},o.prototype.createValidity=function(t){return n.extend({customError:t.customError||!1,patternMismatch:t.patternMismatch||!1,rangeOverflow:t.rangeOverflow||!1,rangeUnderflow:t.rangeUnderflow||!1,stepMismatch:t.stepMismatch||!1,tooLong:t.tooLong||!1,typeMismatch:t.typeMismatch||!1,valid:t.valid||!0,valueMissing:t.valueMissing||!1},t)},o.prototype.getValidationMessage=function(t){var e,i,s=o.validationMessages[this.options.locales],a="%s",r=n(t.field);return(r.is('[type="checkbox"]')||r.is('[type="radio"]'))&&(r=this.$element.find("[name="+r.attr("name")+"]").first()),n.each(t,function(t,i){return"field"===t||"valid"===t?t:"customError"===t&&i?(e=i,s=s.customError,!1):i===!0?(e=t,!1):void 0}),i=s[e]||void 0,i&&o.ERROR_MAP[e]&&(i=i.replace(a,r.attr(o.ERROR_MAP[e])||"\u89c4\u5b9a\u7684")),i},o.prototype.removeMark=function(){this.$element.find(".am-form-success, .am-form-error, .am-field-error").removeClass("am-form-success am-form-error am-field-error")},s.plugin("validator",o),s.ready(function(t){n("[data-am-validator]",t).validator()}),e.exports=o},{2:2}],27:[function(t,e,i){"use strict";var n=t(2),s={get:function(t){var e,i=encodeURIComponent(t)+"=",n=document.cookie.indexOf(i),s=null;return n>-1&&(e=document.cookie.indexOf(";",n),-1==e&&(e=document.cookie.length),s=decodeURIComponent(document.cookie.substring(n+i.length,e))),s},set:function(t,e,i,n,s,o){var a=encodeURIComponent(t)+"="+encodeURIComponent(e);i instanceof Date&&(a+="; expires="+i.toUTCString()),n&&(a+="; path="+n),s&&(a+="; domain="+s),o&&(a+="; secure"),document.cookie=a},unset:function(t,e,i,n){this.set(t,"",new Date(0),e,i,n)}};n.utils=n.utils||{},e.exports=n.utils.cookie=s},{2:2}],28:[function(t,e,i){"use strict";var n=t(2),s=function(){var t="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,e=function(){for(var t,e,i=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n=0,s=i.length,o={};s>n;n++)if(t=i[n],t&&t[1]in document){for(n=0,e=t.length;e>n;n++)o[i[0][n]]=t[n];return o}return!1}(),i={request:function(i){var n=e.requestFullscreen;i=i||document.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?i[n]():i[n](t&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){document[e.exitFullscreen]()},toggle:function(t){this.isFullscreen?this.exit():this.request(t)},raw:e};return e?(Object.defineProperties(i,{isFullscreen:{get:function(){return!!document[e.fullscreenElement]}},element:{enumerable:!0,get:function(){return document[e.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!document[e.fullscreenEnabled]}}}),i.VERSION="2.0.0",i):!1}();e.exports=n.fullscreen=s},{2:2}],29:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2);s.support.geolocation=window.navigator&&window.navigator.geolocation;var o=s.support.geolocation,a=function(t){this.options=t||{}};a.MESSAGES={unsupportedBrowser:"Browser does not support location services",permissionDenied:"You have rejected access to your location",positionUnavailable:"Unable to determine your location",timeout:"Service timeout has been reached"},a.ERROR_CODE={0:"unsupportedBrowser",1:"permissionDenied",2:"positionUnavailable",3:"timeout"},a.prototype.get=function(t){var e=this;t=n.extend({},this.options,t);var i=new n.Deferred;return o?this.watchID=o.getCurrentPosition(function(t){i.resolve.call(e,t)},function(t){i.reject(a.MESSAGES[a.ERROR_CODE[t.code]])},t):i.reject(a.MESSAGES.unsupportedBrowser),i.promise()},a.prototype.watch=function(t){if(o&&(t=n.extend({},this.options,t),n.isFunction(t.done))){this.clearWatch();var e=n.isFunction(t.fail)?t.fail:null;return this.watchID=o.watchPosition(t.done,e,t),this.watchID}},a.prototype.clearWatch=function(){o&&this.watchID&&(o.clearWatch(this.watchID),this.watchID=null)},e.exports=s.Geolocation=a},{2:2}],30:[function(t,e,i){"use strict";function n(t,e,i){return setTimeout(c(t,i),e)}function s(t,e,i){return Array.isArray(t)?(o(t,i[e],i),!0):!1}function o(t,e,i){var n;if(t)if(t.forEach)t.forEach(e,i);else if(void 0!==t.length)for(n=0;n<t.length;)e.call(i,t[n],n,t),n++;else for(n in t)t.hasOwnProperty(n)&&e.call(i,t[n],n,t)}function a(t,e,i){for(var n=Object.keys(e),s=0;s<n.length;)(!i||i&&void 0===t[n[s]])&&(t[n[s]]=e[n[s]]),s++;return t}function r(t,e){return a(t,e,!0)}function l(t,e,i){var n,s=e.prototype;n=t.prototype=Object.create(s),n.constructor=t,n._super=s,i&&a(n,i)}function c(t,e){return function(){return t.apply(e,arguments)}}function u(t,e){return typeof t==ht?t.apply(e?e[0]||void 0:void 0,e):t}function h(t,e){return void 0===t?e:t}function d(t,e,i){o(v(e),function(e){t.addEventListener(e,i,!1)})}function p(t,e,i){o(v(e),function(e){t.removeEventListener(e,i,!1)})}function m(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}function f(t,e){return t.indexOf(e)>-1}function v(t){return t.trim().split(/\s+/g)}function g(t,e,i){if(t.indexOf&&!i)return t.indexOf(e);for(var n=0;n<t.length;){if(i&&t[n][i]==e||!i&&t[n]===e)return n;n++}return-1}function w(t){return Array.prototype.slice.call(t,0)}function y(t,e,i){for(var n=[],s=[],o=0;o<t.length;){var a=e?t[o][e]:t[o];g(s,a)<0&&n.push(t[o]),s[o]=a,o++}return i&&(n=e?n.sort(function(t,i){return t[e]>i[e]}):n.sort()),n}function b(t,e){for(var i,n,s=e[0].toUpperCase()+e.slice(1),o=0;o<ct.length;){if(i=ct[o],n=i?i+s:e,n in t)return n;o++}return void 0}function T(){return ft++}function x(t){var e=t.ownerDocument;return e.defaultView||e.parentWindow}function C(t,e){var i=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){u(t.options.enable,[t])&&i.handler(e)},this.init()}function E(t){var e,i=t.options.inputClass;return new(e=i?i:wt?_:yt?W:gt?B:z)(t,S)}function S(t,e,i){var n=i.pointers.length,s=i.changedPointers.length,o=e&St&&n-s===0,a=e&(Dt|Ft)&&n-s===0;i.isFirst=!!o,i.isFinal=!!a,o&&(t.session={}),i.eventType=e,k(t,i),t.emit("hammer.input",i),t.recognize(i),t.session.prevInput=i}function k(t,e){var i=t.session,n=e.pointers,s=n.length;i.firstInput||(i.firstInput=A(e)),s>1&&!i.firstMultiple?i.firstMultiple=A(e):1===s&&(i.firstMultiple=!1);var o=i.firstInput,a=i.firstMultiple,r=a?a.center:o.center,l=e.center=M(n);e.timeStamp=mt(),e.deltaTime=e.timeStamp-o.timeStamp,e.angle=I(r,l),e.distance=N(r,l),D(i,e),e.offsetDirection=P(e.deltaX,e.deltaY),e.scale=a?L(a.pointers,n):1,e.rotation=a?O(a.pointers,n):0,F(i,e);var c=t.element;m(e.srcEvent.target,c)&&(c=e.srcEvent.target),e.target=c}function D(t,e){var i=e.center,n=t.offsetDelta||{},s=t.prevDelta||{},o=t.prevInput||{};(e.eventType===St||o.eventType===Dt)&&(s=t.prevDelta={x:o.deltaX||0,y:o.deltaY||0},n=t.offsetDelta={x:i.x,y:i.y}),e.deltaX=s.x+(i.x-n.x),e.deltaY=s.y+(i.y-n.y)}function F(t,e){var i,n,s,o,a=t.lastInterval||e,r=e.timeStamp-a.timeStamp;if(e.eventType!=Ft&&(r>Et||void 0===a.velocity)){var l=a.deltaX-e.deltaX,c=a.deltaY-e.deltaY,u=$(r,l,c);n=u.x,s=u.y,i=pt(u.x)>pt(u.y)?u.x:u.y,o=P(l,c),t.lastInterval=e}else i=a.velocity,n=a.velocityX,s=a.velocityY,o=a.direction;e.velocity=i,e.velocityX=n,e.velocityY=s,e.direction=o}function A(t){for(var e=[],i=0;i<t.pointers.length;)e[i]={clientX:dt(t.pointers[i].clientX),clientY:dt(t.pointers[i].clientY)},i++;return{timeStamp:mt(),pointers:e,center:M(e),deltaX:t.deltaX,deltaY:t.deltaY}}function M(t){var e=t.length;if(1===e)return{x:dt(t[0].clientX),y:dt(t[0].clientY)};for(var i=0,n=0,s=0;e>s;)i+=t[s].clientX,n+=t[s].clientY,s++;return{x:dt(i/e),y:dt(n/e)}}function $(t,e,i){return{x:e/t||0,y:i/t||0}}function P(t,e){return t===e?At:pt(t)>=pt(e)?t>0?Mt:$t:e>0?Pt:Nt}function N(t,e,i){i||(i=zt);var n=e[i[0]]-t[i[0]],s=e[i[1]]-t[i[1]];return Math.sqrt(n*n+s*s)}function I(t,e,i){i||(i=zt);var n=e[i[0]]-t[i[0]],s=e[i[1]]-t[i[1]];return 180*Math.atan2(s,n)/Math.PI}function O(t,e){return I(e[1],e[0],_t)-I(t[1],t[0],_t)}function L(t,e){return N(e[0],e[1],_t)/N(t[0],t[1],_t)}function z(){this.evEl=qt,this.evWin=Wt,this.allow=!0,this.pressed=!1,C.apply(this,arguments)}function _(){this.evEl=Ut,this.evWin=Vt,C.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function R(){this.evTarget=Xt,this.evWin=Yt,this.started=!1,C.apply(this,arguments)}function q(t,e){var i=w(t.touches),n=w(t.changedTouches);return e&(Dt|Ft)&&(i=y(i.concat(n),"identifier",!0)),[i,n]}function W(){this.evTarget=Qt,this.targetIds={},C.apply(this,arguments)}function H(t,e){var i=w(t.touches),n=this.targetIds;if(e&(St|kt)&&1===i.length)return n[i[0].identifier]=!0,[i,i];var s,o,a=w(t.changedTouches),r=[],l=this.target;if(o=i.filter(function(t){return m(t.target,l)}),e===St)for(s=0;s<o.length;)n[o[s].identifier]=!0,s++;for(s=0;s<a.length;)n[a[s].identifier]&&r.push(a[s]),e&(Dt|Ft)&&delete n[a[s].identifier],s++;return r.length?[y(o.concat(r),"identifier",!0),r]:void 0}function B(){C.apply(this,arguments);var t=c(this.handler,this);this.touch=new W(this.manager,t),this.mouse=new z(this.manager,t)}function U(t,e){this.manager=t,this.set(e)}function V(t){if(f(t,ie))return ie;var e=f(t,ne),i=f(t,se);return e&&i?ne+" "+se:e||i?e?ne:se:f(t,ee)?ee:te}function j(t){this.id=T(),this.manager=null,this.options=r(t||{},this.defaults),this.options.enable=h(this.options.enable,!0),this.state=oe,this.simultaneous={},this.requireFail=[]}function X(t){return t&ue?"cancel":t&le?"end":t&re?"move":t&ae?"start":""}function Y(t){return t==Nt?"down":t==Pt?"up":t==Mt?"left":t==$t?"right":""}function Z(t,e){var i=e.manager;return i?i.get(t):t}function Q(){j.apply(this,arguments)}function G(){Q.apply(this,arguments),this.pX=null,this.pY=null}function J(){Q.apply(this,arguments)}function K(){j.apply(this,arguments),this._timer=null,this._input=null}function tt(){Q.apply(this,arguments)}function et(){Q.apply(this,arguments)}function it(){j.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function nt(t,e){return e=e||{},e.recognizers=h(e.recognizers,nt.defaults.preset),new st(t,e)}function st(t,e){e=e||{},this.options=r(e,nt.defaults),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.element=t,this.input=E(this),this.touchAction=new U(this,this.options.touchAction),ot(this,!0),o(e.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}function ot(t,e){var i=t.element;o(t.options.cssProps,function(t,n){i.style[b(i.style,n)]=e?t:""})}function at(t,e){var i=document.createEvent("Event");i.initEvent(t,!0,!0),i.gesture=e,e.target.dispatchEvent(i)}var rt=window.jQuery,lt=t(2),ct=["","webkit","moz","MS","ms","o"],ut=document.createElement("div"),ht="function",dt=Math.round,pt=Math.abs,mt=Date.now,ft=1,vt=/mobile|tablet|ip(ad|hone|od)|android/i,gt="ontouchstart"in window,wt=void 0!==b(window,"PointerEvent"),yt=gt&&vt.test(navigator.userAgent),bt="touch",Tt="pen",xt="mouse",Ct="kinect",Et=25,St=1,kt=2,Dt=4,Ft=8,At=1,Mt=2,$t=4,Pt=8,Nt=16,It=Mt|$t,Ot=Pt|Nt,Lt=It|Ot,zt=["x","y"],_t=["clientX","clientY"];C.prototype={handler:function(){},init:function(){this.evEl&&d(this.element,this.evEl,this.domHandler),this.evTarget&&d(this.target,this.evTarget,this.domHandler),this.evWin&&d(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&p(this.element,this.evEl,this.domHandler),this.evTarget&&p(this.target,this.evTarget,this.domHandler),this.evWin&&p(x(this.element),this.evWin,this.domHandler)}};var Rt={mousedown:St,mousemove:kt,mouseup:Dt},qt="mousedown",Wt="mousemove mouseup";l(z,C,{handler:function(t){var e=Rt[t.type];e&St&&0===t.button&&(this.pressed=!0),e&kt&&1!==t.which&&(e=Dt),this.pressed&&this.allow&&(e&Dt&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:xt,srcEvent:t}))}});var Ht={pointerdown:St,pointermove:kt,pointerup:Dt,pointercancel:Ft,pointerout:Ft},Bt={2:bt,3:Tt,4:xt,5:Ct},Ut="pointerdown",Vt="pointermove pointerup pointercancel";window.MSPointerEvent&&(Ut="MSPointerDown",Vt="MSPointerMove MSPointerUp MSPointerCancel"),l(_,C,{handler:function(t){var e=this.store,i=!1,n=t.type.toLowerCase().replace("ms",""),s=Ht[n],o=Bt[t.pointerType]||t.pointerType,a=o==bt,r=g(e,t.pointerId,"pointerId");s&St&&(0===t.button||a)?0>r&&(e.push(t),r=e.length-1):s&(Dt|Ft)&&(i=!0),0>r||(e[r]=t,this.callback(this.manager,s,{pointers:e,changedPointers:[t],pointerType:o,srcEvent:t}),i&&e.splice(r,1))}});var jt={touchstart:St,touchmove:kt,touchend:Dt,touchcancel:Ft},Xt="touchstart",Yt="touchstart touchmove touchend touchcancel";l(R,C,{handler:function(t){var e=jt[t.type];if(e===St&&(this.started=!0),this.started){var i=q.call(this,t,e);e&(Dt|Ft)&&i[0].length-i[1].length===0&&(this.started=!1),this.callback(this.manager,e,{pointers:i[0],changedPointers:i[1],pointerType:bt,srcEvent:t})}}});var Zt={touchstart:St,touchmove:kt,touchend:Dt,touchcancel:Ft},Qt="touchstart touchmove touchend touchcancel";l(W,C,{handler:function(t){var e=Zt[t.type],i=H.call(this,t,e);i&&this.callback(this.manager,e,{pointers:i[0],changedPointers:i[1],pointerType:bt,srcEvent:t})}}),l(B,C,{handler:function(t,e,i){var n=i.pointerType==bt,s=i.pointerType==xt;if(n)this.mouse.allow=!1;else if(s&&!this.mouse.allow)return;e&(Dt|Ft)&&(this.mouse.allow=!0),this.callback(t,e,i)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Gt=b(ut.style,"touchAction"),Jt=void 0!==Gt,Kt="compute",te="auto",ee="manipulation",ie="none",ne="pan-x",se="pan-y";U.prototype={set:function(t){t==Kt&&(t=this.compute()),Jt&&(this.manager.element.style[Gt]=t),this.actions=t.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var t=[];return o(this.manager.recognizers,function(e){u(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),V(t.join(" "))},preventDefaults:function(t){if(!Jt){var e=t.srcEvent,i=t.offsetDirection;if(this.manager.session.prevented)return void e.preventDefault();var n=this.actions,s=f(n,ie),o=f(n,se),a=f(n,ne);return s||o&&i&It||a&&i&Ot?this.preventSrc(e):void 0}},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}};var oe=1,ae=2,re=4,le=8,ce=le,ue=16,he=32;j.prototype={defaults:{},set:function(t){return a(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(s(t,"recognizeWith",this))return this;var e=this.simultaneous;return t=Z(t,this),e[t.id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return s(t,"dropRecognizeWith",this)?this:(t=Z(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(s(t,"requireFailure",this))return this;var e=this.requireFail;return t=Z(t,this),-1===g(e,t)&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(s(t,"dropRequireFailure",this))return this;t=Z(t,this);var e=g(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return!!this.simultaneous[t.id]},emit:function(t){function e(e){i.manager.emit(i.options.event+(e?X(n):""),t)}var i=this,n=this.state;le>n&&e(!0),e(),n>=le&&e(!0)},tryEmit:function(t){return this.canEmit()?this.emit(t):void(this.state=he)},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(this.requireFail[t].state&(he|oe)))return!1;t++}return!0},recognize:function(t){var e=a({},t);return u(this.options.enable,[this,e])?(this.state&(ce|ue|he)&&(this.state=oe),this.state=this.process(e),void(this.state&(ae|re|le|ue)&&this.tryEmit(e))):(this.reset(),void(this.state=he))},process:function(t){},getTouchAction:function(){},reset:function(){}},l(Q,j,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,i=t.eventType,n=e&(ae|re),s=this.attrTest(t);return n&&(i&Ft||!s)?e|ue:n||s?i&Dt?e|le:e&ae?e|re:ae:he}}),l(G,Q,{defaults:{event:"pan",threshold:10,pointers:1,direction:Lt},getTouchAction:function(){var t=this.options.direction,e=[];return t&It&&e.push(se),t&Ot&&e.push(ne),e},directionTest:function(t){var e=this.options,i=!0,n=t.distance,s=t.direction,o=t.deltaX,a=t.deltaY;return s&e.direction||(e.direction&It?(s=0===o?At:0>o?Mt:$t,i=o!=this.pX,n=Math.abs(t.deltaX)):(s=0===a?At:0>a?Pt:Nt,i=a!=this.pY,n=Math.abs(t.deltaY))),t.direction=s,i&&n>e.threshold&&s&e.direction},attrTest:function(t){return Q.prototype.attrTest.call(this,t)&&(this.state&ae||!(this.state&ae)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=Y(t.direction);e&&this.manager.emit(this.options.event+e,t),this._super.emit.call(this,t)}}),l(J,Q,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[ie]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||this.state&ae)},emit:function(t){if(this._super.emit.call(this,t),1!==t.scale){var e=t.scale<1?"in":"out";this.manager.emit(this.options.event+e,t)}}}),l(K,j,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[te]},process:function(t){var e=this.options,i=t.pointers.length===e.pointers,s=t.distance<e.threshold,o=t.deltaTime>e.time;if(this._input=t,!s||!i||t.eventType&(Dt|Ft)&&!o)this.reset();else if(t.eventType&St)this.reset(),this._timer=n(function(){this.state=ce,this.tryEmit()},e.time,this);else if(t.eventType&Dt)return ce;return he},reset:function(){clearTimeout(this._timer)},emit:function(t){this.state===ce&&(t&&t.eventType&Dt?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=mt(),this.manager.emit(this.options.event,this._input)))}}),l(tt,Q,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[ie]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||this.state&ae)}}),l(et,Q,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:It|Ot,pointers:1},getTouchAction:function(){return G.prototype.getTouchAction.call(this)},attrTest:function(t){var e,i=this.options.direction;return i&(It|Ot)?e=t.velocity:i&It?e=t.velocityX:i&Ot&&(e=t.velocityY),this._super.attrTest.call(this,t)&&i&t.direction&&t.distance>this.options.threshold&&pt(e)>this.options.velocity&&t.eventType&Dt},emit:function(t){var e=Y(t.direction);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),l(it,j,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ee]},process:function(t){var e=this.options,i=t.pointers.length===e.pointers,s=t.distance<e.threshold,o=t.deltaTime<e.time;if(this.reset(),t.eventType&St&&0===this.count)return this.failTimeout();if(s&&o&&i){if(t.eventType!=Dt)return this.failTimeout();var a=this.pTime?t.timeStamp-this.pTime<e.interval:!0,r=!this.pCenter||N(this.pCenter,t.center)<e.posThreshold;

	this.pTime=t.timeStamp,this.pCenter=t.center,r&&a?this.count+=1:this.count=1,this._input=t;var l=this.count%e.taps;if(0===l)return this.hasRequireFailures()?(this._timer=n(function(){this.state=ce,this.tryEmit()},e.interval,this),ae):ce}return he},failTimeout:function(){return this._timer=n(function(){this.state=he},this.options.interval,this),he},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ce&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),nt.VERSION="2.0.4",nt.defaults={domEvents:!1,touchAction:Kt,enable:!0,inputTarget:null,inputClass:null,preset:[[tt,{enable:!1}],[J,{enable:!1},["rotate"]],[et,{direction:It}],[G,{direction:It},["swipe"]],[it],[it,{event:"doubletap",taps:2},["tap"]],[K]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var de=1,pe=2;st.prototype={set:function(t){return a(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?pe:de},recognize:function(t){var e=this.session;if(!e.stopped){this.touchAction.preventDefaults(t);var i,n=this.recognizers,s=e.curRecognizer;(!s||s&&s.state&ce)&&(s=e.curRecognizer=null);for(var o=0;o<n.length;)i=n[o],e.stopped===pe||s&&i!=s&&!i.canRecognizeWith(s)?i.reset():i.recognize(t),!s&&i.state&(ae|re|le)&&(s=e.curRecognizer=i),o++}},get:function(t){if(t instanceof j)return t;for(var e=this.recognizers,i=0;i<e.length;i++)if(e[i].options.event==t)return e[i];return null},add:function(t){if(s(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(s(t,"remove",this))return this;var e=this.recognizers;return t=this.get(t),e.splice(g(e,t),1),this.touchAction.update(),this},on:function(t,e){var i=this.handlers;return o(v(t),function(t){i[t]=i[t]||[],i[t].push(e)}),this},off:function(t,e){var i=this.handlers;return o(v(t),function(t){e?i[t].splice(g(i[t],e),1):delete i[t]}),this},emit:function(t,e){this.options.domEvents&&at(t,e);var i=this.handlers[t]&&this.handlers[t].slice();if(i&&i.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var n=0;n<i.length;)i[n](e),n++}},destroy:function(){this.element&&ot(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},a(nt,{INPUT_START:St,INPUT_MOVE:kt,INPUT_END:Dt,INPUT_CANCEL:Ft,STATE_POSSIBLE:oe,STATE_BEGAN:ae,STATE_CHANGED:re,STATE_ENDED:le,STATE_RECOGNIZED:ce,STATE_CANCELLED:ue,STATE_FAILED:he,DIRECTION_NONE:At,DIRECTION_LEFT:Mt,DIRECTION_RIGHT:$t,DIRECTION_UP:Pt,DIRECTION_DOWN:Nt,DIRECTION_HORIZONTAL:It,DIRECTION_VERTICAL:Ot,DIRECTION_ALL:Lt,Manager:st,Input:C,TouchAction:U,TouchInput:W,MouseInput:z,PointerEventInput:_,TouchMouseInput:B,SingleTouchInput:R,Recognizer:j,AttrRecognizer:Q,Tap:it,Pan:G,Swipe:et,Pinch:J,Rotate:tt,Press:K,on:d,off:p,each:o,merge:r,extend:a,inherit:l,bindFn:c,prefixed:b}),function(t,e){function i(i,n){var s=t(i);s.data("hammer")||s.data("hammer",new e(s[0],n))}t.fn.hammer=function(t){return this.each(function(){i(this,t)})},e.Manager.prototype.emit=function(e){return function(i,n){e.call(this,i,n),t(this.element).trigger({type:i,gesture:n})}}(e.Manager.prototype.emit)}(rt,nt),e.exports=lt.Hammer=nt},{2:2}],31:[function(t,e,i){function n(t){return 128>t?[t]:2048>t?(c0=192+(t>>6),c1=128+(63&t),[c0,c1]):(c0=224+(t>>12),c1=128+(t>>6&63),c2=128+(63&t),[c0,c1,c2])}function s(t){for(var e=[],i=0;i<t.length;i++)for(var s=t.charCodeAt(i),o=n(s),a=0;a<o.length;a++)e.push(o[a]);return e}function o(t,e){this.typeNumber=-1,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.rsBlocks=null,this.totalDataCount=-1,this.data=t,this.utf8bytes=s(t),this.make()}function a(t,e){if(void 0==t.length)throw new Error(t.length+"/"+e);for(var i=0;i<t.length&&0==t[i];)i++;this.num=new Array(t.length-i+e);for(var n=0;n<t.length-i;n++)this.num[n]=t[n+i]}function r(){this.buffer=new Array,this.length=0}function n(t){return 128>t?[t]:2048>t?(c0=192+(t>>6),c1=128+(63&t),[c0,c1]):(c0=224+(t>>12),c1=128+(t>>6&63),c2=128+(63&t),[c0,c1,c2])}function s(t){for(var e=[],i=0;i<t.length;i++)for(var s=t.charCodeAt(i),o=n(s),a=0;a<o.length;a++)e.push(o[a]);return e}function o(t,e){this.typeNumber=-1,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.rsBlocks=null,this.totalDataCount=-1,this.data=t,this.utf8bytes=s(t),this.make()}function a(t,e){if(void 0==t.length)throw new Error(t.length+"/"+e);for(var i=0;i<t.length&&0==t[i];)i++;this.num=new Array(t.length-i+e);for(var n=0;n<t.length-i;n++)this.num[n]=t[n+i]}function r(){this.buffer=new Array,this.length=0}var c=window.jQuery,u=t(2),h=[],d=function(t){"string"==typeof t&&(t={text:t}),this.options=c.extend({},{text:"",render:"",width:256,height:256,correctLevel:3,background:"#ffffff",foreground:"#000000"},t);for(var e=null,i=0,n=h.length;n>i;i++)if(h[i].text==this.options.text&&h[i].text.correctLevel==this.options.correctLevel){e=h[i].obj;break}if(i==n&&(e=new o(this.options.text,this.options.correctLevel),h.push({text:this.options.text,correctLevel:this.options.correctLevel,obj:e})),this.options.render)switch(this.options.render){case"canvas":return this.createCanvas(e);case"table":return this.createTable(e);case"svg":return this.createSVG(e);default:return this.createDefault(e)}return this.createDefault(e)};d.prototype.createDefault=function(t){var e=document.createElement("canvas");return e.getContext?this.createCanvas(t):document.createElementNS&&document.createElementNS(SVG_NS,"svg").createSVGRect?this.createSVG(t):this.createTable(t)},d.prototype.createCanvas=function(t){var e=document.createElement("canvas");e.width=this.options.width,e.height=this.options.height;for(var i=e.getContext("2d"),n=(this.options.width/t.getModuleCount()).toPrecision(4),s=this.options.height/t.getModuleCount().toPrecision(4),o=0;o<t.getModuleCount();o++)for(var a=0;a<t.getModuleCount();a++){i.fillStyle=t.modules[o][a]?this.options.foreground:this.options.background;var r=Math.ceil((a+1)*n)-Math.floor(a*n),l=Math.ceil((o+1)*n)-Math.floor(o*n);i.fillRect(Math.round(a*n),Math.round(o*s),r,l)}return e},d.prototype.createTable=function(t){var e=[];e.push('<table style="border:0px; margin:0px; padding:0px; border-collapse:collapse; background-color: '+this.options.background+';">');var i=-1,n=-1,s=-1,o=-1;i=s=Math.floor(this.options.width/t.getModuleCount()),n=o=Math.floor(this.options.height/t.getModuleCount()),0>=s&&(i=t.getModuleCount()<80?2:1),0>=o&&(n=t.getModuleCount()<80?2:1),foreTd='<td style="border:0px; margin:0px; padding:0px; width:'+i+"px; background-color: "+this.options.foreground+'"></td>',backTd='<td style="border:0px; margin:0px; padding:0px; width:'+i+"px; background-color: "+this.options.background+'"></td>',l=t.getModuleCount();for(var a=0;a<l;a++){e.push('<tr style="border:0px; margin:0px; padding:0px; height: '+n+'px">');for(var r=0;r<l;r++)e.push(t.modules[a][r]?foreTd:backTd);e.push("</tr>")}e.push("</table>");var c=document.createElement("span");return c.innerHTML=e.join(""),c.firstChild},d.prototype.createSVG=function(t){for(var e,i,n,s,o=t.getModuleCount(),a=this.options.height/this.options.width,r='<svg xmlns="http://www.w3.org/2000/svg" width="'+this.options.width+'px" height="'+this.options.height+'px" viewbox="0 0 '+10*o+" "+10*o*a+'">',l="<path ",u=' style="stroke-width:0.5;stroke:'+this.options.foreground+";fill:"+this.options.foreground+';"></path>',h=' style="stroke-width:0.5;stroke:'+this.options.background+";fill:"+this.options.background+';"></path>',d=0;o>d;d++)for(var p=0;o>p;p++)e=10*p,n=10*d*a,i=10*(p+1),s=10*(d+1)*a,r+=l+'d="M '+e+","+n+" L "+i+","+n+" L "+i+","+s+" L "+e+","+s+' Z"',r+=t.modules[d][p]?u:h;return r+="</svg>",c(r)[0]},o.prototype={constructor:o,getModuleCount:function(){return this.moduleCount},make:function(){this.getRightType(),this.dataCache=this.createData(),this.createQrcode()},makeImpl:function(t){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[e]=new Array(this.moduleCount);this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(!0,t),this.typeNumber>=7&&this.setupTypeNumber(!0),this.mapData(this.dataCache,t)},setupPositionProbePattern:function(t,e){for(var i=-1;7>=i;i++)if(!(-1>=t+i||this.moduleCount<=t+i))for(var n=-1;7>=n;n++)-1>=e+n||this.moduleCount<=e+n||(this.modules[t+i][e+n]=i>=0&&6>=i&&(0==n||6==n)||n>=0&&6>=n&&(0==i||6==i)||i>=2&&4>=i&&n>=2&&4>=n?!0:!1)},createQrcode:function(){for(var t=0,e=0,i=null,n=0;8>n;n++){this.makeImpl(n);var s=f.getLostPoint(this);(0==n||t>s)&&(t=s,e=n,i=this.modules)}this.modules=i,this.setupTypeInfo(!1,e),this.typeNumber>=7&&this.setupTypeNumber(!1)},setupTimingPattern:function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0,null==this.modules[6][t]&&(this.modules[6][t]=t%2==0))},setupPositionAdjustPattern:function(){for(var t=f.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var i=0;i<t.length;i++){var n=t[e],s=t[i];if(null==this.modules[n][s])for(var o=-2;2>=o;o++)for(var a=-2;2>=a;a++)this.modules[n+o][s+a]=-2==o||2==o||-2==a||2==a||0==o&&0==a?!0:!1}},setupTypeNumber:function(t){for(var e=f.getBCHTypeNumber(this.typeNumber),i=0;18>i;i++){var n=!t&&1==(e>>i&1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=n,this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=n}},setupTypeInfo:function(t,e){for(var i=p[this.errorCorrectLevel]<<3|e,n=f.getBCHTypeInfo(i),s=0;15>s;s++){var o=!t&&1==(n>>s&1);6>s?this.modules[s][8]=o:8>s?this.modules[s+1][8]=o:this.modules[this.moduleCount-15+s][8]=o;var o=!t&&1==(n>>s&1);8>s?this.modules[8][this.moduleCount-s-1]=o:9>s?this.modules[8][15-s-1+1]=o:this.modules[8][15-s-1]=o}this.modules[this.moduleCount-8][8]=!t},createData:function(){var t=new r,e=this.typeNumber>9?16:8;t.put(4,4),t.put(this.utf8bytes.length,e);for(var i=0,n=this.utf8bytes.length;n>i;i++)t.put(this.utf8bytes[i],8);for(t.length+4<=8*this.totalDataCount&&t.put(0,4);t.length%8!=0;)t.putBit(!1);for(;;){if(t.length>=8*this.totalDataCount)break;if(t.put(o.PAD0,8),t.length>=8*this.totalDataCount)break;t.put(o.PAD1,8)}return this.createBytes(t)},createBytes:function(t){for(var e=0,i=0,n=0,s=this.rsBlock.length/3,o=new Array,r=0;s>r;r++)for(var l=this.rsBlock[3*r+0],c=this.rsBlock[3*r+1],u=this.rsBlock[3*r+2],h=0;l>h;h++)o.push([u,c]);for(var d=new Array(o.length),p=new Array(o.length),m=0;m<o.length;m++){var v=o[m][0],g=o[m][1]-v;i=Math.max(i,v),n=Math.max(n,g),d[m]=new Array(v);for(var r=0;r<d[m].length;r++)d[m][r]=255&t.buffer[r+e];e+=v;var w=f.getErrorCorrectPolynomial(g),y=new a(d[m],w.getLength()-1),b=y.mod(w);p[m]=new Array(w.getLength()-1);for(var r=0;r<p[m].length;r++){var T=r+b.getLength()-p[m].length;p[m][r]=T>=0?b.get(T):0}}for(var x=new Array(this.totalDataCount),C=0,r=0;i>r;r++)for(var m=0;m<o.length;m++)r<d[m].length&&(x[C++]=d[m][r]);for(var r=0;n>r;r++)for(var m=0;m<o.length;m++)r<p[m].length&&(x[C++]=p[m][r]);return x},mapData:function(t,e){for(var i=-1,n=this.moduleCount-1,s=7,o=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var r=0;2>r;r++)if(null==this.modules[n][a-r]){var l=!1;o<t.length&&(l=1==(t[o]>>>s&1));var c=f.getMask(e,n,a-r);c&&(l=!l),this.modules[n][a-r]=l,s--,-1==s&&(o++,s=7)}if(n+=i,0>n||this.moduleCount<=n){n-=i,i=-i;break}}}},o.PAD0=236,o.PAD1=17;for(var p=[1,0,3,2],m={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;f.getBCHDigit(e)-f.getBCHDigit(f.G15)>=0;)e^=f.G15<<f.getBCHDigit(e)-f.getBCHDigit(f.G15);return(t<<10|e)^f.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;f.getBCHDigit(e)-f.getBCHDigit(f.G18)>=0;)e^=f.G18<<f.getBCHDigit(e)-f.getBCHDigit(f.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return f.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,i){switch(t){case m.PATTERN000:return(e+i)%2==0;case m.PATTERN001:return e%2==0;case m.PATTERN010:return i%3==0;case m.PATTERN011:return(e+i)%3==0;case m.PATTERN100:return(Math.floor(e/2)+Math.floor(i/3))%2==0;case m.PATTERN101:return e*i%2+e*i%3==0;case m.PATTERN110:return(e*i%2+e*i%3)%2==0;case m.PATTERN111:return(e*i%3+(e+i)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new a([1],0),i=0;t>i;i++)e=e.multiply(new a([1,v.gexp(i)],0));return e},getLostPoint:function(t){for(var e=t.getModuleCount(),i=0,n=0,s=0;e>s;s++)for(var o=0,a=t.modules[s][0],r=0;e>r;r++){var l=t.modules[s][r];if(e-6>r&&l&&!t.modules[s][r+1]&&t.modules[s][r+2]&&t.modules[s][r+3]&&t.modules[s][r+4]&&!t.modules[s][r+5]&&t.modules[s][r+6]&&(e-10>r?t.modules[s][r+7]&&t.modules[s][r+8]&&t.modules[s][r+9]&&t.modules[s][r+10]&&(i+=40):r>3&&t.modules[s][r-1]&&t.modules[s][r-2]&&t.modules[s][r-3]&&t.modules[s][r-4]&&(i+=40)),e-1>s&&e-1>r){var c=0;l&&c++,t.modules[s+1][r]&&c++,t.modules[s][r+1]&&c++,t.modules[s+1][r+1]&&c++,(0==c||4==c)&&(i+=3)}a^l?o++:(a=l,o>=5&&(i+=3+o-5),o=1),l&&n++}for(var r=0;e>r;r++)for(var o=0,a=t.modules[0][r],s=0;e>s;s++){var l=t.modules[s][r];e-6>s&&l&&!t.modules[s+1][r]&&t.modules[s+2][r]&&t.modules[s+3][r]&&t.modules[s+4][r]&&!t.modules[s+5][r]&&t.modules[s+6][r]&&(e-10>s?t.modules[s+7][r]&&t.modules[s+8][r]&&t.modules[s+9][r]&&t.modules[s+10][r]&&(i+=40):s>3&&t.modules[s-1][r]&&t.modules[s-2][r]&&t.modules[s-3][r]&&t.modules[s-4][r]&&(i+=40)),a^l?o++:(a=l,o>=5&&(i+=3+o-5),o=1)}var u=Math.abs(100*n/e/e-50)/5;return i+=10*u}},v={glog:function(t){if(1>t)throw new Error("glog("+t+")");return v.LOG_TABLE[t]},gexp:function(t){for(;0>t;)t+=255;for(;t>=256;)t-=255;return v.EXP_TABLE[t]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},g=0;8>g;g++)v.EXP_TABLE[g]=1<<g;for(var g=8;256>g;g++)v.EXP_TABLE[g]=v.EXP_TABLE[g-4]^v.EXP_TABLE[g-5]^v.EXP_TABLE[g-6]^v.EXP_TABLE[g-8];for(var g=0;255>g;g++)v.LOG_TABLE[v.EXP_TABLE[g]]=g;a.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=new Array(this.getLength()+t.getLength()-1),i=0;i<this.getLength();i++)for(var n=0;n<t.getLength();n++)e[i+n]^=v.gexp(v.glog(this.get(i))+v.glog(t.get(n)));return new a(e,0)},mod:function(t){var e=this.getLength(),i=t.getLength();if(0>e-i)return this;for(var n=new Array(e),s=0;e>s;s++)n[s]=this.get(s);for(;n.length>=i;){for(var o=v.glog(n[0])-v.glog(t.get(0)),s=0;s<t.getLength();s++)n[s]^=v.gexp(v.glog(t.get(s))+o);for(;0==n[0];)n.shift()}return new a(n,0)}};var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];o.prototype.getRightType=function(){for(var t=1;41>t;t++){var e=w[4*(t-1)+this.errorCorrectLevel];if(void 0==e)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+this.errorCorrectLevel);for(var i=e.length/3,n=0,s=0;i>s;s++){var o=e[3*s+0],a=e[3*s+2];n+=a*o}var r=t>9?2:1;if(this.utf8bytes.length+r<n||40==t){this.typeNumber=t,this.rsBlock=e,this.totalDataCount=n;break}}},r.prototype={get:function(t){var e=Math.floor(t/8);return this.buffer[e]>>>7-t%8&1},put:function(t,e){for(var i=0;e>i;i++)this.putBit(t>>>e-i-1&1)},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},o.prototype={constructor:o,getModuleCount:function(){return this.moduleCount},make:function(){this.getRightType(),this.dataCache=this.createData(),this.createQrcode()},makeImpl:function(t){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[e]=new Array(this.moduleCount);this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(!0,t),this.typeNumber>=7&&this.setupTypeNumber(!0),this.mapData(this.dataCache,t)},setupPositionProbePattern:function(t,e){for(var i=-1;7>=i;i++)if(!(-1>=t+i||this.moduleCount<=t+i))for(var n=-1;7>=n;n++)-1>=e+n||this.moduleCount<=e+n||(this.modules[t+i][e+n]=i>=0&&6>=i&&(0==n||6==n)||n>=0&&6>=n&&(0==i||6==i)||i>=2&&4>=i&&n>=2&&4>=n?!0:!1)},createQrcode:function(){for(var t=0,e=0,i=null,n=0;8>n;n++){this.makeImpl(n);var s=f.getLostPoint(this);(0==n||t>s)&&(t=s,e=n,i=this.modules)}this.modules=i,this.setupTypeInfo(!1,e),this.typeNumber>=7&&this.setupTypeNumber(!1)},setupTimingPattern:function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0,null==this.modules[6][t]&&(this.modules[6][t]=t%2==0))},setupPositionAdjustPattern:function(){for(var t=f.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var i=0;i<t.length;i++){var n=t[e],s=t[i];if(null==this.modules[n][s])for(var o=-2;2>=o;o++)for(var a=-2;2>=a;a++)this.modules[n+o][s+a]=-2==o||2==o||-2==a||2==a||0==o&&0==a?!0:!1}},setupTypeNumber:function(t){for(var e=f.getBCHTypeNumber(this.typeNumber),i=0;18>i;i++){var n=!t&&1==(e>>i&1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=n,this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=n}},setupTypeInfo:function(t,e){for(var i=p[this.errorCorrectLevel]<<3|e,n=f.getBCHTypeInfo(i),s=0;15>s;s++){var o=!t&&1==(n>>s&1);6>s?this.modules[s][8]=o:8>s?this.modules[s+1][8]=o:this.modules[this.moduleCount-15+s][8]=o;var o=!t&&1==(n>>s&1);8>s?this.modules[8][this.moduleCount-s-1]=o:9>s?this.modules[8][15-s-1+1]=o:this.modules[8][15-s-1]=o}this.modules[this.moduleCount-8][8]=!t},createData:function(){var t=new r,e=this.typeNumber>9?16:8;t.put(4,4),t.put(this.utf8bytes.length,e);for(var i=0,n=this.utf8bytes.length;n>i;i++)t.put(this.utf8bytes[i],8);for(t.length+4<=8*this.totalDataCount&&t.put(0,4);t.length%8!=0;)t.putBit(!1);for(;;){if(t.length>=8*this.totalDataCount)break;if(t.put(o.PAD0,8),t.length>=8*this.totalDataCount)break;t.put(o.PAD1,8)}return this.createBytes(t)},createBytes:function(t){for(var e=0,i=0,n=0,s=this.rsBlock.length/3,o=new Array,r=0;s>r;r++)for(var l=this.rsBlock[3*r+0],c=this.rsBlock[3*r+1],u=this.rsBlock[3*r+2],h=0;l>h;h++)o.push([u,c]);for(var d=new Array(o.length),p=new Array(o.length),m=0;m<o.length;m++){var v=o[m][0],g=o[m][1]-v;i=Math.max(i,v),n=Math.max(n,g),d[m]=new Array(v);for(var r=0;r<d[m].length;r++)d[m][r]=255&t.buffer[r+e];e+=v;var w=f.getErrorCorrectPolynomial(g),y=new a(d[m],w.getLength()-1),b=y.mod(w);p[m]=new Array(w.getLength()-1);for(var r=0;r<p[m].length;r++){var T=r+b.getLength()-p[m].length;p[m][r]=T>=0?b.get(T):0}}for(var x=new Array(this.totalDataCount),C=0,r=0;i>r;r++)for(var m=0;m<o.length;m++)r<d[m].length&&(x[C++]=d[m][r]);for(var r=0;n>r;r++)for(var m=0;m<o.length;m++)r<p[m].length&&(x[C++]=p[m][r]);return x},mapData:function(t,e){for(var i=-1,n=this.moduleCount-1,s=7,o=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var r=0;2>r;r++)if(null==this.modules[n][a-r]){var l=!1;o<t.length&&(l=1==(t[o]>>>s&1));var c=f.getMask(e,n,a-r);c&&(l=!l),this.modules[n][a-r]=l,s--,-1==s&&(o++,s=7)}if(n+=i,0>n||this.moduleCount<=n){n-=i,i=-i;break}}}},o.PAD0=236,o.PAD1=17;for(var p=[1,0,3,2],m={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;f.getBCHDigit(e)-f.getBCHDigit(f.G15)>=0;)e^=f.G15<<f.getBCHDigit(e)-f.getBCHDigit(f.G15);return(t<<10|e)^f.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;f.getBCHDigit(e)-f.getBCHDigit(f.G18)>=0;)e^=f.G18<<f.getBCHDigit(e)-f.getBCHDigit(f.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return f.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,i){switch(t){case m.PATTERN000:return(e+i)%2==0;case m.PATTERN001:return e%2==0;case m.PATTERN010:return i%3==0;case m.PATTERN011:return(e+i)%3==0;case m.PATTERN100:return(Math.floor(e/2)+Math.floor(i/3))%2==0;case m.PATTERN101:return e*i%2+e*i%3==0;case m.PATTERN110:return(e*i%2+e*i%3)%2==0;case m.PATTERN111:return(e*i%3+(e+i)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new a([1],0),i=0;t>i;i++)e=e.multiply(new a([1,v.gexp(i)],0));return e},getLostPoint:function(t){for(var e=t.getModuleCount(),i=0,n=0,s=0;e>s;s++)for(var o=0,a=t.modules[s][0],r=0;e>r;r++){var l=t.modules[s][r];if(e-6>r&&l&&!t.modules[s][r+1]&&t.modules[s][r+2]&&t.modules[s][r+3]&&t.modules[s][r+4]&&!t.modules[s][r+5]&&t.modules[s][r+6]&&(e-10>r?t.modules[s][r+7]&&t.modules[s][r+8]&&t.modules[s][r+9]&&t.modules[s][r+10]&&(i+=40):r>3&&t.modules[s][r-1]&&t.modules[s][r-2]&&t.modules[s][r-3]&&t.modules[s][r-4]&&(i+=40)),e-1>s&&e-1>r){var c=0;l&&c++,t.modules[s+1][r]&&c++,t.modules[s][r+1]&&c++,t.modules[s+1][r+1]&&c++,(0==c||4==c)&&(i+=3)}a^l?o++:(a=l,o>=5&&(i+=3+o-5),o=1),l&&n++}for(var r=0;e>r;r++)for(var o=0,a=t.modules[0][r],s=0;e>s;s++){var l=t.modules[s][r];e-6>s&&l&&!t.modules[s+1][r]&&t.modules[s+2][r]&&t.modules[s+3][r]&&t.modules[s+4][r]&&!t.modules[s+5][r]&&t.modules[s+6][r]&&(e-10>s?t.modules[s+7][r]&&t.modules[s+8][r]&&t.modules[s+9][r]&&t.modules[s+10][r]&&(i+=40):s>3&&t.modules[s-1][r]&&t.modules[s-2][r]&&t.modules[s-3][r]&&t.modules[s-4][r]&&(i+=40)),a^l?o++:(a=l,o>=5&&(i+=3+o-5),o=1)}var u=Math.abs(100*n/e/e-50)/5;return i+=10*u}},v={glog:function(t){if(1>t)throw new Error("glog("+t+")");return v.LOG_TABLE[t]},gexp:function(t){for(;0>t;)t+=255;for(;t>=256;)t-=255;return v.EXP_TABLE[t]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},g=0;8>g;g++)v.EXP_TABLE[g]=1<<g;for(var g=8;256>g;g++)v.EXP_TABLE[g]=v.EXP_TABLE[g-4]^v.EXP_TABLE[g-5]^v.EXP_TABLE[g-6]^v.EXP_TABLE[g-8];for(var g=0;255>g;g++)v.LOG_TABLE[v.EXP_TABLE[g]]=g;a.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=new Array(this.getLength()+t.getLength()-1),i=0;i<this.getLength();i++)for(var n=0;n<t.getLength();n++)e[i+n]^=v.gexp(v.glog(this.get(i))+v.glog(t.get(n)));return new a(e,0)},mod:function(t){var e=this.getLength(),i=t.getLength();if(0>e-i)return this;for(var n=new Array(e),s=0;e>s;s++)n[s]=this.get(s);for(;n.length>=i;){for(var o=v.glog(n[0])-v.glog(t.get(0)),s=0;s<t.getLength();s++)n[s]^=v.gexp(v.glog(t.get(s))+o);for(;0==n[0];)n.shift()}return new a(n,0)}},w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],o.prototype.getRightType=function(){for(var t=1;41>t;t++){var e=w[4*(t-1)+this.errorCorrectLevel];if(void 0==e)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+this.errorCorrectLevel);for(var i=e.length/3,n=0,s=0;i>s;s++){var o=e[3*s+0],a=e[3*s+2];n+=a*o}var r=t>9?2:1;if(this.utf8bytes.length+r<n||40==t){this.typeNumber=t,this.rsBlock=e,this.totalDataCount=n;break}}},r.prototype={get:function(t){var e=Math.floor(t/8);return this.buffer[e]>>>7-t%8&1},put:function(t,e){for(var i=0;e>i;i++)this.putBit(t>>>e-i-1&1)},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},c.fn.qrcode=function(t){return this.each(function(){c(this).append(new d(t))})},e.exports=u.qrcode=d},{2:2}],32:[function(t,e,i){"use strict";function n(){try{return l in r&&r[l]}catch(t){return!1}}var s,o=t(2),a={},r=window,l="localStorage";a.disabled=!1,a.version="1.3.17",a.set=function(t,e){},a.get=function(t,e){},a.has=function(t){return void 0!==a.get(t)},a.remove=function(t){},a.clear=function(){},a.transact=function(t,e,i){null==i&&(i=e,e=null),null==e&&(e={});var n=a.get(t,e);i(n),a.set(t,n)},a.getAll=function(){},a.forEach=function(){},a.serialize=function(t){return JSON.stringify(t)},a.deserialize=function(t){if("string"!=typeof t)return void 0;try{return JSON.parse(t)}catch(e){return t||void 0}},n()&&(s=r[l],a.set=function(t,e){return void 0===e?a.remove(t):(s.setItem(t,a.serialize(e)),e)},a.get=function(t,e){var i=a.deserialize(s.getItem(t));return void 0===i?e:i},a.remove=function(t){s.removeItem(t)},a.clear=function(){s.clear()},a.getAll=function(){var t={};return a.forEach(function(e,i){t[e]=i}),t},a.forEach=function(t){for(var e=0;e<s.length;e++){var i=s.key(e);t(i,a.get(i))}});try{var c="__storeJs__";a.set(c,c),a.get(c)!=c&&(a.disabled=!0),a.remove(c)}catch(u){a.disabled=!0}a.enabled=!a.disabled,e.exports=o.store=a},{2:2}],33:[function(t,e,i){"use strict";function n(){var t=s('[data-am-widget="accordion"]'),e={item:".am-accordion-item",title:".am-accordion-title",body:".am-accordion-bd",disabled:".am-disabled"};t.each(function(t,i){var n=o.utils.parseOptions(s(i).attr("data-am-accordion")),a=s(i).find(e.title);a.on("click.accordion.amui",function(){var t=s(this).next(e.body),o=s(this).parent(e.item),a=t.data("amui.collapse");o.is(e.disabled)||(o.toggleClass("am-active"),
	a?t.collapse("toggle"):t.collapse(),!n.multiple&&s(i).children(".am-active").not(o).not(e.disabled).removeClass("am-active").find(e.body+".am-in").collapse("close"))})})}var s=window.jQuery,o=t(2);t(6),s(n),e.exports=o.accordion={VERSION:"2.1.0",init:n}},{2:2,6:6}],34:[function(t,e,i){"use strict";e.exports={VERSION:"2.0.1"}},{}],35:[function(t,e,i){"use strict";function n(){var t=s(".ds-thread"),e=t.parent('[data-am-widget="duoshuo"]').attr("data-ds-short-name"),i=("https:"==document.location.protocol?"https:":"http:")+"//static.duoshuo.com/embed.js";if(t.length&&e&&(window.duoshuoQuery={short_name:e},!s('script[src="'+i+'"]').length)){var n=s("<script>",{async:!0,type:"text/javascript",src:i,charset:"utf-8"});s("body").append(n)}}var s=window.jQuery,o=t(2);s(window).on("load",n),e.exports=o.duoshuo={VERSION:"2.0.1",init:n}},{2:2}],36:[function(t,e,i){"use strict";function n(){s(".am-figure").each(function(t,e){var i,n=o.utils.parseOptions(s(e).attr("data-am-figure")),a=s(e);if(n.pureview)if("auto"===n.pureview){var r=s.isImgZoomAble(a.find("img")[0]);r&&a.pureview()}else a.addClass("am-figure-zoomable").pureview();i=a.data("amui.pureview"),i&&a.on("click",":not(img)",function(){i.open(0)})})}var s=window.jQuery,o=t(2);t(17),s.isImgZoomAble=function(t){var e=new Image;e.src=t.src;var i=s(t).width()<e.width;return i&&s(t).closest(".am-figure").addClass("am-figure-zoomable"),i},s(window).on("load",n),e.exports=o.figure={VERSION:"2.0.3",init:n}},{17:17,2:2}],37:[function(t,e,i){"use strict";function n(){s(".am-footer-ysp").on("click",function(){s("#am-footer-modal").modal()});var t=o.utils.parseOptions(s(".am-footer").data("amFooter"));t.addToHS&&a(),s('[data-rel="desktop"]').on("click",function(t){t.preventDefault(),window.AMPlatform?window.AMPlatform.util.goDesktop():(r.set("allmobilize","desktop","","/"),window.location=window.location)})}var s=window.jQuery,o=t(2);t(12);var a=t(3),r=t(27);s(n),e.exports=o.footer={VERSION:"3.1.2",init:n}},{12:12,2:2,27:27,3:3}],38:[function(t,e,i){"use strict";function n(){var t=s('[data-am-widget="gallery"]');t.each(function(){var t=o.utils.parseOptions(s(this).attr("data-am-gallery"));t.pureview&&("object"==typeof t.pureview?s(this).pureview(t.pureview):s(this).pureview())})}var s=window.jQuery,o=t(2);t(17),s(n),e.exports=o.gallery={VERSION:"3.0.0",init:n}},{17:17,2:2}],39:[function(t,e,i){"use strict";function n(){function t(){i[(n.scrollTop()>50?"add":"remove")+"Class"]("am-active")}var e=s('[data-am-widget="gotop"]'),i=e.filter(".am-gotop-fixed"),n=s(window);e.data("init")||(e.find("a").on("click",function(t){t.preventDefault(),n.smoothScroll()}),t(),n.on("scroll.gotop.amui",o.utils.debounce(t,100)),e.data("init",!0))}var s=window.jQuery,o=t(2);t(22),s(n),e.exports=o.gotop={VERSION:"4.0.2",init:n}},{2:2,22:22}],40:[function(t,e,i){"use strict";function n(){s('[data-am-widget="header"]').each(function(){return s(this).hasClass("am-header-fixed")?(s("body").addClass("am-with-fixed-header"),!1):void 0})}var s=window.jQuery,o=t(2);s(n),e.exports=o.header={VERSION:"2.0.0",init:n}},{2:2}],41:[function(t,e,i){"use strict";var n=t(2);e.exports=n.intro={VERSION:"4.0.2",init:function(){}}},{2:2}],42:[function(t,e,i){"use strict";var n=t(2);e.exports=n.listNews={VERSION:"4.0.0",init:function(){}}},{2:2}],43:[function(t,e,i){function n(t){var e=o("<script />",{id:"am-map-api-0"});o("body").append(e),e.on("load",function(){console.log("load");var e=o("<script/>",{id:"am-map-api-1"});o("body").append(e),e.on("load",function(){var e=document.createElement("script");e.textContent="("+t.toString()+")();",o("body")[0].appendChild(e)}).attr("src","http://api.map.baidu.com/getscript?type=quick&file=feature&ak=WVAXZ05oyNRXS5egLImmentg&t=20140109092002")}).attr("src","http://api.map.baidu.com/getscript?type=quick&file=api&ak=WVAXZ05oyNRXS5egLImmentg&t=20140109092002")}function s(){var t=document.querySelector(".am-map"),e=116.331398,i=39.897445,n=t.getAttribute("data-name"),s=t.getAttribute("data-address"),o=t.getAttribute("data-longitude")||e,a=t.getAttribute("data-latitude")||i,r=t.getAttribute("data-setZoom")||17,l=t.getAttribute("data-icon"),c=new BMap.Map("bd-map"),u=new BMap.Point(o,a);c.centerAndZoom(u,r),t.getAttribute("data-zoomControl")&&c.addControl(new BMap.ZoomControl),t.getAttribute("data-scaleControl")&&c.addControl(new BMap.ScaleControl);var h=new BMap.Marker(u);l&&h.setIcon(new BMap.Icon(l,new BMap.Size(40,40)));var d={width:200,title:n},p=new BMap.InfoWindow("\u5730\u5740\uff1a"+s,d),m=new BMap.Geocoder;o==e&&a==i?m.getPoint(s,function(t){t&&(c.centerAndZoom(t,r),h.setPosition(t),c.addOverlay(h),c.openInfoWindow(p,t))},""):m.getLocation(u,function(t){c.centerAndZoom(u,r),h.setPosition(u),c.addOverlay(h),s?c.openInfoWindow(p,u):c.openInfoWindow(new BMap.InfoWindow(s,d),u)})}var o=window.jQuery,a=t(2),r=function(){o(".am-map").length&&n(s)};o(r),e.exports=a.map={VERSION:"2.0.2",init:r}},{2:2}],44:[function(t,e,i){"use strict";function n(){if(s("#mechat").length){var t=s('[data-am-widget="mechat"]'),e=t.data("am-mechat-unitid"),i=s("<script>",{charset:"utf-8",src:"http://mechatim.com/js/unit/button.js?id="+e});s("body").append(i)}}var s=window.jQuery,o=t(2);s(window).on("load",n),e.exports=o.mechat={VERSION:"2.0.1",init:n}},{2:2}],45:[function(t,e,i){"use strict";var n=window.jQuery,s=t(2),o=t(11);t(13),t(6);var a=function(){var t=n('[data-am-widget="menu"]');t.find(".am-menu-nav .am-parent > a").on("click",function(t){t.preventDefault();var e=n(this),i=e.parent(),s=e.next(".am-menu-sub");i.toggleClass("am-open"),s.collapse("toggle"),i.siblings(".am-parent").removeClass("am-open").children(".am-menu-sub.am-in").collapse("close")}),t.filter("[data-am-menu-collapse]").find("> .am-menu-toggle").on("click",function(t){t.preventDefault();var e=n(this),i=e.next(".am-menu-nav");e.toggleClass("am-active"),i.collapse("toggle")}),t.filter("[data-am-menu-offcanvas]").find("> .am-menu-toggle").on("click",function(t){t.preventDefault();var e=n(this),i=e.next(".am-offcanvas");e.toggleClass("am-active"),i.offCanvas("open")});var e='.am-offcanvas[data-dismiss-on="click"]',i=n(e);i.find("a").not(".am-parent>a").on("click",function(t){n(this).parents(e).offCanvas("close")}),t.filter(".am-menu-one").each(function(t){var e,i=n(this),s=n('<div class="am-menu-nav-sub-wrap"></div>'),a=0,r=i.find(".am-menu-nav"),l=r.children("li");l.filter(".am-parent").each(function(t){n(this).attr("data-rel","#am-menu-sub-"+t),n(this).find(".am-menu-sub").attr("id","am-menu-sub-"+t).appendTo(s)}),i.append(s),r.wrap('<div class="am-menu-nav-wrap" id="am-menu-'+t+'">'),l.each(function(t){a+=parseFloat(n(this).css("width"))}),r.width(a);var c=new o("#am-menu-"+t,{eventPassthrough:!0,scrollX:!0,scrollY:!1,preventDefault:!1});l.on("click",function(){var t=n(this);t.addClass("am-active").siblings().removeClass("am-active"),s.find(".am-menu-sub.am-in").collapse("close"),t.is(".am-parent")?!t.hasClass(".am-open")&&s.find(t.attr("data-rel")).collapse("open"):t.siblings().removeClass("am-open"),void 0===e&&(e=n(this).index()?0:1);var o,a=n(this).index()>e,l=n(this)[a?"next":"prev"](),u=l.offset()||n(this).offset(),h=i.offset(),d=parseInt(i.css("padding-left"));(a?u.left+u.width>h.left+h.width:u.left<h.left)&&(o=r.offset(),c.scrollTo(a?h.width-u.left+o.left-u.width-d:o.left-u.left,0,400)),e=n(this).index()}),i.on("touchmove",function(t){t.preventDefault()})})};n(a),e.exports=s.menu={VERSION:"4.0.3",init:a}},{11:11,13:13,2:2,6:6}],46:[function(t,e,i){"use strict";function n(){function t(){u.append(b),u.find("li").not(".am-navbar-more").slice(i()-1).appendTo(y),n.append(y)}function e(){return i()>=d?(b.hide(),void y.find("li").insertBefore(b)):(!n.find(".am-navbar-actions").length&&t(),b.show(),void(u.find("li").length<i()?y.find("li").slice(0,i()-u.find("li").length).insertBefore(b):u.find("li").length>i()&&(y.find("li").length?u.find("li").not(b).slice(i()-1).insertBefore(y.find("li").first()):u.find("li").not(b).slice(i()-1).appendTo(y))))}function i(){return Math.floor((l.width()-f)/m)}var n=s('[data-am-widget="navbar"]');if(n.length){var l=s(window),c=s("body"),u=n.find(".am-navbar-nav"),h=n.find("li"),d=h.length,p=u.attr("class")&&parseInt(u.attr("class").match(/am-avg-sm-(\d+)/)[1])||3,m=60,f=16,v=h.filter("[data-am-navbar-share]"),g=h.filter("[data-am-navbar-qrcode]"),w="am-active",y=s('<ul class="am-navbar-actions"></ul>',{id:o.utils.generateGUID("am-navbar-actions")}),b=s('<li class="am-navbar-labels am-navbar-more"><a href="javascript: void(0);"><span class="am-icon-angle-up"></span><span class="am-navbar-label">\u66f4\u591a</span></a></li>');if("fixed"==n.css("position")&&c.addClass("am-with-fixed-navbar"),g.length){var T="am-navbar-qrcode";if(C=s("#"+T),!C.length){var x=g.attr("data-am-navbar-qrcode"),C=s('<div class="am-modal am-modal-no-btn" id=""><div class="am-modal-dialog"><div class="am-modal-bd"></div></div></div>',{id:T}),E=C.find(".am-modal-bd");if(x)E.html('<img src="'+x+'"/>');else{var S=new r({render:"canvas",correctLevel:0,text:window.location.href,width:200,height:200,background:"#fff",foreground:"#000"});E.html(S)}c.append(C)}g.on("click",function(t){t.preventDefault(),C.modal()})}d>p&&d>i()&&t(),n.on("click.navbar.amui",".am-navbar-more",function(t){t.preventDefault(),b[y.hasClass(w)?"removeClass":"addClass"](w),y.toggleClass(w)}),v.length&&v.on("click.navbar.amui",function(t){t.preventDefault(),a.toggle()}),l.on("resize.navbar.amui orientationchange.navbar.amui",o.utils.debounce(e,150))}}var s=window.jQuery,o=t(2),a=t(21),r=t(31);t(12),s(n),e.exports=o.navbar={VERSION:"2.0.2",init:n}},{12:12,2:2,21:21,31:31}],47:[function(t,e,i){"use strict";var n=t(2);e.exports=n.pagination={VERSION:"3.0.1"}},{2:2}],48:[function(t,e,i){"use strict";function n(){var t=s('[data-am-widget="paragraph"]');t.each(function(t){var e=s(this),i=o.utils.parseOptions(e.attr("data-am-paragraph")),n=t;i.pureview&&e.pureview(),i.tableScrollable&&e.find("table").each(function(t){s(this).width()>s(window).width()&&s(this).scrollTable(n+"-"+t)})})}var s=window.jQuery,o=t(2),a=t(11);t(17),s.fn.scrollTable=function(t){var e,i=s(this);i.wrap('<div class="am-paragraph-table-container" id="am-paragraph-table-'+t+'"><div class="am-paragraph-table-scroller"></div></div>'),e=i.parent(),e.width(i.width()),e.height(i.height()),new a("#am-paragraph-table-"+t,{eventPassthrough:!0,scrollX:!0,scrollY:!1,preventDefault:!1})},s(window).on("load",n),e.exports=o.paragraph={VERSION:"2.0.1",init:n}},{11:11,17:17,2:2}],49:[function(t,e,i){"use strict";function n(){var t=s('[data-am-widget="slider"]');t.not(".am-slider-manual").each(function(t,e){var i=o.utils.parseOptions(s(e).attr("data-am-slider"));s(e).flexslider(i)})}var s=window.jQuery,o=t(2);t(10),s(n),e.exports=o.slider={VERSION:"3.0.1",init:n}},{10:10,2:2}],50:[function(t,e,i){"use strict";function n(){s('[data-am-widget="tabs"]').each(function(){var t=s(this).data("amTabsNoswipe")?{noSwipe:1}:{};s(this).tabs(t)})}var s=window.jQuery,o=t(2);t(24),s(n),e.exports=o.tab={VERSION:"4.0.1",init:n}},{2:2,24:24}],51:[function(t,e,i){"use strict";var n=t(2);e.exports=n.titlebar={VERSION:"4.0.1"}},{2:2}],52:[function(t,e,i){"use strict";function n(){var t=s('[data-am-widget="wechatpay"]');return a?void t.on("click",".am-wechatpay-btn",function(t){t.preventDefault();var e=o.utils.parseOptions(s(this).parent().data("wechatPay"));return window.wx?void wx.checkJsApi({jsApiList:["chooseWXPay"],success:function(t){t.checkResult.chooseWXPay?wx.chooseWXPay(e):alert("\u5fae\u4fe1\u7248\u672c\u4e0d\u652f\u6301\u652f\u4ed8\u63a5\u53e3\u6216\u6ca1\u6709\u5f00\u542f\uff01")},fail:function(){alert("\u8c03\u7528 checkJsApi \u63a5\u53e3\u65f6\u53d1\u751f\u9519\u8bef!")}}):void alert("\u6ca1\u6709\u5fae\u4fe1 JS SDK")}):(t.hide(),!1)}var s=window.jQuery,o=t(2),a=window.navigator.userAgent.indexOf("MicroMessenger")>-1,r=n;s(r),e.exports=o.pay={VERSION:"1.0.0",init:r}},{2:2}]},{},[1])(1)});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16).setImmediate))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(17);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(18)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 19 */
/***/ function(module, exports) {

	// svg点坐标转换到触屏页面上坐标
	"use strict";

	exports.svgToPage = function (x, y, svg_obj) {
	    //svg_obj = svg_obj ? svg_obj : $("svg").filter(":visible")[0];
	    svg_obj = svg_obj ? svg_obj : $("#" + gTools.showingFloor).children()[0];
	    if (!svg_obj) {
	        return false;
	    }
	    var svgPoint = svg_obj.createSVGPoint();
	    svgPoint.x = x;
	    svgPoint.y = y;
	    var CTM = svg_obj.getScreenCTM();
	    var pagePoint = svgPoint.matrixTransform(CTM);
	    return pagePoint;
	};

	// 跟上面的是反过来的
	exports.pageToSvg = function (x, y, svg_obj) {
	    svg_obj = svg_obj ? svg_obj : $("#" + gTools.showingFloor).children()[0];
	    if (!svg_obj) {
	        return false;
	    }
	    var svgPoint = svg_obj.createSVGPoint();
	    svgPoint.x = x;
	    svgPoint.y = y;
	    var CTM = svg_obj.getScreenCTM().inverse();
	    var pagePoint = svgPoint.matrixTransform(CTM);
	    return pagePoint;
	};

	// 元素是对象的数组基于对象属性的排序 …… 数据库的 order by
	exports.getSortFun = function (order, sortBy) {
	    var ordAlpah = order == 'asc' ? '>' : '<';
	    var sortFun = new Function('a', 'b', 'return Number(a.' + sortBy + ')' + ordAlpah + ' Number(b.' + sortBy + ')?1:-1');
	    return sortFun;
	};

	// exports.spin = (matrix,deg)=>{
	//   "use strict";
	//   let m1 = matrix[0],m2 = matrix[1],m3 = matrix[2], m4 = matrix[3], m5 = matrix[4], m6 = matrix[5],
	//       pi = Math.PI * deg /180;
	//   m1 = Math.cos(pi)*4;
	//   m2 = - Math.sin(pi)*4;
	//   m4 = Math.cos(pi)*4;
	//   m3 = Math.sin(pi)*4;
	//   return [m1,m2,m3,m4,m5,m6]
	// }
	/**
	 * 过滤数组中指定下表的数组
	 * @param arr 原数组
	 * @param subArr 指定数组
	 */
	var arrFilter = function arrFilter(arr, subArr) {
	    $.map(arr, function (v, i) {
	        if ($.inArray(i, subArr) == -1) return v;
	    });
	};

	/**
	 * 将字符串中的%s 用后面的参数替换掉  只是初始的模拟php 的sprintf
	 * @param str "asdasda %s 1111"
	 * @param rest "aa".....
	 * @returns {string} "asdasd aa 1111
	 */
	var sprintf = function sprintf(str) {
	    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        rest[_key - 1] = arguments[_key];
	    }

	    var strArr = str.split("%s"),
	        newStr = '';
	    strArr.forEach(function (v, k) {
	        var s = rest[k] ? rest[k] : "";
	        newStr += v + s;
	    });
	    return newStr;
	};
	exports.sprintf = sprintf;

	///**
	// * 组合url 生成分享链接 （用来获取openid和appid）
	// * @param url 要分享的url
	// * @param appid 微信的appid
	// * @returns {string} 组合后的url
	// */
	// 废弃
	//exports.generateRawWxOpenIdUrl = (url, appid = "wxbae35f0d1acf5840")=> {  // 太古里场景
	//    let rediretUri = encodeURIComponent(url),
	//        serverUrl = sprintf("http://carpos.wizarcan.com/rawopenid?appid=%s&surl=%s", appid, rediretUri),
	//        wxOpenIdUrl = sprintf("https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=123#wechat_redirect", appid, encodeURIComponent(serverUrl));
	//    return wxOpenIdUrl;
	//};

	// 废弃: 微信公众平台升级后不允许分享链接为非安全域名下的链接,所以不能直接通过微信授权接口获取code,再通过后台接口去获取openid.
	//exports.generateRawWxOpenIdUrl = (url, appid = "wx032d0135e9a5652e")=> {
	//    let rediretUri = encodeURIComponent(url),
	//        serverUrl = sprintf("http://idp.wizarcan.com/weixin/toPageWithOpenId.shtml?url=%s", rediretUri),
	//        wxOpenIdUrl = sprintf("https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=123#wechat_redirect", appid, encodeURIComponent(serverUrl));
	//    return wxOpenIdUrl;
	//};

	/**
	 * 新的获取openid并进行拼接跳转: http://wx.wizarcan.com/jid?jurl=http://idp.wizarcan.com/XXXXX
	 * @param url 要分享的url
	 * @returns {string} 组合后的url
	 */
	exports.generateWxShareUrl = function (url) {
	    return location.origin + '/weixin/wxAuthorize.shtml?url=' + encodeURIComponent(url);
	};

	//获取两个gps之间的距离
	exports.getGpsDistance = function (lon, lat, lon2, lat2) {
	    var pointA = new BMap.Point(lon, lat),
	        pointB = new BMap.point(lon2, lat2);
	    return bdMap.getDistance(pointA, pointB).toFixed(2); //单位 米
	};

	//gps坐标转换成百度坐标
	exports.gpsToBaiduGps = function () {
	    var lon = arguments.length <= 0 || arguments[0] === undefined ? 116.32715863448607 : arguments[0];
	    var lat = arguments.length <= 1 || arguments[1] === undefined ? 39.990912172420714 : arguments[1];

	    var dtd = $.Deferred(),
	        ggPoint = new BMap.Point(lon, lat),
	        convertor = new BMap.Convertor(),
	        pointArr = [];
	    pointArr.push(ggPoint);
	    convertor.translate(pointArr, 1, 5, function (data) {
	        alert(JSON.stringify(data));
	        dtd.resolve(data);
	    });
	    return dtd.promise();
	};
	//gpsToBaiduGps.done(function(){});
	//

/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * 之前写const，莫名其妙没编译过去……不是编译报错，而是编译出来的依然是const.
	 * naction: 指定动作名称
	 * href: 指定跳转页面
	 * name: 名字标识
	 * class: 指定样式class索引
	 * p: 位置索引,和后台配置的地方顺便保持一致,下标从0开始
	 * *sort字段用于排序,排序后是在下拉菜单中显示的顺序.
	 *      sort1:排序是旧的(无分组)下拉菜单样式.
	 *      sort2:排序是新的(有分组)下拉菜单样式
	 */
	var LABELSCONFIG = [
		{naction:"if-record-car",	href:"#",	            name:"停车",             class:1,         p:0,    sort1: 7,   sort2: 24},      // 停车/记住车位
		{naction:"search-car",	    href:"#",	            name:"找车",	            class:2,	     p:1,    sort1: 4,   sort2: 22},
		{naction:"coupons",	        href:"#coupons",	    name:"优惠券",           class:3,	     p:2,    sort1: 14,  sort2: 12},
		{naction:"activities",	    href:"#activities",	    name:"活动",  	        class:5,	     p:3,    sort1: 15,  sort2: 13},     // 活动对应的是折扣?
		{naction:"findBathroom",	href:"#",	            name:"洗手间",           class:6,	     p:4,    sort1: 1,   sort2: 1},
		{naction:"findElevator",    href:"#",	            name:"直梯",	            class:7,	     p:5,    sort1: 10,  sort2: 8},
		{naction:"findExit",	    href:"#",	            name:"出口",	            class:8,	     p:6,    sort1: 12,  sort2: 4},
		{naction:"findZig",	        href:"#",	            name:"扶梯",	            class:9,	     p:7,    sort1: 11,  sort2: 3},
		{naction:"showSkinList",	href:"#showSkinList",	name:"换肤",	            class:10,	     p:8,    sort1: 16,  sort2: 17},
		{naction:"share",	        href:"#",	            name:"位置分享",	        class:11,	     p:9,    sort1: 9,   sort2: 7},
		{naction:"贩卖机",           href:"#",	            name:"贩卖机",	        class:0,	     p:10,   sort1: 17,  sort2: 18},      // 暂未使用到
		{naction:"findSubway",	    href:"#",	            name:"地铁",	            class:19,	     p:11,   sort1: 8,   sort2: 5},
		{naction:"findPay",	        href:"#",	            name:"缴费机",	        class:12,	     p:12,   sort1: 5,   sort2: 23},
		{naction:"吸烟室",	        href:"#",	            name:"吸烟室",	        class:0,	     p:13,   sort1: 18,  sort2: 19},      // 暂未使用到
		{naction:"findServer",	    href:"#",	            name:"客服中心",	        class:18,	     p:14,   sort1: 2,   sort2: 2},      // 服务台或服务中心或客服中心
		{naction:"阳光谷",	        href:"#",	            name:"阳光谷",	        class:0,	     p:15,   sort1: 19,  sort2: 20},      // 暂未使用到,世博源特有
		{naction:"海景鱼缸",	        href:"#",	            name:"海景鱼缸",	        class:0,	     p:16,   sort1: 20,  sort2: 21},      // 暂未使用到,世博源特有
		{naction:"findChildroom",	href:"#",	            name:"母婴室",	        class:16,	     p:17,   sort1: 3,   sort2: 10},
		{naction:"findATM",	        href:"#",	            name:"ATM机",	        class:15,	     p:18,   sort1: 6,   sort2: 6},
		{naction:"会员中心",	        href:"#",	            name:"会员中心",	        class:18,	     p:19,   sort1: 21,  sort2: 17},
		{naction:"美食",	            href:"#foods",	        name:"美食",	            class:4,	     p:20,   sort1: 22,  sort2: 14},
		{naction:"娱乐",	            href:"#funs",	        name:"娱乐",	            class:20,	     p:21,   sort1: 23,  sort2: 15},
		{naction:"咖啡甜点",	        href:"#coffee",	        name:"咖啡甜点",	        class:21,	     p:22,   sort1: 24,  sort2: 16},
		{naction:"attention",	    href:"#",	            name:"是否关注公众号",	class:14,	     p:23,   sort1: 13,  sort2: 11},     // 等价于关注二维码
		{naction:"绑定车牌",	        href:"manageCar.html",	name:"绑定车牌",	        class:22,	     p:24,   sort1: 25,  sort2: 25}
		//, {	naction:"changeMap", href:"#", name:"百度地图", class:13, p:-1 }	// 后台没有此菜单
	];
	exports.LABELSCONFIG = LABELSCONFIG;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i["return"])_i["return"]();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};})();var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _get=function get(_x8,_x9,_x10){var _again=true;_function: while(_again) {var object=_x8,property=_x9,receiver=_x10;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x8 = parent;_x9 = property;_x10 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if("value" in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass,superClass){if(typeof superClass !== "function" && superClass !== null){throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var fn=__webpack_require__(19);var svgToPage=fn.svgToPage,getSortFun=fn.getSortFun;var Api=__webpack_require__(22);var _require=__webpack_require__(12);var getQueryString=_require.getQueryString;var Tools=(function(_Api){_inherits(Tools,_Api);function Tools(option){_classCallCheck(this,Tools);option = option || {};_get(Object.getPrototypeOf(Tools.prototype),"constructor",this).call(this);this.appId = option.appid; // 设置appid
	this.openid = option.openid; // 设置openid
	this._init();} // 初始化一些数据 懒得写在constructor里了
	_createClass(Tools,[{key:"_init",value:function _init(){ //this.initOver = false;
	this.bdMapIsShow = false;this.action = getQueryString("action") || "";this.enterType = this._setEnterType(this.action); //（0：猫寻助手；1：微肯APP；2：分享；3:摇一摇；4：其它公众号；5：其它APP；6：其他；7.太古里线上停车缴费后页面入口）
	this.initOver = true;log.v('gTools',this);} /**
	     * 设置访问页面来源类型
	     * @author weibin
	     * @param {string} action 动作名称
	     * @returns {number} 来源分类编号
	     * @private
	     */},{key:"_setEnterType",value:function _setEnterType(action){if(action === 'fromShare'){return 2;}return +getQueryString("enterType") || (location.href.indexOf("xx.html") > 0?1:6);} // 从url或localstorage中读取appid 跟 openid
	//getOpenId() {
	//    this.appId = getQueryString("appid") || getQueryString("appId") || localStorage.appid || 'wxbae35f0d1acf5840';
	//    this.openid = getQueryString("openid") || localStorage.openid || 'oiuyCvwHRSoG0DhLGNDS0QfkcH9I';
	//    localStorage.appid = this.appId;
	//    localStorage.openid = this.openid;
	//}
	},{key:"initViews",value:function initViews(){this.initLoading(); //this.showLoading();
	this.createCtrlBtn(); //this.judgeSystem();
	//this.createFloorNav();
	this.fullPageModal();} /**
	     * 显示欢迎页(仅限内部调用)
	     * @author weibin
	     * @param {string} imgLink 欢迎页的图片
	     * @param {string} jumpLink 点击欢迎页对应的跳转链接
	     * @param callback 显示欢迎页后的回调函数
	     * @private 私有方法
	     */},{key:"_showWelcomePage",value:function _showWelcomePage(imgLink,jumpLink,callback){imgLink = imgLink || '//oex38ct5y.qnssl.com/TaikooLi/welcome.png';var _this=this,closeWelcomePageTimerId=undefined,remainSeconds=5,tpl="<div class=\"welcomePage\" id=\"js_welcome_page\">\n                    <a href=\"javascript:;\" class=\"am-close closebtn0\" id=\"js_close_welcome_page\">" + remainSeconds + "s</a>\n                    <img src=\"" + imgLink + "\" id=\"js_welcome_page_img\">\n                </div>";$("body").append(tpl); // 定义关闭欢迎页的方法
	function _closeWelcomePage(){$('#js_welcome_page').remove();} // 设置关闭事件
	new Hammer(_this.getElementById('js_close_welcome_page')).on('tap',function(){_closeWelcomePage();}); // 查看欢迎页详情
	new Hammer(_this.getElementById('js_welcome_page_img')).on('tap',function(){ // 上报-浮层广告的点击量, 此处依赖的全局的report对象
	report.saveWelcomePagePV(_this.floatLayerId || 0).always(function(xhrOrResp){log.v('[reportFloatAdPV] xhrOrResp:',xhrOrResp);_closeWelcomePage(); // 如果存在跳转外链的话,则进行跳转,否则不进行跳转.另外需要等待上报完成后再进行跳转,否则上报不一定成功.
	jumpLink && (location.href = jumpLink);log.v('Will jump to',jumpLink);});}); // 设置自动关闭欢迎页倒计时
	closeWelcomePageTimerId = setInterval(function(){remainSeconds--; // 倒计时未结束,更新倒计时
	if(remainSeconds > 0){$('#js_close_welcome_page').html(remainSeconds + 's');return;} // 倒计时结束,清除定时器,关闭欢迎页
	clearInterval(closeWelcomePageTimerId);_closeWelcomePage();},1000); // 执行回调
	callback && callback();} /**
	     * 显示欢迎页(供外部调用)
	     * @author weibin
	     * @param {string} imgLink 欢迎页的图片
	     * @param {string} jumpLink 点击欢迎页对应的跳转链接
	     * @param callback 显示欢迎页后的回调函数
	     */},{key:"showWelcomePage",value:function showWelcomePage(imgLink,jumpLink,callback){imgLink = imgLink || '//oex38ct5y.qnssl.com/TaikooLi/welcome.png';var _this=this;_this.loadImg(imgLink,function(){_this._showWelcomePage(imgLink,jumpLink,callback);});}},{key:"tips",value:function tips(){var tips="<div id=\"stepBox\">\n                <div class=\"circles circle0\"></div>\n                <img class=\"otherPage\" id=\"step0\" src=\"//oex38ct5y.qnssl.com/TaikooLi/1.png\"/>\n                <img class=\"otherPage\" id=\"step1\" src=\"//oex38ct5y.qnssl.com/TaikooLi/2.png\" class=\"am-center\" />\n                <img class=\"otherPage\" id=\"step2\" src=\"//oex38ct5y.qnssl.com/TaikooLi/3.png\" />\n                <img class=\"parkTips\" id=\"step_1\" src=\"//oex38ct5y.qnssl.com/TaikooLi/7.png\"/>\n                <img class=\"parkTips\" id=\"step_2\" src=\"//oex38ct5y.qnssl.com/TaikooLi/4.png\"/>\n                <img class=\"parkTips\" id=\"step_3\" src=\"//oex38ct5y.qnssl.com/TaikooLi/5.png\"/>\n                <img class=\"parkTips\" id=\"step_4\" src=\"//oex38ct5y.qnssl.com/TaikooLi/6.png\"/>\n                <a id=\"step\" class=\"stepbtn\" href=\"javascript:;\"></a>\n            </div>";$("body").append(tips);} // 添加推荐（店铺或展位）列表
	},{key:"recommendStores",value:function recommendStores(arr){var _this=this,brandName=undefined,list="<div class=\"storeLists\">\n                    <div class=\"closeBtn\">\n                        <a href=\"javascript:;\" class=\"am-close closebtn0\" data-maction=\"closeRec\"></a>\n                    </div>\n                <div class=\"storesContainer\">";$.each(arr,function(i,poi){brandName = poi.brand.split("#").join(" ");list += "<div class=\"stores\" data-map-area=\"" + poi.mapArea + "\">\n                    <div class=\"icon\">\n                        <a style=\"height: 100%;background: url('" + _this.setImgLink(poi.icon) + "') no-repeat center;background-size: contain;\"></a>\n                    </div>\n                    <div class=\"content\">\n                        <a href=\"javascript:;\" class=\"storeName\">" + brandName + "</a>\n                        <a class=\"disInfo\">" + poi.discountInfo + "</a>\n                    </div>\n                </div>";});list += "</div></div>";$(".eleColumn").append(list);} // 一个被改得面目全非的半弹窗
	},{key:"halfModal",value:function halfModal(conTpl,opt,useNewClsBtn){conTpl = conTpl || "";opt = opt || {};var _this=this,closeTpl="";if(!opt.noClose){if(useNewClsBtn){closeTpl = "<div class=\"closeLine\"><a href=\"javascript:;\" class=\"btc-close-half-popup\" data-maction=\"close-half-modal\"></a></div>";}else {closeTpl = "<div class=\"closeLine\"><a href=\"javascript:;\" class=\"am-close closebtn1\" data-maction=\"close-half-modal\" style=\"opacity: 0.8;\">×</a></div>";}}var tpl="<div id=\"halfModal\" class=\"RehalfModal\">\n                " + closeTpl + "\n                <div id=\"halfModalContent\">\n                  " + conTpl + "\n                </div>\n            </div>";$("#body").find("#halfModal").remove().end().append(tpl); // 先移除,再添加
	if(!opt.noClose){var _close=$("#halfModal").find('.am-close');_close.on("click",function(){_this.hideHalfModal();if(typeof opt.callback == 'function'){opt.callback();}});}var fn=function fn(){var hm=$("#halfModal");hm.addClass("active");$("#btm").css({bottom:hm.outerHeight()}); //$("#halfModalContent").css({
	// height:hm.height()
	// })
	opt["class"]?hm.addClass(opt["class"]):"";};if(opt.noEmpty){fn();return;}setTimeout(fn,150);} // 隐藏半弹窗
	},{key:"hideHalfModal",value:function hideHalfModal(){$("#halfModal").removeClass();$("#btm").css({bottom:0});this.hideBgModal();} // 显示半弹窗
	},{key:"showbgModal",value:function showbgModal(){var tpl=$("<div class=\"modal\"></div>");$("#body").append(tpl);return tpl;}},{key:"hideBgModal",value:function hideBgModal(){setTimeout(function(){$(".modal").eq(0).remove();},300);} // 初始化正在加载弹框
	},{key:"initLoading",value:function initLoading(msg){msg = msg || '正在加载中...';var tpl="<div class=\"am-modal am-modal-loading am-modal-no-btn\" tabindex=\"-1\" id=\"modal-loading\">\n                <div class=\"am-modal-dialog\">\n                    <div class=\"am-modal-hd\">" + msg + "</div>\n                    <div class=\"am-modal-bd\">\n                        <span class=\"am-icon-spinner am-icon-spin\"></span>\n                    </div>\n                </div>\n            </div>";$("#body").append(tpl);return this;} // 显示外链广告模块
	},{key:"showModalAdv",value:function showModalAdv(imgUrl,linkUrl){imgUrl = imgUrl?imgUrl:"http://www.xuanfengwenhua.com/images/uploadpic/Picture/201307/20130726021455659.jpg";linkUrl = linkUrl?linkUrl:"javascript:;";var img=new Image();img.src = imgUrl;img.onload = function(){var tpl="\n            <div class=\"am-modal am-modal-no-btn\" tabindex=\"-1\" id=\"modal-adv\">\n              <div class=\"am-modal-dialog\">\n                <div class=\"am-modal-hd\"  style=\"padding: 0\">\n                  <a href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close style=\"font-size: 33px;line-height: 33px;background-color: #002;width: 33px;height: 33px;color: #FFF;opacity: 0.3;right: 4px;\">&times;</a>\n                </div>\n                <div class=\"am-modal-bd\" style=\"padding: 0\">\n                  <a href=\"" + linkUrl + "\" target=\"_blank\"><img src=\"" + imgUrl + "\" style=\"width:100%\"></a>\n                </div>\n              </div>\n            </div> ";$("#body").find("#modal-adv").remove().end().append(tpl);$("#modal-adv").modal("open");};} // 显示正在加载弹框
	},{key:"showLoading",value:function showLoading(text){text = text || '正在加载中...';$("#modal-loading").find(".am-modal-hd").html(text).end().modal("open");} // 隐藏正在加载弹框
	},{key:"hideLoading",value:function hideLoading(){$("#modal-loading").modal("close");} // 系统和版本判断：是否通过微信客户端访问，以及微信的版本号是否满足需求
	},{key:"judgeSystem",value:function judgeSystem(){var wechatInfo=navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i),dtd=$.Deferred(); // Debug用
	if(getQueryString("debug") == 1){return dtd.resolve();} // 系统合法性检测
	if(!wechatInfo){this.halfModal("<p class=\"am-text-center\">请使用微信打开~</p>");$("#halfModal").addClass("wechatTips");return dtd.reject();}if($.os.ios && wechatInfo[1] < "6.2.4"){this.halfModal("\n                <div class=\"am-text-center\">\n                    <p>啊哦~</p>\n                    <p>目前停车导航功能只支持IOS7.0以上版本，<br>微信6.2.4以上版本哦~</p>\n                </div>");return dtd.reject();}if($.os.android && wechatInfo[1] < "6.2.5"){this.halfModal("\n                <div class=\"am-text-center\">\n                    <p>啊哦~</p>\n                    <p>目前停车导航功能只支持微信6.2.5以上版本哦~</p>\n                </div>");return dtd.reject();} // 通过了上面的合法性检测
	return dtd.resolve(); //return dtd.promise()
	} // 蓝牙开启情况判断
	},{key:"judgeBlueTeeth",value:function judgeBlueTeeth(){if($("#halfModal.active").length){return;} // 安卓未打开蓝牙提示
	if(!$.os.ios){this.alert("请先打开蓝牙和gps定位");return;} // 苹果未打开蓝牙提示
	var tpl="\n   \t \t\t<div class=\"popup\" tabindex=\"-1\" id=\"my-alert0\">\n   \t \t\t\t<img class=\"popup_img\" src=\"//oex38ct5y.qnssl.com/bt-3_06.png?_=1\" />\n   \t \t\t\t<a class=\"close_pop\" data-maction = \"close_pop\" href=\"javascript:;\"></a>\n\t            <div class=\"hand\"></div>\n            </div>";$("#body").find("#my-alert1").remove().end().append(tpl); //this.halfModal(`
	//<h2 class="am-text-center">请打开蓝牙</h2>
	// <p class="am-inline-block round-border">开启蓝牙步骤：</p>
	//<p>方法1：向上拉屏幕——<img src="http://oex38ct5y.qnssl.com/bt.png"></p>
	// <p>方法2：设置——蓝牙——打开
	//</p>
	// <p class='am-text-center'>
	//	<a class="am-btn am-btn-default am-inline-block bth-opened" data-maction='bth-opened'>我已打开蓝牙</a>
	// </p>
	// `)
	} // 不在现场提示  废弃
	},{key:"notAtTheScene",value:function notAtTheScene(){if($("#halfModal.active.not-at-the-scene").length){return;}this.halfModal("<h3 class=\"am-text-center\" style=\"margin-top: 10px\">抱歉！您不在现场</h3>\n            <p></p>\n            <p class='am-text-center'><a class=\"am-btn am-btn-default am-inline-block bth-opened am-hide\">测试btn</a></p>",{"class":"not-at-the-scene"});} // 历史停车记录 废弃
	},{key:"showHistory",value:function showHistory(){var tpl="\n    <div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" id=\"history\">\n            <div class=\"am-list-news-hd am-cf\">\n            <a href=\"##\" class=\"am-cf\">\n            <h2>历史停车记录</h2>\n            </a>\n            <span style=\"display:block;font-size:14px\">记录了您最近10次的停车记录</span>\n            </div>\n            <div class=\"am-list-news-bd\">\n            <ul class=\"am-list\">\n                        ";for(var i=0;i < 10;i++) {tpl += "<li class=\"am-g am-list-item-dated\">\n                    <div class=\"am-list-item-text\">我很囧，你保重....晒晒旅行中的那些囧我很囧，你保重....晒晒旅行中的那些囧我很囧，你保重....晒晒旅行中的那些囧我很囧，你保重....晒晒旅行中的那些囧！</div>\n                <span class=\"am-list-date\">2013-09-18</span>\n                    </li>";}tpl += "\n    </ul>\n        </div>\n        </div>\n            ";this.halfModal(tpl,{"class":"history"});} // 创建楼层切换按钮 貌似废弃？
	},{key:"createFloorNav",value:function createFloorNav(){var _this=this;$('#floor-nav').remove();var len=this.floorList.length > 5?5:this.floorList.length,totalW=$(window).width(),itemWidth=(totalW - 72) / len,tpl='';tpl += "\n    <div  class=\"am-slider am-slider-default am-slider-carousel\" id=\"floor-nav\"  data-am-flexslider=\"{itemWidth: " + itemWidth + ", itemMargin: 0, slideshow: false}\">\n            <ul class=\"am-slides hoverBox\">";$.each(this.floorList,function(i,v){tpl += "<li  data-taction='switchfloor'  data-maction='switchfloor'  data-floor=\"" + v.floorid + "\"><a href=\"#\" class=\"am-btn am-btn-default\">" + v.content + "</a></li> ";});tpl += "\n    </ul>\n        </div>";$("#body").prepend(tpl);$('#floor-nav').flexslider({itemWidth:itemWidth,itemMargin:0,slideshow:false});$("#floor-nav").find('[data-taction]').tap(function(event){event.stopPropagation();event.preventDefault();$(this).trigger("click");});this.floorid?$("[data-floor='" + this.floorid + "']").addClass("hover"):"";} // 貌似废弃了
	},{key:"createSideNav",value:function createSideNav(){var tpl='<ul>',defaultFloorName='',_this=this,floorList=$.extend([],this.floorList);floorList.sort(getSortFun("asc","number"));this.showingFloor = this.showingFloor?this.showingFloor:this.floorid;$.each(floorList,function(i,v){if(_this.showingFloor && _this.showingFloor == "F" + v.id){defaultFloorName = v.comment;return true;}tpl += "<li><a href=\"#\" data-taction='switchfloor'  data-maction='switchfloor'  data-floor=\"" + v.id + "\">" + v.comment + "</a></li> ";if(!_this.showingFloor && defaultFloorName == ''){defaultFloorName = v.comment;}});tpl += '</ul>';if(this.floorList.length == 1){tpl = '';}var noRecordCar=gTools.buildingName == "changtai"?"am-hide":"";tpl = defaultFloorName + tpl;tpl = "<div class=\"am-btn am-btn-default\" id=\"sideNav\">" + tpl + "</div>\n                <div class=\"am-btn am-btn-default \"  id=\"sideCar\">\n                    <ul>\n                        <li class=\"" + noRecordCar + "\">\n                            <a data-maction=\"if-record-car\" href=\"#\">记录车位</a>\n                        </li>\n                        <li><a data-maction=\"search-car\" href=\"#\">找车</a></li>\n                    </ul>\n                </div>\n                <div class=\"am-btn am-btn-default \" id=\"sideToilet\">\n                    <ul>\n                        <li>\n                            <a href=\"#\" data-maction=\"findElevator\"><i class=\"icon elevator\"></i>直梯</a>\n                        </li>\n                        <li><a href=\"#\" data-maction=\"findZig\"><i class=\"icon zig\"></i>扶梯</a></li>\n                        <li>\n                            <a href=\"#\" data-maction=\"findToilet\"><i class=\"icon toilet\"></i>洗手间</a>\n                        </li>\n                        <li><a href=\"#\" data-maction=\"findExit\"><i class=\"icon exit\"></i>出口</a></li>\n                    </ul>\n                </div>\n                <div class=\"am-btn am-btn-default \" id=\"sideMarket\">\n                    <!--<ul>\n                        <li>\n                            <a href=\"#\" data-maction=\"findPoiByType\" data-type=\"3\">服装</a>\n                        </li>\n                        <li><a href=\"#\" data-maction=\"findPoiByType\" data-type=\"2\">娱乐</a></li>\n                        <li><a href=\"#\" data-maction=\"findPoiByType\" data-type=\"1\">美食</a></li>\n                        <li><a href=\"#\" data-maction=\"findPoiByType\" data-type=\"4\">其他</a></li>\n                    </ul>-->\n                </div>";$(".ctrl-btn2").empty().append(tpl);} // 创建楼层切换按钮
	},{key:"createBottomFloorNav",value:function createBottomFloorNav(){var defaultFloorName='',_this=this,floorList=$.extend([],this.floorList);floorList.sort(getSortFun("desc","number"));this.showingFloor = this.showingFloor?this.showingFloor:this.floorid;var tpl="  <div class=\"floor_change_box\">\n          <div style=\"\" class=\"rtmap_floor_change_list\">\n            <div class=\"top_angle topAngle\">\n              <i class=\"am-icon-chevron-up\"></i>\n            </div>\n            <div class=\"list_scroll\">\n              <ul class=\"floor_list\" >";$.each(floorList,function(i,v){var additionClass='';if(_this.showingFloor && _this.showingFloor == "F" + v.id){defaultFloorName = v.name;additionClass = 'active';}tpl += "<li class=\"" + additionClass + "\" data-taction='switchfloor'  data-maction='switchfloor'  data-floor=\"" + v.id + "\"><a href=\"javascript:;\" >" + v.name + "</a></li> ";});tpl += " </ul>\n            </div>\n            <div class=\"bottom_angle bottomAngle\">\n              <i class=\"am-icon-chevron-down\"></i>\n            </div>\n          </div>\n          <div class=\"rtmap_floor_btn\">" + defaultFloorName + "</div>\n        </div>\n      </div>";$("#floor-bottom").empty().append(tpl);} // alert样式弹窗
	},{key:"alert",value:function alert(text,title,type){text = text?text:"";title = title?title:"";type = type?type:""; // 将对象转化成字符串
	typeof text === 'object' && (text = JSON.stringify(text));typeof title === 'object' && (title = JSON.stringify(title));var tpl="<div class=\"am-modal am-modal-alert " + type + "\" tabindex=\"-1\" id=\"my-alert\">\n                <div class=\"am-modal-dialog\">\n                    <div class=\"am-modal-hd\">" + title + "</div>\n                    <div class=\"am-modal-bd\">" + text + "</div>\n                    <div class=\"am-modal-footer\"><span class=\"am-modal-btn\">确定</span></div>\n                </div>\n            </div>";$("#body").find("#my-alert").remove().end().append(tpl);$("#my-alert").modal();} /**
	     * toast 提示
	     * @author weibin
	     * @param {string|object} argv: A.string类型时为提示的内容; B.object类型时,通过对应的字段指定toast的配置
	     */},{key:"toast",value:function toast(argv){var msg, // 提示信息
	sec, // 指定自动关闭的时间
	cls, // 需额外添加的样式
	$parent, // 提示信息的父容器
	$toast; // toast元素的jquery对象
	if(typeof argv === 'string'){msg = argv;sec = 1;$parent = $('body');}else {msg = argv.msg;sec = argv.sec;$parent = argv.$parent;cls = argv.cls;}cls = cls?'toast ' + cls:'toast'; // 设置最终样式
	$toast = $('<span class="' + cls + '">' + msg + '</span>');$parent.append($toast); // 到达指定时间后,自动隐藏toast提示
	(function($toast){setTimeout(function(){$toast.remove();},sec * 1000);})($toast);} // tianjin 未打开蓝牙提示
	},{key:"alert_1",value:function alert_1(){if(!$.os.ios){this.alert("请先打开蓝牙和gps定位");return;}var tpl="<div class=\"popup\" tabindex=\"-1\" id=\"my-alert1\">\n                <img class=\"popup_img\" src=\"//oex38ct5y.qnssl.com/bt-3_06.png?_=1\">\n                <a class=\"close_pop\" data-maction= \"close_pop\" href=\"javascript:;\"></a>\n                <div class=\"hand\"></div>\n            </div>";$("#body").find("#my-alert1").remove().end().append(tpl); //$("#my-alert1").modal();
	} // 创建缩放按钮等
	},{key:"createCtrlBtn",value:function createCtrlBtn(){var tpl="<div class=\"ctrl-btn-location\">\n                <a class=\"am-btn am-btn-default search\" data-maction=\"location\"><i class=\"am-icon-location-arrow\"></i></a>\n            </div>\n            <div class=\"ctrl-btn hoverBox\">\n                <div class=\"am-btn am-btn-default search\" data-maction=\"location\"><i class=\"am-icon-location-arrow\"></i></div>\n                <a class=\"attention1\" href=\"javascript:;\" data-naction=\"attention\">点击<br/>关注</a>\n                <a class=\"post_btn\" data-maction=\"post_btn\" href=\"javascript:;\"><img class=\"imgsize\" src=\"//oex38ct5y.qnssl.com/img/taiguli/feedback.png\"></a>\n                <div style=\"background: url('//oex38ct5y.qnssl.com/feedback/zoom.png') no-repeat; background-size: 100%;\">\n                    <a class=\"am-btn am-btn-default zoom-in zoom_larger\" data-maction=\"zoom\"></a>\n                    <a class=\"am-btn am-btn-default zoom-out zoom_small\" data-maction=\"zoom\"></a>\n                </div>\n            </div>";$("#btm").append(tpl);} // tianjin 用户反馈弹框
	},{key:"pop_post",value:function pop_post(){var tpl="\n\t    <div class=\"post_main\">\n\t\t    <div class=\"title0\">用户反馈</div>\n\t\t    <a class=\"closebtn0\" data-maction=\"closebtn_post\" href=\"javascript:;\"></a>\n\t\t    <div class=\"am-g icons_container\">\n\t\t\t    <a class=\"am-u-sm-3 sub_container\" data-maction=\"locate_error\" href=\"javascript:;\"><img class=\"icons\" src=\"//oex38ct5y.qnssl.com/feedback/2.png\" /></a>\n\t\t\t    <a class=\"am-u-sm-3 sub_container  am-text-center\" data-maction=\"route_error\" href=\"javascript:;\"><img class=\"icons\" src=\"//oex38ct5y.qnssl.com/feedback/3.png\" /></a>\n\t\t\t    <a class=\"am-u-sm-3 sub_container\" data-maction=\"store_error\" href=\"javascript:;\"><img class=\"icons\" src=\"//oex38ct5y.qnssl.com/feedback/4.png\" /></a>\n                \t    <a class=\"am-u-sm-3 sub_container\" data-maction=\"other_error\" href=\"javascript:;\"><img class=\"icons icon3\" src=\"//oex38ct5y.qnssl.com/feedback/3-01.png\" /></a>\n\t\t    </div>\n\t    </div>\n\t    ";$("body").append(tpl);} // tianjin 用户反馈-定位错误
	},{key:"locate_error",value:function locate_error(){var tpl="\n    \t<div class=\"post_loc_error\">\n    \t\t<div class=\"title0\">定位错误</div>\n    \t\t<a class=\"closebtn0\" data-maction=\"closebtn_post_loc\" href=\"javascript:;\"></a>\n\t\t    <a class=\"goback_btn\" data-maction=\"goback_btn\" href=\"javascript:;\"></a>\n\t\t    <div class=\"icons_container\">\n\t\t\t    <div class=\"am-g\">\n\t\t\t\t    <a id=\"locate_fail\" class=\"am-u-sm-4 sub_loc\" data-maction=\"locate_fail\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"locate_fail_1\" class=\"locate\"><span>定位失败</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t    <a id=\"locate_error\" class=\"am-u-sm-4 sub_loc\" data-maction=\"locate_error0\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"locate_error_1\" class=\"locate middle\"><span>定位不准</span><div class=\"tick\"></div></div></a>\n\t\t\t\t    <a id=\"others_loc\" class=\"am-u-sm-4 sub_loc\" data-maction=\"others_loc\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"others_loc_1\" class=\"locate right tick_other\"><span>其他</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t</div>\n\t\t\t\t<input type=\"text\" class=\"detail_des\" placeholder=\"点击描述问题详情...\" />\n                <input type=\"tel\" class=\"phoneNumber\" style=\"height:36px;line-height:36px;\" placeholder=\"点击输入电话号码...\"/>\n\t\t\t\t<a class=\"submit_btn0\" data-maction=\"submit_btn0\" href=\"javascript:;\">提交</a>\n\t\t    </div>\n    \t</div>\n    \t";$("body").append(tpl);} // tianjin 用户反馈-路径错误
	},{key:"route_error",value:function route_error(){var tpl="\n    \t<div class=\"post_loc_error\">\n    \t\t<div class=\"title0\">路径不合理</div>\n    \t\t<a class=\"closebtn0\" data-maction=\"closebtn_post_loc\" href=\"javascript:;\"></a>\n\t\t    <a class=\"goback_btn\" data-maction=\"goback_btn\" href=\"javascript:;\"></a>\n\t\t    <div class=\"icons_container\">\n\t\t\t    <div class=\"am-g\">\n\t\t\t\t    <a id=\"route_error0\" class=\"am-u-sm-4 sub_loc\" data-maction=\"route_error0\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"route_error0_1\" class=\"locate\"><span>路径错误</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t    <a id=\"detour\" class=\"am-u-sm-4 sub_loc\" data-maction=\"detour\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"detour_1\" class=\"locate middle tick_other\"><span>绕路</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t    <a id=\"others_route\" class=\"am-u-sm-4 sub_loc\" data-maction=\"others_route\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"others_route_1\" class=\"locate right tick_other\"><span>其他</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t</div>\n\t\t\t\t<input type=\"text\" class=\"detail_des\" placeholder=\"点击描述问题详情...\" />\n                <input type=\"tel\" class=\"phoneNumber\" style=\"height:36px;line-height:36px;\" placeholder=\"点击输入电话号码...\"/>\n\t\t\t\t<a class=\"submit_btn0\" data-maction=\"submit_btn1\" href=\"javascript:;\">提交</a>\n\t\t    </div>\n    \t</div>\n    \t";$("body").append(tpl);} // tianjin 用户反馈-店铺错误
	},{key:"store_error",value:function store_error(){var tpl="\n    \t<div class=\"post_loc_error\">\n    \t\t<div class=\"title0\">店铺错误</div>\n    \t\t<a class=\"closebtn0\" data-maction=\"closebtn_post_loc\" href=\"javascript:;\"></a>\n\t\t    <a class=\"goback_btn\" data-maction=\"goback_btn\" href=\"javascript:;\"></a>\n\t\t    <div class=\"icons_container\">\n\t\t\t    <div class=\"am-g\">\n\t\t\t\t    <a id=\"name_error\" class=\"am-u-sm-4 sub_loc\" data-maction=\"name_error\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"name_error_1\" class=\"locate\"><span>名称错误</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t    <a id=\"brand_change\" class=\"am-u-sm-4 sub_loc\" data-maction=\"brand_change\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"brand_change_1\" class=\"locate middle\"><span>品牌更换</span><div class=\"tick\"></div></div></a>\n\t\t\t\t    </a>\n\t\t\t\t    <a id=\"others_st\" class=\"am-u-sm-4 sub_loc\" data-maction=\"others_st\" href=\"javascript:;\">\n\t\t\t\t    \t<div id=\"others_st_1\" class=\"locate right tick_other\"><span>其他</span><div class=\"tick\"></div></div>\n\t\t\t\t    </a>\n\t\t\t\t</div>\n\t\t\t\t<input type=\"text\" class=\"detail_des\" placeholder=\"点击描述问题详情...\" />\n                <input type=\"tel\" class=\"phoneNumber\" style=\"height:36px;line-height:36px;\" placeholder=\"点击输入电话号码...\"/>\n\t\t\t\t<a class=\"submit_btn0\" data-maction=\"submit_btn2\" href=\"javascript:;\">提交</a>\n\t\t    </div>\n    \t</div>\n    \t";$("body").append(tpl);} // tianjin 用户反馈-其他错误
	},{key:"other_error",value:function other_error(){var tpl="\n        <div class=\"post_loc_error\">\n            <div class=\"title0\">其它错误</div>\n            <a class=\"closebtn0\" data-maction=\"closebtn_post_loc\" href=\"javascript:;\"></a>\n            <a class=\"goback_btn\" data-maction=\"goback_btn\" href=\"javascript:;\"></a>\n            <div class=\"icons_container\">\n                <input type=\"text\" class=\"detail_des\" placeholder=\"点击描述问题详情...\" />\n                <input type=\"tel\" class=\"phoneNumber\" style=\"height:36px;line-height:36px;\" placeholder=\"点击输入电话号码...\"/>\n                <a class=\"submit_btn0\" data-maction=\"submit_btn3\" href=\"javascript:;\">提交</a>\n            </div>\n        </div>\n        ";$("body").append(tpl);} // tianjin 用户反馈-上报提交成功弹框提示
	},{key:"success_tips",value:function success_tips(){var tpl="\n    \t<div class=\"success_tips\">\n    \t\t<div style=\"height:14px\">\n\t\t\t<a class=\"closebtn0\" data-maction=\"closebtn_tips\" href=\"javascript:;\"></a>\n\t\t\t</div>\n    \t\t<div class=\"green_tick\"></div>\n    \t\t<div class=\"tips_content\">\n\t\t   \t\t<p style=\"margin:0\">您已成功提交，</p>\n\t\t   \t\t<p style=\"margin:0\">非常感谢您的宝贵建议！</p>\n\t\t   \t</div>\n    \t</div>\n    \t";$("body").append(tpl);} // 当地图缩放时  设置图标等跟着一起缩放以达到大小不变
	},{key:"setPinScale",value:function setPinScale(){var scale=this.cursorScale * this.initialRatio / Number(this.ratio);scale = 40 * this.floorSP[this.showingFloor].p2s / this.ratio / 26;var newScale="scale(" + scale + ")";$(".pin").show().each(function(){var transform=this.getAttribute("transform") || "",translate=transform.match(/translate\(.*?\)/),newTransform=translate + (" " + newScale);if(this.tagName === 'g'){$(this.children[0]).css("transform",newScale);}else {$(this).css("transform",newTransform);}});this._cursorScale = scale || 1;setCursorPosition({X:X,Y:Y},1);this.setPathScale();} // 当地图缩放时  设置路径等跟着一起缩放以达到大小不变
	},{key:"setPathScale",value:function setPathScale(){var _w=this.floorSP[this.showingFloor].p2s * 6 / this.ratio;_w = Math.ceil(_w * 100) / 100;$('[class^=directionPath]').each(function(i,el){if(el.tagName === 'path'){el.style.strokeWidth = _w;}else if(el.tagName === 'text'){el.setAttribute('dy',_w / 2);el.setAttribute("font-size",_w * 1.7);}});} // 初始化平移事件
	},{key:"initPanEvt",value:function initPanEvt(){var transX=0,transY=0,_this=this;var _t=$("#header").find("[data-maction='showNav']").next();var _x=0;var _y=0;var ratio=this.ratio;var panStart=function panStart(e){e.preventDefault();_t.hasClass("am-in") && _t.removeClass("am-in"); //拖拽时隐藏掉顶部的菜单栏
	var matrix=$(this).panzoom('getMatrix');ratio = +matrix[0];_x = +matrix[4];_y = +matrix[5];};var pan=function pan(e){ // TODO fucking TAI KOO LI 妈的智障
	_this.follow = false;var deltaX=0;var deltaY=0;if(e.originalEvent){deltaX = e.originalEvent.gesture.deltaX;deltaY = e.originalEvent.gesture.deltaY;}var _this$floorSP$_this$showingFloor=_this.floorSP[_this.showingFloor];var p2s=_this$floorSP$_this$showingFloor.p2s;var p2sh=_this$floorSP$_this$showingFloor.p2sh;var p2sw=_this$floorSP$_this$showingFloor.p2sw;var s2p=_this$floorSP$_this$showingFloor.s2p; // console.log(_x,deltaX * p2s, _x + deltaX * p2s > 0)
	if(_x + deltaX * p2s > 0){transX = (0 - _x) * s2p;}else if(p2sw * (ratio - 1) + _x + deltaX * p2s < 0){transX = (-p2sw * (ratio - 1) - _x) * s2p;}else {transX = deltaX;} // if(_x + deltaX <= 10 && p2sw * (ratio - 1) + _x + deltaX >= -10 ){
	//     transX = deltaX;
	// }
	if(_y + deltaY * p2s > 0){transY = (0 - _y) * s2p;}else if(p2sh * (ratio - 1) + _y + deltaY * p2s < 0){transY = (-p2sh * (ratio - 1) - _y) * s2p;}else {transY = deltaY;} // if(_y + deltaY <= 10 && p2sh * (ratio - 1) + _y + deltaY >= -10  ){
	//     transY = deltaY;
	// }
	// console.log(transX)
	//console.log(transX,transY)
	// console.log(this.textBox);
	$(this).add(_this.textBox).css({"-webkit-transform":"translate(" + transX + "px," + transY + "px)","transform":"translate(" + transX + "px," + transY + "px)"});};var panEnd=function panEnd(e){var matrix=$(this).panzoom("getMatrix")?$(this).panzoom("getMatrix"):[1,0,0,1,0,0],svg_dom=$(this).children("svg")[0],ratio=matrix[0],p1=svgToPage(1,1,svg_dom),p2=svgToPage(2,2,svg_dom),dx=1 / (p2.x - p1.x),dy=1 / (p2.y - p1.y),mx=+matrix[4] + transX * dx,my=+matrix[5] + transY * dy;mx = Math.round(mx);my = Math.round(my);var newMatrix=[ratio,0,0,ratio,mx,my];transX = 0;transY = 0;$(this).add(_this.textBox).css({"-webkit-transform":"translate(" + transX + "," + transY + ")","transform":"translate(" + transX + "," + transY + ")"}).end().panzoom("setMatrix",newMatrix);_this.transPoiText();};$("#myMaps >div").each(function(i,v){new Hammer(v,{domEvents:true});v.addEventListener("touchmove",function(e){e.preventDefault();},false);});return function(act){if(act === 'bind'){$("#myMaps >div").each(function(i,v){$(v).on("panstart",panStart).on("pan",pan).on("panend",panEnd);});}if(act === 'unbind'){$("#myMaps >div").each(function(i,v){$(v).off("panstart",panStart).off("pan",pan).off("panend",panEnd);});}};} // 初始化缩放事件
	},{key:"initZoomEvt",value:function initZoomEvt(){var _this=this;var o=$("#myMaps >div");!_this.textBox || _this.textBox.length == 0?_this.textBox = $("#body > #text"):"";var isZoom=0,zoomTimer=undefined,textBox=_this.textBox,scale=this.ratio || 2,isTouching=0,paningWhenZooming=0; //在缩放时进行拖拽事件
	//硬编码去掉。后台已经有了缩放参数，不再需要这个数据
	// if(_this.buildingId == 33){
	//     scale = 1.5;
	// }
	var topNavDiv=$("#header").find('div.am-menu-nav'),toggleBtn=$("#header").find(".am-menu-toggle");o.panzoom("destroy");if(!o.filter(":visible").children("svg").length){return;} //console.info(o.filter(":visible"),o.filter(":visible").children("svg"))
	var _o$filter$children$0$getAttribute$split=o.filter(":visible").children("svg")[0].getAttribute("viewBox").split(" ");var _o$filter$children$0$getAttribute$split2=_slicedToArray(_o$filter$children$0$getAttribute$split,4);var _a=_o$filter$children$0$getAttribute$split2[0];var _b=_o$filter$children$0$getAttribute$split2[1];var _w=_o$filter$children$0$getAttribute$split2[2];var _h=_o$filter$children$0$getAttribute$split2[3];o.panzoom({$zoomIn:$(".zoom-in"),$zoomOut:$(".zoom-out"), //$zoomRange: $section.find(".zoom-range"),
	//$reset: $section.find(".reset"),
	startTransform:'matrix(' + scale + ',0,0,' + scale + ',-' + _w / 2 * (scale - 1) + ',-' + _h / 2 * (scale - 1) + ')',increment:1,minScale:1,maxScale:16,disablePan:true,target:"#transArea",sx_zoom:true, //contain: 'invert',
	// onEnd:function(){
	// 	console.log(arguments)
	// },
	onPan:function onPan(event,q,x,y){},onZoom:function onZoom(){if(gTools.IS_HANDLING_PRE_ZOOM_EVENT){log.v('正在进行上一次缩放处理');return;}log.v('新一轮的缩放处理');gTools.IS_HANDLING_PRE_ZOOM_EVENT = true; //gTools.showLoading('正在处理...');
	$('.pin').hide();_this.textBox && _this.textBox.empty(); // 需提前清空文字poi,否则会发生错位
	clearTimeout(zoomTimer);_this.bindPanEvt("unbind");zoomTimer = setTimeout(function(){ // 在地图上添加标尺
	if(!$("#scale").length){$("#body").append("<div id='scale'></div>");}scale = $("#scale");var $svg_obj=$("#myMaps >div").filter(":visible"),$svg=$svg_obj, //.find("svg#jz"),
	svg_dom=$svg.children("svg")[0],matrix=$svg.panzoom("getMatrix")?$svg.panzoom("getMatrix"):[1,0,0,1,0,0],ratio=matrix[0];var e0=svgToPage(0,0,svg_dom),e1=svgToPage(1,1,svg_dom),dx=e1.x - e0.x,text=Math.round(50 / ratio / dx * 5.5) / 10;scale.text(text + " 米");_this.initSetPoiText("zoom")();_this.bindPanEvt("bind");_this.ratio = Number(matrix[0]);_this.setPinScale(); //$svg_obj.trigger('panstart').trigger('pan').trigger('panend');
	//gTools.hideLoading();
	gTools.IS_HANDLING_PRE_ZOOM_EVENT = false;},500); // if(!$("#scale").length){
	// 		$("#body").append("<div id='scale'></div>")
	// }
	// scale = $("#scale");
	// let $svg_obj = $("#myMaps >div").filter(":visible"),
	// 		$svg = $svg_obj,//.find("svg#jz"),
	// 		matrix =$svg.panzoom("getMatrix") ?$svg.panzoom("getMatrix"):[1,0,0,1,0,0] ,
	// 		ratio = matrix[0],
	// 		text = Math.round(50 / ratio * 5.5 )/10;
	// scale.text(text + " 米");
	//return
	// console.log("onzoom")
	// isZoom = 1;//缩放事件
	//
	//
	// if(!isTouching){
	// 	//如果不是手指缩放，即是按键放大缩小键
	// 	// o.find("svg#jz").panzoom("disable");
	// 	// _this.setPoiText = _this.initSetPoiText("create");
	// 	// _this.setPoiText();
	//
	// 	//比例尺设置
	//
	//
	//
	//
	// 	// setTimeout(function(){o.find("svg#jz").panzoom("enable");},50);
	// }else{
	// 	//手指缩放
	// 	paningWhenZooming = 1;
	// 	//L("zoom   paningWhenZooming="+paningWhenZooming)
	// }
	//
	//
	//
	//
	// L("onzoom");
	//   let scale;
	// 	if(!$("#scale").length){
	// 			$("#body").append("<div id='scale'></div>")
	//
	// 	}
	// 	scale = $("#scale");
	//
	//   clearTimeout(zoomTimer);
	//   textBox.empty();
	//
	//
	// 	let x1 = svgToPage(0,0).x,
	// 			x2 = svgToPage(1,0).x,
	// 			//svg_obj = $("#myMaps >div").filter(":visible")[0], //todo  这里有个问题  当是svg的时候 panzoom取值有问题
	// 			$svg_obj = $("#myMaps >div").filter(":visible"),
	// 			$svg = $svg_obj,//.find("svg#jz"),
	// 			matrix =$svg.panzoom("getMatrix") ?$svg.panzoom("getMatrix"):[1,0,0,1,0,0] ,
	// 			ratio = matrix[0],
	// 			text = Math.round(50/(x2 - x1)/ratio * 5.5 )/10;
	// 	scale.text(text + " 米");
	// 	_this.ratio = ratio;
	// 	isZoom = 0;
	// 	//TODO 不知道对不对？
	// 	_this.setPinScale();
	},onStart:function onStart(e1,g,e2,touches){isTouching = 1;if(touches && touches.length == 1 && !isZoom){} //单手指，平滑移动
	//如果楼层是展开的   触发start时将楼层隐藏掉
	if(_this.floorEvt && _this.floorEvt.openstatus){_this.floorEvt.btn.trigger("click");} //如果顶部菜单是展开的   触发start时将菜单隐藏掉
	if(topNavDiv.hasClass("am-in")){toggleBtn.trigger("click");}},onEnd:function onEnd(){isTouching = 0;return;if(paningWhenZooming){paningWhenZooming = 0; //手指缩放over
	}isTouching = 0; //触屏over——其实不一定，很有可能是双手转单手
	return;setTimeout(function(){o.find("svg#jz").panzoom("disable");_this.setPoiText = _this.initSetPoiText("create");_this.setPoiText();setTimeout(function(){o.find("svg#jz").panzoom("enable");},50); //L("onend paningWhenZooming="+paningWhenZooming)
	if(paningWhenZooming){paningWhenZooming = 0;return;} // if(isZoom){
	//     // _this.setPoiText = _this.initSetPoiText("create");
	//     // //console.log(new Date() - a,1111);
	//     // _this.setPoiText();
	//     // isZoom = 0;
	// }else{
	//   L("onendTimeout");
	//     if($.os.ios){
	//         _this.setPoiText();
	//         return;
	//     }
	//     _this.moveOverPoi();
	//
	// }
	},50); //console.log(new Date() - a,2222);
	} /*,
	             // onChange:function(){
	             //     //console.log("onChange");
	             //     $("#body > #text").empty();
	             //     //_this.setPoiText();
	             // }*/});o.each(function(){if(this.id !== _this.floorid){var _$$children$0$getAttribute$split=$(this).children("svg")[0].getAttribute("viewBox").split(" ");var _$$children$0$getAttribute$split2=_slicedToArray(_$$children$0$getAttribute$split,4);var _a2=_$$children$0$getAttribute$split2[0];var _b2=_$$children$0$getAttribute$split2[1];var _w2=_$$children$0$getAttribute$split2[2];var _h2=_$$children$0$getAttribute$split2[3];$(this).panzoom("setMatrix",[scale,0,0,scale,-_w2 / 2 * (scale - 1),-_h2 / 2 * (scale - 1)]);}});} // 显示poi详情-太古里-旧
	},{key:"newShowPoiInfo_TaikooLi",value:function newShowPoiInfo_TaikooLi(arr,categoryId){ //console.log(arr)
	var tpl='',_this=this;var tpl2='<div style="width: 100%;font-size:12px;color:#898989;">';var defaultObj={icon:"",brand:"",detail:"",discountInfo:"",serviceLabels:"",payLabels:""};var url=this.origin;var _w=(winW - 32) / 5;var _flag=false;var brandType='';$.each(arr,function(i,obj){var v=$.extend({},defaultObj,obj),info='';if(v.brand){_flag = true;var iconUrl=undefined,className=v["class"] || "";v.brand = v.brand.replace('服务台','客服中心'); // 服务台 => 客服中心
	iconUrl = "background-image:url(" + _this.setSearchRstImgLink(v.brand,v.icon) + ")";if(v.type == 1){brandType = "美食";}else if(v.type == 2){brandType = "娱乐";}else if(v.type == 3){brandType = "品牌服装";}else if(v.type == 4){brandType = "其他";}else if(v.type == 5){brandType = "停车场";}else if(v.type == 6){brandType = "咖啡甜点";}tpl2 += "<div style=\"height: 108px;\">\n                        <div class=\"BrandIcon\">\n                            <img src=\"data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==\" style=\"" + iconUrl + "\" class=\"" + className + "\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                        </div>\n                        <div style=\"width: 62%;float:left;margin:3px 0px 0px 12px;height:94px;\">\n                            <div style=\"height:25%\">\n                                <span style=\"margin-right:12px;font-weight:900;font-size: 12px;color:#595757;\">" + v.brand.split("#").join(" ") + "</span>\n                            </div>\n                            <div style=\"height:25%;\"><span>" + (v.typeName || "") + "</span></div>\n                            <div class=\"serviceLabels\">"; // 设置服务标签
	if(v.serviceLabels){var tmp=v.serviceLabels;for(var _i=0;_i < tmp.length;_i++) {if(tmp[_i] == "1"){tpl2 += "<a href=\"#\"><img style=\"max-width:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiTaikooLi" + _i + ".png\"/></a>";}}} // 设置带我去
	tpl2 += "</div>\n                        <div style=\"width: 20%\">\n                            <a class=\"am-btn am-btn-default am-btn-xs am-btn-block new-navigate-TaikooLi\" data-maction=\"navigate\" data-maparea=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-poi-id=\"" + v.id + "\" data-brand=\"" + v.brand + "\" style=\"right:34px;\"></a>\n                        </div>\n                        <div class = \"payLabels\">"; // 是指支付标签
	if(v.payLabels){var tmp=v.payLabels;for(var _i2=0;_i2 < tmp.length;_i2++) {if(tmp[_i2] == "1"){if(_i2 == 4){tpl2 += "<a style=\"margin-right:22px;\" href=\"#\"><img style=\"max-height:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiPayLabels" + _i2 + ".png\"/></a>";}else {tpl2 += "<a href=\"#\"><img style=\"max-height:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiPayLabels" + _i2 + ".png\"/></a>";}}}}tpl2 += "</div>\n                        </div>\n                    </div>\n                    <div style=\"width:100%;border-top: 1px dashed #ddd;color:#727171;padding-top: 4px;\">"; // 设置位置
	if(v.address){tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">位置：</span>" + v.address + "</p>";} // 设置营业时间
	if(_this._isCustomerServiceCenter(v.brand)){ // 设置客服中心的营业时间
	if(v.mapArea === 'L1Ser1'){ // "东里客服中心"需特殊指定
	tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">营业时间：</span>周一至周日 10:00-22:00</p>";}else {tpl2 += "<p style=\"height:18px;overflow:hidden; width: 100%;\"><span style=\"width: 64px; display: inline-block;\">营业时间：</span>周一至周五 10:00-22:00</p>";tpl2 += "<p style=\"height:18px;overflow:hidden; width: 100%;\"><span style=\"width: 64px; display: inline-block;\"></span>周六及周日 10:00-22:30</p>";}v.phoneNumber = '65963000'; // 为客服中心设置联系方式
	}else if(_this._isPrePayCardStore(v)){ // 设置预付卡店铺的营业时间
	tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">营业时间：</span>周一至周日 10:00-22:00</p>";} // 设置电话号码
	if(v.phoneNumber){ // 设置后台配置的联系电话
	var phones=v.phoneNumber.match(/\d+/g),phoneTpl=[];phones.forEach(function(tel){if(tel.length === 8){ // 设置固定电话
	tel = _this.IS_TAIKOOLI_SCENE?'+8628' + tel:tel;}phoneTpl.push("<a href=\"tel:" + tel + "\" style=\"color:#2caefc;text-decoration: underline;\">" + tel + "</a>");});if(phoneTpl.length){phoneTpl = phoneTpl.join(' '); // 为多个联系方式添加分隔符
	tpl2 += "<p style=\"height:18px;overflow:hidden;color:#727171;\"><span style=\"width: 64px; display: inline-block;\">联系电话：</span>" + phoneTpl + "</p>";}} // 设置"更多"和"返回"菜单
	tpl2 += "<div class=\"btn-extra-option-box clearfix\">"; // 设置返回业态分类列表
	if(categoryId !== undefined){tpl2 += "<a class=\"btn-extra-option left\" data-naction=\"findLabelsById\" data-id=\"" + categoryId + "\">&lt返回</a>";} // 设置"更多外链"
	v.url = v.url || "http://www.soltklcd.com/zh-CN/";tpl2 += "<a class=\"btn-extra-option right\" href=\"" + v.url + "\">更多&gt</a></div></div>";}});if(!_flag)return;tpl2 += "</div>";this.halfModal(tpl2,{"class":"showPoi flag TaikooLi"});} /**
	     * 融合了轻导航的显示poi详情,目前只针对太古里场景
	     * @author weibin
	     * @param {Array}   arr             必传,poi详情信息
	     * @param {number}  [categoryId]    可选,业态分类id
	     */},{key:"showPoiDetailForTaikooLiWithLightNav",value:function showPoiDetailForTaikooLiWithLightNav(arr,categoryId){ //console.log(arr)
	var tpl='',_this=this;var tpl2='<div style="width: 100%;font-size:12px;color:#898989;">';var defaultObj={icon:"",brand:"",detail:"",discountInfo:"",serviceLabels:"",payLabels:""};var url=this.origin;var _w=(winW - 32) / 5;var _flag=false;var brandType='',floor=undefined;$.each(arr,function(i,obj){var v=$.extend({},defaultObj,obj),info='';if(v.brand){_flag = true;var iconUrl=undefined,className=v["class"] || "";floor = 'F' + v.floorId;v.brand = v.brand.replace('服务台','客服中心'); // 服务台 => 客服中心
	iconUrl = "background-image:url(" + _this.setSearchRstImgLink(v.brand,v.icon) + ")";if(v.type == 1){brandType = "美食";}else if(v.type == 2){brandType = "娱乐";}else if(v.type == 3){brandType = "品牌服装";}else if(v.type == 4){brandType = "其他";}else if(v.type == 5){brandType = "停车场";}else if(v.type == 6){brandType = "咖啡甜点";}tpl2 += "<div style=\"height: 108px;\">\n                        <div class=\"BrandIcon\">\n                            <img src=\"data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==\" style=\"" + iconUrl + "\" class=\"" + className + "\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                        </div>\n                        <div style=\"width: 62%;float:left;margin:3px 0 0 12px;height:94px;\">\n                            <div style=\"height:25%\">\n                                <span style=\"margin-right:12px;font-weight:900;font-size: 12px;color:#595757;\">" + v.brand.split("#").join(" ") + "</span>\n                            </div>\n                            <div style=\"height:25%;\"><span>" + (v.typeName || "") + "</span></div>\n                            <div class=\"serviceLabels\">"; // 设置服务标签
	if(v.serviceLabels){var tmp=v.serviceLabels;for(var _i3=0;_i3 < tmp.length;_i3++) {if(tmp[_i3] == "1"){tpl2 += "<a href=\"javascript:;\"><img style=\"max-width:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiTaikooLi" + _i3 + ".png\"/></a>";}}} // 设置支付标签
	tpl2 += "</div><div class = \"payLabels\">";if(v.payLabels){var tmp=v.payLabels;for(var _i4=0;_i4 < tmp.length;_i4++) {if(tmp[_i4] == "1"){if(_i4 == 4){tpl2 += "<a style=\"margin-right:22px;\" href=\"javascript:;\"><img style=\"max-height:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiPayLabels" + _i4 + ".png\"/></a>";}else {tpl2 += "<a href=\"javascript:;\"><img style=\"max-height:100%;\" src=\"//oex38ct5y.qnssl.com/TaikooLiPayLabels" + _i4 + ".png\"/></a>";}}}} // 设置中间层的信息
	tpl2 += "</div></div></div><div style=\"width:100%;border-top: 1px dashed #ddd;color:#727171;padding-top: 4px;\">"; // 设置位置
	if(v.address){tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">位置：</span>" + v.address + "</p>";} // 设置营业时间
	if(_this._isCustomerServiceCenter(v.brand)){ // 设置客服中心的营业时间
	if(v.mapArea === 'L1Ser1'){ // "东里客服中心"需特殊指定
	tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">营业时间：</span>周一至周日 10:00-22:00</p>";}else {tpl2 += "<p style=\"height:18px;overflow:hidden; width: 100%;\"><span style=\"width: 64px; display: inline-block;\">营业时间：</span>周一至周五 10:00-22:00</p>";tpl2 += "<p style=\"height:18px;overflow:hidden; width: 100%;\"><span style=\"width: 64px; display: inline-block;\"></span>周六及周日 10:00-22:30</p>";}v.phoneNumber = '65963000'; // 为客服中心设置联系方式
	}else if(_this._isPrePayCardStore(v)){ // 设置预付卡店铺的营业时间
	tpl2 += "<p style=\"height:18px;overflow:hidden;\"><span style=\"width: 64px;\">营业时间：</span>周一至周日 10:00-22:00</p>";} // 设置电话号码
	if(v.phoneNumber){ // 设置后台配置的联系电话
	var phones=v.phoneNumber.match(/\d+/g),phoneTpl=[];phones.forEach(function(tel){if(tel.length === 8){ // 设置固定电话
	tel = _this.IS_TAIKOOLI_SCENE?'+8628' + tel:tel;}phoneTpl.push("<a href=\"tel:" + tel + "\" style=\"color:#2caefc;text-decoration: underline;\">" + tel + "</a>");});if(phoneTpl.length){phoneTpl = phoneTpl.join(' '); // 为多个联系方式添加分隔符
	tpl2 += "<p style=\"height:18px;overflow:hidden;color:#727171;\"><span style=\"width: 64px; display: inline-block;\">联系电话：</span>" + phoneTpl + "</p>";}} // 设置"更多"和"返回"菜单
	tpl2 += "<div class=\"btn-extra-option-box clearfix\">"; // 设置返回业态分类列表
	if(categoryId !== undefined){tpl2 += "<a class=\"btn-extra-option left\" data-naction=\"findLabelsById\" data-id=\"" + categoryId + "\">&lt返回</a>";} // 设置"更多外链"
	v.url = v.url || "http://www.soltklcd.com/zh-CN/";tpl2 += "<a class=\"btn-extra-option right\" href=\"" + v.url + "\">更多&gt</a></div>"; // 1.添加设置起点和终点按钮; 2.添加最外层的闭合标签
	tpl2 += "<div class=\"btn-start-and-end-box\"><button class=\"btn-nav btn-set-start-point\" data-maction=\"fromHere\" data-floor=\"" + floor + "\" data-map-area=\"" + v.mapArea + "\">从这里出发</button><button class=\"btn-nav btn-set-end-point\" data-maction=\"toHere\" data-floor=\"" + floor + "\" data-map-area=\"" + v.mapArea + "\">到这里去</button></div></div>";}});if(!_flag)return;tpl2 += "</div>";this.halfModal(tpl2,{"class":"showPoi flag TaikooLi"},true);} // 显示导航半弹框
	},{key:"showNavHalfModal",value:function showNavHalfModal(startPoint,endPoint){startPoint = startPoint || {};endPoint = endPoint || {};var _this=this,startPointName=startPoint.brand?startPoint.brand.includes('#')?startPoint.brand.split('#')[1]:startPoint.brand:'请选择起点',endPointName=endPoint.brand?endPoint.brand.includes('#')?endPoint.brand.split('#')[1]:endPoint.brand:'请选择终点';var tpl="<div class=\"nav-start-and-end-point-desc\">\n                <div class=\"nav-point-group nav-start-point-group\"><span class=\"nav-point-label nav-start-point-label\">起点：</span><a class=\"nav-point-name nav-start-point-name\" data-maction=\"switchNavStartPoint\" id=\"js_nav_start_point_name\">" + startPointName + "</a></div>\n                <div class=\"nav-point-group nav-end-point-group\"><span class=\"nav-point-label nav-end-point-label\">终点：</span><a class=\"nav-point-name nav-end-point-name\">" + endPointName + "</a></div>\n            </div>\n            <div class=\"nav-start-nav-group\"><button class=\"btn-start-nav\" data-maction=\"startNavigate\">开始导航</button></div>";this.halfModal(tpl,{'class':'showPoi flag nav-half-modal'},true);} // 显示poi详情-点击poi商铺
	},{key:"newShowPoiInfo",value:function newShowPoiInfo(arr){ //console.log(arr)
	var tpl='',_this=this;var tpl2='<table style="width: 100%">';var defaultObj={icon:"",brand:"",detail:"",discountInfo:""}; //let url = this.origin;
	var _w=(winW - 32) / 5;var _flag=false;$.each(arr,function(i,obj){var v=$.extend({},defaultObj,obj),info='';if(v.brand){_flag = true;var className=v["class"] || '',iconUrl=className?'':_this.setImgLink(v.icon); //if (v.icon) {
	//    iconUrl = url + v.icon;
	//}
	tpl2 += "<tr>\n                        <td style=\"width: 20%;text-align:center\"><img src=\"" + iconUrl + "\" style=\"width: " + _w + "px !important;height:" + _w + "px;\" class=\"" + className + "\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\"></td>\n                        <td style=\"width: 80%\">\n                        <p>" + v.brand + "</p>\n                        <p style=\"overflow:hidden;\">" + (v.typeName?v.typeName.replace(/,/g,'/'):'') + "</p>\n                        <div class=\"poi-desc\">\n                            <p>" + v.discountInfo + "</p>\n                            <p>" + v.detail + "</p>\n                        </div>\n                        <td style=\"width: 0\">\n                            <a class=\"am-btn am-btn-default am-btn-xs am-btn-block new-navigate\" data-maction=\"navigate\" data-maparea=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-poi-id=\"" + v.id + "\" data-brand=\"" + v.brand + "\">带我去</a>\n                        </td>\n                        </td>\n                    </tr>";}});if(!_flag)return;tpl2 += "</table>";this.halfModal(tpl2,{"class":"showPoi flag"});} // 显示poi列表信息: 搜索结果
	},{key:"showPoiInfo",value:function showPoiInfo(arr){var tpl='',_this=this;var tpl2='<table style="width: 100%">';var defaultObj={icon:"",brand:"",detail:"",discountInfo:""};var url=this.origin;var _w=(winW - 32) / 5;$.each(arr,function(i,obj){ //普通poi
	// {
	//   x:x,
	//   y:y,
	//   icon:icon,
	//   floorId:floorId,
	//   brand:brand,
	//   detail:detail,
	//   discountInfo:discountInfo,
	//   mapArea:mapArea
	// }
	var v=$.extend({},defaultObj,obj),info='';if(v.brand){var iconUrl='',className=v["class"] || ''; //if (v.icon) {
	//    iconUrl = url + v.icon;
	//}
	iconUrl = _this.setSearchRstImgLink(v.brand,v.icon);var floorName=_this.floorList.filter(function(vv){return vv.id === v.floorId;})[0].name;tpl2 += "<tr>\n                        <td  style=\"width: 20%\"><img src=\"" + iconUrl + "\" style=\"width: 100%;/* height:" + _w + "px; */height:auto\" class=\"" + className + "\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\"></td>\n                        <td style=\"width: 60%\">\n                        <p style=\"font-weight:900\">" + v.brand.split("#").join(" ") + "</p>\n                        <p>" + (v.typeName || "") + "</p>\n                        <p>" + v.discountInfo + "</p>\n                        <p style=\"color:#aaa\">" + floorName + "</p>\n                        <td style=\"width: 20%\">\n                            <!--<a class=\"am-btn am-btn-default am-btn-xs am-btn-block take-me-new\" data-maction=\"navigate\" data-maparea=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-poi-id=\"" + v.id + "\" data-brand=\"" + v.brand + "\">带我去</a>-->\n                            <a class=\"am-btn am-btn-default am-btn-xs am-btn-block take-me-new\" data-maction=\"toHere\" data-floor=\"" + ('F' + v.floorId) + "\" data-map-area=\"" + v.mapArea + "\">带我去</a>\n                        </td>\n                        </td>\n                    </tr>";tpl += "<div class=\"am-g\">\n                        <div class=\"am-u-sm-3\"><img src=\"" + url + v.icon + "\" style=\"width: 100%;height:" + _w + "px;\"> </div>\n                        <div class=\"am-u-sm-9\">\n                        <p>" + v.brand + "</p>\n                        <p>" + (v.typeName || "") + "</p>\n                        <p>" + v.discountInfo + "</p>\n                        </div>\n                    </div>";} //红包
	/*
	             * {
	             "id": "191",
	             "red_name": "哈尔滨K友汇福利",
	             "start_time": "1439360160",
	             "end_time": "1439446560",
	             "red_blessings": "恭喜发财",
	             "marketing_copy": "快来领奖吧",
	             "merchant_name": "哈尔滨K友汇",
	             "logo": "/static/upload/image/109/20150724/1437715968147790.png",
	             "money": "100.00",
	             "amount": "",
	             "money_type": "1",
	             "grand_method": "1",
	             "force_attention": "0",
	             "random_money_min": "1.00",
	             "random_money_max": "5.00",
	             "fixed_money": null,
	             "fixed_money_copy": null,
	             "flag": "1",
	             "addtime": "1439360260",
	             "red_note": " ",
	             "vitality": "0",
	             "money_balance": "97.34",
	             "ad_coupon_type": "2",
	             "floor_id": "F30",
	             "position_id": "F1-058",
	             "infos": "活动测试"
	             }
	             * */if(v.redpacks){v.redpacks.ss_type = 'redpacks';v.redpacks.ss_floor = "";v.redpacks.ss_point = "";info = JSON.stringify(v.redpacks);tpl2 += "\n                <tr>\n                    <td  style=\"width: 20%\"><img src=\"//y.wizarcan.com" + v.redpacks.logo + "\" style=\"width: 100%;\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\"></td>\n                    <td  style=\"width: 60%\">\n                    <p>" + v.redpacks.red_name + "</p>\n                    <p>" + v.redpacks.infos + "</p>\n                    </td>\n                    <td  style=\"width: 20%\">\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-info='" + info + "' data-maction=\"links-detail\" data-anls=\"event\" data-anls-category=\"/idp/naviCat/shopShowTicketDetail\" data-anls-action=\"shopShowTicketDetail:" + _this.buildingName + "\" data-anls-label=\"\" data-anls-value=\"\">详情</a>\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" href=\"" + v.redpacks.get_url + "\" " + v.redpacks.disable + " data-maction=\"receive-links\"  data-anls=\"event\" data-anls-category=\"/idp/naviCat/shopGetTicket\" data-anls-action=\"shopGetTicket:" + _this.buildingName + "\" data-anls-label=\"\" data-anls-value=\"\">领取</a>\n                    </td>\n                </tr>\n                ";tpl += "\n                <div class=\"am-g\">\n                    <div class=\"am-u-sm-3\"><img src=\"//y.wizarcan.com/" + v.redpacks.logo + "\" style=\"width: 100%;\"> </div>\n                    <div class=\"am-u-sm-9\">\n                    <p>" + v.redpacks.red_name + "</p>\n                    <p>" + v.redpacks.infos + "</p>\n                    <a class=\"am-btn am-btn-default am-btn-xs am-hide\" " + v.redpacks.disable + " href=\"" + v.redpacks.get_url + "\" data-maction=\"receive-links\">领取</a>\n                    </div>\n                </div>\n                ";} //代金券
	/*
	             {
	             "id": "1163",
	             "auth_type": "2",
	             "link_title": "世博源女士馆10元现金券",
	             "link_desc": "",
	             "kindly_reminder": "限满58元抵用",
	             "merchant_name": "世博源",
	             "background_img": "/static/upload/image/204/20150818/1439892174281212.jpg",
	             "start_time": "1440295200",
	             "end_time": "1440338400",
	             "amount": "65",
	             "times_limit": "0",
	             "exp_date": "0",
	             "guide_attention": "0",
	             "force_attention": "0",
	             "content": "<p>1、本券仅限世博源女士馆内（化妆品、黄金珠宝类商户除外）使用，请在消费前出示</p><p>2、本券限满58元抵用，限单件商品使用；</p><p>3、本券不与店内其他优惠同享（详询商户）；</p><p>4、本券不兑换现金、不找零；</p><p>5、使用地点：4区G层、L1层收银台</p><p>​<br></p><p>世博源地址:上海市浦东新区上南路168号、世博大道1368号</p><p>服务热线：021-31117777</p>",
	             "button_title": "",
	             "addtime": "2015-08-12 01:15:17",
	             "flag": "1",
	             "admin_id": "204",
	             "wizarpos_id": "",
	             "vitality": "0",
	             "link_cat": "0",
	             "link_cover": "世博源女士馆10元现金券",
	             "send_flag": "1",
	             "brought_num": "65",
	             "ad_coupon_type": "1",
	             "floor_id": "F30",
	             "position_id": "F1-019",
	             "infos": "优惠券备注说明"
	             }
	             * */if(v.links && !v.links.idpObj.isHide){v.links.ss_type = 'links';v.links.ss_floor = "";v.links.ss_point = "";info = JSON.stringify(v.links);tpl2 += "\n                <tr>\n                    <td  style=\"width: 20%\"><img src=\"" + v.links.background_img + "\" style=\"width: 100%;height:" + _w + "px;\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\"></td>\n                    <td  style=\"width: 60%\">\n                    <p>" + v.links.link_title + "</p>\n                    <p>" + v.links.infos + "</p>\n                    </td>\n                    <td  style=\"width: 20%\">\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-info='" + info + "' data-maction=\"links-detail\">详情</a>\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" href=\"" + v.links.get_url + "\" " + v.links.disable + " data-maction=\"receive-links\" data-point=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">领取</a>\n                    </td>\n                </tr>\n                ";tpl += "\n                <div class=\"am-g\">\n                    <div class=\"am-u-sm-3\"><img src=\"" + v.links.background_img + "\" style=\"width: 100%;\"> </div>\n                    <div class=\"am-u-sm-9\">\n                    <p>" + v.links.link_title + "</p>\n                    <p>" + v.links.infos + "</p>\n                    <a class=\"am-btn am-btn-default am-btn-xs am-hide\" href=\"" + v.links.get_url + "\" " + v.links.disable + " data-maction=\"receive-links\">领取</a>\n                    </div>\n                </div>\n                ";} //优惠券
	/*{
	             "id": "150",
	             "card_type": "GENERAL_COUPON",
	             "least_cost": "0",
	             "reduce_cost": "0",
	             "discount": "0",
	             "brand_name": "坤虫现场摇",
	             "logo_url": "//y.wizarcan.com/static/upload/image/74/20150807/1438943043223678.png",
	             "code_type": "CODE_TYPE_QRCODE",
	             "title": "名片券100元",
	             "sub_title": "节约用纸 爱护森林",
	             "color": "Color020",
	             "notice": "使用时请出示此券",
	             "service_phone": "0472-3628377",
	             "description": "此券不找零，不开发票，\r\n不与其他他活动同时使用\r\n此券最终解释权归坤虫所有\r\n",
	             "quantity": "72",
	             "date_type": "DATE_TYPE_FIX_TERM",
	             "begin_timestamp": "0",
	             "end_timestamp": "0",
	             "fixed_term": "13",
	             "fixed_begin_term": "0",
	             "get_limit": "1",
	             "can_share": "0",
	             "can_give_friend": "1",
	             "privilege_detail": "此券只限坤虫现场摇使用\r\n凭券可兑换名片1000张\r\n",
	             "detail": null,
	             "card_id": "pGW-ExNFZtN4xwoYsv8_RLcAP-JY",
	             "pass": "3",
	             "status": "1",
	             "createtime": "1438943762",
	             "ad_coupon_type": "3",
	             "floor_id": "F30",
	             "position_id": "F1-026",
	             "infos": "备注说明"
	             }
	             */if(v.cards){v.cards.ss_type = 'cards';v.cards.ss_floor = "";v.cards.ss_point = "";info = JSON.stringify(v.cards);tpl2 += "\n                <tr>\n                    <td style=\"width: 20%\"><img src=\"" + v.cards.logo_url + "\" style=\"width: 100%;height:" + _w + "px;\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\"></td>\n                    <td style=\"width: 60%\">\n                    <p>" + v.cards.title + "</p>\n                    <p>" + v.cards.infos + "</p>\n                    </td>\n                    <td style=\"width: 20%\">\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-info='" + info + "' data-maction=\"links-detail\">详情</a>\n                        <a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" href=\"" + v.cards.get_url + "\" " + v.card.disable + " data-maction=\"receive-links\">领取</a>\n                    </td>\n                </tr>\n                ";tpl += "\n                <div class=\"am-g\">\n                    <div class=\"am-u-sm-3\"><img src=\"" + v.cards.logo_url + "\" style=\"width: 100%;\"> </div>\n                    <div class=\"am-u-sm-9\">\n                    <p>" + v.cards.title + "</p>\n                    <p>" + v.cards.infos + "</p>\n                    <a class=\"am-btn am-btn-default am-btn-xs am-hide\" href=\"" + v.cards.get_url + "\" data-maction=receive-links\">领取</a>\n                    </div>\n                </div>\n                ";}tpl += "<div class=\"am-g\">\n                  <a class=\"am-btn am-btn-default am-btn-block\" data-maction=\"navigate\" data-maparea=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">带我去</a>\n                </div>"; /*tpl2 += `<div class="am-g">
	             <a class="am-btn am-btn-default am-btn-block" data-maction="navigate" data-target="${v.mapArea}" data-floor="F${v.floorId}">带我去</a>
	             </div>`*/});tpl2 += "</table>";if(!tpl){return;}this.halfModal(tpl2,{"class":"showPoi flag multiple"});} // 监听hash值变化
	},{key:"hashChange",value:function hashChange(hashVal,opt){ //let dtd = $.Deferred();
	hashVal = hashVal.split("#").join("");var _this=this;if(this.oldHash != hashVal){switch(this.oldHash){case 'links': //_this.hideFullPageModal()
	break;case "linksInfo":_this.hideFullPageModal(2);break;default:break;}this.oldHash = hashVal;switch(hashVal){case "links":_this.notReceivingLinks();break;case "activities":_this.couponListModal();break;case "foods":_this.poiTypeListModal2(1);break;case "coffee":_this.poiTypeListModal2(6);break;case "funs":_this.poiTypeListModal2(2);break;case 'linksInfo':setTimeout(function(){_this.showFullPageModal(2);},100);break;case "showSkinList":_this.showSkinList();break;default:_this.hideFullPageModal(); //var msg = '[hashChange] Not need extra handle for hash change to ' + hashVal;
	//L(msg);
	//log.w(msg);
	break;}}else {L('hash not change');}} // 创建用来清除路径和钉子的按钮
	},{key:"createClearPinBtn",value:function createClearPinBtn(){var btn=$("#clearPin");if(btn.length){btn.show();return;}$("#body").append("<div class=\"wzmap-clear-pin\" id=\"clearPin\">\n                <a class=\"am-btn am-btn-warning am-btn-xs\" data-maction='remove-pin'></a>\n            </div>");} // tianjin 显示外链详情
	},{key:"showLinksDetail",value:function showLinksDetail(info){ //info = {"id":"191","auth_type":"2","link_title":"送雪肌精美白洁面乳","link_desc":"KOSE","kindly_reminder":"请详细查看下方优惠券使用规则","merchant_name":"海港城","background_img":"/static/upload/image/49/20150612/1434106260133293.jpg","start_time":"1433952000","end_time":"1438358399","amount":"10000","times_limit":"0","exp_date":"0","guide_attention":"0","force_attention":"0","content":"<p>【地址】</p><p>FACESSS</p><p><br/></p><p>【优惠券详情】：</p><p>1. 购买雪肌精防晒或雪肌精產品满HK$220, 即可获赠雪肌精美白洁面乳20mL;</p><p>2.以上优惠只适用于 KOSE 海港城 FACESSS 专柜；</p><p>3.优惠套装及赠品数量有限，送/ 售完即止；</p><p>4.以上优惠不可与其他优惠同时使用；</p><p>5.如有任何争议，KOSE 保留最终决定权。</p><p><br/></p><p>【现场使用礼遇方式】</p><p>a.如活动页面已关闭：请开启蓝牙并连接网络，使用微信摇一摇周边，摇出活动页面，点击“我的券”，换领时需向店员出示优惠券，并经店员点击核销方可使用。</p><p>b.如已随机获取礼遇：请关闭优惠券弹窗页面，回到活动页面点击右上角“我的券”，换领时需向店员出示优惠券，并经店员点击核销方可使用。</p><p><br/></p><p>【备注】</p><p>a.如将获取的礼遇分享给好友，可在品牌主页直接选择自己心仪的礼遇；</p><p>b.获得好友分享的礼遇，领取后，可到达门店开启蓝牙，使用微信摇一摇周边，摇出活动页面，点击“我的券”，换领时需向店员出示优惠券，并经店员点击核销方可使用。</p><p><br/></p><p>【条款及细则】</p><p>•礼遇只适用于海港城分店。</p><p>•每项礼遇设有独立二维码，顾客可以在主页面按“我的券”查看所得礼遇，换领时需向店舖出示优惠券，并经店员点击核销方可使用。</p><p>•每用户只限享用每项礼遇一次，同一微信号/ 电话号码/ 手机装置皆被定为同一用户。</p><p>•礼遇数量有限，先换先得，换完即止。</p><p>•礼遇不可兑换现金或其他优惠。</p><p>•礼遇不可与其他优惠同时使用。</p><p>•礼遇条款及细则请参阅各礼遇详情。</p><p>•参与商户有权更改礼遇详情而不作另行通知。</p><p>•如有任何争议，海港城置业有限公司及参与商户保留最终决定权。</p><p><br/></p>","button_title":"","addtime":"2015-06-03 09:28:04","flag":"1","admin_id":"49","wizarpos_id":"","vitality":"0","link_cat":"3","link_cover":"送雪肌精美白洁面乳","send_flag":"0","brought_num":"221","ad_coupon_type":"2","floor_id":"F49","position_id":"B-4B11","infos":"红包备注","get_url":"http://y.wizarcan.com/yao/yao_api/get_link/2/191","view_url":"http://y.wizarcan.com/yao/yao_api/view_link/2/191","ss_type":"links","ss_floor":"F49","ss_point":"B-4B11"}
	//info = {"id":"191","red_name":"哈尔滨K友汇福利","start_time":"1439360160","end_time":"1439446560","red_blessings":"恭喜发财","marketing_copy":"快来领奖吧","merchant_name":"哈尔滨K友汇","logo":"/static/upload/image/109/20150724/1437715968147790.png","money":"100.00","amount":"","money_type":"1","grand_method":"1","force_attention":"0","random_money_min":"1.00","random_money_max":"5.00","fixed_money":null,"fixed_money_copy":null,"flag":"1","addtime":"1439360260","red_note":" ","vitality":"0","money_balance":"97.34","ad_coupon_type":"1","floor_id":"F49","position_id":"B-4B35","infos":"","get_url":"http://y.wizarcan.com/yao/yao_api/get_link/1/191","view_url":"http://y.wizarcan.com/yao/yao_api/view_link/1/191","ss_type":"redpacks","ss_floor":"F49","ss_point":"B-4B35"}
	//info = {"id":"151","card_type":"CASH","least_cost":"5000","reduce_cost":"500","discount":"0","brand_name":"唐小甜","logo_url":"http://y.wizarcan.com/static/upload/image/171/20150806/1438823453350862.jpg","code_type":"CODE_TYPE_TEXT","title":"唐小甜满50减5","sub_title":"唐小甜，快乐很简单","color":"Color030","notice":"领取后使用","service_phone":"15757177248","description":"关注微信公众账号","quantity":"5000","date_type":"DATE_TYPE_FIX_TIME_RANGE","begin_timestamp":"1438823460","end_timestamp":"1440983460","fixed_term":"0","fixed_begin_term":"0","get_limit":"10","can_share":"0","can_give_friend":"1","privilege_detail":null,"detail":null,"card_id":"p6ri-s-xSWFmDqiemtFBaY2XdleQ","pass":"1","status":"1","createtime":"1438823932","ad_coupon_type":"4","floor_id":"F49","position_id":"B-4B09","infos":"优惠券备注","get_url":"http://y.wizarcan.com/yao/yao_api/get_link/4/151","view_url":"http://y.wizarcan.com/yao/yao_api/view_link/4/151","ss_type":"cards","ss_floor":"F49","ss_point":"B-4B09"}
	info = typeof info == "string"?JSON.parse(info):info;var tpl='',url=this.origin,_this=this;if(info.ss_type == 'redpacks'){tpl += "<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                <ul class=\"am-list\">\n                    <li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                        <div class=\"am-u-sm-4 am-list-thumb\">\n                            <a>\n                                <img src=\"//y.wizarcan.com" + info.logo + "\" alt=\"\">\n                            </a>\n                        </div>\n                        <div class=\"am-u-sm-8 am-list-main\">\n                            <h3 class=\"am-list-item-hd\">\n                               " + info.red_name + "\n                            </h3>\n                            <div class=\"am-list-item-text\">" + info.infos + "</div>\n                        </div>\n                        <!--<div class=\"am-u-sm-4 am-list-main am-text-right\">\n                        </div>-->\n                    </li>\n                </ul>\n                </div>\n                </div>\n                ";if(info.start_time && info.start_time != 0){var begin=new Date(Number(info.start_time) * 1000).format('yyyy-MM-dd hh:mm:ss'),end=new Date(Number(info.end_time) * 1000).format('yyyy-MM-dd hh:mm:ss');tpl += "<p>有效日期：" + begin + "  " + end + "</p>";}}else if(info.ss_type == "cards"){tpl += "<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                <ul class=\"am-list\">\n                    <li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a>\n                                    <img src=\"" + info.logo_url + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-8 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                   " + info.title + "\n                                </h3>\n                                <div class=\"am-list-item-text\">" + info.infos + "</div>\n                            </div>\n                        </li>\n                </ul>\n                </div>\n                </div>\n                ";if(info.begin_timestamp && info.begin_timestamp != 0){var begin=new Date(Number(info.begin_timestamp) * 1000).format('yyyy-MM-dd hh:mm:ss'),end=new Date(Number(info.end_timestamp) * 1000).format('yyyy-MM-dd hh:mm:ss');tpl += "<p>有效日期：" + begin + "  " + end + "</p>";}else {tpl += "<p>有效日期：领取后" + info.fixed_term + "天有效，有效期" + info.fixed_begin_term + "天</p>";}}else if(info.ss_type == "links"){tpl += "<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                <ul class=\"am-list\">\n                    <li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a>\n                                    <img src=\"" + info.background_img + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-8 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                   " + info.link_title + "\n                                </h3>\n                                <div class=\"am-list-item-text\">" + info.link_cover + "</div>\n                            </div>\n\n                        </li>\n                </ul>\n                </div>\n                </div>\n                ";if(info.start_time && info.start_time != 0){var begin=new Date(Number(info.start_time) * 1000).format('yyyy-MM-dd hh:mm:ss'),end=new Date(Number(info.end_time) * 1000).format('yyyy-MM-dd hh:mm:ss');tpl += "<p>有效日期：" + begin + "  " + end + "</p>";}else if(info.exp_date && info.exp_date != 0){tpl += "<p>有效日期：领取后" + info.exp_date + "天有效</p>";}else {tpl += "<p>无限期</p>";}}if(info.merchant_name){tpl += "<p>店铺名称：" + info.merchant_name + "</p>";}if(info.service_phone){tpl += "<p>服务电话：" + info.service_phone + "</p>";}if(info.content){tpl += "<p>使用说明：" + info.content + "</p>";}tpl += "<button type=\"button\" class=\"am-btn am-btn-default am-btn-block\" href=\"" + info.get_url + "\" data-maction=\"receive-links\" " + info.disable + " data-floor='" + info.ss_floor + "' data-point=\"" + info.ss_point + "\" data-anls=\"event\" data-anls-category=\"/idp/naviCat/detailGetTicket\" data-anls-action=\"detailGetTicket:" + _this.buildingName + "\" data-anls-label=\"detailGetTicket:" + _this.buildingName + "|" + info.id + "\" data-anls-value=\"\">领取</button>";tpl += "<br/><button class=\"am-btn am-btn-default am-btn-block\" data-maction=\"return\">返回</button>";$("#fullModal2").empty().append(tpl);} // 未接收到外链 废弃
	},{key:"notReceivingLinks",value:function notReceivingLinks(){this.headerOfLinks();var tpl2='',mapList=this.couponList,url=this.origin,_this=this;$.each(mapList,function(key,arr){var defaultObj={icon:"",brand:"",detail:"",discountInfo:""};$.each(arr,function(i,obj){ //普通poi
	var v=$.extend({},defaultObj,obj),info='';if(v.brand){tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a href=\"#\" class=\"\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                                    <img src=\"" + _this.setImgLink(v.icon) + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">" + (v.brand + '--' + v.discountInfo) + "</h3>\n                                <div class=\"am-list-item-text\">" + (v.typeName || "") + "</div>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main am-text-right\">\n                                <button type=\"button\" class=\"am-btn am-btn-default\">卡券详情</button>\n                                <button type=\"button\" class=\"am-btn am-btn-default\">领取</button>\n                            </div>\n                            <!--<a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-maction=\"navigate\" data-target=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">带我去</a>-->\n                        </li>";} //红包
	/*
	                 * {
	                 "id": "191",
	                 "red_name": "哈尔滨K友汇福利",
	                 "start_time": "1439360160",
	                 "end_time": "1439446560",
	                 "red_blessings": "恭喜发财",
	                 "marketing_copy": "快来领奖吧",
	                 "merchant_name": "哈尔滨K友汇",
	                 "logo": "/static/upload/image/109/20150724/1437715968147790.png",
	                 "money": "100.00",
	                 "amount": "",
	                 "money_type": "1",
	                 "grand_method": "1",
	                 "force_attention": "0",
	                 "random_money_min": "1.00",
	                 "random_money_max": "5.00",
	                 "fixed_money": null,
	                 "fixed_money_copy": null,
	                 "flag": "1",
	                 "addtime": "1439360260",
	                 "red_note": " ",
	                 "vitality": "0",
	                 "money_balance": "97.34",
	                 "ad_coupon_type": "2",
	                 "floor_id": "F30",
	                 "position_id": "F1-058",
	                 "infos": "活动测试"
	                 }
	                 * */if(v.redpacks){v.redpacks.ss_type = 'redpacks';v.redpacks.ss_floor = key;v.redpacks.ss_point = i;info = JSON.stringify(v.redpacks);tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a href=\"#\" class=\"\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                                    <img src=\"//y.wizarcan.com" + v.redpacks.logo + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                   " + v.redpacks.red_name + "\n                                </h3>\n                                <div class=\"am-list-item-text\">" + v.redpacks.infos + "</div>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main am-text-right\">\n                                <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"links-detail\" data-info='" + info + "'>卡券详情</button>\n                                <button type=\"button\" class=\"am-btn am-btn-default\" " + v.redpacks.disable + " href=\"" + v.redpacks.get_url + "\" data-maction=\"receive-links\" data-floor='" + key + "' data-point=\"" + i + "\">领取</button>\n                            </div>\n                            <!--<a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-maction=\"navigate\" data-target=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">带我去</a>-->\n                        </li>";} //代金券
	/*
	                 {
	                 "id": "1163",
	                 "auth_type": "2",
	                 "link_title": "世博源女士馆10元现金券",
	                 "link_desc": "",
	                 "kindly_reminder": "限满58元抵用",
	                 "merchant_name": "世博源",
	                 "background_img": "/static/upload/image/204/20150818/1439892174281212.jpg",
	                 "start_time": "1440295200",
	                 "end_time": "1440338400",
	                 "amount": "65",
	                 "times_limit": "0",
	                 "exp_date": "0",
	                 "guide_attention": "0",
	                 "force_attention": "0",
	                 "content": "<p>1、本券仅限世博源女士馆内（化妆品、黄金珠宝类商户除外）使用，请在消费前出示</p><p>2、本券限满58元抵用，限单件商品使用；</p><p>3、本券不与店内其他优惠同享（详询商户）；</p><p>4、本券不兑换现金、不找零；</p><p>5、使用地点：4区G层、L1层收银台</p><p>​<br></p><p>世博源地址:上海市浦东新区上南路168号、世博大道1368号</p><p>服务热线：021-31117777</p>",
	                 "button_title": "",
	                 "addtime": "2015-08-12 01:15:17",
	                 "flag": "1",
	                 "admin_id": "204",
	                 "wizarpos_id": "",
	                 "vitality": "0",
	                 "link_cat": "0",
	                 "link_cover": "世博源女士馆10元现金券",
	                 "send_flag": "1",
	                 "brought_num": "65",
	                 "ad_coupon_type": "1",
	                 "floor_id": "F30",
	                 "position_id": "F1-019",
	                 "infos": "优惠券备注说明"
	                 }
	                 * */if(v.links && !v.links.idpObj.isHide){v.links.ss_type = 'links';v.links.ss_floor = key;v.links.ss_point = i;info = JSON.stringify(v.links);tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a href=\"#\" class=\"\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                                    <img src=\"" + v.links.background_img + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                   " + v.links.link_title + "\n                                </h3>\n                                <div class=\"am-list-item-text\">" + v.links.link_cover + "</div>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main am-text-right\">\n                                <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"links-detail\" data-info='" + info + "' data-anls=\"event\" data-anls-category=\"/idp/naviCat/listShowTicketDetail\" data-anls-action=\"listShowTicketDetail:" + _this.buildingName + "\" data-anls-label=\"listShowTicketDetail:" + _this.buildingName + "|" + v.links.id + "\" data-anls-value=\"\">卡券详情</button>\n                                <button type=\"button\" class=\"am-btn am-btn-default\" href=\"" + v.links.get_url + "\" " + v.links.disable + " data-maction=\"receive-links\" data-floor='" + key + "' data-point=\"" + i + "\" data-anls=\"event\" data-anls-category=\"/idp/naviCat/listGetTicket\" data-anls-action=\"listGetTicket:" + _this.buildingName + "\" data-anls-label=\"listGetTicket:" + _this.buildingName + "|" + v.links.id + "\" data-anls-value=\"\">领取</button>\n                            </div>\n                            <!--<a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-maction=\"navigate\" data-target=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">带我去</a>-->\n                        </li>";} //优惠券
	/*{
	                 "id": "150",
	                 "card_type": "GENERAL_COUPON",
	                 "least_cost": "0",
	                 "reduce_cost": "0",
	                 "discount": "0",
	                 "brand_name": "坤虫现场摇",
	                 "logo_url": "//y.wizarcan.com/static/upload/image/74/20150807/1438943043223678.png",
	                 "code_type": "CODE_TYPE_QRCODE",
	                 "title": "名片券100元",
	                 "sub_title": "节约用纸 爱护森林",
	                 "color": "Color020",
	                 "notice": "使用时请出示此券",
	                 "service_phone": "0472-3628377",
	                 "description": "此券不找零，不开发票，\r\n不与其他他活动同时使用\r\n此券最终解释权归坤虫所有\r\n",
	                 "quantity": "72",
	                 "date_type": "DATE_TYPE_FIX_TERM",
	                 "begin_timestamp": "0",
	                 "end_timestamp": "0",
	                 "fixed_term": "13",
	                 "fixed_begin_term": "0",
	                 "get_limit": "1",
	                 "can_share": "0",
	                 "can_give_friend": "1",
	                 "privilege_detail": "此券只限坤虫现场摇使用\r\n凭券可兑换名片1000张\r\n",
	                 "detail": null,
	                 "card_id": "pGW-ExNFZtN4xwoYsv8_RLcAP-JY",
	                 "pass": "3",
	                 "status": "1",
	                 "createtime": "1438943762",
	                 "ad_coupon_type": "3",
	                 "floor_id": "F30",
	                 "position_id": "F1-026",
	                 "infos": "备注说明"
	                 }
	                 */if(v.cards){v.cards.ss_type = 'cards';v.cards.ss_floor = key;v.cards.ss_point = i;info = JSON.stringify(v.cards);tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a href=\"#\" class=\"\" data-maction=\"locate-poi\" data-x=\"" + v.x + "\" data-y=\"" + v.y + "\" data-floor=\"F" + v.floorId + "\">\n                                    <img src=\"" + v.cards.logo_url + "\" alt=\"\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                   " + v.cards.title + "\n                                </h3>\n                                <div class=\"am-list-item-text\">" + v.cards.infos + "</div>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main am-text-right\">\n                                <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"links-detail\" data-info='" + info + "'>卡券详情</button>\n                                <button type=\"button\" class=\"am-btn am-btn-default\" href=\"" + v.cards.get_url + "\" data-maction=\"receive-links\" data-floor='" + key + "' data-point=\"" + i + "\">领取</button>\n                            </div>\n                            <!--<a class=\"am-btn am-btn-default am-btn-xs am-btn-block\" data-maction=\"navigate\" data-target=\"" + v.mapArea + "\" data-floor=\"F" + v.floorId + "\">带我去</a>-->\n                        </li>";} /*tpl2 += `<div class="am-g">
	                 <a class="am-btn am-btn-default am-btn-block" data-maction="navigate" data-target="${v.mapArea}" data-floor="F${v.floorId}">带我去</a>
	                 </div>`*/});}); /*        $.each(arr,function(){
	         tplLists += `<li class="am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left">
	         <div class="am-u-sm-4 am-list-thumb">
	         <a href="//www.douban.com/online/11614662/" class="">
	         <img src="//img5.douban.com/lpic/o636459.jpg" alt="">
	         </a>
	         </div>
	         <div class="am-u-sm-4 am-list-main">
	         <h3 class="am-list-item-hd">
	         优衣库
	         </h3>
	         <div class="am-list-item-text">50元代金券</div>
	         </div>
	         <div class="am-u-sm-4 am-list-main am-text-right">
	         <button type="button" class="am-btn am-btn-default">卡券详情</button>
	         <button type="button" class="am-btn am-btn-default">领取</button>
	         </div>
	         </li>`
	         })*/if(tpl2 == ''){tpl2 += '<li class="am-g am-list-item-desced am-text-center">啊哦~~暂时没有卡券哦~~~</li>';}tpl2 += "<a class=\"am-btn am-btn-warning am-btn-block\" data-maction=\"return\">返回</a>";$("#links-list").empty().append(tpl2);setTimeout(function(){_this.showFullPageModal();},100); /*setTimeout(function(){
	         $("#fullModal").empty().append("<iframe id='my-iframe' src='testsolution.html'></iframe>")
	         },1000)*/} // 接收到优惠券 废弃
	},{key:"receivedCoupons",value:function receivedCoupons(){this.headerOfLinks();var tplLists='',arr=[1];$.each(arr,function(){tplLists += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                            <div class=\"am-u-sm-4 am-list-thumb\">\n                                <a href=\"//www.douban.com/online/11614662/\" class=\"\">\n                                    <img src=\"//img5.douban.com/lpic/o636459.jpg\" alt=\"我很囧，你保重....晒晒旅行中的那些囧！\">\n                                </a>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main\">\n                                <h3 class=\"am-list-item-hd\">\n                                    优衣库\n                                </h3>\n                                <div class=\"am-list-item-text\">50元代金券</div>\n                            </div>\n                            <div class=\"am-u-sm-4 am-list-main am-text-right\">\n                                <a class=\"am-btn am-btn-default\">卡券详情</a>\n                                <a class=\"am-btn am-btn-default\">领取</a>\n                            </div>\n                        </li>";});$("#links-list").append(tplLists); /*setTimeout(function(){
	         $("#fullModal").empty().append("<iframe id='my-iframe' src='testsolution.html'></iframe>")
	         },1000)*/} // 外链的头部 废弃
	},{key:"headerOfLinks",value:function headerOfLinks(){if(!$("#links-list").length){var tpl="<div class=\"am-text-center am-hide\">\n                <div class=\"am-btn-group hoverBox\">\n                    <a class=\"am-btn am-btn-primary am-radius\" data-maction=\"\">未领</a>\n                    <a class=\"am-btn am-btn-primary am-radius\" data-maction=\"\">已领</a>\n                </div>\n            </div>";tpl += "<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                    <ul class=\"am-list\" id=\"links-list\">\n                    </ul>\n                </div>\n            </div>";$("div#fullModal").empty().append(tpl);}} // 显示全屏弹窗
	},{key:"showFullPageModal",value:function showFullPageModal(num){num = num?num:'';$("div#fullModal" + num).addClass("active");} // 隐藏全屏弹窗
	},{key:"hideFullPageModal",value:function hideFullPageModal(num){num = num?num:'';$("div#fullModal" + num).removeClass("active");} // 初始化全屏弹框
	},{key:"fullPageModal",value:function fullPageModal(){if(!$("div#fullModal").length){$("#body").append("<div id='fullModal'></div><div id='fullModal2'></div>");}} /**
	     * 换肤页面……啊，感觉要死了    废弃
	     * @return {[type]} [description]
	     */},{key:"showSkinList",value:function showSkinList(){if(!$("#skin-list").length){var tpl="<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n              <div class=\"am-list-news-bd\">\n                  <ul class=\"am-list\" id=\"skin-list\">\n                  </ul>\n              </div>\n          </div>";$("div#fullModal").empty().append(tpl);}var skinConf=[{name:"荷兰橙",desc:"呵呵哒","class":"",icon:'//oex38ct5y.qnssl.com/img/orange.png'},{name:"天空蓝",desc:"依然是呵呵哒","class":"bl",icon:'//oex38ct5y.qnssl.com/img/blue.jpg'},{name:"墨白",desc:"仍然是呵呵哒","class":"white",icon:'//oex38ct5y.qnssl.com/img/white.jpg'},{name:"商务黑",desc:"还是呵呵哒","class":"black",icon:'//oex38ct5y.qnssl.com/img/black.jpg'},{name:"蓝粉晶",desc:"女生的审美咱不懂","class":"lf",icon:'//oex38ct5y.qnssl.com/img/doubi.png'} // {
	//   name:"淡雅黄",
	//   desc:"想不出词儿了",
	//   class:"yellow",
	//   icon:'data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw=='
	// }
	];var tpl2="",_this=this;$.each(skinConf,function(i,v){tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n            <div class=\"am-u-sm-3 am-list-thumb\">\n                <a href=\"#\" class=\"\">\n                    <img src=\"" + v.icon + "\" alt=\"\">\n                </a>\n            </div>\n            <div class=\"am-u-sm-6 am-list-main\">\n                <h3 class=\"am-list-item-hd\">\n                   " + v.name + "\n                </h3>\n                <div class=\"am-list-item-text\"></div>\n            </div>\n            <div class=\"am-u-sm-3 am-list-main am-text-right\">\n                <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"changeSkin\" data-skin=\"" + v["class"] + "\" data-skinname=\"" + v.name + "\">选择</button>\n            </div>\n        </li>";});tpl2 += "<a class=\"am-btn am-btn-warning am-btn-block\" data-maction=\"return\">返回</a>";$("#skin-list").empty().append(tpl2);setTimeout(function(){_this.showFullPageModal();},100);} //活动页面？券页面？
	},{key:"couponListModal",value:function couponListModal(){if(!this.poiList){return;}$("#fullModal").empty();if(!$("#coupon-list").length){var tpl="<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                    <ul class=\"am-list\" id=\"coupon-list\">\n                    </ul>\n                </div>\n            </div>";$("div#fullModal").empty().append(tpl);}var _this=this,tpl2="";$.each(this.poiList,function(fid,floorItem){$.each(floorItem,function(rid,roomItem){if(!roomItem.discountInfo){return true;}tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                    <div class=\"am-u-sm-3 am-list-thumb\">\n                        <a href=\"#\" class=\"\">\n                            <img src=\"" + _this.origin + roomItem.icon + "\" alt=\"\">\n                        </a>\n                    </div>\n                    <div class=\"am-u-sm-6 am-list-main\">\n                        <h3 class=\"am-list-item-hd\">\n                           " + roomItem.brand + "\n                        </h3>\n                        <div class=\"am-list-item-text\">" + roomItem.discountInfo + "<br>\n                        所在楼层：" + _this.floorList[_this.floorIndex[fid]].name + "\n                        </div>\n\n                    </div>\n                    <div class=\"am-u-sm-3 am-list-main am-text-right\">\n                        <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"set-poi-pin\" data-maparea='" + rid + "' data-floor='" + fid + "'>位置</button>\n                    </div>\n                </li>";});});if(tpl2 == ''){tpl2 += '<li class="am-g am-list-item-desced am-text-center">啊哦~~暂时没有活动哦~~~</li>';}tpl2 += "<a class=\"am-btn am-btn-warning am-btn-block\" data-maction=\"return\">返回</a>";$("#coupon-list").empty().append(tpl2);setTimeout(function(){_this.showFullPageModal();},100);} //TODO 好像是老版本  废弃
	},{key:"poiTypeListModal",value:function poiTypeListModal(){var type=arguments.length <= 0 || arguments[0] === undefined?4:arguments[0];var floorid=arguments.length <= 1 || arguments[1] === undefined?this.floorid:arguments[1]; //1美食 2娱乐 3品牌服装 4其他 5停车场
	if(!this.poiList){return;}if(!$("#poi-by-type-list").length){var tpl="<div data-am-widget=\"list_news\" class=\"am-list-news am-list-news-default\" >\n                <div class=\"am-list-news-bd\">\n                    <ul class=\"am-list\" id=\"poi-by-type-list\">\n                    </ul>\n                </div>\n            </div>";$("div#fullModal").empty().append(tpl);}var _this=this,tpl2="";$.each(this.poiList,function(fid,floorItem){$.each(floorItem,function(rid,roomItem){if(roomItem.type != type){return true;}tpl2 += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\">\n                    <div class=\"am-u-sm-3 am-list-thumb\">\n                        <a href=\"#\" class=\"\">\n                            <img src=\"" + _this.origin + roomItem.icon + "\" alt=\"\">\n                        </a>\n                    </div>\n                    <div class=\"am-u-sm-6 am-list-main\">\n                        <h3 class=\"am-list-item-hd\">\n                           " + roomItem.brand + "\n                        </h3>\n                        <div class=\"am-list-item-text\">" + roomItem.discountInfo + "<br>\n                        所在楼层：" + _this.floorList[_this.floorIndex[fid]].name + "\n                        </div>\n\n                    </div>\n                    <div class=\"am-u-sm-3 am-list-main am-text-right\">\n                        <button type=\"button\" class=\"am-btn am-btn-default\" data-maction=\"set-poi-pin\" data-maparea='" + rid + "' data-floor='" + fid + "'>位置</button>\n                    </div>\n                </li>";});});if(tpl2 == ''){tpl2 += '<li class="am-g am-list-item-desced am-text-center">啊哦~~暂时没有数据哦~~~</li>';}tpl2 += "<a class=\"am-btn am-btn-warning am-btn-block\" data-maction=\"return\">返回</a>";$("#poi-by-type-list").empty().append(tpl2);setTimeout(function(){_this.showFullPageModal();},100);} /**
	     * 美食等单页面
	     * @param  {number} [type]
	     * @param  {number} [floorid]
	     * @return {*}
	     */},{key:"poiTypeListModal2",value:function poiTypeListModal2(){var _this2=this;var type=arguments.length <= 0 || arguments[0] === undefined?4:arguments[0];var floorid=arguments.length <= 1 || arguments[1] === undefined?this.floorid:arguments[1];var _this=this,_f=floorid, // 一般停车场没有商铺,所以停车场楼层不用放在楼层列表里面,现将其过滤掉
	tmpFloorList=_this.floorList.filter(function(floor){return !_this.isParking(floor);}); // 排序,使得楼层是按由高=>底的顺序排列
	tmpFloorList = tmpFloorList.sort(function(preFloor,nextFloor){return nextFloor.number - preFloor.number;}); // 修复直接在停车场搜索业态分类,结果列表为空问题
	if(_this.isParking(_this.floorList[_this.floorIndex[_f]])){_f = 'F' + tmpFloorList[0].id;} // 如果当前楼层的poi列表不存在,则需要先获取当前楼层的poi列表
	if(!this.poiList || !this.poiList[_f]){return this.getPoiListByFloorId(_f).then(function(res){var svgB=Snap.select("#myMaps").select('#' + _f);var svg=svgB.select("#jz");var svgBox=svg.select("#beacons");var poiBox=svg.select("#poiBox");if(!poiBox){svg.el("g",{"id":"poiBox"});poiBox = svg.select("#poiBox");svg.select("#poi").before(poiBox);}res = typeof res === 'string'?JSON.parse(res):res;_this.isGetingPoi = false;_this.poiList = _this.poiList?_this.poiList:{};_this.poiList[_f] = _this.poiList[_f]?_this.poiList[_f]:{}; // let w = winW,
	//     h = mapH,
	//     svg_obj = $("#myMaps >div").filter("#"+_f)[0], //todo  这里有个问题  当是svg的时候 panzoom取值有问题
	//     matrix =$(svg_obj).panzoom("getMatrix") ?$(svg_obj).panzoom("getMatrix"):[1,0,0,1,0,0] ,
	//     ratio = matrix[0],
	//     mx = matrix[4],my = matrix[5],
	//     ox = w * ratio /2 -mx-w/ 2,
	//     oy = h*ratio / 2 - my - h/2
	$.each(res.poiList,function(i,v){_this.poiList[_f][v.mapArea] = v; /*var p = svgToPage(v.x, v.y);
	                     tpl += '<span style="position: absolute;font-size: 12px;left:'+ (p.x)+'px;top:'+ (p.y)+'px;">'+ v.brand+'</span>'
	                     return true;*/ // todo add icon poi
	if(v.isShowIcon){var poi=poiBox.image(gTools.origin + v.icon,v.x,v.y,v.width,v.height);poi.attr({"pointer-events":"none"});}return true;});}).then(function(){_this2.poiTypeListModal2(type,floorid);});} // 切换楼层列表模板
	var floorTpl="",selectTpl=""; //floorTpl = `<li><a href="javascript:;" data-maction="chooseSelect" data-type="${type}" data-value="0">全部楼层</a></li>`; // 如果要显示全部楼层,需后台新增接口支持.通过该接口可查询全部楼层和指定楼层
	$.each(tmpFloorList,function(i,v){floorTpl += "<li><a href=\"javascript:;\" data-maction=\"chooseSelect\" data-type=\"" + type + "\" data-value=\"" + v.id + "\">" + v.name + "</a></li>";selectTpl += "<option value=\"" + v.id + "\">" + v.name + "</option>";}); // 搜索结果列表模板
	var listTpl="",merchantLog=undefined;$.each(this.poiList[_f],function(rid,roomItem){if(!roomItem.typeIds){return true;} // poi不属于业态分类,不将该poi添加结果列表
	if(roomItem.typeIds && roomItem.typeIds.split(',').indexOf("" + type) === -1){return true;}merchantLog = _this.setImgLink(roomItem.icon);listTpl += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\" data-maction=\"set-poi-pin\" data-maparea=\"" + rid + "\" data-floor=\"" + _f + "\" data-category=\"" + type + "\">\n                  <div class=\"am-u-sm-4 am-list-thumb\">\n                      <a href=\"javascript:;\" class=\"\">\n                          <!--<img src=\"" + _this.origin + roomItem.icon + "\" alt=\"\">-->\n                          <img src=\"" + merchantLog + "\" alt=\"\">\n                      </a>\n                  </div>\n                  <div class=\"am-u-sm-4 am-list-main border-right\">\n                      <h3 class=\"am-list-item-hd\">\n                         " + roomItem.brand.split('#')[0] + "\n                      </h3>\n                      <div class=\"am-list-item-text\">\n                        <p class=\"discount-info\" >" + (roomItem.discountInfo || '') + "</p>\n                        <p class=\"location\">所在楼层：" + _this.floorList[_this.floorIndex[_f]].name + "</p>\n                      </div>\n                  </div>\n                  <div class=\"am-u-sm-4 am-list-main am-text-center\">\n                      <a href=\"javascript:;\" class=\"location-point\"></a>\n                  </div>\n                </li>";});var tpl="<div class=\"page2\">\n                <div class=\"am-g selectBox  am-text-center\">\n                  <div class=\"am-u-sm-6\" style=\"line-height:39px;text-align:right\">请选择楼层：</div>\n                  <div class=\"am-u-sm-6\">\n                    <div class=\"am-dropdown\">\n                      <button class=\"am-btn btn-white am-dropdown-toggle\" data-name=\"floorId\" data-maction=\"dropdown\" style=\"text-align:left\">" + _this.floorList[_this.floorIndex[_f]].name + " <span class=\"am-icon-caret-down\"></span></button>\n                      <ul class=\"am-dropdown-content\">\n                        " + floorTpl + "\n                      </ul>\n                    </div>\n                    <select name=\"floorId\" search=\"floorId\" style=\"display:none;\">\n                      " + selectTpl + "\n                    </select>\n                  </div>\n                </div>\n                <div class=\"am-list-news am-list-news-default\" style=\"height: " + (winH - 40) + "px; overflow-y: scroll;\">\n                  <div class=\"am-list-news-bd\">\n                    <ul class=\"am-list\" id=\"coupon-list\">\n                        " + listTpl + "\n                    </ul>\n                  </div>\n                </div>\n              </div>";$("div#fullModal").empty().append(tpl);setTimeout(function(){_this2.showFullPageModal();},100);} /**
	     * 设置业态分类poi列表界面的楼层列表模板
	     * @author weibin
	     * @param {array} floorList 必传,楼层列表
	     * @param {number} categoryId 必传,业态分类id
	     * @returns {string} 返回楼层列表字符串模板
	     */},{key:"setFloorListTmplForCategoryPoiList",value:function setFloorListTmplForCategoryPoiList(floorList,categoryId){var floorListTmpl='<ul class="am-dropdown-content">';floorListTmpl += "<li><a href=\"javascript:;\" data-maction=\"chooseSelect\" data-type=\"" + categoryId + "\" data-value=\"0\">全部楼层</a></li>";floorList.forEach(function(floor){floorListTmpl += "<li><a href=\"javascript:;\" data-maction=\"chooseSelect\" data-type=\"" + categoryId + "\" data-value=\"" + floor.id + "\">" + floor.name + "</a></li>";}); // 加上闭合标签
	floorListTmpl += '</ul>';return floorListTmpl;} /**
	     * 设置业态分类poi列表界面的楼层选择器模板
	     * @author weibin
	     * @param {array} floorList 必传,楼层列表
	     * @returns {string} 返回楼层选择器字符串模板
	     */},{key:"setFloorSelectTmplForCategoryPoiList",value:function setFloorSelectTmplForCategoryPoiList(floorList){var floorSelectTmpl='<select name="floorId" search="floorId" style="display: none;">';floorSelectTmpl += "<option value=\"0\">全部楼层</option>";floorList.forEach(function(floor){floorSelectTmpl += "<option value=\"" + floor.id + "\">" + floor.name + "</option>";}); // 加上闭合标签
	floorSelectTmpl += '</select>';return floorSelectTmpl;} /**
	     * 设置业态分类列表模板
	     * @author weibin
	     * @param {array} poiList 必传,poi列表(数据)
	     * @param {number} categoryId 必传,业态分类id
	     * @returns {string} poi列表字符串模板
	     */},{key:"setCategoryPoiListTmpl",value:function setCategoryPoiListTmpl(poiList,categoryId){var _this=this,poiListTmpl='<ul class="am-list" id="coupon-list">';poiList.forEach(function(poi){poiListTmpl += "<li class=\"am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-left\" data-maction=\"set-poi-pin\" data-maparea=\"" + poi.mapArea + "\" data-floor=\"" + ('F' + poi.floorId) + "\" data-category=\"" + categoryId + "\">\n                  <div class=\"am-u-sm-4 am-list-thumb\">\n                      <a href=\"javascript:;\" class=\"\">\n                          <img src=\"" + _this.setImgLink(poi.icon) + "\" alt=\"\">\n                      </a>\n                  </div>\n                  <div class=\"am-u-sm-4 am-list-main border-right\">\n                      <h3 class=\"am-list-item-hd\">" + poi.brand.split('#')[0] + "</h3>\n                      <div class=\"am-list-item-text\">\n                        <p class=\"discount-info\" >" + (poi.discountInfo || '') + "</p>\n                        <p class=\"location\">所在楼层：" + _this.floorList[_this.floorIndex['F' + poi.floorId]].name + "</p>\n                      </div>\n                  </div>\n                  <div class=\"am-u-sm-4 am-list-main am-text-center\">\n                      <a href=\"javascript:;\" class=\"location-point\"></a>\n                  </div>\n                </li>";}); // 添加闭合标签
	poiListTmpl += '</ul>';return poiListTmpl;} /**
	     * 显示属于某一业态的poi列表
	     * @author weibin
	     * @param {number} categoryId 必传,业态分类id
	     * @param {string} [floor] 可选,楼层编号,如F68,默认当前楼层
	     * @param {number} [buildingId] 可选,场景id,默认当前场景
	     * @returns {*}
	     */},{key:"poiTypeListModal3",value:function poiTypeListModal3(categoryId){var floor=arguments.length <= 1 || arguments[1] === undefined?this.floorid:arguments[1];var buildingId=arguments.length <= 2 || arguments[2] === undefined?this.buildingId:arguments[2];var _this=this,isShowAllFloor=floor === 'F0' || _this.isParking(_this.floorList[_this.floorIndex[floor]]), // 是否查看全部楼层: 1.floor为F0时表示查看全部楼层. 2.在停车场查看业态分类,也是查看全部楼层的
	floorId=isShowAllFloor?0:floor.substr(1);_this.getCategoryPoiList(categoryId,floorId,buildingId).done(function(poiList){var floorListTmpl=undefined,floorSelectTmpl=undefined,poiListTmpl=undefined,pageTmpl=undefined, // 一般停车场没有商铺,所以停车场楼层不用放在楼层列表里面,先将其过滤掉
	tmpFloorList=_this.floorList.filter(function(floor){return !_this.isParking(floor);}); // 排序:使得楼层是按由高=>底的顺序排列
	tmpFloorList.sort(function(preFloor,nextFloor){return nextFloor.number - preFloor.number;}); // 设置楼层列表模板
	floorListTmpl = _this.setFloorListTmplForCategoryPoiList(tmpFloorList,categoryId); // 设置楼层选项模板
	floorSelectTmpl = _this.setFloorSelectTmplForCategoryPoiList(tmpFloorList); // 排序:使得poi列表按楼层进行排序
	poiList.sort(function(pre,next){return next.floorId - pre.floorId;}); // 设置poi列表模板
	poiListTmpl = _this.setCategoryPoiListTmpl(poiList,categoryId); // 设置页面模板
	pageTmpl = "<div class=\"page2\">\n                    <div class=\"am-g selectBox  am-text-center\">\n                      <div class=\"am-u-sm-6\" style=\"line-height:39px;text-align:right\">请选择楼层：</div>\n                      <div class=\"am-u-sm-6\">\n                        <div class=\"am-dropdown\">\n                          <button class=\"am-btn btn-white am-dropdown-toggle\" data-name=\"floorId\" data-maction=\"dropdown\" style=\"text-align:left\">" + (isShowAllFloor?'全部楼层':_this.floorList[_this.floorIndex[floor]].name) + " <span class=\"am-icon-caret-down\"></span></button>\n                          " + floorListTmpl + "\n                        </div>\n                        " + floorSelectTmpl + "\n                      </div>\n                    </div>\n                    <div class=\"am-list-news am-list-news-default\" style=\"height: " + (winH - 40 + 'px') + "; overflow-y: auto;\">\n                      <div class=\"am-list-news-bd\">\n                        " + poiListTmpl + "\n                      </div>\n                    </div>\n                </div>";$("div#fullModal").empty().append(pageTmpl);setTimeout(function(){_this.showFullPageModal();},100);}).fail(function(err){_this.alert('抱歉~获取分类poi列表失败，请稍后重试');});} /**
	     * 初始化poi文字位置 发现移动文字接口未声明时进行声明. 注意,在initSetPoiText()方法中会被重新覆盖
	     */},{key:"transPoiText",value:function transPoiText(){log.w('[transPoiText] call the original method.');this.initSetPoiText("zoom")();} /**
	     * TODO 初始化文字设置。后期要改 单独提出来
	     * @param  {string} act [description]
	     * @return {function}     [description]
	     */},{key:"initSetPoiText",value:function initSetPoiText(act){if(!this.textBox || this.textBox.length === 0){ //this.textBox = $("#body > #text");
	this.textBox = $("#body").find("#text");}var w=winW,h=winH,$div=$("#" + this.showingFloor),div_dom=$div[0],$svg=$div.children("svg"),_this=this,svg_dom=$svg[0],tmpArr=[];if(!this.cachePoiList){this.cachePoiList = [];this.scaleNodeArr = [];}var e0=svgToPage(0,0,svg_dom),e1=svgToPage(1,1,svg_dom),dx=e1.x - e0.x,dy=e1.y - e0.y;var matrix=$div.panzoom("getMatrix") || [1,0,0,1,0,0],mx=+matrix[4],my=+matrix[5],ratio=+matrix[0];if(act === 'zoom'){return function(){_this.scale = ratio > 4?1 + ratio / 10:1;_this.cachePoiList.length = 0; // 切换到的楼层不存在poi
	if(!(_this.poiList && _this.poiList[_this.showingFloor])){_this.textBox.empty();return;} // 会覆盖原来的方法
	_this.transPoiText = _this.initSetPoiText("pan");_this.transPoiText();};}else if(act === 'pan'){return function(){ // 切换到的楼层不存在poi
	if(!(_this.poiList && _this.poiList[_this.showingFloor])){_this.textBox.empty();return;} // 如果是停车场,不显示POI. 特例: 太古里的停车场需要显示POI
	if(_this.isParking()){ //log.v('pan act: is parking');
	if(!_this.IS_TAIKOOLI_SCENE){ //log.v('pan act: is TaikooLi parking');
	return true;}}tmpArr.length = 0;_this.textBox.empty(); //log.i('pan act: clear all poi');
	//debugger;
	matrix = $div.panzoom("getMatrix") || [1,0,0,1,0,0],mx = +matrix[4],my = +matrix[5],ratio = +matrix[0];var tpl="";$.each(_this.poiList[_this.showingFloor],function(i,v){ // 如果是停车场,不显示POI. 特例: 太古里的停车场需要显示POI
	//if (_this.parkType && v.typeIds.split(',').indexOf("" + _this.parkType) > -1) {
	//    return true;
	//}
	if(v.isShowIcon){ // 显示icon poi直接退出
	return true;}var p={x:dx * (v.x * ratio + mx) + e0.x,y:dy * (v.y * ratio + my) + e0.y + 6}; /**
	                     * 针对太古里的poi分级特殊处理,不采用普通场景的poi碰撞检测逻辑处理
	                     * poi分级
	                     * 以推荐字段levels作为分级标准
	                     * levels值越大，地图要显示该poi所需放大倍数就得越大
	                     */if(Math.pow(2,v.levels - 1) > ratio){return true;}_this.cachePoiList.push(v);var fontSize=v.fontSize < 12?12:v.fontSize;var node=[v.mapArea,p.x,p.y,_this.getBytesWidth(v.brand),v.brand,v.fontRotate,fontSize];var _c='one',_text=node[4],_node4=node[4].split("#");if(_node4.length === 2){_c = 'two';_text = _node4[0] + '<br>' + _node4[1];}tpl += '<span class="' + _c + '" style="left:' + node[1] + 'px;top:' + node[2] + 'px;-webkit-transform:rotate(' + node[5] + 'deg);transform:rotate(' + node[5] + 'deg);font-size:' + node[6] + 'px">' + _text + '</span>';});_this.textBox.append(tpl); //log.i('pan act: re-append poi');
	};}} /**
	     * debug用: 创建一个显示或关闭debug窗口的按钮
	     * @param  {[type]} sxDebug [description]
	     * @return {[type]}         [description]
	     */},{key:"sxdebug",value:function sxdebug(sxDebug){if(sxDebug){!$('[data-maction="show-debug"]').length?$('.ctrl-btn').prepend('<a class="am-btn am-btn-default" data-maction="show-debug"><i class="am-icon-code"></i></a>'):""; //$("#debugLog,#debugScript").removeClass("am-hide");
	//$.getScript("js/test.js");
	}} /**
	     * debug用: 显示log,并且不再输出新的log.
	     * @return {*} [description]
	     */},{key:"sxShowEverLog",value:function sxShowEverLog(){this.stopLog = 1;if(!this.logArr){return;}$("#debugLog").empty().append(this.logArr.join(""));} // 获取字符串在页面上占据的真实宽度
	},{key:"getBytesWidth",value:function getBytesWidth(str){var span=document.createElement('span'),txt=document.createTextNode(str),w=1;span.appendChild(txt);document.body.appendChild(span);w = span.offsetWidth;document.body.removeChild(span);return w;} /**
	     * 检测地图上的poi文字/图片是否重叠
	     * @param  {object}  textnode 文本节点对象
	     * @param  {array}  textarr 文本数组
	     * @param  {boolean} isIcon 是否是icon
	     * @return {boolean}
	     */},{key:"checkIsCovered",value:function checkIsCovered(textnode,textarr,isIcon){var flag=false,scale=this.scale || 1,rect,rect1,tGap; /*if(textnode[4]!='酷乐潮玩'&&textnode[4]!='etam'){
	         return true;
	         }*/rect = getBoundTxt(textnode,scale);if(isIcon){rect = getBoundIcon(textnode,scale);}tGap = 40 / scale; //this.opts.txtGap / scale;
	var left=rect.l - tGap;var top=rect.t - tGap;var right=rect.r + tGap;var bottom=rect.b + tGap;for(var i=0,n=textarr.length;i < n;i++) {rect1 = getBoundTxt(textarr[i],scale);var left1=rect1.l;var top1=rect1.t;var right1=rect1.r;var bottom1=rect1.b; //左边
	if(left < left1 && right > left1 && !(top > bottom1 || bottom < top1)){flag = true;break;} //右边
	if(left < right1 && right > right1 && !(top > bottom1 || bottom < top1)){flag = true;break;} //上边
	if(top < top1 && bottom > top1 && !(right < left1 || left > right1)){flag = true;break;} //下边
	if(top < bottom1 && bottom > bottom1 && !(right < left1 || left > right1)){flag = true;break;} //内部上下
	if(left > left1 && right < right1 && !(top > bottom1 || bottom < top1)){flag = true;break;} //内部左右
	if(top > top1 && bottom < bottom1 && !(right < left1 || left > right1)){flag = true;break;}}function getBoundTxt(arr,scale){var id=arr[0],x=arr[1],y=arr[2],len=arr[3],name=arr[4];return {id:id,name:name,l:x,t:y + 14 / scale,r:x + len / scale,b:y};}function getBoundIcon(arr,scale){var id=arr[0],x=arr[1],y=arr[2],len=arr[3],name=arr[4],width=arr[5],height=arr[6];return {i:id,name:name,l:x,t:y,r:x + width,b:y + height};}return flag;} /** Begin append by weibin. */ /**
	     * 设置图片链接:1.本地绝对路径,可通过url参数指定成不同环境上的图片资源; 2.服务器上,相对路径
	     * @author weibin
	     * @param path 图片路径
	     * @returns {string} 转化后的图片路径
	     */},{key:"setImgLink",value:function setImgLink(path){return path?path.includes('//')?path:this.origin + (path.charAt(0) === '/'?path:'/' + path):'//oex38ct5y.qnssl.com/img/none_1.jpg';} /**
	     * 设置搜索结果的图片链接
	     * @author weibin
	     * @param {string} brand poi的品牌名称
	     * @param {string} [path] 图片的相对或绝对路径
	     * @returns {string} 图片的绝对路径
	     */},{key:"setSearchRstImgLink",value:function setSearchRstImgLink(brand,path){var name; // 返回后台配置的图片
	if(path){return this.setImgLink(path);} // 根据匹配基础设施的名称,返回对应的图片链接
	if(brand.includes('洗手间') || brand.includes('卫生间') || brand.includes('厕所')){name = 'Bathroom';}else if(brand.includes('客服中心') || brand.includes('服务台')){name = 'Server';}else if(brand.includes('母婴室')){name = 'Childroom';}else if(brand.includes('取款机')){name = 'ATM';}else if(brand.includes('地铁')){name = 'Subway';}else if(brand.includes('电梯') || brand.includes('直梯')){name = 'Elevator';}else if(brand.includes('扶梯')){name = 'Zig';}else if(brand.includes('楼梯')){name = 'Stair';}else if(brand.includes('出口')){name = 'Exit';}else if(brand.includes('缴费')){name = 'Pay';}else {} // todo nothing.
	// 如果匹配到了对应的基础设置,则返回对应的icon链接
	if(name){return '//oex38ct5y.qnssl.com/img/taiguli3/' + name + '.png';} // 返回默认图片——未匹配图片
	return this.setImgLink(path);} /**
	     * 根据元素id获取DOM元素
	     * @author weibin
	     * @param {string} id 元素id
	     * @returns {Element} DOM元素
	     */},{key:"getElementById",value:function getElementById(id){return document.getElementById(id);} /**
	     * 预加载图片:某些需要等待图片加载完成后的处理逻辑可通过设置回调函数来处理
	     * @author weibin
	     * @param {string} link 需要加载的图片链接
	     * @param {function} callback 当图片加载完成后的回调函数
	     */},{key:"loadImg",value:function loadImg(link,callback){var img=new Image(); //创建一个Image对象，实现图片的预下载
	img.src = link;if(img.complete){ // 如果图片已经存在于浏览器缓存，直接调用回调函数
	log.i('Image in browser cache.');callback && callback.call(img); //将回调函数的this替换为Image对象
	return; // 直接返回，不用再处理onload事件
	}img.onload = function(){ //图片下载完毕时异步调用callback函数。
	log.i('Load image finished.');callback && callback.call(img); //将回调函数的this替换为Image对象
	};}},{key:"getFloorInfo", /**
	     * 获取楼层信息,如果指定的楼层编号无效,则根据指定的索引返回对应的楼层信息,如果也未指定索引,则返回null.
	     * @author weibin
	     * @param {string} [floor] 可选 楼层编号,如F138
	     * @param {number} [index] 可选 当楼层编号无效时,用于指定所要获取楼层信息对应的索引
	     * @returns {*} 返回指定楼层信息对象或null
	     */value:function getFloorInfo(floor,index){floor = floor || this.showingFloor;index = floor?this.floorIndex[floor]:index;var floorObj=index !== undefined?this.floorList[index]:null; //log.i('[getFloorInfo] floor info:', floorObj);
	return floorObj; //return index !== undefined ?  this.floorList[index] : null;
	} /**
	     * 判断是否是停车场场景
	     * @author weibin
	     * @param {object} floor 楼层信息对象
	     * @returns {boolean}
	     */},{key:"isParking",value:function isParking(floor){ //log.v('[isParking] Judge is parking:', this.getFloorInfo().type == 2);
	floor = floor || this.getFloorInfo();return floor.type == 2;} /**
	     * 判断是否缓存了某个楼层的poi列表
	     * @author weibin
	     * @param {string}  floor   楼层编号
	     * @returns {boolean}
	     */},{key:"isCachedFloorPoiList",value:function isCachedFloorPoiList(floor){return !!(this.poiList && this.poiList[floor]);} /**
	     * 根据mapArea获取某个楼层的poi信息
	     * @author weibin
	     * @param {string} floor    必传,楼层编号,如F140
	     * @param {string} mapArea  必传,poi的mapArea编号
	     * @returns {object} poi信息对象
	     */},{key:"getSomeOneFloorPoiInfoByMapArea",value:function getSomeOneFloorPoiInfoByMapArea(floor,mapArea){if(!floor){ //this.alert('请先指定楼层');
	console.error('获取poi信息失败: 请先指定楼层');return {};}if(!mapArea){ //this.alert('请先指定poi的mapArea编号');
	console.error('获取poi信息失败: 请先指定poi的mapArea编号');return {};} // 未能从缓存中找到对应的poi: 如某些公共设施未添加poi
	if(!(gTools.poiList && gTools.poiList[floor] && gTools.poiList[floor][mapArea])){return {};} // 从缓存中找到了对应的poi
	return gTools.poiList[floor][mapArea];} /**
	     * 统一设置标志字段的方法
	     * @author weibin
	     * @private 私有方法
	     */},{key:"_setFlag",value:function _setFlag(){ // 下列标志位每次运行时需动态设置
	this.IS_TAIKOOLI_SCENE = this.buildingId === 33; // 太古里场景
	this.IS_HX_HOME_EXPO_SCENE = false; // 华夏家博会场景
	this.IS_FEILE_SCENE = getQueryString('scene') === 'feile'; // 飞乐场景
	// 下列标志位都为固定值,不需要区分场景
	this.IS_NOT_HANDLE_SEARCH_FOCUS = true;this.IS_HID_DROPDOWN_MENU = true; // 轻导航标志字段
	this.IS_CONTAIN_LIGHT_NAV = false;} /**
	     * 判断是否是客服中心
	     * @param {string} brand 品牌名称
	     * @returns {boolean}
	     * @private 私有方法
	     */},{key:"_isCustomerServiceCenter",value:function _isCustomerServiceCenter(brand){return !!(this.IS_TAIKOOLI_SCENE && (brand.includes('客服中心') || brand.includes('服务台')));} /**
	     * 判断是否是预付卡店铺
	     * @param {object} store
	     * @returns {boolean}
	     * @private 私有方法
	     */},{key:"_isPrePayCardStore",value:function _isPrePayCardStore(store){var i,len,prePayCardList=window.recommendStore.prePayCard.list;for(i = 0,len = prePayCardList.length;i < len;i++) {if(prePayCardList[i].id === store.id){return true;}}return false;} /**
	     * 判断是否是数组
	     * @param obj
	     * @returns {boolean}
	     */},{key:"isArray",value:function isArray(obj){return toString.call(obj) === '[object Array]';} /** End append by weibin. */}]);return Tools;})(Api);module.exports = Tools;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _require = __webpack_require__(12);

	var setOrigin = _require.setOrigin;
	var ENV = _require.ENV;

	//接口接口接

	var Api = (function () {
	    function Api() {
	        _classCallCheck(this, Api);

	        //this.debugLogTimer = '';
	        this.origin = setOrigin();
	        this.isLocalhost = ENV.LOCAL;
	        //if (this.origin.indexOf('127.0.') > -1 || this.origin.indexOf('192.168.') > -1 || this.origin.indexOf('172.16.') > -1) {
	        //    let dev = location.href.indexOf('dev') > -1 ? "dev2." : "";
	        //    this.origin = 'http://idp.' + dev + 'wizarcan.com';
	        //    this.isLocalhost = true;
	        //}
	        this.url = this.origin + "/client/";
	        this.openid = localStorage.openid ? localStorage.openid : 'oiuyCvwHRSoG0DhLGNDS0QfkcH9I'; //'oFEZQuE-wiI4OSY2BhYxyujQlQIw';
	        this.mapname = '';
	        this.action = '';
	        this.appId = localStorage.appid ? localStorage.appid : 'wxbae35f0d1acf5840'; //'wx54d8b65ca288f8f3'
	    }

	    _createClass(Api, [{
	        key: 'get',
	        value: function get(data, op) {
	            data = data ? data : {};
	            return this.act(data, 'get', op);
	        }
	    }, {
	        key: 'post',
	        value: function post(data, op) {
	            data = data ? data : {};
	            return this.act(data, "post", op);
	        }
	    }, {
	        key: 'act',
	        value: function act(data, method, op) {
	            var dtd = $.Deferred(),
	                url = this.url,
	                _this = this;
	            if ($.inArray(op, ["saveVisit.shtml", "saveActivity.shtml", "saveAdvert.shtml", "saveCoupon.shtml", "saveInfrastruc.shtml", "saveLocation.shtml", "savePoi.shtml", "report.shtml", "saveSkin.shtml", "saveSearch.shtml", "enterParkPage.shtml", "parkButton.shtml", "findButton.shtml"]) > -1) {
	                if (this.isLocalhost) {//如果是本地测试  就不调用数据统计接口了……
	                    //return;
	                }
	                if (op === 'report.shtml') {
	                    url = this.origin + '/position/';
	                } else {
	                    url = this.origin + '/stats/';
	                }
	            }
	            if (op) {
	                if (typeof op == 'object') {
	                    url += op.url;
	                } else {
	                    url += op;
	                }
	            }

	            //_this.showLoading()
	            var opt = {
	                url: url,
	                data: data,
	                async: true,
	                method: method,
	                beforeSend: function beforeSend(jqxhr, settings) {
	                    if (settings.url.indexOf("?") > -1) {
	                        settings.url += '&sign=' + Math.random();
	                    } else {
	                        settings.url += '?sign=' + Math.random();
	                    }
	                }
	            };

	            //if (op && typeof  op == 'object') {
	            //    $.each(op, function (i, v) {
	            //
	            //    })
	            //}

	            $.ajax(opt).done(function (res) {
	                if (typeof res === 'string') {
	                    // 返回的是非JSON字符串,比如页面code,不做解析
	                    if (res.indexOf('<head>') > -1) {
	                        console.error('返回数据格式不正确:', res);
	                        return;
	                    }

	                    res = JSON.parse(res);
	                }

	                // old校验方式
	                //if (res.result && res.result.errorMsg) {
	                //    alert(res.result.errorMsg, 3);
	                //    return dtd.reject(res);
	                //}
	                //
	                //if (res.hasOwnProperty("server_status") && res.server_status.code != 0) {
	                //    alert(res.server_status.message, 3);
	                //    return dtd.reject(res);
	                //}

	                if (res === 'success') {
	                    // 有些接口只返回success(注意返回的success是带有引号的),如上报位置的接口report.shtml
	                    return;
	                }

	                if (res.errorCode !== 0) {
	                    alert(res.errorCode + ': ' + res.msg);
	                    return;
	                }

	                return dtd.resolve(res.data || res);
	            }).fail(function (xhr) {
	                if (op === "report.shtml") {
	                    return;
	                }
	                if (_this.origin.indexOf("dev") > -1) {
	                    alert("failed!status:" + xhr.status + "\nurl:" + opt.url + "\ndata:" + JSON.stringify(data));
	                } else {
	                    _this.alert("啊哦~网络似乎出了什么问题了");
	                    L("failed!status:" + xhr.status + "===url:" + opt.url + "===data:" + JSON.stringify(data));
	                }
	            }).complete(function () {
	                //_this.hideLoading();
	            });
	            return dtd.promise();
	        }

	        // 获取微信签名: 注意,这里无论是url参数中的appid还是request body中的appid都不会作为后端获取微信签名时用的appid,后端获取微信签名时用的appid是写死的为wx54d8b65ca288f8f3
	    }, {
	        key: 'getSignature',
	        value: function getSignature() {
	            return this.post({ url: location.href.split('#')[0], appid: this.appId }, "getSignature.shtml");
	        }

	        //停车信息
	    }, {
	        key: 'getParkedInfo',
	        value: function getParkedInfo() {
	            return this.post({
	                weixinOpenId: this.openid,
	                weixinAppId: this.appId,
	                buildingId: this.buildingId
	            }, "getParkedInfo.shtml");
	        }

	        //废弃
	    }, {
	        key: 'getBuildingInfoByBeacon',
	        value: function getBuildingInfoByBeacon(major, minor) {
	            return this.post({ major: major, minor: minor }, "getBuildingInfoByBeacon.shtml");
	        }

	        //一个奇葩接口 废弃
	    }, {
	        key: 'getBuildingInfoByName',
	        value: function getBuildingInfoByName() {
	            return this.post({ buildingName: this.buildingName }, "getBuildingInfoByName.shtml");
	        }

	        //基于场景id获得场景信息
	    }, {
	        key: 'getBuildingInfo',
	        value: function getBuildingInfo() {
	            var data = { buildingId: this.buildingId };
	            return this.post(data, "getBuildingInfo.shtml");
	        }

	        // 指定openid的用户停车到指定场景的位置
	    }, {
	        key: 'parkRecord',
	        value: function parkRecord(Parkpoint) {
	            return this.post({
	                weixinOpenId: this.openid,
	                weixinAppId: this.appId,
	                floorId: this.floorid.slice(1),
	                parkPoint: Parkpoint,
	                buildingId: this.buildingId
	            }, "parkRecord.shtml"); //this.floorid:"F30" -> .slice(1) = 30
	        }

	        //根据扫描到的beaco自动识别场景
	    }, {
	        key: 'getBuildingInfoByBeaconArray',
	        value: function getBuildingInfoByBeaconArray(arr) {
	            arr = arr ? arr : []; //[{major:"",minor:""}]
	            return this.post(JSON.stringify({ beacons: arr }), "getBuildingInfoByBeaconArray.shtml");
	        }

	        //忘了是啥……都忘了还有没有用
	    }, {
	        key: 'getBuildingInfoForCoupon',
	        value: function getBuildingInfoForCoupon(arr) {
	            arr = arr ? arr : [];
	            return this.post(JSON.stringify({ beacons: arr }), "getBuildingInfoForCoupon.shtml");
	        }

	        // 基于floorId获取poi信息
	    }, {
	        key: 'getPoiListByFloorId',
	        value: function getPoiListByFloorId(floorId) {
	            if (!floorId) {
	                return;
	            }
	            floorId = floorId.split("F").pop();
	            return this.post({ floorId: floorId }, "getPoiListByFloorId.shtml");
	        }

	        //喵了个咪哦 需要重新new一个  http://carpos.wizarcan.com/buildingads     ---- 应该是朝兵和振样没有对接好的问题， 传给振样的buildingId 是 朝兵这边地图的添加者名字 adUser
	        //貌似废弃了
	    }, {
	        key: 'getAllCouponsByFloorId',
	        value: function getAllCouponsByFloorId(floorId) {
	            if (!floorId) {
	                return;
	            }
	            floorId = floorId.split("F").pop();
	            return this.post(JSON.stringify({
	                //"building_id":buildingId,
	                "adUser": gTools.adUser,
	                "floor_id": floorId // floor_id 可以为空字符串，若为空字符串，则返回building_id下所有的广告
	            }), "buildingads");
	        }

	        //貌似废弃了
	    }, {
	        key: 'getCouponListByFloorId',
	        value: function getCouponListByFloorId(floorId) {
	            if (!floorId) {
	                return;
	            }
	            floorId = floorId.split("F").pop();
	            return this.post({ "floorId": floorId }, "getCouponListByFloorId.shtml");
	        }

	        // 嗯哼？BI用
	    }, {
	        key: 'createAnalysisData',
	        value: function createAnalysisData(data) {
	            var mapName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	            data.weixinOpenId = this.openid;
	            data.weixinAppId = this.appId;
	            data.buildingId = this.buildingId;
	            var newData = {};
	            $.each(data, function (k, v) {
	                if (v === '' || typeof v === 'undefined') {
	                    return true;
	                }
	                //newData[mapName + "."+k] = v;//接口调整  不再需要前面的xxxxFormMap了
	                newData[k] = v;
	            });
	            return newData;
	        }

	        // BI……我原来以为是全部统计都用它的来着……orz……只做入口统计
	    }, {
	        key: 'analysis',
	        value: function analysis() {
	            var floor_id = arguments.length <= 0 || arguments[0] === undefined ? this.floorid : arguments[0];
	            var action = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	            floor_id === "" ? floor_id = this.floorid : "";
	            if (!floor_id) {
	                floor_id = "0";
	            }
	            var data = {
	                floorId: floor_id.split("F").join(""),
	                action: action, //（0：进入地图；1：找车，2：停车；3：分享位置；）
	                enterType: this.enterType //（0：猫寻助手；1：微肯APP；2：分享；3：其它公众号；4：其它APP；）
	            };
	            var newData = this.createAnalysisData(data, "statsVisitFormMap");
	            return this.post(newData, "saveVisit.shtml");
	        }

	        //活动统计
	    }, {
	        key: 'saveActivity',
	        value: function saveActivity(activityId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];

	            //todo 0.4改版    打点暂时取消
	            var data = {
	                floorId: floorId.split("F").join(""),
	                activityId: activityId
	            };
	            var newData = this.createAnalysisData(data, "statsActivityFormMap");
	            return this.post(newData, "saveActivity.shtml");
	        }

	        //卡券统计？
	    }, {
	        key: 'saveCoupon',
	        value: function saveCoupon(couponId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];

	            //todo 0.4改版    打点暂时取消
	            var data = {
	                floorId: floorId.split("F").join(""),
	                couponId: couponId
	            };
	            var newData = this.createAnalysisData(data, "statsCouponFormMap");
	            return this.post(newData, "saveCoupon.shtml");
	        }

	        //公共设施统计 卫生间等
	    }, {
	        key: 'saveInfrastruc',
	        value: function saveInfrastruc(name) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.showingFloor : arguments[1];

	            //todo 0.4改版    打点暂时取消
	            var data = {
	                floorId: floorId.split("F").join(""),
	                name: name
	            };
	            var newData = this.createAnalysisData(data, "statsInfrastrucFormMap");
	            return this.post(newData, "saveInfrastruc.shtml");
	        }

	        //分享位置后回调
	    }, {
	        key: 'saveLocation',
	        value: function saveLocation(mapArea, x, y) {
	            var floorId = arguments.length <= 3 || arguments[3] === undefined ? this.floorid : arguments[3];

	            //todo 0.4改版    打点暂时取消
	            var data = {
	                floorId: floorId.split("F").join(""),
	                mapArea: mapArea,
	                x: Math.round(x),
	                y: Math.round(y)
	            };
	            var newData = this.createAnalysisData(data, "statsLocationFormMap");
	            return this.post(newData, "saveLocation.shtml");
	        }

	        //当前位置的数据统计……感觉没啥用？
	    }, {
	        key: 'savePosition',
	        value: function savePosition(mapArea, x, y) {
	            var floorId = arguments.length <= 3 || arguments[3] === undefined ? this.floorid : arguments[3];

	            var data = {
	                floorId: Number(floorId.split("F").join("")),
	                mapArea: mapArea,
	                x: Math.round(x),
	                y: Math.round(y)
	            };
	            var newData = this.createAnalysisData(data, "statsPositionFormMap");
	            return this.post(newData, "report.shtml");
	        }

	        //点击门店
	    }, {
	        key: 'savePoi',
	        value: function savePoi(poiId) {
	            var floorId = arguments.length <= 1 || arguments[1] === undefined ? this.floorid : arguments[1];

	            //todo 0.4改版    打点暂时取消
	            var data = {
	                floorId: floorId.split("F").join(""),
	                poiId: poiId
	            };
	            var newData = this.createAnalysisData(data, "statsPoiFormMap");
	            return this.post(newData, "savePoi.shtml");
	        }

	        //搜索内容统计
	    }, {
	        key: 'saveSearch',
	        value: function saveSearch(brand) {
	            var data = {
	                brand: brand
	            };
	            var newData = this.createAnalysisData(data, "statsSearchFormMap");
	            return this.post(newData, "saveSearch.shtml");
	        }

	        //皮肤
	    }, {
	        key: 'saveSkin',
	        value: function saveSkin(name) {
	            //todo 0.4改版    打点暂时取消
	            var data = {
	                name: name
	            };
	            var newData = this.createAnalysisData(data, "statsSkinFormMap");
	            return this.post(newData, "saveSkin.shtml");
	        }

	        // 废弃了？
	    }, {
	        key: 'getReceivedCouponsByFloorId',
	        value: function getReceivedCouponsByFloorId(floorId) {
	            if (!floorId) {
	                return;
	            }
	            floorId = floorId.split("F").pop();
	            return this.post(JSON.stringify({
	                "openid": gTools.openid,
	                "adUser": gTools.adUser,
	                "buildingName": gTools.buildingName,
	                "floorid": floorId // floor_id 可以为空字符串，若为空字符串，则返回building_id下所有的广告
	            }), "receivedCoupons");
	        }

	        //getCouponsByFloorId(floorId){
	        //		return $.when(gTools.getCouponListByFloorId(floorId),this.getReceivedCouponsByFloorId(floorId))//.done(function(){console.info(arguments)})
	        //}
	        // 抵达停车位，完成停车，
	    }, {
	        key: 'finishPark',
	        value: function finishPark() {
	            return this.post({
	                weixinOpenId: this.openid,
	                weixinAppId: this.appId,
	                buildingId: this.buildingId
	            }, "finishPark.shtml");
	        }

	        // 基于业态id获取poi信息
	    }, {
	        key: 'getTypeListByBuildingId',
	        value: function getTypeListByBuildingId(buildingId, type) {
	            //type : 1美食  2娱乐 3品牌 4其他
	            var data = { buildingId: buildingId, type: type, pageNow: 1, pageSize: 12 };
	            return this.post(data, "getTypeListByBuildingId.shtml");
	        }

	        // 搜索关键词
	    }, {
	        key: 'brandSearch',
	        value: function brandSearch(brand, buildingId) {
	            brand = brand.split('\'').join('\\\'');
	            var data = { brand: brand, buildingId: buildingId, pageNow: 1, pageSize: 12 };
	            return this.post(data, "brandSearch.shtml");
	        }

	        // 搜索车牌获取停车信息
	    }, {
	        key: 'searchByCarLicense',
	        value: function searchByCarLicense(carLicense) {
	            var data = { carLicense: carLicense, buildingId: this.buildingId };
	            return this.get(data, "searchByCarLicense.shtml");
	        }

	        // 废弃?
	    }, {
	        key: 'getSolution',
	        value: function getSolution(floorid, start, end) {
	            var _this = this;
	            var data = { buildingName: this.buildingName, floorId: floorid, startPoint: start, endPoint: end };
	            return this.post(data, "getSolution.shtml");
	        }

	        // 废弃?
	    }, {
	        key: 'setSolution',
	        value: function setSolution(start, end, solution) {
	            var _this = this;
	            var floorName = _this.floorName;
	            var data = {
	                buildingName: this.buildingName,
	                floorName: floorName,
	                startPoint: start,
	                endPoint: end,
	                solution: solution
	            };
	            return this.post(data, "setSolution.shtml");
	        }

	        /*快捷停车找车的统计……*/
	    }, {
	        key: 'enterParkPage',
	        value: function enterParkPage() {
	            var newData = this.createAnalysisData({}, "statsVisitFormMap");
	            return this.post(newData, "enterParkPage.shtml");
	        }

	        // 废弃·
	    }, {
	        key: 'parkButton',
	        value: function parkButton() {
	            var newData = this.createAnalysisData({}, "statsVisitFormMap");
	            return this.post(newData, "parkButton.shtml");
	        }

	        // 废弃
	    }, {
	        key: 'findButton',
	        value: function findButton(parkPoint) {
	            var newData = this.createAnalysisData({ parkPoint: parkPoint }, "statsVisitFormMap");
	            newData.parkPoint = parkPoint;
	            return this.post(newData, "findButton.shtml");
	        }

	        // 推荐（店铺或展位）列表
	    }, {
	        key: 'getRecommendPoiListByFloorId',
	        value: function getRecommendPoiListByFloorId(floorId) {
	            var pageSize = arguments.length <= 1 || arguments[1] === undefined ? this.pageSize : arguments[1];
	            var pageNow = arguments.length <= 2 || arguments[2] === undefined ? this.pageNow : arguments[2];

	            floorId = Number(floorId);
	            // console.info("获取某一楼层推荐门店及折扣信息列表接口 理论上不直接调用");
	            return this.post({ floorId: floorId, pageNow: pageNow, pageSize: pageSize }, "getRecommendPoiListByFloorId.shtml");
	        }

	        /**
	         * 获取下拉菜单之后的POI标签
	         */
	    }, {
	        key: 'getPoiLabels',
	        value: function getPoiLabels() {
	            var buildingId = arguments.length <= 0 || arguments[0] === undefined ? this.buildingId : arguments[0];

	            return this.get({ buildingId: buildingId }, "getPoiLabels.shtml");
	        }

	        /** Begin append by weibin. */
	        /**
	         * 根据场景id获取浮层广告
	         * @param buildingId
	         * @returns {*}
	         */
	    }, {
	        key: 'getFloatAds',
	        value: function getFloatAds() {
	            var buildingId = arguments.length <= 0 || arguments[0] === undefined ? this.buildingId : arguments[0];

	            return this.get({ buildingId: buildingId }, 'getFloatLayer.shtml');
	        }

	        /**
	         * 获取各类型的推荐店铺的数据
	         * @author weibin
	         * @param buildingId
	         * @returns {*}
	         */
	    }, {
	        key: 'getRightTopRecommendStores',
	        value: function getRightTopRecommendStores(buildingId) {
	            buildingId = buildingId || this.buildingId;

	            return this.get({ buildingId: buildingId }, 'getPoiDiscountInfo.shtml');
	        }

	        /**
	         * 根据楼层获取分类poi列表
	         * @author weibin
	         * @param {number} categoryId 必传,业态分类id
	         * @param {number} floorId 必传,楼层id
	         * @param {number} buildingId 必传,场景id
	         * @returns {*}
	         */
	    }, {
	        key: 'getCategoryPoiList',
	        value: function getCategoryPoiList(categoryId, floorId, buildingId) {
	            floorId = +floorId; // 转化为数值数字
	            return this.get({ typeId: categoryId, floorId: floorId, buildingId: floorId === 0 ? buildingId : 0 }, 'getPoiByLabel.shtml');
	        }

	        /** End append by weibin. */
	    }]);

	    return Api;
	})();

	module.exports = Api;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// class MathTools {
	//   constructor() {
	//   }
	//   /**
	//   * 基于两点连成的直线方程，数学公式是（x-x1）/(x2-x1) = (y-y1)/(y2-y1)，转换成的格式如Ax+By+C = 0
	//    * @param  {array}  point1 点1坐标，[x1,y1]
	//    * @param  {array}  point2  同上
	//    * @return {object} 返回Ax+By+C=0的ABC值
	//    */
	//   twoPointToLine(point1,point2){
	//     let [x1,y1] = point1,[x2,y2] = point2;
	//     //Ax+By+c=0
	//     let A = y2-y1,B = -(x2 - x1), C = -A*x1 -B*y1;
	//     return {
	//       A:A,
	//       B:B,
	//       C:C
	//     };
	//   }
	//   /**
	//    * 点到直线距离，数学公式是|(Ax0+By0+C)/(A^2+B^2)^1/2|
	//    * @param  {array} point 点坐标[x,y]
	//    * @param  {object} line  线Ax+By+C=0的ABC
	//    * @return {Numver} 距离
	//    */
	//   pointToLineDistance(point,line){
	//     let [x,y] = point,{A,B,C} = line;
	//     let numerator = Math.abs(A*x+B*y+C),
	//         denominator = Math.sqrt( Math.pow(A,2)+Math.pow(B,2)  );
	//     return numerator/ denominator;
	//   }
	// }
	"use strict";

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MathTools = __webpack_require__(24);

	var GpsToSvgCoordinate = (function (_MathTools) {
	  _inherits(GpsToSvgCoordinate, _MathTools);

	  /**
	   * 构造。缓存四个点
	   * @param  {Array} points 四个点坐标，[[x1,y1],...]
	   * @return {null} 木有return
	   */

	  function GpsToSvgCoordinate(points) {
	    _classCallCheck(this, GpsToSvgCoordinate);

	    _get(Object.getPrototypeOf(GpsToSvgCoordinate.prototype), "constructor", this).call(this);
	    /*
	    point1										point2
	    -------------------------
	    |												|
	    |												|
	    |												|
	    |												|
	    |												|
	    |												|
	    |												|
	    -------------------------
	    point4										point3
	     */
	    this.point1 = points[0];
	    this.point2 = points[1];
	    this.point3 = points[2];
	    this.point4 = points[3];
	    this.lineX = this.twoPointToLine(this.point1, this.point2); //x方向的线   [二] 当中的上划线
	    this.lineY = this.twoPointToLine(this.point1, this.point4); //y方向的先   [二] 当中的左侧 [ 线
	    this.lineX2 = this.twoPointToLine(this.point4, this.point3); //x方向的线   [二] 当中的下划线
	    this.lineY2 = this.twoPointToLine(this.point2, this.point3); //y方向的先   [二] 当中的右侧 ] 线
	    this.dx3 = this.pointToLineDistance(this.point3, this.lineX); //点3到x的距离……
	    this.dy3 = this.pointToLineDistance(this.point3, this.lineY); //点3到y的距离……
	  }

	  /**
	   * 接收点坐标，将gps坐标转换成比例返回——可扩展接收svg边界坐标（宽高？）然后直接返回svg坐标
	   * TODO 存在问题  并没处理在区间范围外的点。不然返回的应该有负值
	   * @param  {[array]} point [x,y]
	   * @return {object}  点对应四个点内部的百分比。{X:X,Y:Y}
	   */

	  _createClass(GpsToSvgCoordinate, [{
	    key: "gpsToSvgCoordinate",
	    value: function gpsToSvgCoordinate(point) {
	      var _point = _slicedToArray(point, 2);

	      var x = _point[0];
	      var y = _point[1];

	      var dx0 = this.pointToLineDistance(point, this.lineX),
	          dy0 = this.pointToLineDistance(point, this.lineY),
	          dx1 = this.pointToLineDistance(point, this.lineX2),
	          dy1 = this.pointToLineDistance(point, this.lineY2);
	      var Y = dx0 / this.dx3,
	          X = dy0 / this.dy3;
	      if (dx0 > this.dx3 || dx1 > this.dx3) {
	        X = 0;
	      }
	      if (dy0 > this.dy3 || dy1 > this.dy3) {
	        Y = 0;
	      }
	      return {
	        X: X,
	        Y: Y
	      };
	    }
	  }, {
	    key: "pointLocation",
	    value: function pointLocation() {
	      var point = arguments.length <= 0 || arguments[0] === undefined ? { X: 0, Y: 0 } : arguments[0];
	      var startPoint = arguments.length <= 1 || arguments[1] === undefined ? { X: 0, Y: 0 } : arguments[1];
	      var areaObj = arguments.length <= 2 || arguments[2] === undefined ? { w: 0, h: 0 } : arguments[2];
	      var px = point.X;var py = point.Y;var sx = startPoint.X;var sy = startPoint.Y;var w = areaObj.w;
	      var h = areaObj.h;

	      return {
	        X: w * px + sx,
	        Y: h * py + sy
	      };
	    }
	  }]);

	  return GpsToSvgCoordinate;
	})(MathTools);

	module.exports = GpsToSvgCoordinate;

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MathTools = (function () {
	    function MathTools() {
	        _classCallCheck(this, MathTools);
	    }

	    /**
	     * 基于两点连成的直线方程，数学公式是（x-x1）/(x2-x1) = (y-y1)/(y2-y1)，转换成的格式如Ax+By+C = 0
	     * @param  {array}  point1 点1坐标，[x1,y1]
	     * @param  {array}  point2  同上
	     * @return {object} 返回Ax+By+C=0的ABC值
	     */

	    _createClass(MathTools, [{
	        key: "twoPointToLine",
	        value: function twoPointToLine(point1, point2) {
	            var _point1 = _slicedToArray(point1, 2);

	            var x1 = _point1[0];
	            var y1 = _point1[1];
	            var _point2 = _slicedToArray(point2, 2);

	            var x2 = _point2[0];
	            var y2 = _point2[1];

	            //Ax+By+c=0
	            var A = y2 - y1,
	                B = -(x2 - x1),
	                C = -A * x1 - B * y1;
	            return {
	                A: A,
	                B: B,
	                C: C
	            };
	        }

	        /**
	         * 未用到-可删除?
	         * 两条直线的相交点坐标
	         * @param  {[type]} l1   直线Ax + By + C = 0
	         * @param  {[type]} L2   直线Ax + By + C = 0
	         * @return {[type]}      {x,y}
	         */
	    }, {
	        key: "crosspointOfTwoLine",
	        value: function crosspointOfTwoLine() {
	            var L1 = arguments.length <= 0 || arguments[0] === undefined ? { A: 0, B: 0, C: 0 } : arguments[0];
	            var L2 = arguments.length <= 1 || arguments[1] === undefined ? { A: 0, B: 0, C: 0 } : arguments[1];
	            var x = 0;
	            var y = 0;

	            y = (L2.A * L1.C - L2.C * L1.A) / (L1.A * L2.B - L2.A * L1.B);
	            x = (L2.B * L1.C - L2.C * L1.B) / (L2.A * L1.B - L1.A * L2.B);
	            return { x: x, y: y };
	        }

	        /**
	         * 点到直线距离，数学公式是|(Ax0+By0+C)/(A^2+B^2)^1/2|
	         * @param  {array} point 点坐标[x,y]
	         * @param  {object} line  线Ax+By+C=0的ABC
	         * @return {Numver} 距离
	         */
	    }, {
	        key: "pointToLineDistance",
	        value: function pointToLineDistance(point, line) {
	            var _point = _slicedToArray(point, 2);

	            var x = _point[0];
	            var y = _point[1];var A = line.A;
	            var B = line.B;
	            var C = line.C;

	            var numerator = Math.abs(A * x + B * y + C),
	                denominator = this.pythagorean(A, B); //Math.sqrt( Math.pow(A,2)+Math.pow(B,2)  );
	            return numerator / denominator;
	        }

	        /**
	         * 两点之间的距离
	         * @param  {number} x1
	         * @param  {number} y1
	         * @param  {number} x2
	         * @param  {number} y2
	         * @return {number} distance
	         */
	    }, {
	        key: "pointsDistance",
	        value: function pointsDistance(x1, y1, x2, y2) {
	            return this.pythagorean(x1 - x2, y1 - y2);
	        }

	        /**
	         * 勾股定理，勾三股四弦五
	         * @param  {number} a 勾三
	         * @param  {number} b 股四|弦五
	         * @param  {bollen} type 真表示正向，获得弦五  假则表示反向，获得股四
	         * @return {number}   股四|弦五
	         */
	    }, {
	        key: "pythagorean",
	        value: function pythagorean(a, b, type) {
	            typeof type === 'undefined' ? type = true : "";
	            if (type) {
	                return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	            } else {
	                return Math.sqrt(Math.abs(Math.pow(a, 2) - Math.pow(b, 2)));
	            }
	        }

	        /**
	         * 获取随机数
	         * @param  {number} ...num floor/cell。缺省时返回0~1，一个值时返回0~num，两个值时返回两个值之间的整数
	         * @return {[type]}        随机数
	         */
	    }, {
	        key: "random",
	        value: function random() {
	            for (var _len = arguments.length, num = Array(_len), _key = 0; _key < _len; _key++) {
	                num[_key] = arguments[_key];
	            }

	            if (num.length === 0) {
	                return Math.random();
	            }
	            var floor = undefined,
	                cell = undefined;
	            if (num.length === 1) {
	                floor = 0;
	                cell = num[0];
	            }
	            if (num.length >= 2) {
	                floor = num[0];
	                cell = num[1];
	            }
	            return floor + Math.random() * (cell - floor);
	        }

	        /**
	         * 获取随机整数
	         * @param  {number} ...num floor/cell。缺省时返回0~1，一个值时返回0~num，两个值时返回两个值之间的整数
	         * @return {[type]}        随机整数数
	         */
	    }, {
	        key: "randomInt",
	        value: function randomInt() {
	            return Math.round(this.random.apply(this, arguments));
	        }
	    }]);

	    return MathTools;
	})();

	module.exports = MathTools;

/***/ }
/******/ ]);