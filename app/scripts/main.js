var play = null,
    play1 = null,
    time = null,
    index = 0,
    index1 = 0,
    number = 0;

// 点击首页导航栏跳转相同的页面，传递不同的数据，数据分析和判断是美食、购物、娱乐、服务
function moveto() {
    window.location.href = 'storedetail.html?type=225';
}

function movetoshop() {
    window.location.href = 'storedetail.html?type=226';
}

function movetofun() {
    window.location.href = 'storedetail.html?type=227';
}

function movetoserve() {
    window.location.href = 'classifystore.html?go=2';
}

function moveallto() {
    window.location.href = 'storedetail.html?type=220';
}

function movebookingto() {
    window.location.href = 'storedetail.html?type=221';
}

function backto() {
    var url = location.href;
    if (url.indexOf('name') != -1) {
        window.location.href = 'index.html';
    } else {
        history.back(-1)
    }
}

function classify() {
    var $classifylist = $('.prime_list>li');
    var putcharin;
    $classifylist.each(function (k, l) {
        $classifylist.eq(k).on('click', function () {
            putcharin = $classifylist.eq(k).children('p').html();
            // 传递值给下一个页面，并跳转下一个页面
            window.location.href = 'storedetail.html?classifyo=' + putcharin;
        })
    })
}

document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        $('.homecircle').css('display', 'none');
    }
}
$('.circle-animation').on('touchmove', function (e) {
    e.preventDefault();
})

// pl存放banner，ajax数据
var pl = [];
// ol存放newstore数据
var ol = [];

var puturl = [];

// 调用banner数据并放入pl里面
$.ajax({
    method: 'get',
    url: 'http://idp.dev2.wizarcan.com/client/getBannerHome.shtml?buildingId=33',
    buildingId: 'true',
    dataType: 'json',
    success: function (res) {
        $('#bannerimg>li').each(function (a, b) {
            pl.push(res.data[a].title);
            puturl.push(res.data[a].url);
        })
    },
    error: function () {
        console.log('调用banner失败');
    }
})

// 调用newstore数据并存放在ol当中
$.ajax({
    method: 'get',
    url: 'http://idp.dev2.wizarcan.com/client/getNewStore.shtml?buildingId=33',
    buildingId: 'true',
    dataType: 'json',
    success: function (res) {
        $('#storesdetails>li').each(function (a, b) {
            ol.push(res.data[a]);
        })
    },
    error: function () {
        console.log('调用新店开业失败');
    }
})

