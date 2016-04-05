/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/4/4.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.MBanner = factory(root);
  }
})(this, function (root) {

  'use strict';

  //屏幕宽度
  var clientWidth = window.innerWidth || document.documentElement.clientWidth;
  var containerElem; // banner容器
  var bannerWrap;
  var interval; // 自动播放标记
  var index = 1; // banner 播放下标
  var moveDirection = 'next'; // banner 移动方向  'prev' or 'next'


  /**
   * m-banner 构造函数
   * @param containerId banner容器ID
   * @param options 初始化参数
   * @constructor
   */
  function MBanner(containerId, options) {
    containerElem = document.getElementById(containerId);
    containerElem.style.width = clientWidth + 'px';
    this.imageList = options.imageList || [];
    var elementList = [];

    bannerWrap = initElements(this.imageList);

    this.scrollerStyle = bannerWrap.style;
    this.isScrolling = null;
    this.isTouched;
    this.touches = {
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      diff: 0       // 移动差值
    };
    this.scrollerPosition;

    bannerWrap.style['transform'] = 'translateX(-' + clientWidth + 'px)';
    bannerWrap.style.width = bannerWrap.width + 'px';
    containerElem.appendChild(bannerWrap);

    this._initTouchEvent();

    //setInterval(function () {
    //  var dist = -clientWidth * index;
    //  bannerWrap.style.webkitTransitionDuration =
    //    bannerWrap.style.MozTransitionDuration =
    //      bannerWrap.style.msTransitionDuration =
    //        bannerWrap.style.OTransitionDuration =
    //          bannerWrap.style.transitionDuration = 1000 + 'ms';
    //
    //  bannerWrap.style.transform = 'translateX(' + dist + 'px)';
    //  index > imageList.length - 1 ? index : index++;
    //}, 1000);
  }

  function initElements(imageList) {
    var bannerWrap = document.createElement('div');
    var bannerWrapStyle = bannerWrap.style;
    var containerElemBound = containerElem.getBoundingClientRect();
    bannerWrapStyle.width = ( containerElemBound.width * (imageList.length + 2)) + 'px';
    bannerWrapStyle.height = ( containerElemBound.height) + 'px';
    bannerWrapStyle.position = 'relative';

    var bannerElem = document.createElement('div');
    bannerElem.style.width = containerElemBound.width + 'px';
    bannerElem.style.height = containerElemBound.height + 'px';
    bannerElem.style.float = 'left';
    bannerElem.innerHTML = '<img src="' + imageList[imageList.length - 1].imageUrl + '" style="width: 100%;display: block"/>';
    bannerWrap.appendChild(bannerElem);
    imageList.forEach(function (item, index) {
      bannerElem = document.createElement('div');
      bannerElem.style.width = containerElemBound.width + 'px';
      bannerElem.style.height = containerElemBound.height + 'px';
      bannerElem.style.float = 'left';
      bannerElem.innerHTML = '<img src="' + item.imageUrl + '" style="width: 100%;display: block"/>';
      bannerWrap.appendChild(bannerElem);
    });
    bannerElem = document.createElement('div');
    bannerElem.style.width = containerElemBound.width + 'px';
    bannerElem.style.height = containerElemBound.height + 'px';
    bannerElem.style.float = 'left';
    bannerElem.innerHTML = '<img src="' + imageList[0].imageUrl + '" style="width: 100%;display: block"/>';
    bannerWrap.appendChild(bannerElem);

    return bannerWrap;
  }


  MBanner.prototype = {
    _translate: function (x) {
      if (-x < parseInt(bannerWrap.style.width) - parseInt(containerElem.style.width) && x < 0) {
        bannerWrap.style['transform'] = 'translateX(' + x + 'px)';
      }
    },
    _getComputedPosition: function () {
      var matrix = window.getComputedStyle(bannerWrap, null),
        x, y;
      matrix = matrix['transform'].split(')')[0].split(', ');
      x = +(matrix[12] || matrix[4]);
      y = +(matrix[13] || matrix[5]);
      var position = {x: Math.round(x), y: Math.round(y)};
      bannerWrap.style['transform'] = 'translate(' + position.x + 'px,' + position.y + 'px)' + 'translateZ(0)';
      return position;
    },
    _initTouchEvent: function () {
      var _this = this;
      bannerWrap.addEventListener('touchstart', function (e) {
        _this.scrollerPosition = _this._getComputedPosition();
        _this._translate(_this.scrollerPosition.x);
        _this.isScrolling = undefined;
        _this.isTouched = true;
        var startX = _this.touches.currentX = e.targetTouches[0].pageX;
        var startY = _this.touches.currentY = e.targetTouches[0].pageY;
        _this.touches.startX = startX;
        _this.touches.startY = startY;
      }, false);

      bannerWrap.addEventListener('touchmove', function (e) {
        _this.touches.currentX = e.targetTouches[0].pageX;
        _this.touches.currentY = e.targetTouches[0].pageY;
        if (typeof _this.isScrolling === 'undefined') {
          var touchAngle = Math.atan2(
              Math.abs(_this.touches.currentY - _this.touches.startY),
              Math.abs(_this.touches.currentX - _this.touches.startX)) * 180 / Math.PI;
          _this.isScrolling = touchAngle > 45;
        }
        if (!_this.isTouched) return;
        if (_this.isScrolling) {
          _this.isTouched = false;
          return;
        }
        e.preventDefault();
        e.stopPropagation();

        //计算方向
        var diff = _this.touches.diff = _this.touches.currentX - _this.touches.startX;
        moveDirection = diff > 0 ? 'prev' : 'next';

        var moveX = e.touches[0].pageX - _this.touches.startX;
        _this._translate(_this.scrollerPosition.x + moveX);
      }, false);

      bannerWrap.addEventListener('touchend', function (e) {
        if (Math.abs(_this.touches.diff) > clientWidth / 3) { //滑动距离必须大于屏幕的三分之一
          if (moveDirection === 'prev') {
            _this._play(index - 1);
          }
          if (moveDirection === 'next') {
            _this._play(index + 1);
          }
        } else {
          _this._play(index);
        }
      }, false);
    },
    interval: function () {
      interval = setTimeout(this._next, delay);
    },
    _next: function () {
      if (index < this.imageList.length - 1) {
        this._play(index + 1);
      }
    },
    _play: function (to, speed) {
      if (index === to && Math.abs(this.touches.diff) === 0) {
        return;
      }
      index = to;
      var dist = -clientWidth * index;
      bannerWrap.style.webkitTransitionDuration =
        bannerWrap.style.MozTransitionDuration =
          bannerWrap.style.msTransitionDuration =
            bannerWrap.style.OTransitionDuration =
              bannerWrap.style.transitionDuration = speed || 300 + 'ms';

      bannerWrap.style.transform = 'translateX(' + dist + 'px)';
    }
  };

  return MBanner;
});
