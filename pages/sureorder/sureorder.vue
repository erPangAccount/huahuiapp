<template>
	<view>
		<view v-if="loading">
			<view class="c-list">
				<view class="c-row b-b">
					<!-- <text class="tit">促销活动</text> -->
					<view class="con-list">
						<text style="font-weight: 700;">{{addressInfo.recipient_name}} {{addressInfo.recipient_phone}}</text>
						<text>{{addressInfo.addressStr}}</text>
					</view>
					<text class="yticon icon-you" @click="navTo('/pages/address/list?sureorder=true')"></text>
				</view>
			</view>

			<view class="separate"></view>

			<view class="sku-warpper">
				<view class="sku-item" v-for="item in wantBuyArr" :key="item.id">
					<image :src="item.sku_image"></image>
					<view class="sku-right">
						<view class="sku-tit">
							{{item.commodity.name}}
						</view>
						<view class="sku-name">
							{{item.sku_name}}
						</view>
						<view class="sku-price-number">
							<view class="sku-price">
								￥ {{item.sku_price}}
							</view>
							<view class="sku-number">
								X {{item.wantBuyNumber}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="c-list">
				<view class="c-row b-b">
					<text class="tit">配送方式</text>
					<view class="bz-list con">
						<text>快递配送 ·</text>
						<text style="color: #999999;">运费 0.00 元 ·</text>
					</view>
				</view>

				<view class="c-row b-b">
					<text class="tit">订单备注</text>
					<view class="bz-list con">
						<input type="text" value="" placeholder="选填,请填写自定义备注" data-key="remark" @input="inputChange" />
					</view>
				</view>

				<view class="separate"></view>

				<view class="c-row b-b">
					<text class="tit">商品金额</text>
					<view class="bz-list con">
						<text style="color: #eb4981;">{{skuTotalPrice}}</text>
					</view>
				</view>
				<view class="c-row b-b">
					<text class="tit">运费</text>
					<view class="bz-list con">
						<text style="color: #eb4981;">+ 0.00 </text>
					</view>
				</view>
				<view class="c-row b-b">
					<text class="tit">实付金额</text>
					<view class="bz-list con">
						<text style="color: #eb4981;">￥ {{needPay}}</text>
					</view>
				</view>

				<view class="action-box b-t">
					<button class="action-btn recom" @click="createOrder()">确认订单</button>
				</view>
			</view>
		</view>
		<empty v-else></empty>

		<neil-modal :show="showPay" @close="closeModal()" title="是否立即支付" @cancel="cancelModel()" @confirm="confirmModel()">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<view>需要支付 <text style="color: #eb4981;">￥ {{orderAmount}}</text> 元</view>
			</view>
		</neil-modal>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		mapMutations
	} from 'vuex';
	import empty from '@/components/empty.vue';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import provinces from '@/components/w-picker/city-data/province.js';
	import citys from '@/components/w-picker/city-data/city.js';
	import areas from '@/components/w-picker/city-data/area.js';
	export default {
		data() {
			return {
				queryData: {},
				addressInfo: {},
				wantBuyArr: [],
				remark: "",
				fare: 0,
				showPay: false,
				orderInfo: {},
				loading: false
			};
		},
		components: {
			empty,
			neilModal
		},
		computed: {
			...mapState(['hasLogin', 'wantBuy']),
			skuTotalPrice: function() {
				let total = 0;
				for (let i in this.wantBuyArr) {
					total += this.wantBuyArr[i].sku_price * this.wantBuyArr[i].wantBuyNumber;
				}
				return this.formatNumber(total);
			},
			needPay: function() {
				let total = 0;
				for (let i in this.wantBuyArr) {
					total += this.wantBuyArr[i].sku_price * this.wantBuyArr[i].wantBuyNumber;
				}
				return this.formatNumber(parseFloat(total) + parseFloat(this.fare));
			},
			orderAmount: function() {
				return this.formatNumber(this.orderInfo.total_amount);
			}
		},
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			...mapMutations(['clearWantBuy']),
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},
			//输入框修改
			inputChange: function(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			loadData: function() {
				let startCallback = () => {
					this.$load.loadding('加载中……');
				}

				let endCallback = () => {
					this.$load.endLoadding();
				}
				//如果存在地址信息获取地址信息
				if (this.queryData.address_id) {
					this.getAddress(this.queryData.address_id, startCallback, endCallback);
				}

				if (this.queryData.wantBuy) {
					this.getAddressList(startCallback, endCallback);
					let wantBuy = this.wantBuy;
					let wantBuySkuIds = this.getWantBuyIds(wantBuy);
					this.getSkusInfo(wantBuySkuIds.join(","), startCallback, endCallback);
				}

			},
			//获取想要购买的单品的id
			getWantBuyIds: function(wantBuy) {
				let data = [];
				for (let i in wantBuy) {
					data.push(wantBuy[i].sku_id);
				}
				return data;
			},
			formatNumber: function number(data) {
				if (data != null) {
					return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
				} else {
					return;
				}
			},
			formatDate: function(date) {
				return new Date(date);
			},
			//格式化地址信息，获取地址信息的索引、名字
			formatAddress: function(value) {
				let formatOk = false;
				let data = {};
				for (let i in provinces) { //省
					let province = provinces[i];
					if (province.value == value.province) {
						data.province = {
							index: i,
							value: province.value,
							label: province.label
						}
						for (let j in citys[i]) {
							let city = citys[i][j];
							if (city.value == value.city) {
								data.city = {
									index: j,
									value: city.value,
									label: city.label
								}
								for (let k in areas[i][j]) {
									let area = areas[i][j][k];
									if (area.value == value.county) {
										data.area = {
											index: k,
											value: area.value,
											label: area.label
										}
										formatOk = true;
									}
								}
							}
						}
					}
					if (formatOk) {
						break;
					}
				}
				return data;
			},

			//支付模态框
			closeModal: function() {
				this.showPay = false;
			},
			confirmModel: function() {
				this.updateOrder({
					id: this.orderInfo.id,
					status: "paid"
				}, () => {
					this.$load.loadding("支付中……");
				}, () => {
					this.$load.endLoadding();
				})
			},
			cancelModel: function() {
				uni.navigateTo({
					url: "/pages/order/order?state=1"
				})
			},

			//ajax

			//获取用户所有地址列表
			getAddressList: function(startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'GET',
					url: this.$ajax.ajaxBaseUrl + '/api/address',
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							let data = res.data.data;
							let addressInfo = {}; //当前应该显示的地址信息
							for (let i in data) { //格式化地址
								data[i].areaInfo = this.formatAddress({
									province: data[i].province_code.toString().replace(/(0+)$/gi, ""),
									city: data[i].city_code.toString().replace(/(0+)$/gi, ""),
									county: data[i].county_code.toString().replace(/(0+)$/gi, "")
								})

								data[i].addressStr = data[i].areaInfo.province.label + "·" + data[i].areaInfo.city.label + "·" + data[i].areaInfo
									.area.label + "·" + data[i].detailed;
								if (data[i].is_default) {
									addressInfo = data[i];
								}
							}

							//找到当前应该显示的地址
							for (let i in data) {
								if (data[i].last_used > addressInfo.last_used) {
									addressInfo = data[i];
								}
							}
							this.addressInfo = addressInfo;
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//获取某个具体的地址信息
			getAddress: function(id, startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'get',
					url: this.$ajax.ajaxBaseUrl + '/api/address/' + id,
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							let data = res.data.data;
							data.areaInfo = this.formatAddress({
								province: data.province_code.toString().replace(/(0+)$/gi, ""),
								city: data.city_code.toString().replace(/(0+)$/gi, ""),
								county: data.county_code.toString().replace(/(0+)$/gi, "")
							})
							this.addressInfo = data;
							this.addressInfo.addressStr = data.areaInfo.province.label + "·" + data.areaInfo.city.label + "·" + data.areaInfo
								.area.label + "·" + data.detailed;
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//获取单品信息
			getSkusInfo: function(ids, startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'get',
					url: this.$ajax.ajaxBaseUrl + '/api/commodities_sku/' + ids,
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							let data = res.data.data;
							for (let i in data) {
								for (let j in this.wantBuy) {
									if (data[i].id === this.wantBuy[j].sku_id) {
										data[i].wantBuyNumber = this.wantBuy[j].number;
									}
								}
							}
							this.wantBuyArr = data;
							this.loading = true;
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//创建订单
			createOrder: function(startCallback = () => {
				this.$load.loadding('确认订单中……')
			}, endCallback = () => {
				this.$load.endLoadding();
			}) {
				startCallback();
				let data = {
					address_id: this.addressInfo.id,
					items: [],
					remark: this.remark
				};
				for (let i in this.wantBuyArr) {
					data.items.push({
						commodity_sku_id: this.wantBuyArr[i].id,
						number: this.wantBuyArr[i].wantBuyNumber
					});
				}

				let token = this.$ajax.getToken();
				uni.request({
					method: 'POST',
					url: this.$ajax.ajaxBaseUrl + '/api/orders',
					dataType: 'json',
					data: data,
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							this.orderInfo = res.data.data;
							this.showPay = true;
							this.clearWantBuy();
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//更新订单
			updateOrder: function(option = {}, startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let data = {
					id: option.id || 0,
					status: option.status || ""
				};

				let token = this.$ajax.getToken();
				uni.request({
					method: 'PUT',
					url: this.$ajax.ajaxBaseUrl + '/api/orders/' + option.id,
					dataType: 'json',
					data: data,
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							uni.navigateTo({
								url: "/pages/order/order?state=0"
							})
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},

		},
		onLoad(option) {
			this.queryData = option;
			this.loadData();
		}
	}
</script>

<style scoped lang="scss">
	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}

	.sku-warpper {
		.sku-item {
			margin-left: 28upx;
			padding-bottom: 28upx;
			color: #262626;
			line-height: 32upx;
			font-size: 28upx;
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid #e9e9e9;

			image {
				margin-top: 28upx;
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				border-radius: 8upx;
				;
			}


			.sku-right {
				flex: 1;
				padding-top: 34upx;
				padding-right: 28upx;
				margin-left: 22upx;

				.sku-tit {
					overflow: hidden;
					text-overflow: ellipsis;
					display: block;
					height: 64upx;
				}

				.sku-name {
					margin-top: 16upx;
					margin-bottom: 16upx;
					font-size: 24upx;
					color: #666666;
				}

				.sku-price-number {
					display: flex;
					flex-direction: row;

					.sku-price {
						flex: 1;
						color: #eb4981;
						font-size: 28upx;
						text-align: left;
					}

					.sku-number {
						flex: 1;
						color: #262626;
						font-size: 28upx;
						text-align: right;
					}
				}
			}
		}

		.sku-item:last-child {
			border: none;
		}


	}
</style>
