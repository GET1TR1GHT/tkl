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
    window.location.href = 'storedetail.html?type=228';
}

// 搜索功能
function search() {
    var putcharin = $('.search').val();
    window.location.href = 'seachstore.html?name=' + putcharin;
}

// 联想搜索点击直接跳转店铺列表
function searchinbox() {
    $('.thinkli').each(function (a, b) {
        $('.thinkli').eq(a).on('click', function () {
            var putcharin = $('.thinkli').eq(a).html();
            console.log(putcharin)
            window.location.href = 'seachstore.html?name=' + putcharin;
        })
    })
    $('.whiteli').each(function (a, b) {
        $('.whiteli').eq(a).on('click', function () {
            var putcharin = $('.whiteli').eq(a).html();
            console.log(putcharin)
            window.location.href = 'seachstore.html?name=' + putcharin;
        })
    })
}

function todetail() {
    $('.storelist').each(function (a, b) {
        $('.storelist').eq(a).on('click', function () {
            var putcharin = $('.store_name').eq(a).html();
            console.log(a)
            window.location.href = 'onestoredetail.html?designation=' + putcharin;
        })
    })
}

// pl存放banner，ajax数据
var pl = [];
// ol存放newstore数据
var ol = [];

// 调用banner数据并放入pl里面
$.ajax({
    method: 'get',
    url: 'http://idp.dev2.wizarcan.com/client/getBannerHome.shtml?buildingId=33',
    buildingId: 'true',
    dataType: 'json',
    success: function (res) {
        $('#bannerimg>li').each(function (a, b) {
            pl.push(res.data[a].title);
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

    // 调用店铺名字放入到联想搜索里面
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            var index2 = 0;
            var guu = [];
            $.each(res.data, function (a, b) {
                guu.push(res.data[a].brand);
                if (guu[a] != '') {
                    for (var i = 0; i < index2 + 1; i++) {
                        $('.thinksearchul').append('<li class="thinkli" onclick="searchinbox()">' + guu[a] + '</li>');
                    }
                }
            })
        },
        error: function () {
            console.log('调用详情店铺失败');
        }
    })
    $.ajax({
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN',
        dataType:'json',
        success: function (res) {
            res.openid;
        }
    })

    // 触发联想搜索
    function searchstoreName() {
        var searchCityName = $('#searchstorename').val();
        if (searchCityName == '') {
            $('.thinksearchul>li').hide();
            $('.record').show();
        } else {
            $('.thinksearchul>li').each(function () {
                var storeName = $(this).html();
                if (storeName.indexOf(searchCityName) != -1) {
                    $(this).show();
                    $('.record').hide();
                } else {
                    $(this).hide();
                }
            });
        }
    }

    $('#searchstorename').bind('input propertychange', function () {
        searchstoreName();
    });


    var trigger = null;

    // 点击最近搜索和热门搜索下的任何一条件，触动会改变背景
    $('.whiteli').each(function (r, g) {
        $('.whiteli').eq(r).on('touchstart', function () {
            $('.whiteli').eq(r).css('background-color', '#ccc');
        })
        $('.whiteli').eq(r).on('touchend', function () {
            $('.whiteli').eq(r).css('background-color', '#e2e2e2');
        })
    })

    // 点击input后显示搜索栏
    $('.search').on('click', function () {
        showsearch();
    }), function () {
        clearTimeout(trigger);   //清除将要在1秒后执行的弹出框动作
    }

    // 点击搜索图标、搜索条件和退出按钮会跳出页面
    // $('.whiteli').on('click', function () {
    //     hidesearch();
    // }), function () {
    //     clearTimeout(trigger);   //清除将要在1秒后执行的弹出框动作
    // };
    // $('.serchlogo').on('click', function (e) {
    //     e.preventDefault();
    //     hidesearch();
    // });
    $('.imginlogo').on('click', function () {
        hidesearch();
    })

    function showsearch() {
        $('.imginlogo').attr('src', 'images/icon/left.png').css('height', '22px');
        $('.search').css({
            'placeholder': ' ', 'text-align': 'left'
        })
        $('.serchlogo').css('display', 'block');
        $('.whiteblock').css('display', 'block').on('touchmove', function (e) {
            e.preventDefault();
        });
        $('.searchstorename').val('');
        if ($('#searchstorename').val() == '') {
            $('.record').show();
            $('.thinksearchul>li').hide();
        }
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getHotSearch.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                $('.hotrecord>li').remove();
                $.each(res.data, function (j, k) {
                    if (j <= 9) {
                        $('.hotrecord').append('<li class="whiteli" onclick="searchinbox()">' + res.data[j].brand + '</li>')
                    }
                })
            },
            error: function () {
                console.log('调用最热搜索失败');
            }
        })
    };

    function hidesearch() {
        $('.imginlogo').attr('src', 'images/icon/tkllogo.png').css('height', '30px');
        $('.search').css({
            'placeholder': ' ', 'text-align': 'center'
        })
        $('.serchlogo').css('display', 'none');
        $('.whiteblock').css('display', 'none');
    }


    // 当页面是为index；
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

    // 当页面是否包含name条件；
    var urll = location.href;
    if (urll.indexOf('name') != -1) {
        var name = urll.split('?')[1];
        var name1 = name.split('=')[1];
        if (name1 == '') {
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
                    var name2 = decodeURIComponent(name1);
                    console.log(res.data)
                    $.each(res.data, function (a, b) {
                        guu.push(res.data[a].comment);
                        if (guu[a] != '') {
                            if (guu[a].indexOf(name2) != -1) {
                                for (var i = 0; i < index2 + 1; i++) {
                                    if (typeof(res.data[a].detail) != 'undefined') {
                                        $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
                                            '                    <div class="detailleft">' +
                                            '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                            '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                            '                        <div class="detailleftbottom">' +
                                            '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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
                                        $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
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

    if (urll.indexOf('designation') != -1) {
        var designation = urll.split('?')[1];
        var designation1 = designation.split('=')[1];
        var designation2 = decodeURIComponent(designation1);
        console.log(designation2);
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                var guu = [];
                $.each(res.data, function (j, k) {
                    guu.push(res.data[j].brand);
                    if (guu[j] != '') {
                        if (guu[j].replace('#', '  ').indexOf(designation2) != -1) {
                            $('.primelogo>img').attr('src', typeof(res.data[j].icon) == 'undefined' ? 'images/icon/Rectangle.png' : 'http://idp.dev2.wizarcan.com/' + res.data[j].icon)
                            $('.primename').html(res.data[j].brand.replace('#', '  '));
                            $('.ativesin').html((res.data[j].discountInfo == '') ? '暂无折扣优惠' : res.data[j].discountInfo)
                            $('.vipin').html()
                            $('.restleft>h1').html(res.data[j].address)
                            $('.telhref').attr('href', 'tel:' + res.data[j].phoneNumber + ')')
                        }
                    }
                })
            },
            error: function () {
                console.log('调用详情店铺失败');
            }
        })
    }

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
                    $('.serveli').css('display', 'none');
                } else if (type1 == 227) {
                    $('#changetype>p').html('生活');
                    $('.shopli').css('display', 'none');
                    $('.foodli').css('display', 'none');
                    $('.funli').css('display', 'block');
                    $('.serveli').css('display', 'none');
                }
                else if (type1 == 228) {
                    $('#changetype>p').html('服务');
                    $('.shopli').css('display', 'none');
                    $('.foodli').css('display', 'none');
                    $('.funli').css('display', 'none');
                    $('.serveli').css('display', 'block');
                }
                else if (type1 == 225) {
                    $('#changetype>p').html('美食');
                    $('.shopli').css('display', 'none');
                    $('.foodli').css('display', 'block');
                    $('.funli').css('display', 'none');
                    $('.serveli').css('display', 'none');
                }
            }
        }
        return type1;
    }

    // 触发kk（），获取该页面为什么类型的，并传递值给type4
    var type4 = kk();
    // 并调用ajax把该页面所有的数据呈现出来
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
                // 去除undefined
                if (typeof(guu[a]) != 'undefined') {
                    // 分析是否有该数据，并进行筛选
                    if (guu[a].indexOf(type4) != -1) {
                        for (var i = 0; i < index2 + 1; i++) {
                            // li数据加载后并插入到ul当中
                            $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
                                '                    <div class="detailleft">' +
                                '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                '                        <div class="detailleftbottom">' +
                                '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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
        $('.greyblock').css('display', 'block');
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
    $('.restli').each(function (d, h) {
        $('.restli').eq(d).on('click', function () {
            $('.restli').each(function (p, u) {
                $('.restli').eq(p).css({'color': '#808080', 'border-bottom': '1px solid #ccc'});
                $('.restli').eq(d).css({'color': '#D8BB81', 'border-bottom': '1px solid #D8BB81'});
                $('.restli').eq(p).parent().prev().children('p').css('color', '#fff');
                $('.restli').eq(d).parent().prev().children('p').css('color', '#D8BB81');
                $('.restli').eq(p).parent().prev().children('.changeimg').attr('src', 'images/icon/down.png');
                $('.restli').eq(d).parent().prev().children('.changeimg').attr('src', 'images/icon/yellowdown.png');
            })
            if ($('.restli').eq(d).text() == 'M层') {
                floorajax('M');
            }
            else if ($('.restli').eq(d).text() == 'L1') {
                floorajax('L1')
            }
            else if ($('.restli').eq(d).text() == 'L2') {
                floorajax('L2')
            }
            else if ($('.restli').eq(d).text() == '中餐') {
                typeajax('中餐');
            }
            else if ($('.restli').eq(d).text() == '西餐') {
                typeajax('西餐');
            }
            else if ($('.restli').eq(d).text() == '咖啡、饮品及烘焙') {
                typeajax('咖啡');
            }
            else if ($('.restli').eq(d).text() == '轻便美食') {
                typeajax('轻便美食');
            }
            else if ($('.restli').eq(d).text() == '亚洲美食') {
            }

            else if ($('.restli').eq(d).text() == '女装') {
                typeajax('女装');
            }
            else if ($('.restli').eq(d).text() == '男装') {
                typeajax('男装');
            }
            else if ($('.restli').eq(d).text() == '休闲服饰/运动产品') {
                typeajax('休闲');
            }
            else if ($('.restli').eq(d).text() == '珠宝钟表/饰品') {
                typeajax('珠宝/钟表/饰品');
            }
            else if ($('.restli').eq(d).text() == '工艺/家具/礼品') {
                typeajax('工艺/家居/礼品');
            }
            else if ($('.restli').eq(d).text() == '电子产品') {
                typeajax('影音/电器用品');
            }
            else if ($('.restli').eq(d).text() == '鞋包皮具') {
                typeajax('鞋/包/皮具用品');
            }

            else if ($('.restli').eq(d).text() == '主力店') {
                typeajax('主力店');
            }
            else if ($('.restli').eq(d).text() == '护理美容') {
                typeajax('护理');
            }
            else if ($('.restli').eq(d).text() == '书店') {
                typeajax('书店');
            }
            else if ($('.restli').eq(d).text() == '电影院') {
                typeajax('电影院');
            }
            else if ($('.restli').eq(d).text() == '卫生间') {
                typeajax('卫生间');
            }
            else if ($('.restli').eq(d).text() == '客服中心') {
                typeajax('客服');
            }

            else if ($('.restli').eq(d).text() == '甜点/饮品') {
                typeajax('甜品及饮品');
            }
            else if ($('.restli').eq(d).text() == '会员优惠') {
                active(2);
            }
            else if ($('.restli').eq(d).text() == '预付卡') {
                active(3);
            }
            else if ($('.restli').eq(d).text() == '店铺活动') {
                cheap()
            }
        })
    })

    function floorajax(j) {
        var floors = j;
        $('.datailsul>li').remove();
        var typee = kk();
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                var index2 = 0;
                var guu = [];
                var floor = [];
                $.each(res.data, function (a, b) {
                    guu.push(res.data[a].typeIds);
                    floor.push(res.data[a].mapArea);
                    if (typeof(guu[a]) != 'undefined') {
                        if (guu[a].indexOf(typee) != -1 && floor[a].indexOf(floors) != -1) {
                            for (var i = 0; i < index2 + 1; i++) {
                                $('.datailsul').append('<li class="container storelist" onclick="todetail()">' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1 class="store_name">' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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


    function typeajax(j) {
        var typesfood = j;
        $('.datailsul>li').remove();
        var typee = kk();
        $.ajax({
            method: 'get',
            url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
            buildingId: 'true',
            dataType: 'json',
            success: function (res) {
                var index2 = 0;
                var guu = [];
                var types = [];
                $.each(res.data, function (a, b) {
                    guu.push(res.data[a].typeIds);
                    types.push(res.data[a].detail);
                    if (typeof(guu[a]) != 'undefined') {
                        if (guu[a].indexOf(typee) != -1 && types[a].indexOf(typesfood) != -1) {
                            for (var i = 0; i < index2 + 1; i++) {
                                $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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

    function active(j) {
        $('.datailsul>li').remove();
        var typee = kk();
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
                    if (typeof(guu[a]) != 'undefined') {
                        if (guu[a].indexOf(typee) != -1 && res.data[a].serviceLabels[j] == '1') {
                            for (var i = 0; i < index2 + 1; i++) {
                                $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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

    function cheap() {
        $('.datailsul>li').remove();
        var typee = kk();
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
                    if (typeof(guu[a]) != 'undefined') {
                        if (guu[a].indexOf(typee) != -1 && res.data[a].discountInfo != '') {
                            for (var i = 0; i < index2 + 1; i++) {
                                $('.datailsul').append('<li class="container" onclick="javascrtpt:window.location.href=\'onestoredetail.html\'">' +
                                    '                    <div class="detailleft">' +
                                    '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                                    '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                                    '                        <div class="detailleftbottom">' +
                                    '                            <p>' + res.data[a].detail.substr(0, 5).replace('及', '') + '  ' + ((res.data[a].serviceLabels[3]) == '0' ? '' : '预付卡店铺') + '</p>' +
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
    $('.detail').html(pl[index]);
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
    newstorename.html(ol[index1].brand.replace('#', '  '));
    newstoreads.html(ol[index1].address);
    $('.newstoretitle').html(ol[index1].newTitle1);
}

// function huadongnew(ll) {
//     var rollthing = ll;
//     var startX, endX;
//     // 在滑动的一定范围内，才切换图片
//     var offset = 50;
//     // 注册滑动事件
//
//     rollthing.on('touchstart', function (e) {
//         // 手指触摸开始时记录一下手指所在的坐标x
//         startX = e.originalEvent.touches[0].clientX;
//
//     });
//     rollthing.on('touchmove', function (e) {
//         // 目的是：记录手指离开屏幕一瞬间的位置 ，用move事件重复赋值
//
//         endX = e.originalEvent.touches[0].clientX;
//     });
//     rollthing.on('touchend', function (e) {
//         // 结束触摸一瞬间记录手指最后所在坐标x的位置 endX
//         // 比较endX与startX的大小，并获取每次运动的距离，当距离大于一定值时认为是有方向的变化
//
//         var distance = Math.abs(startX - endX);
//         if (distance > offset) {
//             if ($('.storedetail').offset().left - 15 == -($('.shownews').width())) {
//                 //说明有方向的变化
//                 //根据获得的方向 判断是上一张还是下一张出现
//                 $(this).carousel(startX > endX ? shownew(2, true) : shownew(0, false));
//             } else if ($('.storedetail').offset().left - 15 == -($('.shownews').width() * 2)) {
//                 $(this).carousel(startX > endX ? shownew(2, true) : shownew(1, false));
//             } else {
//                 $(this).carousel(startX > endX ? shownew(1, true) : shownew(0, false));
//             }
//
//             startX = null;
//             var count = 0;
//             var outTime = 7;//秒
//             window.setInterval(go, 1000);
//
//             function go() {
//                 count++;
//                 if (count == outTime) {
//                     clearInterval(time);
//                     clearInterval(timer);
//                     autoplaynew();
//                 }
//             }
//         }
//     })
// }


// autoplaynew的
// function autoplaynew() {
//     var flag = true;
//     time = setInterval(function () {
//         // 判断是否为最后一个
//         if (number == 2) {
//             flag = false;
//             flag ? number++ : number--;
//         } else {
//             if (number == 1 && flag == false) {
//                 flag = false;
//                 flag ? number++ : number--;
//             } else {
//                 flag = true;
//                 flag ? number++ : number--;
//             }
//         }
//         clearInterval(timer);
//         shownew(number, flag);
//     }, 10000)
// }
//
// function shownew(a, pp) {
//     number = a;
//
//     $.ajax({
//         method: 'get',
//         url: 'http://idp.dev2.wizarcan.com/client/getNewStore.shtml?buildingId=33',
//         buildingId: 'true',
//         dataType: 'json',
//         success: function (res) {
//
//             var newstorename = $('.newstorename');
//             var newstoreads = $('.newstoreads');
//             var ress = [];
//             $('#storesdetails>li').each(function (g, h) {
//                 strs = res.data[number].storeImage.split(',');
//                 ress.push(strs[0]);
//                 $('#storesdetails>li').eq(a).css({
//                     'background': 'url(http://idp.dev2.wizarcan.com/' + ress[0] + ') no-repeat',
//                     'background-size': '100% 100%',
//                 }).attr('onclick', 'javascrtpt:window.location.href="' + res.data[number].url + '"');
//                 newstorename.html(res.data[number].brand.replace('#', '  '));
//                 newstoreads.html(res.data[number].address);
//             })
//         },
//         error: function () {
//             alert('失败');
//         }
//     })
//
//
//     var k = pp;
//
//     // 新店开业的滚动条
//     var roll = $('#roll>p');
//     roll.each(function (b, value) {
//         roll.eq(b).removeClass();
//         roll.eq(number).addClass('default');
//     });
//
//     var iTarget = number * $('.shownews').width();
//     iSpeed = (($('.shownews').width()) / 500);
//     iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
//     if (k == true) {
//         timer = setInterval(function () {
//             if ($('#storesdetails').offset().left == -(($('.shownews').width() * number) - 15)) {
//                 clearInterval(timer);
//             } else {
//                 var oo = $('#storesdetails').offset().left - 15 - iSpeed + 'px';
//                 $('#storesdetails').css('left', oo);
//             }
//         }, 1);
//     } else {
//         timer1 = setInterval(function () {
//             if ($('#storesdetails').offset().left == -(($('.shownews').width() * number) - 15)) {
//                 clearInterval(timer1);
//             } else {
//                 var xx = $('#storesdetails').offset().left - 15 + iSpeed + 'px';
//                 $('#storesdetails').css('left', xx);
//             }
//         }, 1);
//     }
//     // 判断number是否为0，放置位置
// }
