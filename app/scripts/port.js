$(document).ready(function () {
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getNewStore.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            console.log(res.data[1])
            var newstorename = $('.newstorename');
            var newstoreads = $('.newstoreads');
            var ress = [];
            $('#storesdetails>li').each(function (a, b) {
                strs = res.data[0].storeImage.split(',');
                ress.push(strs[0]);
                console.log(ress);
                if ($('#storesdetails>li').attr('data-id') == a + 1) {
                    $('#storesdetails>li').eq(a).css({
                        'background': 'url(http://idp.dev2.wizarcan.com/' + ress[0] + ') no-repeat',
                        'background-size': '100% 100%',
                    }).attr('onclick', 'javascrtpt:window.location.href="' + res.data[0].url + '"');
                    newstorename.html(res.data[0].brand.replace('#', '  '));
                    newstoreads.html(res.data[0].address);
                }
            })
        },
        error: function () {
            alert('失败');
        }
    })
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getHotStore.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            var hotstoreimg = $('.storelogo>img');
            var hotstorename = $('.hotstorename');
            var hotstorespecil = $('.hotstorespecil');
            $('#hotstoreul>li').each(function (a, b) {
                hotstoreimg.eq(a).attr('src', 'http://idp.dev2.wizarcan.com' + res.data[a].icon);
                hotstorename.eq(a).html(res.data[a].brand.replace('#', '  '));
                hotstorespecil.eq(a).html(res.data[a].hotReasons);
            })
        },
        error: function (res) {
            alert(res.msg);
        }
    })
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getBannerHome.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            $('#bannerimg>li').each(function (a, b) {
                var $bannerimg = res.data[a].icon;
                $('#bannerimg>li').eq(a).css({
                    'background': 'url(http://idp.dev2.wizarcan.com/' + $bannerimg + ') no-repeat',
                    'background-size': '100% 100%',
                }).attr('onclick', 'javascrtpt:window.location.href="' + res.data[a].url + '"');
            })
        },
        error: function () {
            alert('失败');
        }
    })
    $.ajax({
        method: 'get',
        url: 'http://idp.dev2.wizarcan.com/client/getPoiByWhere.shtml?buildingId=33',
        buildingId: 'true',
        dataType: 'json',
        success: function (res) {
            var index2 = 0;
            $.each(res.data, function (a, b) {
                if (res.data[a].detail == '西餐') {
                    console.log(res.data[a])
                    for (var i = 0; i < index2 + 1; i++) {
                        $('.datailsul').append('<li class="container">' +
                        '                    <div class="detailleft">' +
                        '                        <h1>' + res.data[a].brand.replace('#', '  ') + '</h1>' +
                        '                        <h2>' + (res.data[a].discountInfo == '' ? '暂无折扣优惠' : res.data[a].discountInfo) + '</h2>' +
                        '                        <div class="detailleftbottom">' +
                        '                            <p>' + res.data[a].detail + (res.data[a].serviceLabels[3]== '0'? '':'预付卡店铺')+'</p>' +
                        '                            <div class="yellowloacl">' +
                        '                                <img src="images/icon/loaclyellow.png"/>' +
                        '                                <h3>' + (((res.data[a].mapArea[0]) == 'M') ? 'M' : 'L' +  res.data[a].mapArea[1] )+ '层</h3>' +
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
                            ((res.data[a].serviceLabels[2])== '0' ? '':'<div class="vipsign" >\n' +
                                '                        <img src="images/icon/vipicon.png"/>\n' +
                                '                    </div>')+
                            '                </li>')
                    }
                }
            })
        },
        error: function () {
            alert('失败');
        }
    })
})