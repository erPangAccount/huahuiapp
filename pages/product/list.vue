<template>
	<view>
		<product-list :product="product.productList" v-if="product.productList.length"></product-list>

		<empty v-else></empty>
	</view>
</template>

<script>
	import productList from "@/components/product.vue"
	import empty from '@/components/empty.vue';
	export default {
		components: {
			productList,
			empty
		},
		data() {
			return {
				//product
				product: {
					productCurrentPage: 1, //当前页
					productLastPage: 1, // 最后一页
					productPageSize: 10, //每页数量
					productList: [] //产品列表
				},
				queryOption: {}
			};
		},
		methods: {
			getProductList: function(option = {}, startCallBack = () => {}, endCallback = () => {}) { //获取商品列表
				startCallBack()
				let data = {
					page: 1,
					pageSize: 10
				};
				for (let i in option) {
					data[i] = option[i];
				}

				let token = this.$ajax.getToken();
				uni.request({
					method: 'GET',
					url: this.$ajax.ajaxBaseUrl + '/api/commodities',
					dataType: 'json',
					data: data,
					header: {
						'content-type': 'application/json',
						"Authorization": token.token_type + ' ' + token.access_token
					},
					success: (res) => {
						if (res.data.status === 0) {
							this.product.productCurrentPage = res.data.data.current_page; //当前页
							this.product.productLastPage = res.data.data.last_page; //最后一页
							this.product.productPageSize = res.data.data.per_page; //每页数量
							if (data.page > 1 && this.product.productList.length) {
								this.product.productList = this.product.productList.concat(res.data.data.data);
							} else {
								this.product.productList = res.data.data.data;
							}
						} else {
							this.$api.msg(res.data.message);
						}
						endCallback();
					}
				});
			}
		},
		onLoad: function(option) {
			this.getProductList(option, () => {
				this.$load.loadding('加载中……');
			}, () => {
				this.$load.endLoadding();
			});
			this.queryOption = option;
		},
		onPullDownRefresh:  function() {
			this.getProductList(this.queryOption, () => {}, () => {
				uni.stopPullDownRefresh();
			}); //获取商品列表
		},
		onReachBottom:  function() {
			if (this.product.productCurrentPage < this.product.productLastPage) {
				this.queryOption.page = this.product.productCurrentPage + 1;
				this.getProductList(this.queryOption, () => {
					this.$load.loadding('加载更多中……');
				}, () => {
					this.$load.endLoadding();
				}); //获取商品列表
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 空白页 */
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm+2upx;
			color: $font-color-disabled;

			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}
</style>