$(document).ready(function () {

    // 当页面是为index，是就触发滑动
    var url = location.href;
    if (url.indexOf('store') == -1) {
        // banner和新店开业页面加载完成后自动左右滑动
        autoplay();
        autoplay1();
        // 获取手指在轮播图元素（左右）
        // 根据手指触摸的情况分辨是哪一个滑动并触发
        // banner滑动并触发,huadong()在$(document).ready外部
        var $carousels = $('.banner');
        huadong($carousels);

        // 新店开业滑动触发，huadong1()在$(document).ready外部
        var $carousels1 = $('.storedetail');
        huadong1($carousels1);
    }

    // 当页面域名是否包含name,classifyo，go条件；说明在店铺列表页面
    var urll = location.href;
    if (urll.indexOf('name') != -1) {
        var name = urll.split('?')[1];
        var name1 = name.split('=')[1];
        if (name1 == '') {
            // 未搜索到该结果
            $('#reminder').css('display', 'block')
        } else {
            $.ajax({
                method: 'get',
                url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
                buildingId: 'true',
                dataType: 'json',
                success: function (res) {
                    var index2 = 0;
                    var guu = [];
                    var name2 = decodeURIComponent(name1).replace('&amp;', '&');
                    $.each(res.data, function (a, b) {
                        guu.push(res.data[a].comment.toLowerCase().replace('#', ''));
                        if (guu[a] != '') {
                            if (guu[a].indexOf(name2.toLowerCase().replace('#', '')) != -1) {
                                console.log(guu[a])
                                for (var i = 0; i < index2 + 1; i++) {
                                    if (typeof(res.data[a].detail) != 'undefined') {
                                        $('.datailsul').append('<li class="container storelist" >' +
                                            '                    <div class="detailleft">' +
                                            '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                            '                        <h2 class="dian">' + (res.data[a].discountInfo == '' || (typeof (res.data[a].discountInfo) == 'undefined') ? '' : '<span>店</span>' + res.data[a].discountInfo) + '</h2> <h2 class="viph2">' + (res.data[a].memberOffer == '' || (typeof (res.data[a].memberOffer) == 'undefined') ? '' : '<span class="vipspan">VIP</span>' + res.data[a].memberOffer) + '</h2>' +
                                            '                        <div class="detailleftbottom">' +
                                            '                            <p data-id="' + (res.data[a].discountInfo == '' ? '0' : '1') + ((res.data[a].serviceLabels[3]) == '0' ? '0' : '3') + ((res.data[a].serviceLabels[2]) == '0' ? '0' : '2') + '">' + res.data[a].detail + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
                                            '                            <div class="yellowloacl">' +
                                            '                                <img src="images/icon/loaclyellow.png"/>' +
                                            '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' + res.data[a].mapArea[1]) + '层</h3>' +
                                            '                            </div>' +
                                            '                            <div class="good">' +
                                            '                                <img src="images/icon/good.png"/>' +
                                            '                                <h3>123</h3>' +
                                            '                            </div>' +
                                            '                        </div>' +
                                            '                    </div>' +
                                            '                    <div class="detailright">' +
                                            '                        <img src="' + (typeof(res.data[a].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[a].icon) + '"/>' +
                                            '                    </div>' +
                                            ((res.data[a].serviceLabels[2]) == '0' ? '' : '<div class="vipsign" >\n' +
                                                '                        <img src="images/icon/vipicon.png"/>\n' +
                                                '                    </div>') +
                                            '                </li>')
                                    } else {
                                        $('.datailsul').append('<li class="container storelist" >' +
                                            '                    <div class="detailleft">' +
                                            '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                            '                        <h2>' + '公共设施' + '</h2>' +
                                            '                        <div class="detailleftbottom">' +
                                            '                            <div class="yellowloacl">' +
                                            '                                <img src="images/icon/loaclyellow.png"/>' +
                                            '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' + res.data[a].mapArea[1]) + '层</h3>' +
                                            '                            </div>' +
                                            '                        </div>' +
                                            '                    </div>' +
                                            '                    <div class="detailright">' +
                                            '                        <img src="' + (typeof(res.data[a].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[a].icon) + '"/>' +
                                            '                    </div>' +
                                            ((res.data[a].serviceLabels[2]) == '0' ? '' : '<div class="vipsign" >\n' +
                                                '                        <img src="images/icon/vipicon.png"/>\n' +
                                                '                    </div>') +
                                            '                </li>')
                                    }
                                }

                            }
                        }
                    })
                    if ($('.datailsul>li').length <= 0) {
                        $('#reminder').css('display', 'block')
                    }
                },
                error: function () {
                    console.log('调用详情店铺失败');
                }
            })
            $('#reminder').css('display', 'none')
        }
    }
    if (urll.indexOf('classifyo') != -1) {
        var classify = urll.split('?')[1];
        var classify1 = classify.split('=')[1];
        // 转化为中文
        var classify2 = decodeURIComponent(classify1);
        classifys(classify2);

    }
    if (urll.indexOf('go') != -1) {
        var $classfiyli = $('.second_classify_list>li');
        var $classfiydetail = $('.classify_details_list');
        $classfiyli.each(function (r, t) {
            $(t).removeClass('classify_current');
            $classfiyli.eq(2).addClass('classify_current');
            $classfiydetail.eq(r).css('display', 'none');
            $classfiydetail.eq(2).css('display', 'block');
        })
    }

    // if (urll.indexOf('storedesignation') != -1) {
    //     var name = urll.split('?')[1];
    //     var name1 = name.split('=')[1];
    //     var name2 = decodeURIComponent(name1).replace('&amp;', '&');
    //     $.ajax({
    //         method: 'get',
    //         url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
    //         buildingId: 'true',
    //         dataType: 'json',
    //         success: function (res) {
    //             console.log(res.data)
    //             $.each(res.data, function (c, d) {
    //                 if (res.data[c].comment.toLowerCase().replace('#', '').indexOf(name2.toLowerCase().replace('#', '')) != -1) {
    //                     $('.primelogo>img').attr('src',(typeof(res.data[c].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[c].icon))
    //                     $('.primename').html(res.data[c].brand);
    //                     $('.telhref').attr('href','tel:' +res.data[c].phoneNumber);
    //                     $('.restleft>h1').html(res.data[c].address.substr(0,9));
    //                     $('.classify_store').html(res.data[c].detail);
    //                     $('.booking_store').html(((res.data[c].serviceLabels[3]) == '0' ? '' : '预付卡店铺'));
    //                     // $('.charh3').html(((res.data[c].discountInfo != '') || (typeof (res.data[c].discountInfo) != 'undefined') ?  :'' )+
    //                     //     ((res.data[c].memberOffer != '' )|| (typeof (res.data[c].memberOffer) != 'undefined') ?  '<div class="messagerow"><img src="images/icon/vipsmall.png"/><h3>会员优惠</h3><h3 class="vipin">'+ res.data[c].memberOffer+'</h3></div>' :''));
    //                     // console.log((res.data[c].discountInfo != '' || (typeof (res.data[c].discountInfo) != 'undefined')?'y':'n'));
    //
    //                     if((res.data[c].discountInfo != '') &&(typeof (res.data[c].discountInfo) != 'undefined')){
    //                         $('.onegift_store').append('<img src="images/icon/giftsmall.png"/><h3>店铺优惠</h3><h3 class="ativesin">'+ res.data[c].discountInfo +'</h3>')
    //                     }
    //
    //                     if((res.data[c].memberOffer != '')&&(typeof (res.data[c].memberOffer) != 'undefined')){
    //                         $('.onevip_store').append('<img src="images/icon/vipsmall.png"/><h3>会员优惠</h3><h3 class="vipin">'+ res.data[c].memberOffer +'</h3>')
    //                     }
    //                     $('.gotostorehome').attr('onclick','javascrtpt:window.location.href="' + res.data[c].url + '"');
    //                 }
    //             })
    //         }
    //     })
    // }

    // 判断首页点击导航栏获得网址的数据，并分析提出type后面的值，区分美食、购物、娱乐、服务；
    function kk() {
        var ur = location.href;
        if (ur.indexOf('type') != -1) {
            if (ur.indexOf('?') != -1) {
                var type = ur.split('?')[1];
                var type1 = type.split('=')[1];
                if (type1 == 226) {
                    $('#changetype>p').html('购物');
                    // $('#changetypeul>li').remove();
                    $('.shopli').css('display', 'block');
                    $('.foodli').css('display', 'none');
                    $('.funli').css('display', 'none');
                } else if (type1 == 227) {
                    $('#changetype>p').html('生活');
                    $('.shopli').css('display', 'none');
                    $('.foodli').css('display', 'none');
                    $('.funli').css('display', 'block');
                }
                else if (type1 == 225) {
                    $('#changetype>p').html('美食');
                    $('.shopli').css('display', 'none');
                    $('.foodli').css('display', 'block');
                    $('.funli').css('display', 'none');
                } else if (type1 == 220) {
                    $('#changetype>p').html('分类');
                    $('.restli').css('display', 'block');
                    $('.vip_li').eq(2).addClass('yellowvip');
                    $('.youyueli').css('display', 'block');
                    $('.datailsul').css('padding-top', '0');
                } else {
                    $('#changetype>p').html('分类');
                    $('.restli').css('display', 'block');
                    $('.vip_li').eq(3).addClass('yellowvip');
                }
            }
        }
        return type1;
    }

    // 触发kk（），获取该页面为什么类型的，并传递值给type4
    var type4 = kk();
    // 并调用ajax把该页面所有的数据呈现出来
    if (urll.indexOf('type') != -1) {
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                var index2 = 0;
                var guu = [];
                $.each(res.data, function (a, b) {
                    guu.push(res.data[a].typeIds);
                    if ((typeof (res.data[a].serviceLabels) != 'undefined') && (typeof (res.data[a].detail) != 'undefined')) {
                        if (type4 == 220 || type4 == 221) {
                            showlist();
                            for (var i = 0; i < index2 + 1; i++) {
                                // li数据加载后并插入到ul当中
                                $('.datailsul').append('<li class="container storelist" >' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2 class="dian">' + (res.data[a].discountInfo == '' || (typeof (res.data[a].discountInfo) == 'undefined') ? '' : '<span>店</span>' + res.data[a].discountInfo) + '</h2> <h2 class="viph2">' + (res.data[a].memberOffer == '' || (typeof (res.data[a].memberOffer) == 'undefined') ? '' : '<span class="vipspan">VIP</span>' + res.data[a].memberOffer) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p data-id="' + (res.data[a].discountInfo == '' ? '0' : '1') + ((res.data[a].serviceLabels[3]) == '0' ? '0' : '3') + ((res.data[a].serviceLabels[2]) == '0' ? '0' : '2') + '">' + res.data[a].detail + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
                                    '                            <div class="yellowloacl">' +
                                    '                                <img src="images/icon/loaclyellow.png"/>' +
                                    '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' + res.data[a].mapArea[1]) + '层</h3>' +
                                    '                            </div>' +
                                    '                            <div class="good">' +
                                    '                                <img src="images/icon/good.png"/>' +
                                    '                                <h3>123</h3>' +
                                    '                            </div>' +
                                    '                        </div>' +
                                    '                    </div>' +
                                    '                    <div class="detailright">' +
                                    '                        <img src="' + (typeof(res.data[a].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[a].icon) + '"/>' +
                                    '                    </div>' +
                                    ((res.data[a].serviceLabels[2]) == '0' ? '' : '<div class="vipsign" >\n' +
                                        '                        <img src="images/icon/vipicon.png"/>\n' +
                                        '                    </div>') +
                                    '                </li>')
                            }
                        }
                        else {
                            // 去除undefined
                            if (typeof(guu[a]) != 'undefined') {
                                // 分析是否有该数据，并进行筛选
                                if (guu[a].indexOf(type4) != -1) {
                                    for (var i = 0; i < index2 + 1; i++) {
                                        // li数据加载后并插入到ul当中
                                        $('.datailsul').append('<li class="container storelist" >' +
                                            '                    <div class="detailleft">' +
                                            '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                            '                        <h2 class="dian">' + (res.data[a].discountInfo == '' || (typeof (res.data[a].discountInfo) == 'undefined') ? '' : '<span>店</span>' + res.data[a].discountInfo) + '</h2> <h2 class="viph2">' + (res.data[a].memberOffer == '' || (typeof (res.data[a].memberOffer) == 'undefined') ? '' : '<span class="vipspan">VIP</span>' + res.data[a].memberOffer) + '</h2>' +
                                            '                        <div class="detailleftbottom">' +
                                            '                            <p data-id="' + (res.data[a].discountInfo == '' ? '0' : '1') + ((res.data[a].serviceLabels[3]) == '0' ? '0' : '3') + ((res.data[a].serviceLabels[2]) == '0' ? '0' : '2') + '">' + res.data[a].detail + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
                                            '                            <div class="yellowloacl">' +
                                            '                                <img src="images/icon/loaclyellow.png"/>' +
                                            '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' + res.data[a].mapArea[1]) + '层</h3>' +
                                            '                            </div>' +
                                            '                            <div class="good">' +
                                            '                                <img src="images/icon/good.png"/>' +
                                            '                                <h3>123</h3>' +
                                            '                            </div>' +
                                            '                        </div>' +
                                            '                    </div>' +
                                            '                    <div class="detailright">' +
                                            '                        <img src="' + (typeof(res.data[a].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[a].icon) + '"/>' +
                                            '                    </div>' +
                                            ((res.data[a].serviceLabels[2]) == '0' ? '' : '<div class="vipsign" >\n' +
                                                '                        <img src="images/icon/vipicon.png"/>\n' +
                                                '                    </div>') +
                                            '                </li>')
                                    }
                                }
                            }
                        }
                    }
                })
            },
            error: function () {
                console.log('调用详情店铺失败');
            }
        })
    }


    //点击进入商铺列表后 顶部下滑栏事件，根据情况触发showrestli和hiderestli
    $('.dropdown').each(function (c, d) {
        $('.dropdown').eq(c).on('click', function () {
            if ($('.restul').eq(c).css('display') == 'block') {
                hiderestli(c);
            }
            else {
                $('.restul').each(function (k, l) {
                    hiderestli(k)
                    showrestli(c);
                })
                $('.greyblock').on('click', function () {
                    hiderestli(c);
                })
                $('.restli').on('click', function () {
                    // hiderestli(c);
                    $('.restul').eq(c).css('display', 'none');
                    $('.greyblock').css('display', 'none');
                    $('.heighligth').eq(c).css('font-weight', '200');
                })
            }
        })
    })

    // 隐藏和显示下滑栏
    function showrestli(o) {
        var cc = o;
        $('.restul').eq(cc).css('display', 'block')
        $('.greyblock').css('display', 'block').on('touchmove', function (e) {
            e.preventDefault();
        });
        // 判断下面的子导航栏是否点击
        if ($('.changeimg').eq(cc).prev('p').css('color') != 'rgb(216, 187, 129)') {
            $('.changeimg').eq(cc).attr('src', 'images/icon/top.png');
        } else {
            $('.changeimg').eq(cc).attr('src', 'images/icon/yellowtop.png');
        }
        $('.heighligth').eq(cc).css('font-weight', '500');
    }

    function hiderestli(o) {
        var cc = o;
        $('.restul').eq(cc).css('display', 'none');
        $('.greyblock').css('display', 'none');
        if ($('.changeimg').eq(cc).prev('p').css('color') != 'rgb(216, 187, 129)') {
            $('.changeimg').eq(cc).attr('src', 'images/icon/down.png');
        } else {
            $('.changeimg').eq(cc).attr('src', 'images/icon/yellowdown.png');
        }
        $('.heighligth').eq(cc).css('font-weight', '200');
    }

    // 对不同的情况下的下滑栏筛选进行分析
    $('.typelist_li').each(function (u, i) {
        $('.typelist_li').eq(u).on('click', function () {
            $('.typelist_li').each(function (l, p) {
                $('.typelist_li').eq(l).css({
                    'color': '#808080',
                    'border-bottom': '1px solid #ccc'
                }).removeClass('yellowtype');
                $('.typelist_li').eq(u).css({
                    'color': '#D8BB81',
                    'border-bottom': '1px solid #D8BB81'
                });
                $('.typelist_li').eq(u).parent().prev().children('.changeimg').attr('src', 'images/icon/yellowdown.png');
                // 当点击的是全部按钮时，不添加yellowtype的class分类
                if (u != 0) {
                    $('.typelist_li').eq(u).addClass('yellowtype');
                } else {

                }
            })
            $('.typelist_li').eq(u).parent().prev().children('p').css('color', '#D8BB81');
            showlist()
        })
    })

    $('.floor_li').each(function (u, i) {
        $('.floor_li').eq(u).on('click', function () {
            $('.floor_li').each(function (l, p) {
                $('.floor_li').eq(l).css({
                    'color': '#808080',
                    'border-bottom': '1px solid #ccc'
                }).removeClass('yellowfloor');
                $('.floor_li').eq(u).css({
                    'color': '#D8BB81',
                    'border-bottom': '1px solid #D8BB81'
                })
                $('.floor_li').eq(u).parent().prev().children('.changeimg').attr('src', 'images/icon/yellowdown.png');
                if (u != 0) {
                    $('.floor_li').eq(u).addClass('yellowfloor');
                } else {

                }
            })
            $('.floor_li').eq(u).parent().prev().children('p').css('color', '#D8BB81');
            showlist()
        })
    })

    $('.vip_li').each(function (u, i) {
        $('.vip_li').eq(u).on('click', function () {
            $('.vip_li').each(function (l, p) {
                $('.vip_li').eq(l).css({
                    'color': '#808080',
                    'border-bottom': '1px solid #ccc'
                }).removeClass('yellowvip');
                $('.vip_li').eq(u).css({
                    'color': '#D8BB81',
                    'border-bottom': '1px solid #D8BB81'
                })
                $('.vip_li').eq(u).parent().prev().children('.changeimg').attr('src', 'images/icon/yellowdown.png');
                if (u != 0) {
                    $('.vip_li').eq(u).addClass('yellowvip');
                } else {
                }
            })
            $('.vip_li').eq(u).parent().prev().children('p').css('color', '#D8BB81');
            showlist()
        })
    })

    function showlist() {
        var $typedetail = $('.yellowtype').text().substr(0, 2);
        var $floordetail = $('.yellowfloor').text().substr(0, 2);
        var $storevip = $('.yellowvip>p').text();
        var $storedetail = $('.detailleftbottom > p');
        var $storefloor = $('.yellowloacl>h3');
        var $vipdetail = $('.yellowvip').index();
        var $storeviprow = $('.detailleftbottom > p');

        $('.storelist').each(function (r, e) {
            if ($storedetail.eq(r).text().indexOf($typedetail) != -1 && $storefloor.eq(r).text().indexOf($floordetail) != -1 && $storeviprow.eq(r).attr('data-id').indexOf($storevip) != -1) {
                $('.storelist').eq(r).show();
            } else {
                $('.storelist').eq(r).hide();
            }
        })
    }

    // 显示二级分类业态点击后的店铺列表
    function classifys(j) {
        var putchar = j;
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                var index2 = 0;
                var guu = [];
                $.each(res.data, function (a, b) {
                    guu.push(res.data[a].detail);
                    if (typeof(guu[a]) != 'undefined') {
                        if (guu[a].indexOf(putchar.substr(0, 2)) != -1) {
                            $('#reminder').css('display', 'none')
                            for (var i = 0; i < index2 + 1; i++) {
                                $('.datailsul').append('<li class="container storelist" >' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2 class="dian">' + (res.data[a].discountInfo == '' || (typeof (res.data[a].discountInfo) == 'undefined') ? '' : '<span>店</span>' + res.data[a].discountInfo) + '</h2> <h2 class="viph2">' + (res.data[a].memberOffer == '' || (typeof (res.data[a].memberOffer) == 'undefined') ? '' : '<span class="vipspan">VIP</span>' + res.data[a].memberOffer) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p data-id="' + (res.data[a].discountInfo == '' ? '0' : '1') + ((res.data[a].serviceLabels[3]) == '0' ? '0' : '3') + ((res.data[a].serviceLabels[2]) == '0' ? '0' : '2') + '">' + res.data[a].detail + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
                                    '                            <div class="yellowloacl">' +
                                    '                                <img src="images/icon/loaclyellow.png"/>' +
                                    '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' + res.data[a].mapArea[1]) + '层</h3>' +
                                    '                            </div>' +
                                    '                            <div class="good">' +
                                    '                                <img src="images/icon/good.png"/>' +
                                    '                                <h3>123</h3>' +
                                    '                            </div>' +
                                    '                        </div>' +
                                    '                    </div>' +
                                    '                    <div class="detailright">' +
                                    '                        <img src="' + (typeof(res.data[a].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[a].icon) + '"/>' +
                                    '                    </div>' +
                                    ((res.data[a].serviceLabels[2]) == '0' ? '' : '<div class="vipsign" >\n' +
                                        '                        <img src="images/icon/vipicon.png"/>\n' +
                                        '                    </div>') +
                                    '                </li>')
                            }
                        }
                    }
                })
            },
            error: function () {
                console.log('调用详情店铺失败');
            }
        })
    }

    // 分类页面点击左侧栏二级分类事件
    var $classfiyli = $('.second_classify_list>li');
    var $classfiydetail = $('.classify_details_list');
    $classfiyli.each(function (g, h) {
        $classfiyli.eq(g).on('click', function () {
            $classfiyli.each(function (r, t) {
                $(t).removeClass('classify_current');
                $classfiyli.eq(g).addClass('classify_current');
                $classfiydetail.eq(r).css('display', 'none');
                $classfiydetail.eq(g).css('display', 'block');
            })
        })
    })
    // 禁止滑动
    $('.second_classify').on('touchmove', function (e) {
        e.preventDefault();
    })
    $('.classify_details').on('touchmove', function (e) {
        e.preventDefault();
    })

    $('#closed').on('click', function () {
        $('.storemessage').css({'transform': 'translate(0px, 250px)', 'opacity': '0'});
        $('#closed').css({'transform': 'scale(0,0)', 'top': '-20px'});
    })
    $('.map').on('click', function () {
        $('.storemessage').css({'transform': 'translate(0px, 0px)', 'opacity': '1'});
        setTimeout(function () {
            $('#closed').css({'transform': 'scale(1,1)', 'top': '-65px'})
        }, 300);
    })
    setTimeout(function () {
        $('.circle-animation').css('display', 'none');
        $('.datailsul>li').css({'margin-bottom': '7px', 'opacity': '1'})
    }, 400)
});

