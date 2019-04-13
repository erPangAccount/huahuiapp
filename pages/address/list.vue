<template>
	<view>
		<view class="separate"></view>
		<view class="add-address" @click="navTo('/pages/address/add')">
			<image src="../../static/add.svg"></image>
			新增收货地址
		</view>
		<view class="separate"></view>

		<view class="list-warpper">
			<view class="list-item" v-for="(item, index) in addressList" :key="index">
				<view class="list-body"  @click="navtoSureOrder(item.id)">
					<view class="item-left">
						<view class="item-head">
							<view class="head-tag" v-if="item.is_default">
								默认
							</view>
							<view class="head-name">
								{{item.recipient_name}}
							</view>
							<view class="head-mobile">
								{{item.recipient_phone}}
							</view>
						</view>
						<view class="item-body">
							{{item.addressStr}}
						</view>
					</view>
					<view class="item-right">
						<image src="../../static/edit.svg" @click="navToEdit(item.id)"></image>
						<image src="../../static/del.svg" @click="del(index)"></image>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import provinces from '@/components/w-picker/city-data/province.js';
	import citys from '@/components/w-picker/city-data/city.js';
	import areas from '@/components/w-picker/city-data/area.js';
	export default {
		data() {
			return {
				addressList: [],
				queryData: {}
			};
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},
			navToEdit(id) {
				uni.navigateTo({
					url: '/pages/address/add?id=' + id
				})
			},
			navtoSureOrder(id) {
				if (this.queryData.sureorder) {
					uni.navigateTo({
						url: '/pages/sureorder/sureorder?address_id=' + id
					})
				}
			},
			del: function(index) {
				let row = this.addressList[index];
				this.delAddress(row.id, index);
			},			
			loadData: function() {
				this.getAddressList();
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
			
			//ajax
			
			//获取地址列表
			getAddressList: function() {
				this.$load.loadding('加载中……');
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
						this.$load.endLoadding();
						if (res.data.status === 0) {
							let data = res.data.data;
							for (let i in data) {
								data[i].areaInfo = this.formatAddress({
									province: data[i].province_code.toString().replace(/(0+)$/gi,""),
									city: data[i].city_code.toString().replace(/(0+)$/gi,""),
									county: data[i].county_code.toString().replace(/(0+)$/gi,"")
								})
								
								data[i].addressStr = data[i].areaInfo.province.label + "·" + data[i].areaInfo.city.label + "·"+ data[i].areaInfo.area.label + "·" + data[i].detailed
							}
							this.addressList = data;
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			
			//删除地址
			delAddress: function(id, index) {
				let token = this.$ajax.getToken();
				uni.request({
					method: 'DELETE',
					url: this.$ajax.ajaxBaseUrl + '/api/address/' + id,
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						if (res.data.status === 0) {
							this.addressList.splice(index, 1);
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			}
		},
		onLoad(option) {
			this.queryData = option;
			this.loadData();
		}
	}
</script>

<style scoped lang="scss">
	.separate {
		width: 100%;
		height: 24upx;
		background-color: #e9e9e9;
	}

	.add-address {
		height: 88upx;
		color: #262626;
		font-size: 28upx;
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			margin-right: 12upx;
			width: 50upx;
			height: 50upx;
		}
	}

	.list-warpper {
		.list-body {
			padding: 36upx 28upx;
			font-size: 28upx;
			color: #262626;
			display: flex;
			flex-direction: row;
			border-bottom: 1upx solid #e9e9e9;

			.item-left {
				flex: 1;

				.item-head {
					display: flex;
					flex-direction: row;
					height: 28upx;
					line-height: 28upx;
					margin-bottom: 24upx;

					.head-tag {
						width: 80upx;
						text-align: center;
						color: #fff;
						background-color: #eb4981;
						font-size: 24upx;
						margin-right: 20upx;
					}

					.head-name {
						font-weight: 700;
						margin-right: 43upx;
					}

					.head-price {
						font-weight: 700;
					}
				}

				.item-body {
					line-height: 30upx;
					font-size: 26upx;
					color: #666666;
					font-weight: 300;
				}


			}

			.item-right {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				width: 210upx;

				image {
					margin-right: 12upx;
					width: 50upx;
					height: 50upx;
				}
			}
		}
	}
</style>
