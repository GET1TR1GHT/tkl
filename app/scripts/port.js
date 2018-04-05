$(document).ready(function () {
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
                strs = res.data[0].storeImage.split(',');
                ress.push(strs[0]);
                if ($('#storesdetails>li').attr('data-id') == a + 1) {
                    $('#storesdetails>li').eq(a).css({
                        'background': 'url(http://idp.dev2.wizarcan.com/' + ress[0] + ') no-repeat',
                        'background-size': '100% 100%',
                    }).attr('onclick', 'javascrtpt:window.location.href="' + res.data[0].url + '"');
                    newstorename.html(res.data[0].brand.replace('#', '  '));
                    newstoreads.html(res.data[0].address);
                    $('.newstoretitle').html(res.data[0].newTitle1);
                }
            })
        },
        error: function () {
            console.log('调用新店开业失败');
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
            })
        },
        error: function (res) {
            console.log('调用热门店铺失败');
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
                $('.detail').eq(a).html(res.data[0].title);
            })
        },
        error: function () {
            console.log('调用banner失败');
        }
    })
})