function huadong(tt) {
    var rollthing = tt;
    var startX, endX;
    // 在滑动的一定范围内，才切换图片
    var offset = 30;
    // 注册滑动事件
    rollthing.on('touchstart', function (e) {
        // 手指触摸开始时记录一下手指所在的坐标x
        startX = 0;
        startX = e.originalEvent.touches[0].clientX;

    });
    rollthing.on('touchmove', function (e) {
        e.preventDefault();
        endX = 0;
        // 目的是：记录手指离开屏幕一瞬间的位置 ，用move事件重复赋值
        endX = e.originalEvent.touches[0].clientX;
    });
    rollthing.on('touchend', function (e) {
        //结束触摸一瞬间记录手指最后所在坐标x的位置 endX
        //比较endX与startX的大小，并获取每次运动的距离，当距离大于一定值时认为是有方向的变化
        var distance = 0;
        if (endX != null) {
            distance = Math.abs(startX - endX);
        }
        clearInterval(play);
        if (distance > offset) {

            if ($('.current').attr('data-id') == 2) {
                //说明有方向的变化
                //根据获得的方向 判断是上一张还是下一张出现
                $(this).carousel(startX > endX ? show(2) : show(0));
            } else if ($('.current').attr('data-id') == 1) {
                $(this).carousel(startX > endX ? show(1) : show(2));
            } else {
                $(this).carousel(startX > endX ? show(0) : show(1));
            }

            startX = null;
            endX = null;


            var count = 0;
            var outTime = 7;//秒
            window.setInterval(go, 1000);

            function go() {
                count++;
                if (count == outTime) {
                    clearInterval(play);
                    autoplay();
                }
            }


        } else {
            clearInterval(play);
        }
    })
}

