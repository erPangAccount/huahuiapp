<template>

	<view class="guess-section">
		<view v-for="(item, index) in product" :key="index" class="guess-item" @click="navToProductDetail(item.id)">
			<view class="image-wrapper">
				<image :src="item.image" mode="aspectFill"></image>
			</view>

			<text class="title clamp">
				{{item.name}}
			</text>
			<text class="price">￥{{item.price}}</text>
		</view>
	</view>
</template>


<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue";
	export default {
		props: {
			/**
			 * product object
			 */
			product: {
				type: Array,
				default: () => {
					return [];
				}
			},
		},
		methods: {
			navToProductDetail(id) {
				uni.navigateTo({
					url: '/pages/product/product?id=' + id
				})
			},
		},
		components: {
			uniTag
		}
	}
</script>

<style scoped lang="scss">
	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			max-width: 50%;
			min-width: 40%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 20upx;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.category-tag {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: center;
			margin-top: 10px;
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>
