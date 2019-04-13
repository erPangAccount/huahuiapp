<template>
	<view>
		<view class="container" v-if="isloading">
			<view class="carousel">
				<swiper indicator-dots circular=true duration="400">
					<swiper-item class="swiper-item" v-for="(item,index) in productInfo.imgList" :key="index">
						<view class="image-wrapper">
							<image :src="item" class="loaded" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="introduce-section">
				<text class="title">{{productInfo.name}}</text>
				<view class="price-box">
					<text class="price-tip">¥</text>
					<text class="price">{{specSelected.sku_price}}</text>
					<text class="m-price">¥{{productInfo.price}}</text>
					<!-- <text class="coupon-tip">7折</text> -->
				</view>
				<view class="bot-row">
					<text>销量: {{productInfo.sold_count}}</text>
					<text>库存: {{specSelected.sku_stock}}</text>
					<!-- <text>浏览量: 768</text> -->
				</view>
			</view>

			<view class="c-list">
				<view class="c-row b-b" @click="toggleSpec">
					<text class="tit">购买类型</text>
					<view class="con">
						<text class="selected-text">
							{{specSelected.sku_name}}
						</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
			</view>

			<!-- 评价 -->
			<view class="eva-section" v-if="productInfo.reviews">
				<view class="e-header">
					<text class="tit">评价</text>
					<text>({{productInfo.reviews.length}})</text>
					<!-- <text class="tip">好评率 100%</text> -->
					<!-- <text class="yticon icon-you"></text> -->
				</view>
				<view class="eva-box" v-for="item in productInfo.reviews" :key="item.id">
					<image class="portrait" src="../../static/missing-face.png" mode="aspectFill"></image>
					<view class="right">
						<text class="name">{{item.order.customer.nick || item.order.customer.mobile}}</text>
						<text class="con">{{item.review}}</text>
						<view class="bot">
							<text class="attr">购买类型：{{item.commosity_sku.sku_name}}</text>
							<text class="time">{{item.reviewed_at}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="detail-desc" v-if="productInfo.description">
				<view class="d-header">
					<text>图文详情</text>
				</view>
				<rich-text :nodes="productInfo.description"></rich-text>
			</view>

			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
					<text class="yticon icon-xiatubiao--copy"></text>
					<text>首页</text>
				</navigator>
				<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
					<text class="yticon icon-gouwuche"></text>
					<text>购物车</text>
				</navigator>

				<view class="action-btn-group">
					<button type="primary" class=" action-btn no-border buy-now-btn" @click="navToSureOrder(specSelected.id)">立即购买</button>
					<button type="primary" class=" action-btn no-border add-cart-btn" @click="addToCart()">加入购物车</button>
				</view>
			</view>


			<!-- 规格-模态层弹窗 -->
			<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
				<!-- 遮罩层 -->
				<view class="mask"></view>
				<view class="layer attr-content" @click.stop="stopPrevent">
					<view class="a-t">
						<image :src="specSelected.sku_image"></image>
						<view class="right">
							<text class="price">¥{{specSelected.sku_price}}</text>
							<text class="stock">库存：{{specSelected.sku_stock}}件</text>
							<view class="selected">
								已选：
								<text class="selected-text">
									{{specSelected.sku_name}}
								</text>
							</view>
						</view>
					</view>
					<view class="attr-list">
						<!-- <text>{{item.name}}</text> -->
						<view class="item-list">
							<text v-for="(item,index) in productInfo.skus" :key="index" class="tit" :class="{selected: item.selected}"
							 @click="selectSpec(index)">
								{{item.sku_name}}
							</text>
						</view>
					</view>
					<button class="btn" @click="toggleSpec">完成</button>
				</view>
			</view>
		</view>
		<empty v-else></empty>

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
	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		components: {
			empty
		},
		data() {
			return {
				specClass: 'none',
				specSelected: {},
				//商品详情
				productInfo: {},
				isloading: false
			};
		},
		async onLoad(options) {
			//接收传值
			let id = options.id;
			await this.getProductInfo(id, () => {
				this.$load.loadding('加载中……');
			}, () => {
				this.$load.endLoadding();
			});


		},
		methods: {
			...mapMutations(['saveWantBuy']),
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index) {
				this.specSelected = this.productInfo.skus[index];
				for (let j in this.productInfo.skus) {
					this.productInfo.skus[j].selected = false;
				}
				this.productInfo.skus[index].selected = true;
			},
			stopPrevent() {},
			//跳转到确认订单页面
			navToSureOrder: function($id) {
				if (!this.hasLogin) {
					this.navToLogin();
				}


				let data = [{
					sku_id: $id,
					number: 1
				}];
				this.saveWantBuy(data);
				uni.navigateTo({
					url: '/pages/sureorder/sureorder?wantBuy=1'
				});
			},
			navToLogin: function() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//格式化产品详情
			formatProductInfo: function(productInfo) {
				let returnData = {
					imgList: []
				};
				for (let i in productInfo) {
					//
					returnData[i] = productInfo[i];
				}

				//图片列表
				returnData.imgList.push(productInfo.image);
				for (let j in productInfo.skus) {
					returnData.imgList.push(productInfo.skus[j].sku_image);
				}


				return returnData;
			},
			//ajax

			//获取产品详情
			getProductInfo: function(id, startCallBack = () => {}, endCallback = () => {}) {
				startCallBack()

				let token = this.$ajax.getToken();
				uni.request({
					method: 'GET',
					url: this.$ajax.ajaxBaseUrl + '/api/commodities/' + id,
					dataType: 'json',
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						if (res.data.status === 0) {
							this.productInfo = this.formatProductInfo(res.data.data);
							//初始化当前选择规格
							this.selectSpec(0);
							this.isloading = true;
						} else {
							this.$api.msg(res.data.message);
						}
						endCallback();
					}
				});
			},
			// 添加到购物车
			addToCart: function() {
				//判断登录没有，没有登录前往登录页面
				if (!this.hasLogin) {
					this.navToLogin();
				}

				this.$load.loadding("加入购物城中……")
				let token = this.$ajax.getToken();


				uni.request({
					method: 'POST',
					url: this.$ajax.ajaxBaseUrl + '/api/cart',
					dataType: 'json',
					data: {
						commodity_sku_id: this.specSelected.id,
						number: 1
					},
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						this.$load.endLoadding();
						if (res.data.access_token) {
							console.log(res);
						} else {
							this.$api.msg(res.data.message);
						}
					}
				});
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
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
			height: 40upx;
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
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
