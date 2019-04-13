import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},


		//首屏广告上次显示时间
		splashAdvertPreTime: 0,

		//想要购买的商品数据
		// 				[
		// 					{
		// 						"sku_id": 1,
		// 						"number": 1
		// 					}
		// 				]
		wantBuy: []


	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
		},
		saveUserInfo(state, value) {
			state.userInfo = value;
			uni.setStorageSync('userInfo', value);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorageSync({
				key: 'userToken'
			});
			uni.removeStorageSync({
				key: 'userInfo'
			});
		},
		saveWantBuy(state, value) {
			state.wantBuy = value;
		},
		clearWantBuy(state) {
			state.wantBuy = [];
		}
	},
	actions: {

	}
})

export default store
