/**
 * Created by weibin on 2018/4/7.
 */
class Refine {
    isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    setPoiIcon(link) {
        return '//taiguli.wizarcan.com/' + link;
    }

    setDetail(detail) {
        if (detail != undefined) {
            return detail;
        } else {
            return '';
        }
    }

    setPoiBookingStore(book) {
        let booking;
        console.log(book)
        if (book != undefined) {
            book[3] == 0 ? booking = '' : booking = '预付卡店铺'
        } else {
            booking = ''
        }
        return booking;
    }

    setPoiGift(gift) {
        let gifting;
        if ((gift != '') && (gift != undefined)) {
            gifting = '<img src="images/icon/giftsmall.png"/><h3>店铺优惠</h3><h3 class="ativesin">' + gift + '</h3>';
            console.log(gifting)
        } else {
            gifting = ''
        }
        return gifting;
    }

    setPoiVip(vip) {
        let viping;
        if ((vip != '') && (vip != undefined)) {
            viping = '<img src="images/icon/vipsmall.png"/><h3>会员优惠</h3><h3 class="vipin">' + vip + '</h3>'
        } else {
            viping = ''
        }
        return viping;
    }

    showPoiDetail(poi) {
        console.log('===> 新版地图的显示poi详情的方法 => poi:', poi);

        this.startNavPoi = $.extend({}, poi);

        let tpl =
            `<div class="storemessage">
                <div class="container-fluid">
                    <div class="storemessageprime">
                        <div class="primeleft">
                            <div class="primelogo">
                                <img src="${refine.setPoiIcon(poi.icon)}">
                            </div>
                        </div>
                        <div class="primeright">
                            <h1 class="primename">${poi.brand}</h1>
                            <h2 class="classify_store">${refine.setDetail(poi.detail)}</h2> <h4 class="booking_store">${refine.setPoiBookingStore(poi.serviceLabels)}</h4>
                            <div class="charh3">
                                <div class="messagerow onegift_store">
                                ${refine.setPoiGift(poi.discountInfo)}
                                    <!--<img src="images/icon/giftsmall.png"/>-->
                                    <!--<h3>店铺优惠</h3>-->
                                    <!--<h3 class="ativesin">4月18至19日限量臻品开放柜预售，前100位全款预定可获黑金版眼睛一副</h3>-->
                                </div>
                                <div class="messagerow onevip_store">
                                  ${refine.setPoiVip(poi.memberOffer)}
                                    <!--<img src="images/icon/vipsmall.png"/><h3>会员优惠</h3>-->
                                    <!--<h3 class="vipin">里享计划9折，里誉计划8.5折，谧寻商店里享计划9.5折，里誉计划9折</h3>-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="storemessagerest">
                        <div class="restleft">
                            <img src="images/icon/localsmall.png"/>
                            <h1>${poi.address}</h1>
                        </div>
                        <div class="restright">
                            <ul>
                                <li><a class="telhref" href="javascript:void(0);"><img src="images/icon/telsmall.png" onclick="refine.dial('${poi.phoneNumber}')"/></a></li>
                                <li class="shareurl"><img src="images/icon/sharesmall.png" onclick="refine.share()"/></li>
                                <li><img class="goodicon" src="images/icon/goodsmall.png" onclick="refine.thumbUp('${poi.id}','${poi.thumpup}')"/><h4 class="thumpup">${poi.thumpup}</h4></li>
                                <li class="gotostorehome"><img src="images/icon/cheapsmall.png" onclick="refine.viewTheCoupons('${poi.url}')"/></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--<div class="closel">-->
                    <!--<img src="images/icon/close.png" />-->
                <!--</div>-->
                <div class="gotow" onclick="refine.startNav()">
                    <img src="images/icon/go.png"/>
                </div>
                <div class="gotow" id="closed" onclick="refine.hidePoiDetail()">
                    <img src="images/icon/closered.png"/>
                </div>
            </div>`;


        gTools.halfModal(tpl, {class: "showPoi flag TaikooLi"});

        // 设置关闭弹框事件
        $('#js_poi_detail_popup').click((event) => {
            let target = event.target;
            console.log('target:', target);
        });
    }

    // 关闭poi详情弹框
    hidePoiDetail() {
        gTools.hideHalfModal();
    }

    // poi详情弹框-打电话
    dial(j) {
        let storetel = j
        window.location.href = 'tel:' + storetel
    }

    // poi详情弹框-分享
    share() {
        // console.log('share...');
        // $.ajax({
        //     url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi',
        //     type: 'get',
        //     dataType: 'json',
        //     success: function (res) {
        //
        //     }
        // })
        let url=location.href;
        $.ajax({
            type : "get",
            url : "http://127.0.0.1:8088/php/jssdk.php?url="+url,//替换网址，xxx根据自己jssdk文件位置修改
            dataType : "jsonp",
            jsonp: "callback",
            jsonpCallback:"success_jsonpCallback",
            success : function(data){
                wx.config({
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        "onMenuShareTimeline", //分享给好友
                        "onMenuShareAppMessage", //分享到朋友圈
                        "onMenuShareQQ", //分享到QQ
                        "onMenuShareWeibo" //分享到微博
                    ]
                });
            },
            error:function(data){
                console.log("连接失败！");
            }
        });
        wx.ready(function (){
            let shareData = {
                title: '标题',
                desc: '简介',//这里请特别注意是要去除html
                link: '链接',
                imgUrl: '题图'
            };
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
        });
    }

    // poi详情弹框-点赞
    thumbUp(a, b) {
        let poiId = a;
        let poiThum = b;


        $.ajax({
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.errcode != '40013') {
                    $.ajax({
                        url: 'http://idp.dev2.wizarcan.com/stats/saveThumbUp.shtml?buildingId=33&poiId=' + poiId + '&weixinAppId=wx032d0135e9a5652e&weixinOpenId=' + res.openid,
                        type: 'get',
                        dataType: 'json',
                        success: function (res1) {
                            if (res1.msg == 'success') {
                                poiThum += 1;
                                $('.thumpup').html(poiThum);
                                $('.goodicon').attr('src', 'images/icon/yellowgoodsmall.png');
                            }
                        }
                    });
                } else {
                    console.log('调用openid失败');
                }
            },
        })
    }

    // poi详情弹框-查看优惠券
    viewTheCoupons(j) {
        let storeurl = j;
        window.location.href = storeurl;
    }

    // 开始导航
    startNav(poi) {
        poi = poi || this.startNavPoi;
        console.log('startNav() ===> poi:', poi);
        gTools.startNav(poi, true);
    }
}

window.refine = new Refine();