function huadong1(tt) {
    var rollthing = tt;
    var startX, endX;
    // 在滑动的一定范围内，才切换图片
    var offset = 60;
    // 注册滑动事件
    rollthing.on('touchstart', function (e) {
        // 手指触摸开始时记录一下手指所在的坐标x
        startX = 0;
        startX = e.originalEvent.touches[0].clientX;

    });
    rollthing.on('touchmove', function (e) {
        e.preventDefault();
        endX = 0;
        // 目的是：记录手指离开屏幕一瞬间的位置 ，用move事件重复赋值
        endX = e.originalEvent.touches[0].clientX;
    });
    rollthing.on('touchend', function (e) {
        //结束触摸一瞬间记录手指最后所在坐标x的位置 endX
        //比较endX与startX的大小，并获取每次运动的距离，当距离大于一定值时认为是有方向的变化
        var distance = 0;
        if (endX != null) {
            distance = Math.abs(startX - endX);
        }
        clearInterval(play1);
        if (distance > offset) {

            if ($('.shownews').attr('data-id') == 2) {
                //说明有方向的变化
                //根据获得的方向 判断是上一张还是下一张出现
                $(this).carousel(startX > endX ? show1(2) : show1(0));
            } else if ($('.shownews').attr('data-id') == 1) {
                $(this).carousel(startX > endX ? show1(1) : show1(2));
            } else {
                $(this).carousel(startX > endX ? show1(0) : show1(1));
            }
            startX = null;
            endX = null;

            var count1 = 0;
            var outTime1 = 7;//秒
            window.setInterval(go, 1000);

            function go() {
                count1++;
                if (count1 == outTime1) {
                    clearInterval(play1);
                    autoplay1();
                }
            }

        } else {
            clearInterval(play1);
        }
    })
}


