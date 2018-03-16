var play = null,
  time = null,
  index = 0,
  timer = null,
  timer1 = null,
  number = 0;
$(document).ready(function () {

  autoplay();


  //新开店铺左右滑动
  autoplaynew();


  // 获取手指在轮播图元素上的一个滑动方向（左右）
  // 获取界面上轮播图容器
  var $carousels = $('.banner');
  huadong($carousels);

  var $carousels1 = $('.storedetail');
  huadongnew($carousels1);
});

function huadong(tt) {
  var rollthing = tt;
  var startX, endX;
  // 在滑动的一定范围内，才切换图片
  var offset = 50;
  // 注册滑动事件
  rollthing.on('touchstart', function (e) {
    // 手指触摸开始时记录一下手指所在的坐标x
    startX = e.originalEvent.touches[0].clientX;
    clearInterval(play);

  });
  rollthing.on('touchmove', function (e) {
    // 目的是：记录手指离开屏幕一瞬间的位置 ，用move事件重复赋值
    endX = e.originalEvent.touches[0].clientX;
  });
  rollthing.on('touchend', function (e) {
    //console.log(endX);
    //结束触摸一瞬间记录手指最后所在坐标x的位置 endX
    //比较endX与startX的大小，并获取每次运动的距离，当距离大于一定值时认为是有方向的变化
    var distance = Math.abs(startX - endX);
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
    }
  })
}
function huadongnew(ll) {
  var rollthing = ll;
  var startX, endX;
  // 在滑动的一定范围内，才切换图片
  var offset = 50;
  // 注册滑动事件

  rollthing.on('touchstart', function (e) {
    // 手指触摸开始时记录一下手指所在的坐标x
    startX = e.originalEvent.touches[0].clientX;
    clearInterval(time);
    clearInterval(timer);
  });
  rollthing.on('touchmove', function (e) {
    // 目的是：记录手指离开屏幕一瞬间的位置 ，用move事件重复赋值
    endX = e.originalEvent.touches[0].clientX;
  });
  rollthing.on('touchend', function (e) {
    //console.log(endX);
    //结束触摸一瞬间记录手指最后所在坐标x的位置 endX
    //比较endX与startX的大小，并获取每次运动的距离，当距离大于一定值时认为是有方向的变化
    var distance = Math.abs(startX - endX);
    if (distance > offset) {
      if ($('.storedetail').offset().left - 15 == -($('.shownews').width())) {
        //说明有方向的变化
        //根据获得的方向 判断是上一张还是下一张出现
        $(this).carousel(startX > endX ? shownew(2,true) : shownew(0,false));
      } else if ($('.storedetail').offset().left - 15 == -($('.shownews').width()*2)) {
        $(this).carousel(startX > endX ?  clearInterval(time) : shownew(1,false));
      } else {
        $(this).carousel(startX > endX ? shownew(1,true) : clearInterval(time));
      }

      var count = 0;
      var outTime = 7;//秒
      window.setInterval(go, 1000);

      function go() {
        count++;
        if (count == outTime) {
          clearInterval(time);
          clearInterval(timer);
          autoplaynew();
        }
      }
    }
  })
}

// autoplay banner的
function autoplay() {
  play = setInterval(function () {
    index == $('#bannerimg>li').length - 1 ? index = 0 : index++;
    show(index)
  }, 5000)
}

// showbanner
function show(a) {
  index = a;
  var alpha = 0;
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
}


// autoplaynew的
function autoplaynew() {
  var flag = true;
  time = setInterval(function () {
    // 判断是否为最后一个
    if (number == 2) {
      flag = false;
      flag ? number++ : number--;
    } else {
      if (number == 1 && flag == false) {
        flag = false;
        flag ? number++ : number--;
      } else {
        flag = true;
        flag ? number++ : number--;
      }
    }
    clearInterval(timer);
    shownew(number, flag);
  }, 10000)
}

function shownew(a, pp) {
  number = a;
  var k = pp;

  // 新店开业的滚动条
  var roll = $('#roll>p');
  roll.each(function (b, value) {
    roll.eq(b).removeClass();
    roll.eq(number).addClass('default');
  });

  var iTarget = number * $('.shownews').width();
  var iSpeed = ($('.shownews').width()) / 500;
  iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
  if (k == true) {
    timer = setInterval(function () {
      if ($('#storesdetails').offset().left <= -(( $('.shownews').width() * number) - 15)) {
        clearInterval(timer);
      } else {
        var oo = $('#storesdetails').offset().left - 15 - iSpeed + 'px';
        $('#storesdetails').css('left', oo)
      }
    }, 1);
  } else {
    timer1 = setInterval(function () {
      if ($('#storesdetails').offset().left == -(( $('.shownews').width() * number) - 15)) {
        clearInterval(timer1);
      } else {
        var xx = $('#storesdetails').offset().left - 15 + iSpeed + 'px';
        $('#storesdetails').css('left', xx);
        console.log(xx)
      }
    }, 1);
  }
  // 判断number是否为0，放置位置
}

