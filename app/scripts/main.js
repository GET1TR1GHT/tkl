var play = null,
    play1 = null,
    time = null,
    index = 0,
    index1 = 0,
    number = 0;
$(document).ready(function () {

    autoplay();
    autoplay1();

    // autoplaynew();


    // 获取手指在轮播图元素上的一个滑动方向（左右）
    // 获取界面上轮播图容器
    var $carousels = $('.banner');
    huadong($carousels);

    var $carousels1 = $('.storedetail');
    huadong1($carousels1);


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
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getBannerHome.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            $('#bannerimg>li').each(function (a, b) {
                $('.detail').html(res.data[index].title);
            })
        },
        error: function () {
            console.log('调用banner失败');
        }
    })
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

    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getNewStore.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            var newstorename = $('.newstorename');
            var newstoreads = $('.newstoreads');
            var ress = [];
            $('#storesdetails>li').each(function (a, b) {
                strs = res.data[index1].storeImage.split(',');
                ress.push(strs[0]);
                if ($('#storesdetails>li').attr('data-id') == a + 1) {
                    $('#storesdetails>li').eq(index1).css({
                        'background': 'url(http://idp.dev2.wizarcan.com/' + ress[0] + ') no-repeat',
                        'background-size': '100% 100%',
                    }).attr('onclick', 'javascrtpt:window.location.href="' + res.data[index1].url + '"');
                    newstorename.html(res.data[index1].brand.replace('#', '  '));
                    newstoreads.html(res.data[index1].address);
                    $('.newstoretitle').html(res.data[index1].newTitle1);
                }
            })
        },
        error: function () {
            console.log('调用新店开业失败');
        }
    })
}

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
