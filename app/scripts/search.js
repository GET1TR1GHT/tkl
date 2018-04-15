// 搜索功能触发
function search() {
    // 获取input内的值
    var putcharin = $('.search').val();
    // 传递值给下一个页面，并跳转下一个页面
    window.location.href = 'seachstore.html?name=' + putcharin;
}

// 在HTML标记searchinbox()，点击联想搜索框或者热门搜索和近期搜索按钮其中一个直接跳转该内容的店铺列表
// 判断是否是onestoredetail.html页面，onestoredetail.html页面搜索后直接在地图上显示，不再访问商铺列表页面（seachstore.html）
function searchinbox() {
    var url1 = location.href;
    if (url1.indexOf('onestoredetail') == -1){
        $('.thinkli').each(function (a, b) {
            $('.thinkli').eq(a).on('click', function () {
                // 获取理想搜索里点击的值
                var putcharin = $('.thinkli').eq(a).html();
                // 传递值给下一个页面，并跳转下一个页面
                window.location.href = 'seachstore.html?name=' + putcharin;
            })
        })
        $('.whiteli').each(function (a, b) {
            $('.whiteli').eq(a).on('click', function () {
                // 获取热门搜索和近期搜索的值
                var putcharin = $('.whiteli').eq(a).html();
                // 传递值给下一个页面，并跳转下一个页面
                window.location.href = 'seachstore.html?name=' + putcharin;
            })
        })
    }else {

    }
}
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
                        if(guu[a].substr(0, 1)!='3'){
                            // 调用poi接口，并把所有店铺加载出来放入li，备好联想搜索
                            $('.thinksearchul').append('<li class="thinkli" onclick="searchinbox()">' + guu[a].replace('#', '') + '</li>');
                            $('.thinksearchul').append('<li class="thinkli" onclick="searchinbox()">' + guu[a].toLowerCase().replace('#', '') + '</li>');
                            $('.thinksearchul').append('<li class="thinkli" onclick="searchinbox()">' + guu[a].substring(0,1).toUpperCase() +  guu[a].substring(1).toLowerCase().replace('#', '')+ '</li>');
                            $('.thinksearchul').append('<li class="thinkli" onclick="searchinbox()">' + guu[a].toUpperCase().replace('#', '')+ '</li>');
                        }
                    }
                }
            })
        },
        error: function () {
            console.log('调用详情店铺失败');
        }
    })
    // 触发联想搜索，关键词相关的显示，不相关的隐藏
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
    // 输入一次触发一次
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
        // 显示搜索列表和调用热门搜索调用接口
        showsearch();
    }), function () {
        clearTimeout(trigger);   //清除将要在1秒后执行的弹出框动作
    }
    $('.imginlogo').on('click', function () {
        // 隐藏接口
        hidesearch();
    })

    // 显示搜索列表和调用热门搜索调用
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

    // 隐藏接口
    function hidesearch() {
        $('.imginlogo').attr('src', 'images/icon/tkllogo.png').css('height', '30px');
        $('.search').css({
            'placeholder': ' ', 'text-align': 'center'
        })
        $('.serchlogo').css('display', 'none');
        $('.whiteblock').css('display', 'none');
    }
})