<template>
	<view>
		<view class="sku-warpper">
			<view class="comment-item" v-for="item in orderInfo.items" :key="item.id">
				<view class="sku-item">
					<image :src="item.commosity_sku.sku_image"></image>
					<view class="sku-right">
						<view class="sku-tit">
							{{item.commosity.name}}
						</view>
						<view class="sku-name">
							{{item.commosity_sku.sku_name}}
						</view>
						<view class="sku-price-number">
							<view class="sku-price">
								￥{{item.commosity_sku.sku_price}}
							</view>
							<view class="sku-number">
								X {{item.number}}
							</view>
						</view>
					</view>
				</view>
				<view class="comment">
					<view class="rate">
						<view class="rate-tit">
							评分
						</view>
						<uni-rate value="5" max="5" :datakey="item.rateKey" @change="rateChange"></uni-rate>
					</view>
					<textarea value="" placeholder="请填写商品评论" maxlength="200" :data-key="item.reviewKey" @input="inputChange" />
					</view>
			</view>
			<view class="list-cell log-out-btn" @click="comment()">
				<text class="cell-tit">保存评论</text>
			</view>
		</view>
		<empty v-if="isloading"></empty>
		
	</view>
</template>

<script>
	import uniRate from "@/components/uni-rate/uni-rate.vue";
	import empty from '@/components/empty.vue';
	export default {
		components:{
			uniRate,
			empty
		},
		data() {
			return {
				queryData: {},
				orderInfo: {},
				isloading: true
			};
		},
		methods: {
			loadData:function() {
				if (this.queryData.orderId) {
					this.getOrderInfo(this.queryData.orderId,() => {
					this.$load.loadding("加载中……");
				},  () => {
					this.$load.endLoadding();
				});
				}
			},
			rateChange: function(val) {
				const keys = val.key.split("_");
				this.orderInfo.items[keys[1]][keys[0]] = val.value;
			},
			//输入框修改
			inputChange(e) {
				const keys = e.currentTarget.dataset.key.split("_");
				this.orderInfo.items[keys[1]][keys[0]] = e.detail.value;
			},
			comment: function() {
				this.commentOrder(() => {
					this.$load.loadding("评论中……");
				},  () => {
					this.$load.endLoadding();
				}, () => {
					uni.navigateTo({
						url: "/pages/order/order?state=3"
					})
				});
			},
			
			//ajax
			//获取订单信息
			getOrderInfo: function(id, startCallback = () => {}, endCallback = () => {}) {
				startCallback();
				let token = this.$ajax.getToken();
				uni.request({
					method: 'GET',
					url: this.$ajax.ajaxBaseUrl + '/api/orders/' + id,
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							let data = res.data.data;
							for(let i in data.items) {
								data.items[i].reviewKey = "review_" + i;
								data.items[i].rateKey = "rating_" + i;
								data.items[i].rating = 5;
								data.items[i].review = "该用户很懒，没有对该商品发表任何评论……";
							}
							this.orderInfo = data;
							this.isloading = false;
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//评论、评分订单
			commentOrder: function(startCallback = () => {}, endCallback = () => {}, successCallBack = () => {}) {
				startCallback();
				let data = {
					id: this.orderInfo.id,
					items:　[]
				};
				for (let i in this.orderInfo.items) {
					data.items[i] = {
						id: this.orderInfo.items[i].id,
						rating: this.orderInfo.items[i].rating,
						review: this.orderInfo.items[i].review
					}
				}
				
				let token = this.$ajax.getToken();
				uni.request({
					method: 'PUT',
					url: this.$ajax.ajaxBaseUrl + '/api/orders/' + data.id,
					dataType: 'json',
					data: data,
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						endCallback();
						if (res.data.status === 0) {
							successCallBack();
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
	.sku-warpper {
		.comment {
			margin-left: 28upx;
			margin-right: 28upx;
			margin-top: 15upx;
			border-bottom: 1px solid #e9e9e9;
			
			.rate {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				padding-bottom: 14upx;
				margin-bottom: 14upx;
				border-bottom: 1px solid #e9e9e9;
				
				.rate-tit {
					width: 122upx;
					text-align: left;
					font-size: 28upx;
					color: grey;
					padding-left: 14upx;
				}
			}
			
			uni-textarea {
				width: auto;
			}
			
		}
		.sku-item {
			margin-left: 28upx;
			padding-bottom: 28upx;
			color: #262626;
			line-height: 32upx;
			font-size: 28upx;
			display: flex;
			flex-direction: row;

			image {
				margin-top: 28upx;
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				border-radius: 8upx;
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
	
	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;
	
		&.log-out-btn {
			margin-top: 40upx;
	
			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
	
		&.cell-hover {
			background: #fafafa;
		}
	
		&.b-b:after {
			left: 30upx;
		}
	
		&.m-t {
			margin-top: 16upx;
		}
	
		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}
	
		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}
	
		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}
	
		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