// autoplay banner
function autoplay() {
    play = setInterval(function () {
        index == $('#bannerimg>li').length - 1 ? index = 0 : index++;
        show(index)
    }, 5000)
}

function autoplay1() {
    play1 = setInterval(function () {
        index1 == $('#storesdetails>li').length - 1 ? index1 = 0 : index1++;
        show1(index1);
    }, 5000)
}

// showbanner
function show(a) {
    index = a;
    var $Oimgli = $('#bannerimg>li');
    var $Ocharp = $('#numchar>p');


    $Oimgli.each(function (b, value) {
        $Oimgli.eq(b).removeClass();
        $Oimgli.eq(index).addClass('current');
    })

    $Ocharp.each(function (b, value) {
        $Ocharp.eq(b).removeClass();
        $Ocharp.eq(index).addClass('default');
    })

    // 调用pl数据
    $('.detail').html(pl[index]).attr('onclick', 'javascrtpt:window.location.href="' + puturl[index] + '"');
    ;
}

function show1(a) {
    index1 = a;
    var $storeD = $('#storesdetails>li');
    var $storeR = $('#roll>p');

    $storeD.each(function (b, value) {
        $storeD.eq(b).removeClass();
        $storeD.eq(index1).addClass('shownews');
    })

    $storeR.each(function (b, value) {
        $storeR.eq(b).removeClass();
        $storeR.eq(index1).addClass('default');
    })

    // 调用ol数据
    var newstorename = $('.newstorename');
    var newstoreads = $('.newstoreads');
    var ress = [];
    strs = ol[index1].storeImage.split(',');
    ress.push(strs[0]);
    $('#storesdetails>li').eq(index1).css({
        'background': 'url(http://idp.dev2.wizarcan.com/' + ress[0] + ') no-repeat',
        'background-size': '100% 100%',
    }).attr('onclick', 'javascrtpt:window.location.href="' + ol[index1].url + '"');
    newstorename.html(ol[index1].brand.replace('#', '  ')).attr('onclick', 'javascrtpt:window.location.href="' + ol[index1].url + '"');
    newstoreads.html(ol[index1].address);
    $('.newstoretitle').html(ol[index1].newTitle1).attr('onclick', 'javascrtpt:window.location.href="' + ol[index1].url + '"');
}

