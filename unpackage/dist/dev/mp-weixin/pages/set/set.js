(global.webpackJsonp=global.webpackJsonp||[]).push([["pages/set/set"],{79:
/*!*************************************************************!*\
  !*** D:/web/huahuiapp/main.js?{"page":"pages%2Fset%2Fset"} ***!
  \*************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n(/*! uni-pages */4);var c=s(n(/*! mpvue-page-factory */17)),i=s(n(/*! ./pages/set/set.vue */80));function s(t){return t&&t.__esModule?t:{default:t}}Page((0,c.default)(i.default))},80:
/*!******************************************!*\
  !*** D:/web/huahuiapp/pages/set/set.vue ***!
  \******************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var c=n(/*! ./set.vue?vue&type=template&id=603b1cca& */81),i=n(/*! ./set.vue?vue&type=script&lang=js& */83);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(/*! ./set.vue?vue&type=style&index=0&lang=scss& */85);var l=n(/*! ../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib/runtime/componentNormalizer.js */12),o=Object(l.default)(i.default,c.render,c.staticRenderFns,!1,null,null,null);o.options.__file="web/huahuiapp/pages/set/set.vue",e.default=o.exports},81:
/*!*************************************************************************!*\
  !*** D:/web/huahuiapp/pages/set/set.vue?vue&type=template&id=603b1cca& ***!
  \*************************************************************************/
/*! exports provided: render, staticRenderFns */function(t,e,n){"use strict";n.r(e);var c=n(/*! -!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib??vue-loader-options!./set.vue?vue&type=template&id=603b1cca& */82);n.d(e,"render",function(){return c.render}),n.d(e,"staticRenderFns",function(){return c.staticRenderFns})},82:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!D:/web/huahuiapp/pages/set/set.vue?vue&type=template&id=603b1cca& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */function(t,e,n){"use strict";n.r(e),n.d(e,"render",function(){return c}),n.d(e,"staticRenderFns",function(){return i});var c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("view",{staticClass:"container"},[n("view",{staticClass:"list-cell b-b m-t",attrs:{"hover-class":"cell-hover","hover-stay-time":50,eventid:"f4020942-0"},on:{click:function(e){t.navTo("个人资料")}}},[n("text",{staticClass:"cell-tit"},[t._v("个人资料")]),n("text",{staticClass:"cell-more yticon icon-you"})]),n("view",{staticClass:"list-cell b-b",attrs:{"hover-class":"cell-hover","hover-stay-time":50,eventid:"f4020942-1"},on:{click:function(e){t.navTo("收货地址")}}},[n("text",{staticClass:"cell-tit"},[t._v("收货地址")]),n("text",{staticClass:"cell-more yticon icon-you"})]),n("view",{staticClass:"list-cell",attrs:{"hover-class":"cell-hover","hover-stay-time":50,eventid:"f4020942-2"},on:{click:function(e){t.navTo("实名认证")}}},[n("text",{staticClass:"cell-tit"},[t._v("实名认证")]),n("text",{staticClass:"cell-more yticon icon-you"})]),n("view",{staticClass:"list-cell m-t"},[n("text",{staticClass:"cell-tit"},[t._v("消息推送")]),n("switch",{attrs:{checked:"",color:"#fa436a",eventid:"f4020942-3"},on:{change:t.switchChange}})]),n("view",{staticClass:"list-cell m-t b-b",attrs:{"hover-class":"cell-hover","hover-stay-time":50,eventid:"f4020942-4"},on:{click:function(e){t.navTo("清除缓存")}}},[n("text",{staticClass:"cell-tit"},[t._v("清除缓存")]),n("text",{staticClass:"cell-more yticon icon-you"})]),n("view",{staticClass:"list-cell b-b",attrs:{"hover-class":"cell-hover","hover-stay-time":50,eventid:"f4020942-5"},on:{click:function(e){t.navTo("关于Dcloud")}}},[n("text",{staticClass:"cell-tit"},[t._v("关于Dcloud")]),n("text",{staticClass:"cell-more yticon icon-you"})]),t._m(0),n("view",{staticClass:"list-cell log-out-btn",attrs:{eventid:"f4020942-6"},on:{click:t.toLogout}},[n("text",{staticClass:"cell-tit"},[t._v("退出登录")])])])},i=[function(){var t=this.$createElement,e=this._self._c||t;return e("view",{staticClass:"list-cell"},[e("text",{staticClass:"cell-tit"},[this._v("检查更新")]),e("text",{staticClass:"cell-tip"},[this._v("当前版本 1.0.3")]),e("text",{staticClass:"cell-more yticon icon-you"})])}];c._withStripped=!0},83:
/*!*******************************************************************!*\
  !*** D:/web/huahuiapp/pages/set/set.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var c=n(/*! -!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib??vue-loader-options!./set.vue?vue&type=script&lang=js& */84),i=n.n(c);for(var s in c)"default"!==s&&function(t){n.d(e,t,function(){return c[t]})}(s);e.default=i.a},84:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!D:/web/huahuiapp/pages/set/set.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";(function(t){function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={data:function(){return{}},methods:function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){c(t,e,n[e])})}return t}({},(0,n(/*! vuex */6).mapMutations)(["logout"]),{navTo:function(t){this.$api.msg("跳转到".concat(t))},toLogout:function(){var e=this;t.showModal({title:"确定要退出登录么？",success:function(n){n.confirm&&(e.logout(),setTimeout(function(){t.navigateBack()},200))}})},switchChange:function(t){console.log(t.detail);var e=t.detai?"打开":"关闭";this.$api.msg("".concat(e,"消息推送"))}})};e.default=i}).call(this,n(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */1).default)},85:
/*!****************************************************************************!*\
  !*** D:/web/huahuiapp/pages/set/set.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var c=n(/*! -!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/css-loader??ref--8-oneOf-1-2!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!../../../../HBuilderX.1.8.1.20190330.full/HBuilderX/plugins/uniapp-cli/node_modules/vue-loader/lib??vue-loader-options!./set.vue?vue&type=style&index=0&lang=scss& */86),i=n.n(c);for(var s in c)"default"!==s&&function(t){n.d(e,t,function(){return c[t]})}(s);e.default=i.a},86:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/vue-loader/lib??vue-loader-options!D:/web/huahuiapp/pages/set/set.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(t,e,n){}},[[79,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/set/set.js.map