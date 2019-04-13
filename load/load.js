const loadding = (title, mask = true, success = function() {}, fail = function() {}, complete = function() {}) => {
	//全局loading样式
	if (Boolean(title) === false) {
		return;
	}
	uni.showLoading({
		title,
		mask,
		success,
		fail,
		complete
	});
}

const endLoadding = () => {
	uni.hideLoading();
}

export default {
	loadding: loadding,
	endLoadding: endLoadding
};