<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMore">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orders.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orders.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.created_at}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text v-if="item.state===9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(item)"></text>
						</view>

						<scroll-view v-if="item.items.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.items" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.commosity_sku.sku_image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.items.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.items" :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.commosity_sku.sku_image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.commosity.name}}</text>
								<text class="attr-box">{{goodsItem.commosity_sku.sku_name}} x {{goodsItem.number}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{item.items.length}}</text>
							件商品 实付款
							<text class="price">{{item.total_amount}}</text>
						</view>
						<view class="action-box b-t" v-if="item.state == 1">
							<!-- unpay -->
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom" @click="nowPay(item)">立即支付</button>
						</view>
						<view class="action-box b-t" v-if="item.state == 2">
							<!-- 待收货 -->
							<button class="action-btn recom" @click="receipt(item)">立即收货</button>
						</view>
						<view class="action-box b-t" v-if="item.state == 3">
							<!-- 待评价 -->
							<button class="action-btn recom" @click="navToComment(item.id)">立即评价</button>
						</view>
						<view class="action-box b-t" v-if="item.state == 4">
							<!-- 待评价 -->
							<button class="action-btn recom" @click="refund(item)">申请退款</button>
						</view>

					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from '@/components/empty.vue';
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orders: {
							currentPage: 1,
							lastPage: 1,
							pageSize: 10,
							orderList: []
						}
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orders: {
							currentPage: 1,
							lastPage: 1,
							pageSize: 10,
							orderList: []
						}
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orders: {
							currentPage: 1,
							lastPage: 1,
							pageSize: 10,
							orderList: []
						}
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orders: {
							currentPage: 1,
							lastPage: 1,
							pageSize: 10,
							orderList: []
						}
					},
					{
						state: 4,
						text: '退款',
						loadingType: 'more',
						orders: {
							currentPage: 1,
							lastPage: 1,
							pageSize: 10,
							orderList: []
						}
					}
				],
			};
		},

		onLoad(options) {
			this.tabCurrentIndex = +options.state;

			this.loadData()
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
			navToComment(id) {
				uni.navigateTo({
					url: '/pages/comment/comment?orderId=' + id
				})
			},
			//获取订单列表
			loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;

				// 				if (source === 'tabChange' && navItem.loaded === true) {
				// 					//tab切换只有第一次需要加载数据
				// 					return;
				// 				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				navItem.loadingType = 'loading';

				this.getOrderList({
					state: index,
					pageSize: navItem.orders.pageSize
				});
			},
			//加载更多
			loadMore() {
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (navItem.orders.currentPage < navItem.orders.lastPage) {
					if (navItem.loadingType === 'loading') {
						//防止重复加载
						return;
					}
					navItem.loadingType = 'loading';

					this.getOrderList({
						page: navItem.orders.currentPage + 1,
						state: index,
						pageSize: navItem.orders.pageSize
					});
				} else {
					navItem.loadingType = 'noMore';
				}
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(item) {
				this.delOrder({
					id: item.id
				}, () => {
					this.$load.loadding('删除订单中……');
				}, () => {
					this.$load.endLoadding();
				}, () => {
					//取消订单后删除待付款中该项
					let list = this.navList[this.tabCurrentIndex].orders.orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);
				});
				
			},
			//取消订单
			cancelOrder(item) {
				let {
					stateTip,
					stateTipColor
				} = this.orderStateExp(9);
				item = Object.assign(item, {
					state: 9,
					stateTip,
					stateTipColor
				})

				this.updateOrder({
					id: item.id,
					status: "closed"
				}, () => {
					this.$load.loadding('取消订单中……');
				}, () => {
					this.$load.endLoadding();
				}, () => {
					//取消订单后删除待付款中该项
					let list = this.navList[1].orders.orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);
				});
			},
			//收货
			receipt(item) {
				let {
					stateTip,
					stateTipColor
				} = this.orderStateExp(3);
				item = Object.assign(item, {
					state: 3,
					stateTip,
					stateTipColor
				})

				this.updateOrder({
					id: item.id,
					status: "received"
				}, () => {
					this.$load.loadding('收货中……');
				}, () => {
					this.$load.endLoadding();
				}, () => {
					//收货后删除待收货中该项
					let list = this.navList[2].orders.orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);
				});
			},
			//申请退款
			refund(item) {
				let {
					stateTip,
					stateTipColor
				} = this.orderStateExp(5);
				item = Object.assign(item, {
					state: 5,
					stateTip,
					stateTipColor
				})

				this.updateOrder({
					id: item.id,
					status: "applied"
				}, () => {
					this.$load.loadding('申请退款中……');
				}, () => {
					this.$load.endLoadding();
				});
			},
			//立即支付
			nowPay(item) {
				let {
					stateTip,
					stateTipColor
				} = this.orderStateExp(2);
				item = Object.assign(item, {
					state: 2,
					stateTip,
					stateTipColor
				})

				this.updateOrder({
					id: item.id,
					status: "paid"
				}, () => {
					this.$load.loadding('支付中……');
				}, () => {
					this.$load.endLoadding();
				}, () => {
					//支付订单后删除待付款中该项
					let list = this.navList[1].orders.orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);
				})
			},

			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待收货';
						break;
					case 3:
						stateTip = '待评价';
						break;
					case 4:
						stateTip = '待发货';
						break;
					case 5:
						stateTip = '已申请退款';
						break;
					case 6:
						stateTip = '退款成功';
						break;
					case 7:
						stateTip = '拒绝退款';
						break;

					case 9:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			// 切换tab并发起请求 转换为后台的状态
			toServiceState: function(state) {
				let status = "";
				switch (+state) {
					case 0: //全部
						break;
					case 1: //代付款
						status = "unpay";
						break;
					case 2: //待收货
						status = "delivered";
						break;
					case 3: //待评价
						status = "need_review";
						break;
					case 4: //退款
						status = "unapplied";
				}
				return status;
			},
			// 获取到数据，转换为前段展示
			toShowState: function(status) {
				let state = "";
				switch (status) {
					case "unpay": //代付款
						state = 1;
						break;
					case "undelivered": //待发货
						state = 4;
						break;
					case "need_review": //待评价
						state = 3;
						break;
					case "delivered": //待收货
						state = 2;
						break;
					case "applied":
						state = 5;
						break;
					case "success":
						state = 6;
						break;
					case "failed":
						state = 7;
						break;
					case "closed": //关闭订单
						state = 9;
						break;
				}
				return state;
			},
			//ajax

			//获取订单列表
			getOrderList: function(options = {}) {
				let token = this.$ajax.getToken();
				let data = {};
				for (let i in options) {
					data[i] = options[i]
				}
				//format status
				data.status = this.toServiceState(data.state);


				uni.request({
					method: 'GET',
					url: this.$ajax.ajaxBaseUrl + '/api/orders',
					dataType: 'json',
					data: data,
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						if (res.data.status === 0) {
							let data = res.data.data;

							for (let i in data.data) {
								data.data[i].state = this.toShowState(data.data[i].status.key);
							}

							let orderList = data.data.filter(item => {
								//添加不同状态下订单的表现形式
								item = Object.assign(item, this.orderStateExp(item.state));
								//演示数据所以自己进行状态筛选
								if (options.state === 0) {
									//0为全部订单
									return item;
								}

								if (options.state === 4) {
									return item.state > 3 && item.state < 9
								}

								return item.state === options.state
							});
							let oldOrderList = [];

							if (options.page > 1) {
								oldOrderList = this.navList[options.state].orders.orderList;
							}

							orderList.forEach(item => {
								oldOrderList.push(item);
							})

							this.navList[options.state].orders = {
								currentPage: data.current_page,
								lastPage: data.last_page,
								pageSize: data.per_page,
								orderList: oldOrderList
							}
							// loaded新字段用于表示数据加载完毕， 如果为空可以显示空白页
							this.$set(this.navList[options.state], 'loaded', true);

							//判断是否还有数据， 有改为 more， 没有改为noMore 
							if (data.current_page < data.last_page) {
								this.navList[options.state].loadingType = 'more';
							} else {
								this.navList[options.state].loadingType = 'noMore';
							}


						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//更新订单
			updateOrder: function(option = {}, startCallback = () => {}, endCallback = () => {}, successCallBack = () => {}) {
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
							successCallBack();
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
			//删除订单
			delOrder: function(option = {}, startCallback = () => {}, endCallback = () => {}, successCallBack = () => {}) {
				startCallback();
				let data = {
					id: option.id || 0
				};

				let token = this.$ajax.getToken();
				uni.request({
					method: 'DELETE',
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
							successCallBack();
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
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


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
