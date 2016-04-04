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
  /**
   * m-banner 构造函数
   * @param containerId banner容器ID
   * @param options 初始化参数
   * @constructor
   */
  function MBanner(containerId, options) {
    var containerElem = document.getElementById(containerId);
    var containerElemBound = containerElem.getBoundingClientRect();
    var imageList = options.imageList || [];
    var elementList = [];
    var bannerWrap = document.createElement('div');
    var bannerWrapStyle = bannerWrap.style;
    bannerWrapStyle.width = ( containerElemBound.width * imageList.length) + 'px';
    bannerWrapStyle.height = ( containerElemBound.height) + 'px';
    bannerWrapStyle.position = 'relative';

    var bannerElem = document.createElement('div');
    bannerElem.style.width = containerElemBound.width + 'px';
    bannerElem.style.height = containerElemBound.height + 'px';
    bannerElem.style.float = 'left';
    bannerElem.innerHTML = imageList.length;
    bannerWrap.appendChild(bannerElem);
    imageList.forEach(function (item, index) {
      bannerElem = document.createElement('div');
      bannerElem.style.width = containerElemBound.width + 'px';
      bannerElem.style.height = containerElemBound.height + 'px';
      bannerElem.style.float = 'left';
      bannerElem.innerHTML = index + 1;
      bannerWrap.appendChild(bannerElem);
    });
    bannerElem = document.createElement('div');
    bannerElem.style.width = containerElemBound.width + 'px';
    bannerElem.style.height = containerElemBound.height + 'px';
    bannerElem.style.float = 'left';
    bannerElem.innerHTML = 1;
    bannerWrap.appendChild(bannerElem);

    containerElem.appendChild(bannerWrap);
    bannerWrapStyle.transform = 'translateX(-300px)';
    var index = 1;
    setInterval(function () {
      var dist = '-300' * index;
      bannerWrapStyle.webkitTransitionDuration =
        bannerWrapStyle.MozTransitionDuration =
          bannerWrapStyle.msTransitionDuration =
            bannerWrapStyle.OTransitionDuration =
              bannerWrapStyle.transitionDuration = 1000 + 'ms';

      bannerWrapStyle.transform = 'translateX(' + dist + 'px)';
      index > imageList.length - 2 ? index : index++;
    }, 3000);
  }

  function appendChildElement() {

  }

  return MBanner;
});
