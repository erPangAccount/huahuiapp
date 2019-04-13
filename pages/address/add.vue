<template>
	<view>
		<view class="separate"></view>
		<view class="c-list">
			<view class="c-row b-b">
				<text class="tit">收货人</text>
				<view class="bz-list con">
					<input type="text" :value="recipient_name" placeholder="收货人姓名" data-key="recipient_name" @input="inputChange" />
				</view>
			</view>

			<view class="c-row b-b">
				<text class="tit">手机号码</text>
				<view class="bz-list con">
					<input type="number" :value="recipient_phone" placeholder="11位手机号码" maxlength="11" data-key="recipient_phone"
					 @input="inputChange" />
				</view>
			</view>

			<view class="c-row b-b">
				<text class="tit">所在地区</text>
				<view class="bz-list con">
					<input type="text" :value="formatArea" placeholder="省市区信息" data-key="area" disabled />
				</view>
				<text class="yticon icon-you" @click="showPicker()"></text>
			</view>

			<view class="c-row b-b">
				<text class="tit">详细地址</text>
				<view class="bz-list con">
					<input type="text" :value="detailed" placeholder="详细街道信息" data-key="detailed" @input="inputChange" />
				</view>
			</view>

			<view class="c-row b-b">
				<text class="tit">设为默认地址</text>
				<checkbox-group @change="checkChange">
					<checkbox value="1" color="#eb4981" :checked="isDefault" data-key="is_default" />
				</checkbox-group>
			</view>

			<w-picker mode="region" :defaultVal="defaultArea" @confirm="confirmPicker" ref="picker"></w-picker>

			<view class="action-box b-t">
				<button class="action-btn recom" @click="saveOrUpdate()">保存地址</button>
			</view>
		</view>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import provinces from '@/components/w-picker/city-data/province.js';
	import citys from '@/components/w-picker/city-data/city.js';
	import areas from '@/components/w-picker/city-data/area.js';
	export default {
		data() {
			return {
				recipient_name: "",
				recipient_phone: "",
				area: {},
				detailed: "",
				is_default: 0,
				defaultArea: [0, 0, 0],
				queryData: {}
			};
		},
		computed: {
			isDefault: function() {
				return Boolean(this.is_default);
			},
			formatArea: function() {
				if (JSON.stringify(this.area) === '{}') {
					return '';
				}
				return this.area.province.label + '·' + this.area.city.label + '·' + this.area.area.label;
			}
		},
		methods: {
			loadData: function() {
				if (this.queryData.id) {
					this.getAddress(this.queryData.id, () => {
						this.$load.loadding('加载中……');
					}, () => {
						this.$load.endLoadding();
					});
				}
			},
			saveOrUpdate: function() {
				let startCallback = () => {
					this.$load.loadding('保存中……');
				}

				let endCallback = () => {
					this.$load.endLoadding();
				}
				if (!this.queryData.id) {
					this.addAddress(startCallback, endCallback);
				} else {
					this.updateAddress(this.queryData.id, startCallback, endCallback);
				}
			},
			showPicker: function() {
				this.$refs.picker.show();
			},
			//确认选择地址
			confirmPicker: function(val) {
				let formatOk = false;
				let data = {};
				for (let i in provinces) { //省
					let province = provinces[i];
					if (province.label == val[0]) {
						data.province = {
							value: province.value,
							label: province.label
						}
						for (let j in citys[i]) {
							let city = citys[i][j];
							if (city.label == val[1]) {
								data.city = {
									value: city.value,
									label: city.label
								}
								for (let k in areas[i][j]) {
									let area = areas[i][j][k];
									if (area.label == val[2]) {
										data.area = {
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
				this.area = data;
			},
			//输入框修改
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			//多选框修改
			checkChange(e) {
				this.is_default = parseInt(e.detail.value[0] || 0);
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

			//新增地址信息
			addAddress: function(startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'POST',
					url: this.$ajax.ajaxBaseUrl + '/api/address',
					dataType: 'json',
					data: {
						recipient_name: this.recipient_name,
						recipient_phone: this.recipient_phone,
						province_code: this.area.province.value,
						city_code: this.area.city.value,
						county_code: this.area.area.value,
						is_default: this.isDefault,
						detailed: this.detailed
					},
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							uni.navigateBack();
						} else {
							this.$api.msg(res.data.message);
						}

					}
				});
			},

			//获取地址信息
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
							data.area = this.formatAddress({
								province: data.province_code.toString().replace(/(0+)$/gi, ""),
								city: data.city_code.toString().replace(/(0+)$/gi, ""),
								county: data.county_code.toString().replace(/(0+)$/gi, "")
							})
							this.area = data.area;
							this.recipient_name = data.recipient_name;
							this.recipient_phone = data.recipient_phone;
							this.detailed = data.detailed;
							this.is_default = data.is_default;
							this.defaultArea = [data.area.province.index, data.area.city.index, data.area.area.index];
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},

			//编辑地址信息
			updateAddress: function(id, startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'PUT',
					url: this.$ajax.ajaxBaseUrl + '/api/address/' + id,
					dataType: 'json',
					data: {
						recipient_name: this.recipient_name,
						recipient_phone: this.recipient_phone,
						province_code: this.area.province.value,
						city_code: this.area.city.value,
						county_code: this.area.area.value,
						is_default: this.isDefault,
						detailed: this.detailed
					},
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							uni.navigateBack();
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			}
		},
		components: {
			wPicker
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
			width: 164upx;
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
</style>
